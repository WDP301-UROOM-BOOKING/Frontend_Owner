import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import * as Routers from "@utils/Routes";
import { useNavigate } from "react-router-dom";
import Banner from "../../../images/banner.jpg";
import { useDispatch } from "react-redux";
import AuthActions from "../../../redux/auth/actions";
import { showToast, ToastProvider } from "@components/ToastContainer";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!formData.name.trim()) {
      showToast.error("Tên người dùng là bắt buộc");
      isValid = false;
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      showToast.error("Số điện thoại là bắt buộc");
      isValid = false;
    } else if (!/^\d{9,12}$/.test(formData.phone.trim())) {
      showToast.error("Vui lòng nhập số điện thoại hợp lệ (9-12 chữ số)");
      isValid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      showToast.error("Email là bắt buộc");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast.error("Vui lòng nhập địa chỉ email hợp lệ");
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      showToast.error("Mật khẩu là bắt buộc");
      isValid = false;
    } else if (formData.password.length < 8) {
      showToast.error("Mật khẩu phải có ít nhất 8 ký tự");
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    console.log("Register submitted:", formData);
    
    dispatch({
      type: AuthActions.REGISTER,
      payload: {
        data: formData,
        onSuccess: (Data) => {
          console.log('abc');
          setIsLoading(false);
          showToast.success("Đăng ký thành công");
          navigate(Routers.VerifyCodeRegisterPage, {
            state: {
              message: "Mã xác thực đã được gửi đến email của bạn, vui lòng xác thực tại đây!",
              email: formData.email
            },
          });
        },
        onFailed: (msg) => {
          setIsLoading(false);
          showToast.error(msg);
        },
        onError: (error) => {
          setIsLoading(false);
          showToast.error("Đăng ký thất bại", error.message);
        },
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        backgroundImage: `url(${Banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="position-relative">
        <ToastProvider />
        <Card className="mx-auto shadow" style={{ maxWidth: "800px" }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center mb-4">Đăng Ký Tài Khoản</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: 500 }}>Tên người dùng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên người dùng của bạn"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: 500 }}>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại của bạn"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: 500 }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email của bạn"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 500 }}>Mật khẩu</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu của bạn"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="py-2"
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>
              
              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 mb-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng Ký Tài Khoản"
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">Bạn đã có tài khoản? </span>
                <a
                  onClick={() => {
                    navigate(Routers.LoginHotelPage, { state: { from: "register" } })
                  }}
                  className="text-decoration-none">
                  Đăng nhập tại đây
                </a>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RegisterPage;