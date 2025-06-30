import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Navbar,
  ProgressBar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import RoomActions from "@redux/room/actions";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@redux/store";

function RoomNamingForm() {
  const [roomName, setRoomName] = useState("");
  const [customName, setCustomName] = useState("");
  const [useCustomName, setUseCustomName] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
    const createRoom = useAppSelector(state => state.Room.createRoom);
  useEffect(() => {
      // If createRoom data exists, populate formData with it
      if (createRoom.name !== "") {
        setUseCustomName(true)
        setCustomName(createRoom.name);
      }
    }, [createRoom]);

  // Room name options
  const roomNameOptions = [
    "Phòng Standard",
    "Phòng Family",
    "Phòng Deluxe",
    "Phòng Suite",
    "Phòng Superior",
    "Phòng Executive",
    "Phòng Premium",
    "Phòng Luxury",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (useCustomName) {
      if (!customName.trim()) {
        newErrors.customName = "Tên phòng tùy chỉnh không được để trống";
      } else if (customName.trim().length < 3) {
        newErrors.customName = "Tên phòng phải có ít nhất 3 ký tự";
      } else if (customName.trim().length > 50) {
        newErrors.customName = "Tên phòng không được vượt quá 50 ký tự";
      }
    } else {
      if (!roomName) {
        newErrors.roomName = "Vui lòng chọn tên phòng";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dispatch = useDispatch();
  const handleContinue = () => {
    if (validateForm()) {
      dispatch({
        type: RoomActions.SAVE_ROOM_NAME_CREATE,
        payload: {
          name: useCustomName ? customName : roomName,
        },
      });

      // Navigate to next step
      navigate("/RoomNamingForm");
    }
    if (validateForm()) {
      navigate("/RoomImageForm");
    }
  };

  const styles = {
    bookingApp: {
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
    },
    container: {
      maxWidth: "1000px",
      margin: "50px auto",
      padding: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "30px",
    },
    formSection: {
      marginBottom: "20px",
    },
    infoCard: {
      border: "1px solid #e7e7e7",
      borderRadius: "4px",
      padding: "20px",
      backgroundColor: "#fff",
    },
    infoHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    infoTitle: {
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "16px",
    },
    lightBulbIcon: {
      marginRight: "10px",
      color: "#febb02",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
    },
    bulletPoint: {
      marginBottom: "10px",
    },
    highlightText: {
      color: "#0071c2",
      cursor: "pointer",
    },
    buttonContainer: {
      display: "flex",
      marginTop: "30px",
    },
    backButton: {
      width: "50px",
      marginRight: "10px",
      backgroundColor: "white",
      color: "#0071c2",
      border: "1px solid #0071c2",
    },
    continueButton: {
      flex: 1,
      backgroundColor: "#0071c2",
      border: "none",
    },
    navbarCustom: {
      backgroundColor: "#003580",
      padding: "10px 0",
    },
    customNameSection: {
      marginTop: "15px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "5px",
      border: "1px solid #dee2e6",
    },
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
          <ProgressBar style={{ height: "20px" }}>
            <ProgressBar variant="primary" now={25} key={1} />
            <ProgressBar variant="primary" now={25} key={2} />
            <ProgressBar variant="secondary" now={25} key={3} />
            <ProgressBar variant="secondary" now={25} key={4} />
          </ProgressBar>
        </div>
      </Container>

      <Container style={styles.container}>
        <h1 style={styles.title}>Tên của phòng này là gì?</h1>

        <Row>
          <Col md={7}>
            <div style={styles.infoCard}>
              <p>
                Đây là tên mà khách sẽ thấy trên trang chỗ nghỉ của Quý vị. Hãy
                chọn tên miêu tả phòng này chính xác nhất.
              </p>

              <Form.Group className="mb-3" style={styles.formSection}>
                <Form.Label>Tên phòng *</Form.Label>

                {/* Standard room names */}
                <Form.Select
                  value={roomName}
                  onChange={(e) => {
                    setRoomName(e.target.value);
                    setUseCustomName(false);
                    if (errors.roomName) {
                      setErrors((prev) => ({ ...prev, roomName: "" }));
                    }
                  }}
                  isInvalid={!!errors.roomName}
                  disabled={useCustomName}
                >
                  <option value="">Chọn tên phòng</option>
                  {roomNameOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.roomName}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Custom name option */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="useCustomName"
                  label="Sử dụng tên phòng tùy chỉnh"
                  checked={useCustomName}
                  onChange={(e) => {
                    setUseCustomName(e.target.checked);
                    if (!e.target.checked) {
                      setCustomName("");
                      if (errors.customName) {
                        setErrors((prev) => ({ ...prev, customName: "" }));
                      }
                    }
                  }}
                />
              </Form.Group>

              {/* Custom name input */}
              {useCustomName && (
                <div style={styles.customNameSection}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên phòng tùy chỉnh *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên phòng tùy chỉnh"
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        if (errors.customName) {
                          setErrors((prev) => ({ ...prev, customName: "" }));
                        }
                      }}
                      isInvalid={!!errors.customName}
                      maxLength={50}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customName}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      {customName.length}/50 ký tự
                    </Form.Text>
                  </Form.Group>
                  <small className="text-info">
                    💡 Tên tùy chỉnh sẽ hiển thị trên trang web của bạn
                  </small>
                </div>
              )}

              {/* Preview */}
              <div
                className="mt-3 p-3"
                style={{ backgroundColor: "#e8f4f8", borderRadius: "5px" }}
              >
                <small className="text-muted">
                  <strong>Tên phòng sẽ hiển thị:</strong>
                </small>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#0071c2",
                  }}
                >
                  {useCustomName
                    ? customName || "Chưa nhập tên"
                    : roomName || "Chưa chọn tên"}
                </div>
              </div>
            </div>
          </Col>

          <Col md={5}>
            <div style={styles.infoCard}>
              <div style={styles.infoHeader}>
                <div style={styles.infoTitle}>
                  <span style={styles.lightBulbIcon}>💡</span>
                  Tên phòng tiêu chuẩn vs tùy chỉnh
                </div>
              </div>

              <div className="mb-3">
                <strong>Tên phòng tiêu chuẩn:</strong>
                <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                  <li style={styles.bulletPoint}>
                    Cung cấp đầy đủ thông tin hơn
                  </li>
                  <li style={styles.bulletPoint}>
                    Theo hệ thống thống nhất trên trang web
                  </li>
                  <li style={styles.bulletPoint}>Dễ hiểu cho khách quốc tế</li>
                  <li style={styles.bulletPoint}>
                    Được phiên dịch sang nhiều ngôn ngữ
                  </li>
                </ul>
              </div>

              <div>
                <strong>Tên phòng tùy chỉnh:</strong>
                <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                  <li style={styles.bulletPoint}>
                    Thể hiện cá tính riêng của khách sạn
                  </li>
                  <li style={styles.bulletPoint}>
                    Tạo ấn tượng đặc biệt với khách
                  </li>
                  <li style={styles.bulletPoint}>
                    Linh hoạt trong cách đặt tên
                  </li>
                  <li style={styles.bulletPoint}>
                    Phù hợp với thương hiệu của bạn
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>

        <div style={styles.buttonContainer}>
          <Button
            style={styles.backButton}
            onClick={() => {
              navigate("/CreateRoom");
            }}
          >
            ←
          </Button>
          <Button style={styles.continueButton} onClick={handleContinue}>
            Tiếp tục
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default RoomNamingForm;
