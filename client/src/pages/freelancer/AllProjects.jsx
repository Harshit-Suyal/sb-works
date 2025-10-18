import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minBudget: '',
    maxBudget: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, projects]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects?status=open');
      setProjects(response.data);
      setFilteredProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minBudget) {
      filtered = filtered.filter(p => p.budget >= Number(filters.minBudget));
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(p => p.budget <= Number(filters.maxBudget));
    }

    setFilteredProjects(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Browse Projects</h2>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Min Budget</Form.Label>
                <Form.Control
                  type="number"
                  name="minBudget"
                  placeholder="0"
                  value={filters.minBudget}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Max Budget</Form.Label>
                <Form.Control
                  type="number"
                  name="maxBudget"
                  placeholder="10000"
                  value={filters.maxBudget}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="secondary" 
                onClick={() => setFilters({ search: '', minBudget: '', maxBudget: '' })}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <p>Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h4>No projects found</h4>
            <p className="text-muted">Try adjusting your filters</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredProjects.map(project => (
            <Col md={6} lg={4} key={project._id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {project.description.substring(0, 150)}...
                  </Card.Text>
                  <div className="mb-2">
                    {project.skills?.map((skill, idx) => (
                      <Badge key={idx} bg="secondary" className="me-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="text-success">${project.budget}</strong>
                    <small className="text-muted">
                      {project.bids?.length || 0} bids
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/project/${project._id}`}>
                    <Button variant="primary" size="sm" className="w-100">
                      View Details
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AllProjects;