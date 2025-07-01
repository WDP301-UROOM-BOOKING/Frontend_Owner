import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import * as Routers from "../../../utils/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import Banner from '../../../images/banner.jpg';
import { showToast, ToastProvider } from "@components/ToastContainer";
import Factories from '../../../redux/auth/factories';

const ResetPasswordHotelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    again_password: '',
    password: '',
  });

  console.log("formData:", formData);
  const { email, code, verified } = location.state || {};

  useEffect(() => {
    if (!verified) {
      // Nếu không có verified, không cho vào trang này
      navigate(Routers.LoginHotelPage, { replace: true });
    }
  }, [verified, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.again_password) {
      showToast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (formData.password.length < 8) {
      showToast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    if (formData.password !== formData.again_password) {
      showToast.error("Mật khẩu không khớp");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Factories.reset_password({
        email,
        code,
        newPassword: formData.password,
        confirmPassword: formData.again_password,
      });
      if (response?.status === 200) {
        setIsLoading(false);
        navigate(Routers.LoginHotelPage, {
          state: { 
            from: "reset-password", 
            message: "Đặt lại mật khẩu thành công" 
          },
        });
      }
    } catch (error) {
      setIsLoading(false);
      showToast.error(
        error.response?.data?.MsgNo ||
        error.response?.data?.message ||
        "Đặt lại mật khẩu thất bại"
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (location.state?.message) {
      showToast.warning(location.state.message);
    }
  }, [location]);

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
        <ToastProvider />
        
        <Card className="mx-auto shadow" style={{ maxWidth: '800px' }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center mb-4">Đặt Lại Mật Khẩu Mới</h2>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{fontWeight: 500}}>Mật khẩu mới</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới của bạn"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="py-2"
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{fontWeight: 500}}>Nhập lại mật khẩu mới</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới của bạn"
                    name="again_password"
                    value={formData.again_password}
                    onChange={handleChange}
                    className="py-2"
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ResetPasswordHotelPage;