import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/client/${user.id}`);
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      open: 'primary',
      'in-progress': 'warning',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Client Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.username}!</p>
        </Col>
        <Col className="text-end">
          <Link to="/client/new-project">
            <Button variant="primary">Post New Project</Button>
          </Link>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.length}</h3>
              <p className="text-muted mb-0">Total Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.filter(p => p.status === 'open').length}</h3>
              <p className="text-muted mb-0">Open Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.filter(p => p.status === 'in-progress').length}</h3>
              <p className="text-muted mb-0">In Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{projects.filter(p => p.status === 'completed').length}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h4 className="mb-0">My Projects</h4>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-4">
              <p>No projects yet</p>
              <Link to="/client/new-project">
                <Button variant="primary">Post Your First Project</Button>
              </Link>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Bids</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project._id}>
                    <td>
                      <Link to={`/project/${project._id}`}>{project.title}</Link>
                    </td>
                    <td>${project.budget}</td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>{project.bids?.length || 0}</td>
                    <td>{new Date(project.postedDate).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/client/project/${project._id}/applications`}>
                        <Button variant="sm" size="sm">View Applications</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientDashboard;