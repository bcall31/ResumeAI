import warnings
import os
import zipfile

warnings.filterwarnings("ignore")


from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import FileResponse
from crewai import Agent, Task, Crew
from crewai_tools import ( 
    FileReadTool,
    ScrapeWebsiteTool,
    MDXSearchTool,
    SerperDevTool
)
from markitdown import MarkItDown
from tempfile import NamedTemporaryFile
from shutil import copyfileobj

from model import save_text_as_pdf

router = APIRouter()

def remove_file(path: str):
    try:
        os.remove(path)
        print(f"Deleted file: {path}")
    except FileNotFoundError:
        print(f"File already deleted or not found: {path}")


@router.post("/job-application")
async def job_application(
    resume: UploadFile = File(...),
    job_posting: str = Form(...),
    github_url: str = Form(...),
    gitlab_url: str = Form(...),
    personal_write_up: str = Form(...),
    personal_website: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    print('test')
    # Ensure temp directory exists
    TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
    os.makedirs(TEMP_DIR, exist_ok=True)

   # Save uploaded file to a real temp file
    resume_suffix = os.path.splitext(resume.filename)[1]
    with NamedTemporaryFile(delete=False, suffix=resume_suffix, dir=TEMP_DIR) as tmpresume:
        copyfileobj(resume.file, tmpresume)
        tmpresume_path = tmpresume.name

    # Now use the real temp file for MarkItDown
    converter = MarkItDown(enable_plugins=False)
    with open(tmpresume_path, "rb") as f:
        md_result = converter.convert(f)

   # Save Markdown text to temp file
    with NamedTemporaryFile(delete=False, suffix=".md", dir=TEMP_DIR, mode="w", encoding="utf-8") as tmpmd:
        tmpmd.write(md_result.text_content)
        tmpmd_path = tmpmd.name
        print("Saved Markdown to:", tmpmd_path) 

    try:
        # Tools
        search_tool=SerperDevTool()
        scrape_tool=ScrapeWebsiteTool()
        read_resume=FileReadTool(file_path=tmpmd_path)  
        semantic_search_resume=MDXSearchTool(mdx=tmpmd_path)

        # Agent 1 : Researcher
        researcher = Agent(
            role="Expert Job Researcher",
            goal="Make sure to do an amazing analysis on a job posting to help job applicants. If your tool(s) fail more than 10 times, return an appropriate error.",
            tools=[
                search_tool,
                scrape_tool,
                read_resume,
                semantic_search_resume
            ],
            verbose=True,
            backstory=(
                """
                    As a an expert researcher, your prowess in navigating and extracting critical information from job postings
                    will be invaluable in helping to create a personalized resume that accurately highlights the given skills and experience in a particular field.
                """
            )
        )

        #  Agent 2 : Personal Profiler
        profiler = Agent(
            role="Personal Profiler for Engineers",
            goal="Do incredible research on job applicants to help them stand out in the job market. If your tool(s) fail more than 10 times, return an appropriate error.",
            tools=[
                search_tool,
                scrape_tool,
                read_resume,
                semantic_search_resume
            ],
            verbose=True,
            backstory=(
                """
                    Equipped with anaytical prowess, you dissect and synthesize information from diverse sources to craft comprehensive personal and
                    professional profiles, laying the groundwork for personalized resumes that stand out in the job market.
                """
            )
        )

        # Agent 3: Resume Strategist
        strategist = Agent(
            role="Resume Strategist",
            goal="Create a resume that accurately highlights the given skills and experience in a particular field. Do anything possible to make this stand out in the current job market. If your tool(s) fail more than 10 times, return an appropriate error.",
            tools=[
                search_tool,
                scrape_tool,
                read_resume,
                semantic_search_resume
            ],
            verbose=True,
            backstory=(
                """
                    With a strategic mind and a knack for crafting resumes that stand out in the job market, you have the ability to create resumes that
                    accurately highlight the given skills and experience in a particular field, ensuring that they stand out from the competition."
                """
            )
        )

        # Agent 4: Interview Preparer
        interview_preparer = Agent(
            role="Interview Preparer",
            goal="Create interview questions and talking points with talking points based on the resume and the job requirements. If your tool(s) fail more than 10 times, return an appropriate error.",
            tools=[
                search_tool,
                scrape_tool,
                read_resume,
                semantic_search_resume
            ],
            verbose=True,
            backstory=(
                """
                    Your role is crucial in the preparation of the interview process. You have the ability to create interview questions and talking points based on the 
                    resume and the job requirements to ensure that the candidate is well-prepared for the interview. These talking points will ensure that the candidate
                    is well-prepared for the interview process.
                """
            )
        )


        # Task for Researcher
        researcher_task = Task(
            description=(
                """
                    Analyze the job posting URL provided ({job_posting}) and extract key skills, experiences, and qualifications required for the job position. 
                    Use the tools to gather content and identify and categorize the requirements.
                """
            ),
            expected_output="A structured list of job requirements, skills, qualifications, and experiences.",
            agent=researcher,
            async_execution=True
        )

        # Task for Personal Profiler
        profiler_task = Task(
            description=(
                f"""
                    Compile a detailed personal and professional profile using the resume provided ({md_result.text_content}), Optional github and gitlab urls provided ({github_url}, {gitlab_url}) and Optional personal write-up 
                    provided ({personal_write_up}) and Optional personal website provided ({personal_website}). Utilize tools to extract and synthesize information from these sources.
                """
            ),
            expected_output="A comprehensive profile document that includes skills, project experiences, contributions, interest, and communication style.",
            agent=profiler,
            async_execution=True
        )

        # Task for Resume Strategist
        strategist_task = Task(
            description=(
                """
                    Using the profile and job requirements obtained from previous tasks, tailor the resume to highlight the most relevant areas. Employ 
                    tools to adjust and enhance the resume content. Make sure this is the best resume possible without including any false information. Update every
                    section all to better reflect the candidates abilities and how they match the job posting.
                """
            ),
            expected_output="An updated resume that effectivly highlights the candidates abilities and how they match the job posting as a .pdf file.",
            output_file="new_resume.md",
            context=[researcher_task, profiler_task],
            agent=strategist,
        )

        # Task for Interview Preparer
        interview_preparer_task = Task(
            description=(
                """
                    Create interview questions and talking points with talking points based on the resume and the job requirements.
                """
            ),
            expected_output="A list of interview questions and talking points.",
            output_file="interview_materials.md",
            context=[researcher_task, profiler_task, strategist_task],
            agent=interview_preparer,
        )

        job_application_crew = Crew(
            agents=[
                researcher,
                profiler,
                strategist,
                interview_preparer
            ],
            tasks=[
                researcher_task,
                profiler_task,
                strategist_task,
                interview_preparer_task
            ],
            verbose=True
        )

        inputs = {
            "job_posting": job_posting,
            "github_url": github_url,
            "gitlab_url": gitlab_url,
            "personal_write_up": personal_write_up,
            "personal_website": personal_website
        }

        # Start the Crew process
        job_application_crew.kickoff(inputs=inputs)

        # save markdown files to zip
        zip_path = "./markdown_files.zip"
        file_paths = ["./new_resume.md", "./interview_materials.md"]

        with zipfile.ZipFile(zip_path, "w") as zipf:
            for file_path in file_paths:
                zipf.write(file_path, arcname=os.path.basename(file_path))

        background_tasks.add_task(remove_file, zip_path)

        # Return the zip file
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="aitailoredresume.zip"
        )
        
    finally:
        # Clean up the temp file if needed
        os.remove(tmpresume_path)   
        os.remove(tmpmd_path)  
        os.remove("./new_resume.md")
        os.remove("./interview_materials.md")
        print("COMPLETE")
    

