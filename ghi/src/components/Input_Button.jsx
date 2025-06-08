// Input_Button.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTailorResumeMutation } from '../store/webscraperAPI';
import ResumeUpload from './Upload_File';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Input_Button = ({ isForm = false, resume, endpoint, buttonText = "Submit" }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    useEffect(() => {
        if (loading) {
            document.body.style.cursor = "wait";
        } else if(!loading) {
            document.body.style.cursor = "default";
        }
        if (error) {
            
            console.error('Error:', error);
        }
        if (response) {
            console.log('Response:', response);
        }
    }, [loading, error, response]);
    

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
            setLoading(true);
            console.log("Resume is File?", resume instanceof File); // should be true

            if (!isSubmitted) {
                setIsSubmitted(true);
                axios.post('http://localhost:8000/job-application', formData
                ).then(response => {
                    console.log(response)
                    setResponse(response.data);
                    
                }).catch(error => {
                    setError(error);
                }).finally(() => {
                    setLoading(false);
                    setIsSubmitted(false);
                });
            }
            
        } else {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            console.log(baseUrl)
            window.location.href = baseUrl + endpoint;
        }
    };

    return (
        <Button className="btn btn-primary" onClick={handleClick}>
            {buttonText}
        </Button>
    );
};

export default Input_Button;
