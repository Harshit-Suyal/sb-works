import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';

const ProjectApplications = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [projectRes, applicationsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects/${projectId}`),
        axios.get(`http://localhost:5000/api/applications/project/${projectId}`)
      ]);
      setProject(projectRes.data);
      setApplications(applicationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAccept = async (applicationId, freelancerId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${applicationId}`, {
        status: 'accepted'
      });
      setMessage('Application accepted successfully!');
      fetchData();
      setTimeout(() => navigate('/client/dashboard'), 2000);
    } catch (error) {
      setMessage('Error accepting application');
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${applicationId}`, {
        status: 'rejected'
      });
      setMessage('Application rejected');
      fetchData();
    } catch (error) {
      setMessage('Error rejecting application');
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading...</p></Container>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Applications for: {project?.title}</h2>
      
      {message && <Alert variant="info">{message}</Alert>}

      {applications.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h4>No applications yet</h4>
            <p className="text-muted">Freelancers haven't applied to this project yet</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {applications.map(app => (
            <Col md={12} key={app._id} className="mb-4">
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{app.freelancer?.username}</h5>
                    <Badge bg={app.status === 'pending' ? 'warning' : app.status === 'accepted' ? 'success' : 'danger'}>
                      {app.status}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <h6>Proposal</h6>
                      <p>{app.proposal}</p>
                      {app.portfolioLink && (
                        <p>
                          <strong>Portfolio:</strong>{' '}
                          <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer">
                            View Portfolio
                          </a>
                        </p>
                      )}
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong>Bid Amount:</strong>
                        <p className="text-success fs-4">${app.bidAmount}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Duration:</strong>
                        <p>{app.duration}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Applied:</strong>
                        <p>{new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </Col>
                  </Row>
                  {app.status === 'pending' && (
                    <div className="d-flex gap-2">
                      <Button 
                        variant="success" 
                        onClick={() => handleAccept(app._id, app.freelancer._id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleReject(app._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProjectApplications;