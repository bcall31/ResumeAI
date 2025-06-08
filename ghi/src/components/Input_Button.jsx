// Input_Button.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Input_Button = ({ isForm = false, resume, endpoint, onError, onLoading, buttonText = "Submit" }) => {
    const [response, setResponse] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (response) {
            console.log('Response:', response);
        }
    }, [response]);

    const handleNavigate = (url) => {
        navigate(`/${url}`);
    };

    const handleClick = async () => {
        if (isForm) {
            let jobPosting = document.getElementById("job_posting").value;
            let githubUrl = document.getElementById("github")!== null ? document.getElementById("github").value : "";
            let gitlabUrl = document.getElementById("gitlab")!== null ? document.getElementById("gitlab").value : "";
            let personalWriteUp = document.getElementById("personal_write_up")!== null ? document.getElementById("personal_write_up").value : "";
            let personalWebsite = document.getElementById("personal_website")!== null ? document.getElementById("personal_website").value : "";
            const formData = new FormData()
            formData.append('resume', resume);
            formData.append('job_posting', jobPosting);
            formData.append('github_url', githubUrl);
            formData.append('gitlab_url', gitlabUrl);
            formData.append('personal_write_up', personalWriteUp);
            formData.append('personal_website', personalWebsite);
            onLoading(true);

            if (!resume) {
                onError('No resume file provided.');
                onLoading(false);
                return;
            }
            console.log("Resume is File?", resume instanceof File); // should be true

            if (!jobPosting) {
                onError('No job posting provided.');
                onLoading(false);
                return;
            }

            if (!isSubmitted) {
                setIsSubmitted(true);
                axios.post('http://localhost:8000/job-application', formData, {
                    responseType: 'blob', 
                  }

                  
                ).then(response => {

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    
                    const link = document.createElement('a');
                    link.href = url;

                    // Extract filename from headers if needed
                    const contentDisposition = response.headers['content-disposition'];
                    let filename = 'aitailoredresume.zip';
                    if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match?.[1]) filename = match[1];
                    }

                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    console.log(response)
                    setResponse(response.data);
                    
                }).catch(error => {
                    onError(error);
                }).finally(() => {
                    onLoading(false);
                    setIsSubmitted(false);
                });
            }
            
        } else {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            console.log(baseUrl)
            handleNavigate(endpoint);
        }
    };

    return (
        <Button className="btn btn-primary" onClick={handleClick}>
            {buttonText}
        </Button>
    );
};

export default Input_Button;
