import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Utils from "@utils/Utils";

function Room({ show, handleClose, onSave, editingRoom }) {
  const [formData, setFormData] = useState({
    name: "",
    roomType: "Phòng đơn",
    image: "",
    capacity: 1,
    beds: {
      singleBed: 1,
      doubleBed: 0,
      kingBed: 0,
      superKingBed: 0,
    },
    bathroom: "Riêng",
    price: 120000,
    count: 1,
    size: "15 - 20 m²",
  });

  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or when editing room changes
  useEffect(() => {
    if (editingRoom) {
      setFormData(editingRoom);
    } else {
      setFormData({
        name: "",
        roomType: "Phòng đơn",
        image: "",
        capacity: 1,
        beds: {
          singleBed: 1,
          doubleBed: 0,
          kingBed: 0,
          superKingBed: 0,
        },
        bathroom: "Riêng",
        price: 120000,
        count: 1,
        size: "15 - 20 m²",
      });
    }
    setErrors({});
  }, [editingRoom, show]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleBedCountChange = (bedType, value) => {
    setFormData(prev => ({
      ...prev,
      beds: {
        ...prev.beds,
        [bedType]: Math.max(0, value)
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng không được để trống";
    }

    if (!formData.image.trim()) {
      newErrors.image = "URL hình ảnh không được để trống";
    }

    if (formData.price <= 0) {
      newErrors.price = "Giá phòng phải lớn hơn 0";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Số lượng khách phải lớn hơn 0";
    }

    if (formData.count <= 0) {
      newErrors.count = "Số lượng phòng phải lớn hơn 0";
    }

    const totalBeds = Object.values(formData.beds).reduce((sum, count) => sum + count, 0);
    if (totalBeds === 0) {
      newErrors.beds = "Phải có ít nhất 1 giường";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      roomType: "Phòng đơn",
      image: "",
      capacity: 1,
      beds: {
        singleBed: 1,
        doubleBed: 0,
        kingBed: 0,
        superKingBed: 0,
      },
      bathroom: "Riêng",
      price: 120000,
      count: 1,
      size: "15 - 20 m²",
    });
    setErrors({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="booking-app bg-light">
          <Container className="py-4">
            {/* Room Name Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Thông tin cơ bản</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Tên phòng *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên phòng"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL hình ảnh *</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Room Type Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">
                    Đây là loại chỗ nghỉ gì?
                  </Form.Label>
                  <Form.Select
                    value={formData.roomType}
                    onChange={(e) => handleInputChange("roomType", e.target.value)}
                  >
                    <option value="Phòng đơn">Phòng đơn</option>
                    <option value="Phòng đôi">Phòng đôi</option>
                    <option value="Phòng 2 giường đơn">Phòng 2 giường đơn</option>
                    <option value="Phòng gia đình">Phòng gia đình</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">
                    Quý vị có bao nhiêu phòng loại này?
                  </Form.Label>
                  <InputGroup style={{ maxWidth: "150px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleInputChange("count", Math.max(1, formData.count - 1))}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      min="1"
                      value={formData.count}
                      onChange={(e) => handleInputChange("count", parseInt(e.target.value) || 1)}
                      className="text-center"
                      isInvalid={!!errors.count}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleInputChange("count", formData.count + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                  {errors.count && (
                    <div className="text-danger small mt-1">{errors.count}</div>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Bed Types Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form.Label className="fw-medium mb-3">
                  Có loại giường nào trong phòng này?
                </Form.Label>
                {errors.beds && (
                  <Alert variant="danger" className="mb-3">
                    {errors.beds}
                  </Alert>
                )}

                {/* Single Bed */}
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <span className="me-3 fs-5">🛏️</span>
                    <div>
                      <p className="mb-0 fw-medium">Giường đơn</p>
                      <p className="mb-0 text-muted small">Rộng 90 - 130 cm</p>
                    </div>
                  </div>
                  <InputGroup style={{ width: "120px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("singleBed", formData.beds.singleBed - 1)}
                    >
                      -
                    </Button>
                    <Form.Control
                      value={formData.beds.singleBed}
                      readOnly
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("singleBed", formData.beds.singleBed + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>

                {/* Double Bed */}
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <span className="me-3 fs-5">🛏️</span>
                    <div>
                      <p className="mb-0 fw-medium">Giường đôi</p>
                      <p className="mb-0 text-muted small">Rộng 131 - 150 cm</p>
                    </div>
                  </div>
                  <InputGroup style={{ width: "120px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("doubleBed", formData.beds.doubleBed - 1)}
                    >
                      -
                    </Button>
                    <Form.Control
                      value={formData.beds.doubleBed}
                      readOnly
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("doubleBed", formData.beds.doubleBed + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>

                {/* King Bed */}
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <span className="me-3 fs-5">🛏️</span>
                    <div>
                      <p className="mb-0 fw-medium">Giường lớn (cỡ King)</p>
                      <p className="mb-0 text-muted small">Rộng 151 - 180 cm</p>
                    </div>
                  </div>
                  <InputGroup style={{ width: "120px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("kingBed", formData.beds.kingBed - 1)}
                    >
                      -
                    </Button>
                    <Form.Control
                      value={formData.beds.kingBed}
                      readOnly
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("kingBed", formData.beds.kingBed + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>

                {/* Super King Bed */}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="me-3 fs-5">🛏️</span>
                    <div>
                      <p className="mb-0 fw-medium">
                        Giường rất lớn (cỡ Super King)
                      </p>
                      <p className="mb-0 text-muted small">Rộng 181 - 210 cm</p>
                    </div>
                  </div>
                  <InputGroup style={{ width: "120px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("superKingBed", formData.beds.superKingBed - 1)}
                    >
                      -
                    </Button>
                    <Form.Control
                      value={formData.beds.superKingBed}
                      readOnly
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleBedCountChange("superKingBed", formData.beds.superKingBed + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                </div>
              </Card.Body>
            </Card>

            {/* Room Size Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form.Label className="fw-medium mb-3">
                  Phòng này rộng bao nhiêu?
                </Form.Label>
                <Row>
                  <Col>
                    <Form.Label>Diện tích phòng - không kể toilet</Form.Label>
                    <Form.Select
                      value={formData.size}
                      onChange={(e) => handleInputChange("size", e.target.value)}
                    >
                      <option value="Dưới 10 m²">Dưới 10 m²</option>
                      <option value="10 - 15 m²">10 - 15 m²</option>
                      <option value="15 - 20 m²">15 - 20 m²</option>
                      <option value="20 - 30 m²">20 - 30 m²</option>
                      <option value="Trên 30 m²">Trên 30 m²</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Guest Capacity Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form.Label className="fw-medium mb-3">
                  Bao nhiêu khách có thể nghỉ ở phòng này?
                </Form.Label>
                <InputGroup style={{ maxWidth: "150px" }}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleInputChange("capacity", Math.max(1, formData.capacity - 1))}
                  >
                    -
                  </Button>
                  <Form.Control
                    value={formData.capacity}
                    readOnly
                    className="text-center"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleInputChange("capacity", formData.capacity + 1)}
                  >
                    +
                  </Button>
                </InputGroup>
                {errors.capacity && (
                  <div className="text-danger small mt-1">{errors.capacity}</div>
                )}
              </Card.Body>
            </Card>

            {/* Bathroom Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form.Group>
                  <Form.Label className="fw-medium">Loại phòng tắm</Form.Label>
                  <Form.Select
                    value={formData.bathroom}
                    onChange={(e) => handleInputChange("bathroom", e.target.value)}
                  >
                    <option value="Riêng">Riêng</option>
                    <option value="Chung">Chung</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Pricing Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Quý vị muốn thu bao nhiêu tiền mỗi đêm?</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Số tiền khách trả</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                      isInvalid={!!errors.price}
                    />
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Bao gồm các loại thuế, phí và hoa hồng
                  </Form.Text>
                </Form.Group>

                <div className="bg-light p-2 rounded mb-3">
                  <span>15,00% Hoa hồng cho Booking.com</span>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-start mb-2">
                    <span className="text-success me-2">✓</span>
                    <span>Trợ giúp 24/7 bằng ngôn ngữ của Quý vị</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <span className="text-success me-2">✓</span>
                    <span>
                      Tiết kiệm thời gian với đặt phòng được xác nhận tự động
                    </span>
                  </div>
                  <div className="d-flex align-items-start">
                    <span className="text-success me-2">✓</span>
                    <span>
                      Chúng tôi sẽ quảng bá chỗ nghỉ của Quý vị trên Google
                    </span>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">
                  <strong className="fs-5">
                    {Utils.formatCurrency(Math.round(formData.price * 0.85))}
                  </strong>
                  <span className="text-muted">
                    Doanh thu của Quý vị (bao gồm thuế)
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleCancel}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {editingRoom ? "Cập nhật" : "Thêm phòng"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Room;
