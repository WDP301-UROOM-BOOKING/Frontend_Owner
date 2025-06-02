import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Navbar, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function RoomNamingForm() {
  const [roomName, setRoomName] = useState("Phòng Đơn Hạng Bình Dân");

  const styles = {
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
    bulletIcon: {
      marginRight: "10px",
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
    // Navbar styles
    navbarCustom: {
        backgroundColor: "#003580",
        padding: "10px 0",
    },
    navbarBrand: {
        color: "#fff",
        fontWeight: "bold",
    },
  };
  
  const navigate= useNavigate();
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
                <Form.Label>Tên phòng</Form.Label>
                <Form.Select
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                >
                  <option>Phòng Standard</option>
                  <option>Phòng Family</option>
                  <option>Phòng Deluxe</option>
                  <option>Phòng Suite</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Col>

          <Col md={5}>
            <div style={styles.infoCard}>
              <div style={styles.infoHeader}>
                <div style={styles.infoTitle}>
                  <span style={styles.lightBulbIcon}>
                    <i className="fa fa-lightbulb-o" aria-hidden="true">
                      💡
                    </i>
                  </span>
                  Vì sao tôi không thể sử dụng tên phòng tùy chỉnh?
                </div>
                <button style={styles.closeButton}>×</button>
              </div>

              <p>
                Tên phòng tiêu chuẩn có nhiều lợi ích mà tên tùy chỉnh không có:
              </p>

              <ul style={{ paddingLeft: "20px" }}>
                <li style={styles.bulletPoint}>
                  Cung cấp đầy đủ thông tin hơn
                </li>
                <li style={styles.bulletPoint}>
                  Theo hệ thống thống nhất trên trang web, cho phép khách nhanh
                  chóng tìm và so sánh phòng
                </li>
                <li style={styles.bulletPoint}>
                  Dễ hiểu cho dù khách bất kể xuất thân và quốc tịch
                </li>
                <li style={styles.bulletPoint}>
                  Được phiên dịch sang 43 ngôn ngữ
                </li>
              </ul>

              <p>
                Sau khi đăng ký, Quý vị sẽ có lựa chọn để thêm{" "}
                <span style={styles.highlightText}>tên phòng tùy chỉnh</span>.
                Với những tên này, khách sẽ không thấy nhưng Quý vị có thể sử
                dụng để tham khảo nội bộ.
              </p>
            </div>
          </Col>
        </Row>

        <div style={styles.buttonContainer}>
          <Button 
            style={styles.backButton}
            onClick={() => {
              navigate("/CreateRoom");
            }}
            >←</Button>
          <Button 
            style={styles.continueButton}
            onClick={() =>{
              navigate('/PricingSetupForm')
            }}
          >Tiếp tục</Button>
        </div>
      </Container>
    </div>
  );
}

export default RoomNamingForm;
