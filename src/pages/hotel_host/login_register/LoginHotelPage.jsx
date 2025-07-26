import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Card, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import * as Routers from "@utils/Routes";
import Banner from "@images/banner.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthActions from "@redux/auth/actions";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { clearToken } from "@utils/handleToken";
import Utils from "@utils/Utils";

const LoginHotelPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Check for messages in location state when component mounts or location changes
  useEffect(() => {
    if (location.state?.message) {
      showToast.success(location.state.message);
      // Clear the message from location state to prevent showing it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const handleResendVerification = () => {
    if (!unverifiedEmail) {
      setShowVerifyModal(false);
      return;
    }

    setIsResending(true);
    console.log("ABC")
    dispatch({
      type: AuthActions.RESEND_VERIFICATION,
      payload: {
        data: { email: unverifiedEmail },
        onSuccess: (data) => {
          setIsResending(false);
          showToast.success(
            "A new verification code has been sent to your email"
          );
          setShowVerifyModal(false);
          navigate(Routers.VerifyCodeRegisterPage, {
            state: {
              message: "Please check your email for the verification code",
              email: unverifiedEmail,
            },
          });
        },
        onFailed: (msg) => {
          setIsResending(false);
          showToast.error(msg);
        },
        onError: (error) => {
          setIsResending(false);
          showToast.error("Failed to resend verification code");
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/; // tối thiểu 6 ký tự
    if (!formData.email || !formData.password) {
      showToast.warning(
        "Email và mật khẩu là bắt buộc. Vui lòng điền đầy đủ thông tin!"
      );
    } else if (!emailRegex.test(formData.email)) {
      showToast.warning("Định dạng email không hợp lệ. Vui lòng nhập lại email!");
    } else if (!passwordRegex.test(formData.password)) {
      showToast.warning(
        "Mật khẩu phải có ít nhất 8 ký tự. Vui lòng nhập lại mật khẩu!"
      );
    } else {
      setIsLoading(true);
      dispatch({
        type: AuthActions.LOGIN,
        payload: {
          data: { email: formData.email, password: formData.password },
          onSuccess: (user) => {
            setIsLoading(false);
            console.log("Login successful:", user);
            if (user.isLocked) {
              navigate(Routers.BannedPage, {
                state: {
                  reasonLocked: user.reasonLocked,
                  dateLocked: Utils.getDate(user.dateLocked, 4),
                },
              });
              dispatch({ type: AuthActions.LOGOUT });
              clearToken();
            } else if(user.ownedHotels.length === 0 ){
              console.log("User has no owned hotels, redirecting to registration page");
              navigate(Routers.BookingRegistration);
            } else if(user.ownedHotels.length !== 0 &&  user.ownedHotels[0].adminStatus === "PENDING"){
              navigate(Routers.WaitPendingPage);
            }else{
              navigate(Routers.DataAnalysisAI);
            }
          },
          onFailed: (msg) => {
            setIsLoading(false);
            // Check if the error is about email not being verified
            if (msg === "Your email is not verified") {
              setUnverifiedEmail(formData.email);
              setShowVerifyModal(true);
            } else {
              showToast.warning("Email hoặc mật khẩu không chính xác");
              setFormData({ ...formData, password: "" });
            }
          },
          onError: (error) => {
            setIsLoading(false);
            showToast.error("Email hoặc mật khẩu không chính xác");
          },
        },
      });
    }
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
            <h2 className="text-center mb-4">Đăng Nhập Tài Khoản</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: 500 }}>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập email của bạn"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="py-2"
                  required
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
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                    style={{ right: 0, top: 0 }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between mb-4">
                <Form.Check
                  type="checkbox"
                  label="Ghi nhớ đăng nhập"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="text-muted"
                />
                <a
                  href={Routers.ForgetPasswordHotelPage}
                  className="text-decoration-none"
                >
                  Quên mật khẩu?
                </a>
              </div>

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
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng Nhập"
                )}
              </Button>

              <div className="text-center">
                <span className="text-muted">Chưa có tài khoản? </span>
                <a
                  href={Routers.RegisterHotelPage} 
                  className="text-decoration-none"
                >
                  Đăng ký ngay
                </a>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* Verification Modal */}
      <Modal
        show={showVerifyModal}
        onHide={() => setShowVerifyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Tài Khoản Chưa Được Xác Thực</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tài khoản của bạn chưa được xác thực. Bạn có muốn nhận mã xác thực mới không?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            disabled={isResending}
            onClick={handleResendVerification}
          >
            {isResending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang gửi...
              </>
            ) : (
              "Gửi Mã Xác Thực"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginHotelPage;