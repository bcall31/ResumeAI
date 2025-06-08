import { Container, Card } from "react-bootstrap";
import Input_Button from "../components/Input_Button";
export default function Home() {
    return (
        <>
            <Container>
                <Card style={{ width: '50%', margin: 'auto', marginTop: '5rem'}}>
                    
                    <Card.Body>
                        <Card.Title className="text-center">Perfect your resume with AI</Card.Title>
                        <Card.Text className="text-center">
                            ResumeAI is a platform that uses AI to help you perfect your resume.
                            Provide a link to the job posting annd upload your resume to have it tailored to fit the job.
                        </Card.Text>
                        <div className="d-flex justify-content-center mt-5">
                            <Input_Button buttonText={"Get Started"} endpoint={"resume"} isForm={false}></Input_Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}