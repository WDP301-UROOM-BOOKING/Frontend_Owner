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
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roomFacilities, bedTypes } from "@utils/data";
import RoomActions from "@redux/room/actions";

function CreateRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const createRoom = useSelector(state => state.Room.createRoom);
  const [formData, setFormData] = useState({
    type: "Single Room",
    capacity: 1,
    description: "",
    quantity: 1,
    bed: [],
    facilities: [],
  });

  useEffect(() => {
    // If createRoom data exists, populate formData with it
    if (createRoom) {
      setFormData((prev) => ({
        ...prev,
        ...createRoom,  
      }));
    }
  }, [createRoom]);

  const [errors, setErrors] = useState({});

  // Room type options
  const roomTypes = [
    "Single Room",
    "Double Room", 
    "Family Room",
    "Suite",
    "VIP Room",
    "Deluxe Room",
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

  const handleBedChange = (index, field, value) => {
    const newBeds = [...formData.bed];
    if (!newBeds[index]) {
      newBeds[index] = { bed: "", bedId: "", quantity: 1 };
    }

    if (field === "bed") {     
      const selectedBedType = bedTypes.find((bedType) => bedType._id === Number(value));
      if( selectedBedType) {
        newBeds[index].bed = selectedBedType.name; // Store bed name for display
        newBeds[index].bedId = selectedBedType._id; // Store bed ID for API
      }
    } else {
      newBeds[index][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      bed: newBeds,
    }));
  };

  const addBed = () => {
    setFormData((prev) => ({
      ...prev,
      bed: [...prev.bed, { bed: "", bedId: "", quantity: 1 }],
    }));
  };

  const removeBed = (index) => {
    setFormData((prev) => ({
      ...prev,
      bed: prev.bed.filter((_, i) => i !== index),
    }));
  };

  const handleFacilityChange = (facility, checked) => {
    setFormData((prev) => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, facility]
        : prev.facilities.filter((f) => f !== facility),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Loại phòng là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả phòng là bắt buộc";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Sức chứa phải lớn hơn 0";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phòng phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      console.log("Form data before validation:", formData);
      // Save form data to Redux store
      dispatch({
        type: RoomActions.SAVE_ROOM_DETAILS_CREATE,
        payload: formData
      });

      // Navigate to next step
      navigate("/RoomNamingForm");
    }
  };

  const handleBack = () => {
      navigate("/BookingPropertyChecklist");
  };

  // Helper function to check if a facility is selected
  const isFacilitySelected = (facilityName) => {
    return formData.facilities.includes(facilityName);
  };

  // Helper function to get bed name by ID
  const getBedNameById = (bedIdOrName) => {
    let bedType = bedTypes.find((bed) => bed._id === bedIdOrName);
    if (!bedType) {
      bedType = bedTypes.find((bed) => bed.name === bedIdOrName);
    }
    return bedType ? bedType.name : "Không xác định";
  };

  return (
    <div style={styles.bookingApp}>
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
            <h5>Thông tin cơ bản</h5>
          </div>
          { (
            <ProgressBar style={{ height: "20px" }}>
              <ProgressBar variant="primary" now={25} key={1} />
              <ProgressBar variant="secondary" now={25} key={2} />
              <ProgressBar variant="secondary" now={25} key={3} />
              <ProgressBar variant="secondary" now={25} key={4} />
            </ProgressBar>
          )}
        </div>
      </Container>

      <Container style={styles.formContainer}>
        <h2 style={styles.formTitle}>
          Chi tiết phòng
        </h2>

        {/* Room Type and Quantity */}
        <div style={styles.formSection}>
          <Form.Group className="mb-3">
            <Form.Label>Loại phòng *</Form.Label>
            <Form.Select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              isInvalid={!!errors.type}
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.type}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số lượng phòng *</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", parseInt(e.target.value))}
              isInvalid={!!errors.quantity}
            />
            <Form.Control.Feedback type="invalid">
              {errors.quantity}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div style={styles.formSection}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Sức chứa (người) *</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", parseInt(e.target.value))}
                  isInvalid={!!errors.capacity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.capacity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Description */}
        <div style={styles.formSection}>
          <Form.Group className="mb-3">
            <Form.Label>Mô tả phòng *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả chi tiết về phòng"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        {/* Beds */}
        <div style={styles.formSection}>
          <Form.Label>Loại giường</Form.Label>
          {formData.bed.map((bed, index) => (
            <Row key={index} className="mb-2">
              <Col md={6}>
                <Form.Select
                  value={bed.bedId || bed.bed || ""}
                  onChange={(e) =>
                    handleBedChange(index, "bed", e.target.value)
                  }
                >
                  <option value="">Chọn loại giường</option>
                  {bedTypes
                    .filter((bedType) => {
                      const isSelectedInOtherBeds = formData.bed.some(
                        (selectedBed, selectedIndex) =>
                          selectedIndex !== index &&
                          (selectedBed.bedId === bedType._id || selectedBed.bed === bedType._id)
                      );
                      return !isSelectedInOtherBeds;
                    })
                    .map((bedType) => (
                      <option key={bedType._id} value={bedType._id}>
                        {bedType.name} - {bedType.bedWidth}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="Số lượng"
                  value={bed.quantity}
                  onChange={(e) =>
                    handleBedChange(index, "quantity", parseInt(e.target.value))
                  }
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeBed(index)}
                >
                  Xóa
                </Button>
              </Col>
            </Row>
          ))}

          {/* Display selected beds summary */}
          {formData.bed.length > 0 && (
            <div
              className="mt-2 p-2"
              style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
            >
              <small className="text-muted">
                <strong>Giường đã chọn:</strong>
                <ul className="mb-0 mt-1">
                  {formData.bed.map((bed, index) => (
                    <li key={index}>
                      {getBedNameById(bed.bed)} x {bed.quantity}
                    </li>
                  ))}
                </ul>
              </small>
            </div>
          )}
          <br />
          <Button
            variant="outline-primary"
            size="sm"
            onClick={addBed}
            className="mt-2"
            disabled={formData.bed.length >= bedTypes.length}
          >
            + Thêm giường
          </Button>
        </div>

        {/* Facilities */}
        <div style={styles.formSection}>
          <Form.Label>Tiện nghi</Form.Label>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Row>
              {roomFacilities.map((facility) => (
                <Col md={6} key={facility.name} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`facility-${facility.name}`}
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <facility.iconTemp
                          style={{
                            color: isFacilitySelected(facility.name)
                              ? "#0071c2"
                              : "#6c757d",
                            fontSize: "18px",
                            marginTop: "2px",
                            transition: "color 0.3s ease",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontWeight: isFacilitySelected(facility.name)
                                ? "700"
                                : "600",
                              fontSize: "14px",
                              color: isFacilitySelected(facility.name)
                                ? "#0071c2"
                                : "#333",
                            }}
                          >
                            {facility.name}
                          </div>
                          <small
                            style={{
                              color: "#6c757d",
                              fontSize: "12px",
                              lineHeight: "1.3",
                            }}
                          >
                            {facility.description}
                          </small>
                        </div>
                      </div>
                    }
                    checked={isFacilitySelected(facility.name)}
                    onChange={(e) =>
                      handleFacilityChange(facility.name, e.target.checked)
                    }
                    style={{ marginBottom: "8px" }}
                  />
                </Col>
              ))}
            </Row>
          </div>
          <small className="text-muted mt-2 d-block">
            Đã chọn: <strong>{formData.facilities.length}</strong> tiện nghi
            {formData.facilities.length > 0 && (
              <span className="ms-2">({formData.facilities.join(", ")})</span>
            )}
          </small>
        </div>

        <Row className="mt-4 mb-5">
          <Col xs={1}>
            <Button
              style={styles.backButton}
              className="w-100"
              onClick={handleBack}
            >
              ←
            </Button>
          </Col>
          <Col xs={11}>
            <Button
              style={styles.continueButton}
              className="w-100"
              onClick={handleContinue}
            >
              Tiếp tục
            </Button>
          </Col>
        </Row>
      </Container>
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
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  formSection: {
    border: "1px solid #e7e7e7",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "4px",
    backgroundColor: "white",
  },
  continueButton: {
    backgroundColor: "#0071c2",
    border: "none",
    padding: "10px 0",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "white",
    border: "1px solid #0071c2",
    color: "#0071c2",
    padding: "10px 0",
    fontWeight: "bold",
  },
  navbarCustom: {
    backgroundColor: "#003580",
    padding: "10px 0",
  },
};

export default CreateRoom;