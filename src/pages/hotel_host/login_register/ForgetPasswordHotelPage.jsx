import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import * as Routers from "../../../utils/Routes"
import Banner from '../../../images/banner.jpg';
import { useNavigate } from 'react-router-dom';

const ForgetPasswordHotelPage = () => {
  const navigate= useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Container className="position-relative">
        <Card className="mx-auto shadow" style={{ maxWidth: '800px' }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center mb-2">Forget Password</h2>
            <div className="text-center">
                <span className="text-muted">Remember your password ?</span>
                <a href={Routers.LoginHotelPage} className="text-decoration-none"> Sign in here</a>
              </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{fontWeight: 500}}>Email Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-100 py-2 mb-4"
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2"
                onClick={() => {
                  navigate(Routers.VerifyCodeHotelPage, {state: {status: "FORGET_PASSWORD"}})
                }}
              >
                Reset Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ForgetPasswordHotelPage;
