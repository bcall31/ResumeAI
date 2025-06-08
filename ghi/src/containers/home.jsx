import { Container, Card } from "react-bootstrap";
import Input_Button from "../components/Input_Button";
export default function Home() {
    return (
        <>
            <Container>
                <h1>Home</h1>
                <Card style={{ width: '18rem', margin: 'auto'}}>
                    
                    <Card.Body>
                        <Card.Title>Perfect your resume with AI</Card.Title>
                        <div className="d-flex justify-content-center mt-5">
                            <Input_Button buttonText={"Get Started"} endpoint={"/resume"} isForm={false}></Input_Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}