import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join-chat', chatId);

      socket.on('receive-message', (data) => {
        setMessages(prev => [...prev, data.message]);
      });
    }
  }, [socket, chatId]);

  useEffect(() => {
    fetchChat();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChat = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chats/${chatId}`);
      setChat(response.data);
      setMessages(response.data.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user.id,
      content: newMessage,
      timestamp: new Date()
    };

    try {
      // Send to backend
      await axios.post(`http://localhost:5000/api/chats/${chatId}/message`, messageData);

      // Emit to socket
      socket.emit('send-message', {
        chatId,
        message: messageData
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <Container className="mt-4"><p>Loading chat...</p></Container>;
  if (!chat) return <Container className="mt-4"><p>Chat not found</p></Container>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Chat - {chat.projectId?.title}</h4>
          <small className="text-muted">
            Participants: {chat.participants?.map(p => p.username).join(', ')}
          </small>
        </Card.Header>
        <Card.Body>
          <div className="chat-container" style={{ height: '400px', overflowY: 'auto', marginBottom: '20px' }}>
            {messages.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === user.id ? 'sent' : 'received'}`}
                  style={{
                    backgroundColor: msg.sender === user.id ? '#007bff' : '#e9ecef',
                    color: msg.sender === user.id ? 'white' : '#212529',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    marginBottom: '10px',
                    maxWidth: '70%',
                    marginLeft: msg.sender === user.id ? 'auto' : '0',
                    marginRight: msg.sender === user.id ? '0' : 'auto'
                  }}
                >
                  <p className="mb-1">{msg.content}</p>
                  <small className="message-time" style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Send
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Chat;