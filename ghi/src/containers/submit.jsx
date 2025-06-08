import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import Input_Button from "../components/Input_Button";
import Input_Area from "../components/Input_Area";
import Input_Input from "../components/Input_Input";
import UploadFile from "../components/Upload_File";
import Error_Tag from '../components/Error_Tag';
import Modal_Component from '../components/Modal';
import { useEffect, useState } from 'react';

export default function Submit() {
    const [resumeFile, setResumeFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (loading) {
            handleLoading(true);
        } else if(!loading) {
            handleLoading(false);
        }
        if (error) {
            console.error('Error:', error);
        }
    }, [error, loading]);


    const handleLoading = (isLoading) => {
        if (isLoading) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }
    
    
    return (
        <>
            {showModal && 
                <Modal_Component title="Loading..." text="Please wait while we process your request." onCancel={() => setShowModal(false)}/>
                }
            <Container className="my-5">
                <Card className="shadow-sm">
                    <Card.Body>
                    <Card.Title className="text-center mb-4">Submit Your Resume and Job Posting Info</Card.Title>
                    <Error_Tag error={error} ></Error_Tag>
                    <Form>
                        <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="resume">
                            <Form.Label>Resume</Form.Label>
                            <UploadFile onFileSelect={setResumeFile} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="job_posting">
                            <Form.Label>Job Posting</Form.Label>
                            <Input_Input id="job_posting"/>
                            </Form.Group>
                        </Col>
                        </Row>

                        <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="github">
                            <Form.Label>GitHub</Form.Label>
                            <Input_Input id="github"/>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="gitlab">
                            <Form.Label>GitLab</Form.Label>
                            <Input_Input id="gitlab"/>
                            </Form.Group>
                        </Col>
                        </Row>

                        <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="personal_write_up">
                            <Form.Label>Personal Write-Up</Form.Label>
                            <Input_Area id="personal_write_up" />
                            </Form.Group>
                        </Col>
                        </Row>

                        <Row className="mb-4">
                        <Col>
                            <Form.Group controlId="personal_website">
                            <Form.Label>Personal Website</Form.Label>
                            <Input_Input id="personal_website" />
                            </Form.Group>
                        </Col>
                        </Row>

                        <div className="text-center">
                        <Input_Button buttonText="Submit" isForm={true} resume={resumeFile} onError={setError} onLoading={setLoading}/>
                        </div>
                    </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};