import { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Button,
  Form,
  Card,
  ProgressBar,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/store";
import { showToast, ToastProvider } from "@components/ToastContainer";
import HotelActions from "@redux/hotel/actions";
import * as Routers from "../../../utils/Routes";

// Time options for dropdowns
const timeOptions = [
  { value: "06:00", label: "06:00" },
  { value: "07:00", label: "07:00" },
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
  { value: "22:00", label: "22:00" },
  { value: "23:00", label: "23:00" },
];

export default function BookingPropertyCheckInOut() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const createHotel = useAppSelector((state) => state.Hotel.createHotel);

  // Initialize state with values from Redux store
  const [checkInStart, setCheckInStart] = useState(
    createHotel?.checkInStart || "12:00"
  );
  const [checkInEnd, setCheckInEnd] = useState(
    createHotel?.checkInEnd || "13:00"
  );
  const [checkOutStart, setCheckOutStart] = useState(
    createHotel?.checkOutStart || "10:00"
  );
  const [checkOutEnd, setCheckOutEnd] = useState(
    createHotel?.checkOutEnd || "11:00"
  );

  const [validationErrors, setValidationErrors] = useState([]);

  // Convert time string to minutes for comparison
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Validate time logic
  const validateTimes = () => {
    const errors = [];

    const checkInStartMin = timeToMinutes(checkInStart);
    const checkInEndMin = timeToMinutes(checkInEnd);
    const checkOutStartMin = timeToMinutes(checkOutStart);
    const checkOutEndMin = timeToMinutes(checkOutEnd);

    // Check-in start must be less than check-in end
    if (checkInStartMin >= checkInEndMin) {
      errors.push(
        "Thời gian bắt đầu nhận phòng phải nhỏ hơn thời gian kết thúc nhận phòng"
      );
    }

    // Check-out start must be less than check-out end
    if (checkOutStartMin >= checkOutEndMin) {
      errors.push(
        "Thời gian bắt đầu trả phòng phải nhỏ hơn thời gian kết thúc trả phòng"
      );
    }

    // Check-in start must be greater than check-out end (next day logic)
    if (checkInStartMin <= checkOutEndMin) {
      errors.push(
        "Thời gian bắt đầu nhận phòng phải sau thời gian kết thúc trả phòng"
      );
    }

    return errors;
  };

  // Validate whenever times change
  useEffect(() => {
    const errors = validateTimes();
    setValidationErrors(errors);
  }, [checkInStart, checkInEnd, checkOutStart, checkOutEnd]);

  const handleContinue = () => {
    const errors = validateTimes();

    if (errors.length > 0) {
      showToast.error("Vui lòng kiểm tra lại thời gian check-in và check-out");
      return;
    }

    // Dispatch action to save data
    dispatch({
      type: HotelActions.SAVE_HOTEL_CHECKTIME_CREATE,
      payload: {
        checkInStart,
        checkInEnd,
        checkOutStart,
        checkOutEnd,
      },
    });

    showToast.success("Đã lưu thời gian check-in/check-out thành công!");
    navigate(Routers.BookingPropertyDescription);
  };

  const handleBack = () => {
    // Save current data before going back
    dispatch({
      type: HotelActions.SAVE_HOTEL_CHECKTIME_CREATE,
      payload: {
        checkInStart,
        checkInEnd,
        checkOutStart,
        checkOutEnd,
      },
    });

    navigate(Routers.BookingPropertyFacility);
  };

  const isFormValid = validationErrors.length === 0;

  return (
    <div className="booking-app">
      <ToastProvider />

      {/* Navigation Bar */}
      <Navbar style={{ backgroundColor: "#003580" }}>
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
            <ProgressBar variant="primary" now={20} key={4} />
            <ProgressBar variant="secondary" now={20} key={5} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="main-content py-4">
        <Row>
          <Col md={7}>
            <div className="mb-4">
              <h1 className="main-heading">
                Các quy định về nhận phòng và trả phòng
              </h1>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Lỗi thời gian:</Alert.Heading>
                <ul className="mb-0">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Check-in/Check-out Form */}
            <div className="facility-form-card">
              <Form>
                {/* Check-in Section */}
                <div className="time-section mb-4">
                  <Row className="mb-3">
                    <Col>
                      <h5 className="section-title">
                        <span className="time-icon">🚪</span>
                        Trả phòng (Check-out)
                      </h5>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Từ <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          className="form-input"
                          value={checkOutStart}
                          onChange={(e) => setCheckOutStart(e.target.value)}
                          isInvalid={validationErrors.some((error) =>
                            error.includes("bắt đầu trả phòng")
                          )}
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Đến <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          className="form-input"
                          value={checkOutEnd}
                          onChange={(e) => setCheckOutEnd(e.target.value)}
                          isInvalid={validationErrors.some((error) =>
                            error.includes("kết thúc trả phòng")
                          )}
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Check-out Section */}
                <div className="time-section">
                  <Row className="mb-3">
                    <Col>
                      <h5 className="section-title">
                        <span className="time-icon">🏨</span>
                        Nhận phòng (Check-in)
                      </h5>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Từ <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          className="form-input"
                          value={checkInStart}
                          onChange={(e) => setCheckInStart(e.target.value)}
                          isInvalid={validationErrors.some((error) =>
                            error.includes("bắt đầu nhận phòng")
                          )}
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Đến <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          className="form-input"
                          value={checkInEnd}
                          onChange={(e) => setCheckInEnd(e.target.value)}
                          isInvalid={validationErrors.some((error) =>
                            error.includes("kết thúc nhận phòng")
                          )}
                        >
                          {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Time Summary */}
                {isFormValid && (
                  <Alert variant="success" className="mt-4">
                    <div className="time-summary">
                      <h6>Tóm tắt thời gian:</h6>
                      <p className="mb-0">
                        <strong>Trả phòng:</strong> {checkOutStart} -{" "}
                        {checkOutEnd}
                      </p>
                      <p className="mb-1">
                        <strong>Nhận phòng:</strong> {checkInStart} -{" "}
                        {checkInEnd}
                      </p>
                    </div>
                  </Alert>
                )}
              </Form>
            </div>

            <div className="navigation-buttons mt-4">
              <Button
                variant="outline-primary"
                className="back-button"
                onClick={handleBack}
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </Button>
              <Button
                variant="primary"
                className="continue-button"
                onClick={handleContinue}
                disabled={!isFormValid}
              >
                Tiếp tục
              </Button>
            </div>
          </Col>

          <Col md={5}>
            <div className="info-cards">
              {/* Info Card */}
              <Card className="info-card mb-4">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div className="info-icon lightbulb">
                      <span role="img" aria-label="lightbulb">
                        💡
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">
                        Nếu quy tắc chung của chỗ nghỉ thay đổi thì sao?
                      </h5>
                      <p className="info-text mt-3">
                        Quý vị có thể dễ dàng tùy chỉnh các quy tắc chung này
                        sau và các quy tắc chung bổ sung có thể được cài đặt
                        trong trang Chính sách trên extranet sau khi hoàn tất
                        đăng ký.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Tips Card */}
              <Card className="info-card">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div className="info-icon tips">
                      <span role="img" aria-label="tips">
                        💡
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">
                        Mẹo thiết lập thời gian hợp lý
                      </h5>
                      <ul className="info-list mt-3">
                        <li>Thời gian nhận phòng thường từ 14:00 - 18:00</li>
                        <li>Thời gian trả phòng thường từ 08:00 - 12:00</li>
                        <li>Để đủ thời gian dọn dẹp giữa các lượt khách</li>
                        <li>Có thể điều chỉnh theo nhu cầu cụ thể</li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .booking-app {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .progress-section {
          margin: 0 auto;
        }

        .progress-label {
          font-size: 14px;
          color: #333;
        }

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

        .facility-form-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }

        .time-section {
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          background-color: #f8f9fa;
        }

        .section-title {
          color: #333;
          font-weight: 600;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .time-icon {
          font-size: 20px;
        }

        .form-input {
          height: 45px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        .form-input:focus {
          border-color: #0071c2;
          box-shadow: 0 0 0 0.2rem rgba(0, 113, 194, 0.25);
        }

        .form-input.is-invalid {
          border-color: #dc3545;
        }

        .time-summary h6 {
          color: #155724;
          margin-bottom: 8px;
        }

        .navigation-buttons {
          display: flex;
          gap: 12px;
        }

        .back-button {
          width: 50px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-color: #0071c2;
          color: #0071c2;
          border-radius: 6px;
        }

        .back-button:hover {
          background-color: #0071c2;
          color: white;
        }

        .continue-button {
          flex: 1;
          height: 45px;
          background-color: #0071c2;
          border: none;
          font-weight: 600;
          border-radius: 6px;
          transition: background-color 0.15s ease-in-out;
        }

        .continue-button:hover:not(:disabled) {
          background-color: #005999;
        }

        .continue-button:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
          opacity: 0.6;
          cursor: not-allowed;
        }

        .info-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease-in-out;
        }

        .info-card:hover {
          transform: translateY(-2px);
        }

        .info-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 20px;
          background-color: #f8f9fa;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .lightbulb {
          background-color: #fff3cd;
          color: #856404;
        }

        .tips {
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .info-content {
          flex: 1;
        }

        .info-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 0;
          color: #333;
        }

        .info-list {
          padding-left: 20px;
          margin-bottom: 0;
        }

        .info-list li {
          margin-bottom: 8px;
          color: #666;
        }

        .info-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .main-heading {
            font-size: 24px;
          }

          .facility-form-card {
            padding: 16px;
          }

          .time-section {
            padding: 16px;
          }

          .navigation-buttons {
            flex-direction: column;
          }

          .back-button {
            width: 100%;
            order: 2;
          }

          .continue-button {
            order: 1;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
}
