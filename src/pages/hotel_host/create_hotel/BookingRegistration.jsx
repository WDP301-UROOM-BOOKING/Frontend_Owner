import React, { useEffect } from "react";
import {
  Navbar,
  Container,
  Button,
  Row,
  Col,
  Card,
  ProgressBar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@redux/store";

function BookingRegistration() {
  const navigate = useNavigate();
  const createHotel = useAppSelector((state) => state.Hotel.createHotel)

  useEffect(() => {
    if(createHotel.checkCreateHotel){
      navigate(Routers.BookingPropertyChecklist)
    }
  },[]) 
  return (
    <div className="booking-app">
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
            <ProgressBar variant="secondary" now={20} key={1} />
            <ProgressBar variant="secondary" now={20} key={2} />
            <ProgressBar variant="secondary" now={20} key={3} />
            <ProgressBar variant="secondary" now={20} key={4} />
            <ProgressBar variant="secondary" now={20} key={5} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}

      <Container className="main-content py-5">
        <div className="mb-4">
          <h1 className="main-heading">
            Đăng chỗ nghỉ của Quý vị trên Booking.com và bắt đầu đón tiếp khách
            thật nhanh chóng!
          </h1>
          <p className="sub-heading">
            Để bắt đầu, chọn loại chỗ nghỉ Quý vị muốn đăng trên Booking.com
          </p>
        </div>

        <div className="quick-start-button mb-4">
          <Button variant="success" className="quick-start-btn">
            <i className="quick-start-icon">⚡</i> Bắt đầu nhanh
          </Button>
        </div>

        <Row>
          {/* Apartment Option */}
          <Col md={3} className="mb-4">
            <Card className="accommodation-card h-100">
              <Card.Body className="text-center">
                <div className="icon-container apartment-icon">
                  <div className="accommodation-icon">🏠</div>
                </div>
                <Card.Title className="accommodation-title">Căn hộ</Card.Title>
                <Card.Text className="accommodation-description">
                  Chỗ nghỉ tự nấu nướng, đầy đủ nội thất mà khách thuê nguyên
                  căn.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-center p-0 border-0">
                <Button
                  variant="primary"
                  className="register-btn w-100"
                  onClick={() => {
                    navigate("/BookingPropertyName");
                  }}
                >
                  Đăng chỗ nghỉ
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          {/* House Option */}
          <Col md={3} className="mb-4">
            <Card className="accommodation-card h-100">
              <Card.Body className="text-center">
                <div className="icon-container house-icon">
                  <div className="accommodation-icon">🏡</div>
                </div>
                <Card.Title className="accommodation-title">Nhà</Card.Title>
                <Card.Text className="accommodation-description">
                  Các chỗ nghỉ như căn hộ, nhà nghỉ dưỡng, biệt thự, v.v.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-center p-0 border-0">
                <Button variant="primary" className="register-btn w-100"
                  onClick={() => {
                    navigate("/BookingPropertyName");
                  }}
                >
                  Đăng chỗ nghỉ
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          {/* Hotel/B&B Option */}
          <Col md={3} className="mb-4">
            <Card className="accommodation-card h-100">
              <Card.Body className="text-center">
                <div className="icon-container hotel-icon">
                  <div className="accommodation-icon">🏨</div>
                </div>
                <Card.Title className="accommodation-title">
                  Khách sạn, nhà nghỉ B&B hay tương tự
                </Card.Title>
                <Card.Text className="accommodation-description">
                  Các chỗ nghỉ như khách sạn, nhà nghỉ B&B, nhà khách, hostel,
                  khách sạn căn hộ, v.v.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-center p-0 border-0">
                <Button variant="primary" className="register-btn w-100"
                  onClick={() => {
                    navigate("/BookingPropertyName");
                  }}
                >
                  Đăng chỗ nghỉ
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          {/* Other Accommodations Option */}
          <Col md={3} className="mb-4">
            <Card className="accommodation-card h-100">
              <Card.Body className="text-center">
                <div className="icon-container other-icon">
                  <div className="accommodation-icon">⛺</div>
                </div>
                <Card.Title className="accommodation-title">
                  Các loại chỗ nghỉ khác
                </Card.Title>
                <Card.Text className="accommodation-description">
                  Các chỗ nghỉ như tàu thuyền, khu cắm trại, lều trại sang
                  trọng, v.v.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-center p-0 border-0">
                <Button variant="primary" className="register-btn w-100"
                  onClick={() => {
                    navigate("/BookingPropertyName");
                  }}
                >
                  Đăng chỗ nghỉ
                </Button>
              </Card.Footer>
            </Card>
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

        /* Main content styles */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .main-heading {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .sub-heading {
          font-size: 18px;
          color: #333;
        }

        /* Quick start button */
        .quick-start-btn {
          background-color: #008009;
          border: none;
          padding: 8px 15px;
          font-weight: bold;
        }

        .quick-start-icon {
          font-style: normal;
          margin-right: 5px;
        }

        /* Accommodation cards */
        .accommodation-card {
          border: 1px solid #e7e7e7;
          border-radius: 4px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s;
        }

        .accommodation-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
        }

        .accommodation-icon {
          font-size: 40px;
          color: #003580;
        }

        .accommodation-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .accommodation-description {
          font-size: 14px;
          color: #333;
          margin-bottom: 20px;
        }

        /* Register button */
        .register-btn {
          background-color: #0071c2;
          border: none;
          border-radius: 0 0 3px 3px;
          padding: 10px;
          font-weight: bold;
        }

        .register-btn:hover {
          background-color: #005999;
        }
      `}</style>
    </div>
  );
}

export default BookingRegistration;
