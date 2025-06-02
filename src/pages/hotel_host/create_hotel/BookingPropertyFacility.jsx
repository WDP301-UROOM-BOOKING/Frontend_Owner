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
import { listFacilities } from "@utils/data";
import HotelActions from "@redux/hotel/actions";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@redux/store";

function BookingPropertyFacility() {
  const navigate = useNavigate();
  const dispatch= useDispatch();
  const createHotel = useAppSelector((state) => state.Hotel.createHotel);
  const [hotelFacilities, setHotelFacilities] = useState(createHotel.facilities);
  const handleFacilityChange = (facilityName) => {
    setHotelFacilities((prev) => {
      if (prev.includes(facilityName)) {
        // Bỏ tick
        return prev.filter((name) => name !== facilityName);
      } else {
        // Tick
        return [...prev, facilityName];
      }
    });
  };

  const handleBack= () => {
    // Save current data before going back
    dispatch({
      type: HotelActions.SAVE_HOTEL_FACILITIES_CREATE,
      payload: {
        facilities: hotelFacilities,
      },
    });
    
    // Navigate back (you can replace with actual back route)
    navigate(Routers.BookingPropertyLocation)
  }
  
  const handleContinue = () => {
    // Validate required fields
    if (hotelFacilities.length === 0) {
      showToast.warning("Vui lòng chọn tiện nghi của khách sạn");
      return;
    }


    // Dispatch action to save data
    dispatch({
      type: HotelActions.SAVE_HOTEL_FACILITIES_CREATE,
      payload: {
        facilities: hotelFacilities,
      },
    });

    // Navigate to next step
    navigate(Routers.BookingPropertyCheckInOut);
  };
  console.log("hotelFacilities: ", hotelFacilities);
  return (
    <div className="booking-app">
      <ToastProvider/>
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
            <ProgressBar variant="primary" now={20} key={2} />
            <ProgressBar variant="primary" now={20} key={3} />
            <ProgressBar variant="secondary" now={20} key={4} />
            <ProgressBar variant="secondary" now={20} key={5} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="main-content py-4">
        <Row>
          <Col md={7}>
            {/* Main Content */}
            <Container className="main-content">
              <div className="mb-4">
                <h1 className="main-heading">
                  Khách có thể sử dụng gì tại khách sạn căn hộ của Quý vị?
                </h1>
              </div>

              {/* Facility Form */}
              <div
                className="facility-form-card"
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  padding: "20px",
                }}
              >
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Các tiện nghi</Form.Label>
                    {listFacilities.map((facility, index) => {
                      const FacilityIcon = facility.iconTemp;
                      return (
                        <Form.Check
                          className="mb-1"
                          key={`facility1-${index}`}
                          type="checkbox"
                          label={
                            <span>
                              {FacilityIcon && (
                                <FacilityIcon
                                  style={{
                                    marginRight: "8px",
                                    marginTop: "-10px",
                                  }}
                                />
                              )}
                              <a>{facility.name}</a>
                            </span>
                          }
                          checked={hotelFacilities.includes(facility.name)}
                          onChange={() => handleFacilityChange(facility.name)}
                        />
                      );
                    })}
                  </Form.Group>
                </Form>
              </div>
            </Container>
            <div className="navigation-buttons mt-4">
              <Button
                variant="outline-primary"
                onClick={handleBack}
              >
                <FiArrowLeft className="back-icon" />
              </Button>
              <Button
                variant="primary"
                className="continue-button"
                onClick={handleContinue}
              >
                Tiếp tục
              </Button>
            </div>
          </Col>

          <Col md={5}>
            <div className="info-cards">
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
                        Nếu tôi không thấy tiện nghi mà tôi có cung cấp thì sao?
                      </h5>
                    </div>
                  </div>
                  <p className="info-text mt-3">
                    Các tiện nghi được liệt kê tại đây là các tiện nghi được
                    khách tìm kiếm nhiều nhất. Sau khi hoàn tất đăng ký, Quý vị
                    có thể thêm nhiều tiện nghi khác qua danh sách đầy đủ hơn
                    trên extranet, kênh mà Quý vị sẽ sử dụng để quản lý chỗ nghỉ
                    của mình.
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

export default BookingPropertyFacility;
