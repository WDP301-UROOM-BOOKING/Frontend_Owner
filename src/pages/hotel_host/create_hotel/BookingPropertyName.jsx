import React, { useState } from "react";
import {
  Navbar,
  Container,
  Button,
  Form,
  Card,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiArrowLeft } from "react-icons/fi";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/store";
import HotelActions from "@redux/hotel/actions";
import { showToast, ToastProvider } from "@components/ToastContainer";

function BookingPropertyName() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const createHotel = useAppSelector((state) => state.Hotel.createHotel);
  const [hotelName, setHotelName] = useState(createHotel.hotelName);
  const [phoneNumber, setPhoneNumber] = useState(createHotel.phoneNumber || "");
  const [email, setEmail] = useState(createHotel.email || "");

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Replace the existing handleContinueClick function
  const handleContinueClick = () => {
    if (hotelName === "" || phoneNumber === "" || email === "") {
      showToast.warning("Hãy điền đầy đủ thông tin trước khi tiếp tục!");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      showToast.warning("Số điện thoại phải có 10 chữ số!");
      return;
    }

    if (!validateEmail(email)) {
      showToast.warning("Email không hợp lệ! Hãy nhập đúng định dạng email.");
      return;
    }

    dispatch({
      type: HotelActions.SAVE_HOTEL_NAME_CREATE,
      payload: { hotelName, phoneNumber, email },
    });
    navigate(Routers.BookingPropertyLocation);
  };
  return (
    <div className="booking-app">
      <ToastProvider />
      {/* Navigation Bar */}
      <Navbar className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold">
            <b style={{ fontSize: 30 }}>
              UR<span style={{ color: "#f8e71c" }}>OO</span>M
            </b>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Progress Bar */}
      <Container className="mt-4">
        <div className="progress-section">
          <div className="progress-label mb-2">
            <h5>Thông tin cơ bản</h5>
          </div>
          <ProgressBar style={{ height: "20px" }}>
            <ProgressBar variant="primary" now={20} key={1} />
            <ProgressBar variant="secondary" now={20} key={2} />
            <ProgressBar variant="secondary" now={20} key={3} />
            <ProgressBar variant="secondary" now={20} key={4} />
            <ProgressBar variant="secondary" now={20} key={5} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="main-content py-4">
        <Row>
          <Col md={7}>
            <div className="mb-4">
              <h1 className="main-heading">Tên chỗ nghỉ Quý vị?</h1>
            </div>

            <div className="property-form-card">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Tên chỗ nghỉ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên chỗ nghỉ"
                    className="form-input"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Số điện thoại liên hệ
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại liên hệ"
                    className="form-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email liên hệ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập email liên hệ"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </div>

            <div className="navigation-buttons mt-4">
              <Button
                variant="outline-primary"
                onClick={() => {
                  dispatch({
                    type: HotelActions.SAVE_HOTEL_NAME_CREATE,
                    payload: hotelName,
                  });
                  navigate(Routers.BookingRegistration);
                }}
              >
                <FiArrowLeft className="back-icon" />
              </Button>
              <Button
                variant="primary"
                className="continue-button"
                onClick={handleContinueClick}
              >
                Tiếp tục
              </Button>
            </div>
          </Col>

          <Col md={5}>
            <div className="info-cards">
              {/* First Info Card */}
              <Card className="info-card mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="info-icon thumbs-up">
                      <span role="img" aria-label="thumbs up">
                        👍
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">
                        Tôi nên chú ý điều gì khi chọn tên?
                      </h5>
                    </div>
                  </div>
                  <ul className="info-list mt-3">
                    <li>Chọn tên ngắn và hấp dẫn</li>
                    <li>Tránh sử dụng chữ viết tắt</li>
                    <li>Đúng với thực tế</li>
                  </ul>
                </Card.Body>
              </Card>

              {/* Second Info Card */}
              <Card className="info-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="info-icon lightbulb">
                      <span role="img" aria-label="lightbulb">
                        💡
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">
                        Tại sao tôi cần đặt tên cho chỗ nghỉ của mình?
                      </h5>
                    </div>
                  </div>
                  <p className="info-text mt-3">
                    Tên này giống như tiêu đề đăng ký chỗ nghỉ của Quý vị trên
                    trang web của chúng tôi. Tên này sẽ cho khách biết thông tin
                    cụ thể về chỗ nghỉ, vị trí hoặc những gì Quý vị cung
                    cấp.Điều này sẽ hiển thị cho bất cứ ai truy cập trang web
                    của chúng tôi, vì vậy đừng bao gồm địa chỉ của Quý vị trong
                    tên.
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx="true">{`
        /* Custom CSS */
        .booking-app {
          min-height: 100vh;
        }

        /* Navbar styles */
        .navbar-custom {
          background-color: #003580;
          padding: 10px 0;
        }

        .help-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background-color: #fff;
          color: #003580;
          border-radius: 50%;
          font-weight: bold;
        }

        .user-icon-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: #fff;
          border-radius: 50%;
          margin-left: 10px;
        }

        /* Progress bar styles */
        .progress-section {
          margin: 0 auto;
        }

        .progress-label {
          font-size: 14px;
          color: #333;
        }

        .progress {
          height: 8px;
          background-color: #e7e7e7;
        }

        .progress-bar-primary {
          background-color: #0071c2;
        }

        .progress-bar-secondary {
          background-color: #e7e7e7;
        }

        /* Main content styles */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .main-heading {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        /* Property form styles */
        .property-form-card {
          background-color: #fff;
          border-radius: 4px;
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .form-input {
          height: 45px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 16px;
        }

        /* Navigation buttons */
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
        }

        .back-button {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-color: #0071c2;
          color: #0071c2;
        }

        .continue-button {
          flex-grow: 1;
          margin-left: 10px;
          height: 45px;
          background-color: #0071c2;
          border: none;
          font-weight: bold;
        }

        .continue-button:hover {
          background-color: #005999;
        }

        /* Info cards styles */
        .info-card {
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          border: none;
        }

        .info-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 20px;
        }

        .thumbs-up {
          background-color: #f5f5f5;
          color: #0071c2;
        }

        .lightbulb {
          background-color: #f5f5f5;
          color: #0071c2;
        }

        .info-content {
          flex-grow: 1;
          padding: 0 15px;
        }

        .info-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 0;
        }

        .close-button {
          color: #666;
          padding: 0;
        }

        .info-list {
          padding-left: 20px;
          margin-bottom: 0;
        }

        .info-list li {
          margin-bottom: 5px;
        }

        .info-text {
          font-size: 14px;
          color: #333;
          margin-bottom: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default BookingPropertyName;
