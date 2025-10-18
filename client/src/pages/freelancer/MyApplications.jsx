import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, Table, Badge } from 'react-bootstrap';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/freelancer/${user.id}`);
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Applications</h2>

      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="text-center py-4">
              <p>No applications yet</p>
              <Link to="/freelancer/projects" className="btn btn-primary">
                Browse Projects
              </Link>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Bid Amount</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <Link to={`/project/${app.projectId._id}`}>
                        {app.projectId?.title}
                      </Link>
                    </td>
                    <td>{app.client?.username}</td>
                    <td>${app.bidAmount}</td>
                    <td>{app.duration}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
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

export default MyApplications;