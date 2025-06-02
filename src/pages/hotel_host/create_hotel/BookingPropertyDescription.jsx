import React from "react"
import { useState, useEffect } from "react"
import { Navbar, Container, Button, Form, Card, ProgressBar, Row, Col, Alert } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { ArrowLeft, Upload, X, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@redux/store"
import { showToast, ToastProvider } from "@components/ToastContainer"
import HotelActions from "@redux/hotel/actions"
import * as Routers from "../../../utils/Routes";

// Star rating options
const starOptions = [
  { value: 1, label: "1 sao" },
  { value: 2, label: "2 sao" },
  { value: 3, label: "3 sao" },
  { value: 4, label: "4 sao" },
  { value: 5, label: "5 sao" },
]

export default function BookingPropertyDescription() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const createHotel = useAppSelector((state) => state.Hotel.createHotel)
  console.log("createHotel:   ", createHotel);
  // Initialize state with values from Redux store
  const [star, setStar] = useState(createHotel?.star || 1)
  const [description, setDescription] = useState(createHotel?.description || "")
  const [images, setImages] = useState(createHotel?.images || [])

  const [dragActive, setDragActive] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  // Validate form
  const validateForm = () => {
    const errors = []

    if (!description.trim()) {
      errors.push("Vui lòng nhập mô tả về khách sạn")
    } else if (description.trim().length < 50) {
      errors.push("Mô tả khách sạn phải có ít nhất 50 ký tự")
    }

    if (images.length < 5) {
      errors.push(`Vui lòng upload đủ 5 hình ảnh (hiện tại: ${images.length}/5)`)
    }

    return errors
  }

  // Validate whenever form data changes
  useEffect(() => {
    const errors = validateForm()
    setValidationErrors(errors)
  }, [star, description, images])

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files) => {
    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type))

    if (invalidFiles.length > 0) {
      showToast.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP")
      return
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      showToast.error("Kích thước file không được vượt quá 5MB")
      return
    }

    // Check total number of images
    if (images.length + files.length > 5) {
      showToast.warning("Chỉ được upload tối đa 5 hình ảnh")
      return
    }

    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    }
  }

  const handleContinue = () => {
    const errors = validateForm()

    if (errors.length > 0) {
      showToast.error("Vui lòng kiểm tra lại thông tin đã nhập")
      return
    }

    // Dispatch action to save data
    dispatch({
      type: HotelActions.SAVE_HOTEL_DESCRIPTION_CREATE,
      payload: {
        star,
        description: description.trim(),
        images: createHotel.images,
        checkCreateHotel: true,
      },
    })

    showToast.success("Đã lưu thông tin mô tả khách sạn thành công!")
    navigate(Routers.BookingPropertyChecklist)
  }

  const handleBack = () => {
    // Save current data before going back
    dispatch({
      type: HotelActions.SAVE_HOTEL_DESCRIPTION_CREATE,
      payload: {
        star,
        description: description.trim(),
        images: createHotel.images,
      },
    })

    navigate(Routers.BookingPropertyCheckInOut)
  }

  const isFormValid = validationErrors.length === 0

  return (
    <div className="booking-app">
      <ToastProvider/>

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
            <ProgressBar variant="primary" now={20} key={5} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="main-content py-4">
        <Row>
          <Col md={7}>
            <div className="mb-4">
              <h1 className="main-heading">Tiêu chuẩn và mô tả về khách sạn</h1>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Vui lòng kiểm tra lại:</Alert.Heading>
                <ul className="mb-0">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Description Form */}
            <div className="facility-form-card">
              <Form>
                {/* Star Rating */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        <Star className="me-2" size={18} />
                        Tiêu chuẩn khách sạn <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        className="form-input"
                        value={star}
                        onChange={(e) => setStar(Number(e.target.value))}
                      >
                        {starOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <div className="star-display">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={24}
                          className={index < star ? "star-filled" : "star-empty"}
                          fill={index < star ? "#ffc107" : "none"}
                          color={index < star ? "#ffc107" : "#dee2e6"}
                        />
                      ))}
                    </div>
                  </Col>
                </Row>

                {/* Description */}
                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Mô tả về khách sạn <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Nhập mô tả chi tiết về khách sạn của bạn... (tối thiểu 50 ký tự)"
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        isInvalid={validationErrors.some((error) => error.includes("mô tả"))}
                      />
                      <Form.Text className="text-muted">{description.length}/50 ký tự tối thiểu</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Image Upload */}
                <Row className="mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Hình ảnh khách sạn <span className="text-danger">*</span>
                        <span className="text-muted ms-2">({images.length}/5 ảnh)</span>
                      </Form.Label>

                      {/* Upload Area */}
                      <div
                        className={`upload-area ${dragActive ? "drag-active" : ""} ${
                          images.length >= 5 ? "disabled" : ""
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="upload-content">
                          <Upload size={48} className="upload-icon" />
                          <h5>Kéo thả ảnh vào đây hoặc</h5>
                          <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={images.length >= 5}
                            className="d-none"
                            id="image-upload"
                          />
                          <Button
                            as="label"
                            htmlFor="image-upload"
                            variant="outline-primary"
                            disabled={images.length >= 5}
                          >
                            Chọn ảnh
                          </Button>
                          <p className="upload-note">Chấp nhận JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh.</p>
                        </div>
                      </div>

                      {/* Image Preview */}
                      {images.length > 0 && (
                        <div className="image-preview mt-3">
                          <Row>
                            {images.map((img, index) => (
                              <Col md={4} key={index} className="mb-3">
                                <div className="preview-container">
                                  <img
                                    src={img || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    className="preview-image"
                                  />
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="remove-button"
                                    onClick={() => removeImage(index)}
                                    title="Xóa ảnh"
                                  >
                                    <X size={16} />
                                  </Button>
                                  <div className="image-info">
                                    <small>{img.name}</small>
                                    <br />
                                    <small className="text-muted">{(img.size / 1024 / 1024).toFixed(2)} MB</small>
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Form Summary */}
                {isFormValid && (
                  <Alert variant="success" className="mt-4">
                    <div className="form-summary">
                      <h6>Tóm tắt thông tin:</h6>
                      <p className="mb-1">
                        <strong>Tiêu chuẩn:</strong> {star} sao
                      </p>
                      <p className="mb-1">
                        <strong>Mô tả:</strong> {description.length} ký tự
                      </p>
                      <p className="mb-0">
                        <strong>Hình ảnh:</strong> {images.length}/5 ảnh
                      </p>
                    </div>
                  </Alert>
                )}
              </Form>
            </div>

            <div className="navigation-buttons mt-4">
              <Button variant="outline-primary" className="back-button" onClick={handleBack} title="Quay lại">
                <ArrowLeft size={20} />
              </Button>
              <Button variant="primary" className="continue-button" onClick={handleContinue} disabled={!isFormValid}>
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
                      <h5 className="info-title">Những tiêu chuẩn của khách sạn của mình?</h5>
                      <p className="info-text mt-3">
                        Quý vị có thể dễ dàng tùy chỉnh các quy tắc chung này sau và các quy tắc chung bổ sung có thể
                        được cài đặt trong trang Chính sách trên extranet sau khi hoàn tất đăng ký.
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
                        📝
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">Mẹo viết mô tả hấp dẫn</h5>
                      <ul className="info-list mt-3">
                        <li>Mô tả vị trí và tiện ích nổi bật</li>
                        <li>Nhấn mạnh điểm độc đáo của khách sạn</li>
                        <li>Sử dụng ngôn ngữ tích cực, thân thiện</li>
                        <li>Upload ảnh chất lượng cao, đa dạng góc độ</li>
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

        .form-input {
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-input:focus {
          border-color: #0071c2;
          box-shadow: 0 0 0 0.2rem rgba(0, 113, 194, 0.25);
        }

        .form-input.is-invalid {
          border-color: #dc3545;
        }

        .star-display {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .star-filled {
          color: #ffc107;
        }

        .star-empty {
          color: #dee2e6;
        }

        .upload-area {
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          background-color: #f8f9fa;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .upload-area:hover:not(.disabled) {
          border-color: #0071c2;
          background-color: #f0f8ff;
        }

        .upload-area.drag-active {
          border-color: #0071c2;
          background-color: #e3f2fd;
        }

        .upload-area.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-icon {
          color: #6c757d;
        }

        .upload-note {
          font-size: 12px;
          color: #6c757d;
          margin: 0;
        }

        .preview-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .remove-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .image-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
          padding: 8px;
          font-size: 12px;
        }

        .form-summary h6 {
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
          
          .upload-area {
            padding: 20px 16px;
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
  )
}
