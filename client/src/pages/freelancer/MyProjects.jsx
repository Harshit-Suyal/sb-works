import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';

const MyProjects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/freelancer/${user.id}`);
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'in-progress': 'warning',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Active Projects</h2>

      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-4">
              <p>No active projects yet</p>
              <Link to="/freelancer/projects" className="btn btn-primary">
                Find Projects
              </Link>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project._id}>
                    <td>
                      <Link to={`/project/${project._id}`}>
                        {project.title}
                      </Link>
                    </td>
                    <td>{project.client?.username}</td>
                    <td>${project.budget}</td>
                    <td>{new Date(project.deadline).toLocaleDateString()}</td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>
                      <Link to={`/chat/chat_${project._id}`}>
                        <Button variant="primary" size="sm">
                          Chat
                        </Button>
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

export default MyProjects;