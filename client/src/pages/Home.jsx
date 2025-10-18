import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Container className="mt-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4">Welcome to SB Works</h1>
          <p className="lead">Connect Clients with Talented Freelancers</p>
          {!isAuthenticated && (
            <div className="mt-4">
              <Link to="/register">
                <Button variant="primary" size="lg" className="me-3">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline-primary" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>For Clients</Card.Title>
              <Card.Text>
                Post your projects and find skilled freelancers to bring your ideas to life.
              </Card.Text>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="primary">Hire Freelancers</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>For Freelancers</Card.Title>
              <Card.Text>
                Browse available projects and showcase your skills to potential clients.
              </Card.Text>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="success">Find Work</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Secure Platform</Card.Title>
              <Card.Text>
                Built-in chat system, secure payments, and project management tools.
              </Card.Text>
              {isAuthenticated && (
                <Link to={user?.userType === 'client' ? '/client/dashboard' : '/freelancer/dashboard'}>
                  <Button variant="info">Go to Dashboard</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5 bg-light p-5 rounded">
        <Col>
          <h2 className="text-center mb-4">How It Works</h2>
          <Row>
            <Col md={3} className="text-center">
              <h3>1</h3>
              <h5>Sign Up</h5>
              <p>Create your account as a client or freelancer</p>
            </Col>
            <Col md={3} className="text-center">
              <h3>2</h3>
              <h5>Post/Browse</h5>
              <p>Clients post projects, freelancers browse opportunities</p>
            </Col>
            <Col md={3} className="text-center">
              <h3>3</h3>
              <h5>Connect</h5>
              <p>Submit proposals and collaborate through our platform</p>
            </Col>
            <Col md={3} className="text-center">
              <h3>4</h3>
              <h5>Complete</h5>
              <p>Deliver work and get paid securely</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;