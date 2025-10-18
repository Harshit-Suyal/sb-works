import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const FreelancerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    applications: 0,
    activeProjects: 0,
    completedProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [applicationsRes, projectsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/applications/freelancer/${user.id}`),
        axios.get(`http://localhost:5000/api/projects/freelancer/${user.id}`)
      ]);

      setStats({
        applications: applicationsRes.data.length,
        activeProjects: projectsRes.data.filter(p => p.status === 'in-progress').length,
        completedProjects: projectsRes.data.filter(p => p.status === 'completed').length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Freelancer Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.username}!</p>
        </Col>
        <Col className="text-end">
          <Link to="/freelancer/projects">
            <Button variant="primary">Browse Projects</Button>
          </Link>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.applications}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.activeProjects}</h3>
              <p className="text-muted mb-0">Active Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.completedProjects}</h3>
              <p className="text-muted mb-0">Completed Projects</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/freelancer/projects">
                  <Button variant="primary" className="w-100">Browse Available Projects</Button>
                </Link>
                <Link to="/freelancer/applications">
                  <Button variant="outline-primary" className="w-100">View My Applications</Button>
                </Link>
                <Link to="/freelancer/my-projects">
                  <Button variant="outline-success" className="w-100">My Active Projects</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Profile Tips</h5>
            </Card.Header>
            <Card.Body>
              <ul className="mb-0">
                <li>Complete your profile with skills and experience</li>
                <li>Add portfolio items to showcase your work</li>
                <li>Write compelling proposals for projects</li>
                <li>Respond promptly to client messages</li>
                <li>Deliver quality work on time</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FreelancerDashboard;