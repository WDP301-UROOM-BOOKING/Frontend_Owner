import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Button,
  Form,
  Card,
  ProgressBar,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RoomActions from "@redux/room/actions";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Factories from "@redux/room/factories"; // Add this import

function RoomImageForm() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Add this for storing files
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const createRoom = useAppSelector(state => state.Room.createRoom);
  console.log("createRoom:", createRoom);

  useEffect(() => {
    // If createRoom data exists, populate images with it
    if (createRoom.images && createRoom.images.length > 0) {
      setImages(createRoom.images);
    }
  }, [createRoom]);

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP");
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    setIsUploadingImages(true);
    setUploadProgress(0);

    try {
      // Use Factories.uploadRoomImages like in RoomListingPage
      const uploadResponse = await Factories.uploadRoomImages(files);
      
      if (uploadResponse && !uploadResponse.error) {
        // Add uploaded image URLs to images array
        const uploadedImages = uploadResponse.data.images.map((img) => img.url);
        setImages((prev) => [...prev, ...uploadedImages]);
        
        setUploadProgress(100);
        toast.success(`Đã upload ${files.length} ảnh thành công!`);
      } else {
        throw new Error(uploadResponse?.message || "Upload failed");
      }

      // Clear file input
      event.target.value = "";
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Có lỗi xảy ra khi upload ảnh");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    const totalImages = images.length;

    if (totalImages <= 5) {
      toast.error("Phòng phải có ít nhất 5 ảnh!");
      return;
    }

    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    const totalImages = images.length;

    if (totalImages < 5) {
      newErrors.images = "Phòng phải có ít nhất 5 ảnh";
    }

    // Don't allow continue if images are still uploading
    if (isUploadingImages) {
      newErrors.uploading = "Vui lòng chờ upload hoàn tất";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dispatch = useAppDispatch();

  const continueStep = () => {
    if (validateForm()) {
      dispatch({
        type: RoomActions.SAVE_ROOM_IMAGES_CREATE,
        payload: {
          images: [...images], // Only save uploaded image URLs
        },
      });

      console.log("images:", images);
      // Navigate to next step
      navigate("/PricingSetupForm");
    } else {
      if (isUploadingImages) {
        toast.error("Vui lòng chờ upload hoàn tất");
      } else {
        toast.error("Vui lòng upload đủ 5 ảnh để tiếp tục");
      }
    }
  };

  const totalImages = images.length;

  return (
    <div className="booking-app">
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
      <Container className="mt-4 mb-4">
        <div className="progress-section">
          <div className="progress-label mb-2">
            <h5>Thông tin cơ bản</h5>
          </div>
          <ProgressBar style={{ height: "20px" }}>
            <ProgressBar variant="primary" now={25} key={1} />
            <ProgressBar variant="primary" now={25} key={2} />
            <ProgressBar variant="primary" now={25} key={3} />
            <ProgressBar variant="secondary" now={25} key={4} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="main-content py-4">
        <Row>
          <Col md={7}>
            <Container className="main-content">
              <div className="mb-4">
                <h1 className="main-heading">Hình ảnh về phòng</h1>
              </div>

              {/* Image Upload Form */}
              <div
                className="facility-form-card"
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  padding: "20px",
                }}
              >
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Label>
                      Hình ảnh phòng <span className="text-danger">*</span>
                      <span className="text-muted ms-2">
                        ({totalImages}/5+ ảnh)
                      </span>
                    </Form.Label>

                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingImages}
                      isInvalid={!!errors.images}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.images}
                    </Form.Control.Feedback>

                    <Form.Text className="text-muted">
                      Chấp nhận JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh.{" "}
                      <strong>Tối thiểu 5 ảnh.</strong>
                    </Form.Text>

                    {/* Image count status */}
                    <div className="mt-2">
                      <small className="text-muted">
                        Tổng số ảnh: <strong>{totalImages}</strong>
                        {totalImages < 5 && (
                          <span className="text-danger ms-2">
                            (Cần thêm {5 - totalImages} ảnh)
                          </span>
                        )}
                        {totalImages >= 5 && !isUploadingImages && (
                          <span className="text-success ms-2">
                            ✓ Đủ số lượng ảnh
                          </span>
                        )}
                      </small>
                    </div>

                    {/* Loading indicator */}
                    {isUploadingImages && (
                      <Alert variant="info" className="mt-3">
                        <div className="d-flex align-items-center mb-2">
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          <span>Đang upload ảnh lên Cloudinary... {uploadProgress}%</span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${uploadProgress}%` }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </Alert>
                    )}

                    {/* Show uploaded images */}
                    {images.length > 0 && (
                      <div className="mt-3">
                        <small className="text-muted d-block mb-2">
                          <strong>Ảnh đã upload ({images.length}):</strong>
                        </small>
                        <Row className="mt-2">
                          {images.map((img, index) => (
                            <Col md={3} key={`uploaded-${index}`} className="mb-2">
                              <div style={{ position: "relative" }}>
                                <img
                                  src={img}
                                  alt={`Uploaded ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    border: "1px solid #28a745", // Green border for uploaded images
                                  }}
                                />
                                <Button
                                  variant="danger"
                                  size="sm"
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    padding: "2px 6px",
                                  }}
                                  onClick={() => removeImage(index)}
                                  disabled={isUploadingImages || totalImages <= 5}
                                  title={totalImages <= 5 ? "Không thể xóa - cần tối thiểu 5 ảnh" : "Xóa ảnh"}
                                >
                                  ×
                                </Button>
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    backgroundColor: "rgba(40, 167, 69, 0.9)",
                                    color: "white",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓ ĐÃ LƯU
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}

                    {/* Error message for images */}
                    {errors.images && (
                      <div className="text-danger mt-2 small">
                        {errors.images}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </Container>

            <div className="navigation-buttons mt-4">
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigate("/RoomNamingForm");
                }}
                disabled={isUploadingImages}
              >
                <FiArrowLeft className="back-icon" />
              </Button>
              <Button
                variant="primary"
                className="continue-button"
                onClick={continueStep}
                disabled={isUploadingImages || totalImages < 5}
              >
                {isUploadingImages ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang upload...
                  </>
                ) : (
                  "Tiếp tục"
                )}
              </Button>
            </div>
          </Col>

          <Col md={5}>
            <div className="info-cards">
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
                        Lời khuyên về hình ảnh phòng
                      </h5>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="info-text">
                      <strong>Để có ảnh đẹp nhất:</strong>
                    </p>
                    <ul className="info-list">
                      <li>Chụp ảnh trong điều kiện ánh sáng tốt</li>
                      <li>Hiển thị đầy đủ không gian phòng</li>
                      <li>Làm sạch phòng trước khi chụp</li>
                      <li>Chụp từ nhiều góc độ khác nhau</li>
                      <li>Tránh chụp ảnh mờ hoặc nghiêng</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>

              <Card className="info-card mt-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="info-icon thumbs-up">
                      <span role="img" aria-label="thumbs-up">
                        👍
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">Yêu cầu về ảnh</h5>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ul className="info-list">
                      <li>
                        <strong>Tối thiểu:</strong> 5 ảnh
                      </li>
                      <li>
                        <strong>Định dạng:</strong> JPG, PNG, WEBP
                      </li>
                      <li>
                        <strong>Kích thước:</strong> Tối đa 5MB/ảnh
                      </li>
                      <li>
                        <strong>Chất lượng:</strong> HD (1280x720) trở lên
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ...existing styles... */}
      <style jsx="true">{`
        .booking-app {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .navbar-custom {
          background-color: #003580;
          padding: 10px 0;
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

        .continue-button:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
        }

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
          margin-bottom: 10px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default RoomImageForm;