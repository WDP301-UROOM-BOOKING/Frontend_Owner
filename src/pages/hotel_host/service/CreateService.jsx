import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Navbar,
  ProgressBar,
  Modal,
  Badge,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { useAppSelector } from "../../../redux/store";
import { useDispatch } from "react-redux";
import HotelActions from "../../../redux/hotel/actions";
import * as Routers from "../../../utils/Routes";
import ConfirmationModal from "@components/ConfirmationModal";

function CreateService() {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "person",
    availability: "daily",
    active: true,
    options: [],
    timeSlots: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [currentOption, setCurrentOption] = useState("");

  // Service type options
  const serviceTypes = [
    { value: "person", label: "Theo người" },
    { value: "service", label: "Theo dịch vụ" },
    { value: "room", label: "Theo phòng" },
    { value: "day", label: "Theo ngày" },
    { value: "night", label: "Theo đêm" },
    { value: "month", label: "Theo tháng" },
    { value: "year", label: "Theo năm" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      price: value,
    }));
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên dịch vụ là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả dịch vụ là bắt buộc";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá dịch vụ phải lớn hơn 0";
    }

    if (!formData.type) {
      newErrors.type = "Loại tính phí là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const serviceData = {
      ...formData,
      price: Number(formData.price.toString().replace(/\D/g, "")),
    };

    dispatch({
      type: HotelActions.SAVE_SERVICE_CREATE,
      payload: serviceData,
    });

    showToast.success("Thêm dịch vụ thành công!");
    navigate(Routers.BookingPropertyChecklist);
  };

  const handleCancel = () => {
    navigate(Routers.BookingPropertyChecklist);
  };

  return (
    <div style={styles.bookingApp}>
      <ToastProvider />
      
      {/* Navigation Bar */}
      <Navbar style={styles.navbarCustom}>
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold">
            <b style={{ fontSize: 30 }}>
              UR<span style={{ color: "#f8e71c" }}>OO</span>M
            </b>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Progress Bar */}
      <Container className="mt-4 mb-4">
        <div className="progress-section">
          <div className="progress-label mb-2">
            <h5>Tạo dịch vụ mới</h5>
          </div>
          <ProgressBar style={{ height: "20px" }}>
            <ProgressBar variant="primary" now={100} key={1} />
          </ProgressBar>
        </div>
      </Container>

      <Container style={styles.formContainer}>
        <h2 style={styles.formTitle}>Thông tin dịch vụ</h2>

        {/* Service Name */}
        <div style={styles.formSection}>
          <Form.Group className="mb-3">
            <Form.Label>Tên dịch vụ *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ví dụ: Bữa sáng, Buffet tối, Spa..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {/* Description */}
        <div style={styles.formSection}>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả dịch vụ *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Nhập mô tả chi tiết về dịch vụ..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {/* Price and Type */}
        <div style={styles.formSection}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giá dịch vụ (VND) *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập giá dịch vụ"
                  value={formatPrice(formData.price)}
                  onChange={handlePriceChange}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Loại tính phí *</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  isInvalid={!!errors.type}
                >
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Action Buttons */}
        <Row className="mt-4 mb-5">
          <Col xs={6}>
            <Button
              style={styles.cancelButton}
              className="w-100"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy bỏ
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              style={styles.submitButton}
              className="w-100"
              onClick={() => setShowAcceptModal(true)}
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo dịch vụ"}
            </Button>
          </Col>
        </Row>
      </Container>
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleSubmit}
        title="Confirm Acceptance"
        message="Are you sure you want to create service setup?"
        confirmButtonText="Accept"
        type="accept"
      />
    </div>
  );
}

const styles = {
  bookingApp: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  formContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "15px 15px",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#333",
  },
  formSection: {
    border: "1px solid #e7e7e7",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  submitButton: {
    backgroundColor: "#0071c2",
    border: "none",
    padding: "12px 0",
    fontWeight: "bold",
    borderRadius: "6px",
  },
  cancelButton: {
    backgroundColor: "white",
    border: "1px solid #0071c2",
    color: "#0071c2",
    padding: "12px 0",
    fontWeight: "bold",
    borderRadius: "6px",
  },
  navbarCustom: {
    backgroundColor: "#003580",
    padding: "10px 0",
  },
  optionsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  timeSlotsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
};

export default CreateService;
