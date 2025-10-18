import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [proposal, setProposal] = useState({
    proposal: '',
    bidAmount: '',
    duration: '',
    portfolioLink: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setLoading(false);
    }
  };

  const handleProposalChange = (e) => {
    setProposal({
      ...proposal,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const applicationData = {
        projectId: project._id,
        freelancer: user.id,
        client: project.client._id,
        ...proposal,
        bidAmount: Number(proposal.bidAmount)
      };

      await axios.post('http://localhost:5000/api/applications', applicationData);
      setSuccess('Application submitted successfully!');
      setShowModal(false);
      setTimeout(() => navigate('/freelancer/applications'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting application');
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading...</p></Container>;
  if (!project) return <Container className="mt-4"><p>Project not found</p></Container>;

  return (
    <Container className="mt-4">
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <h2>{project.title}</h2>
          <Badge bg="primary">{project.status}</Badge>
        </Card.Header>
        <Card.Body>
          <h5>Description</h5>
          <p>{project.description}</p>

          <hr />

          <div className="row">
            <div className="col-md-3">
              <strong>Budget:</strong>
              <p className="text-success">${project.budget}</p>
            </div>
            <div className="col-md-3">
              <strong>Deadline:</strong>
              <p>{new Date(project.deadline).toLocaleDateString()}</p>
            </div>
            <div className="col-md-3">
              <strong>Bids:</strong>
              <p>{project.bids?.length || 0}</p>
            </div>
            <div className="col-md-3">
              <strong>Posted:</strong>
              <p>{new Date(project.postedDate).toLocaleDateString()}</p>
            </div>
          </div>

          <hr />

          <h5>Required Skills</h5>
          <div className="mb-3">
            {project.skills?.map((skill, idx) => (
              <Badge key={idx} bg="secondary" className="me-2 mb-2">
                {skill}
              </Badge>
            ))}
          </div>

          <hr />

          <h5>Client Information</h5>
          <p><strong>Name:</strong> {project.client?.username}</p>

          {user?.userType === 'freelancer' && project.status === 'open' && (
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
              Apply for this Project
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* Application Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Submit Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitProposal}>
            <Form.Group className="mb-3">
              <Form.Label>Your Proposal *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="proposal"
                value={proposal.proposal}
                onChange={handleProposalChange}
                placeholder="Explain why you're the best fit for this project..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Bid Amount (USD) *</Form.Label>
              <Form.Control
                type="number"
                name="bidAmount"
                value={proposal.bidAmount}
                onChange={handleProposalChange}
                placeholder="Enter your bid"
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estimated Duration *</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={proposal.duration}
                onChange={handleProposalChange}
                placeholder="e.g., 2 weeks"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Portfolio Link (Optional)</Form.Label>
              <Form.Control
                type="url"
                name="portfolioLink"
                value={proposal.portfolioLink}
                onChange={handleProposalChange}
                placeholder="https://..."
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Submit Application
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProjectDetails;