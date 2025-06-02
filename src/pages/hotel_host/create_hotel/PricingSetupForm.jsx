import React, { useState } from "react";
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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function PricingSetupForm() {
  const [price, setPrice] = useState("125.000");
  const [sliderValue, setSliderValue] = useState(87033);
  const [helpfulFeedback, setHelpfulFeedback] = useState(null);
  const navigate= useNavigate();

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "20px auto",
      padding: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "30px",
    },
    card: {
      border: "1px solid #e7e7e7",
      borderRadius: "4px",
      padding: "20px",
      marginBottom: "20px",
      backgroundColor: "#fff",
    },
    sliderContainer: {
      marginTop: "20px",
      marginBottom: "20px",
    },
    sliderLabel: {
      textAlign: "center",
      backgroundColor: "#0071c2",
      color: "white",
      padding: "5px 10px",
      borderRadius: "4px",
      position: "relative",
      marginBottom: "10px",
    },
    sliderLabelArrow: {
      width: "0",
      height: "0",
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderTop: "8px solid #0071c2",
      position: "absolute",
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
    },
    slider: {
      width: "100%",
    },
    priceRange: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
    },
    feedbackButtons: {
      display: "flex",
      alignItems: "center",
      marginTop: "15px",
    },
    feedbackButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      marginLeft: "10px",
      cursor: "pointer",
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
    highlightText: {
      color: "#0071c2",
      cursor: "pointer",
    },
    priceInput: {
      marginTop: "10px",
      marginBottom: "5px",
    },
    smallText: {
      fontSize: "12px",
      color: "#6b6b6b",
    },
    commissionRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      marginBottom: "10px",
    },
    benefitItem: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "10px",
    },
    checkIcon: {
      color: "#008009",
      marginRight: "10px",
      fontSize: "18px",
    },
    revenueRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      paddingTop: "15px",
      borderTop: "1px solid #e7e7e7",
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
            <ProgressBar variant="primary" now={25} key={3} />
            <ProgressBar variant="secondary" now={25} key={4} />
          </ProgressBar>
        </div>
      </Container>

      <Container style={styles.container}>
        <h1 style={styles.title}>Thiết lập giá mỗi đêm cho phòng này</h1>
        <Row>
          <Col md={7}>
            <div style={styles.card}>
              <h5>Quý vị muốn thu bao nhiêu tiền mỗi đêm?</h5>
              <Form.Group>
                <Form.Label>Số tiền khách trả</Form.Label>
                <InputGroup style={styles.priceInput}>
                  <InputGroup.Text>VND</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </InputGroup>
                <Form.Text style={styles.smallText}>
                  Bao gồm các loại thuế, phí và hoa hồng
                </Form.Text>
              </Form.Group>

              <div style={styles.commissionRow}>
                <span>12,00% Hoa hồng cho Booking.com</span>
              </div>

              <div>
                <div style={styles.benefitItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Trợ giúp 24/7 bằng ngôn ngữ của Quý vị</span>
                </div>
                <div style={styles.benefitItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>
                    Tiết kiệm thời gian với đặt phòng được xác nhận tự động
                  </span>
                </div>
                <div style={styles.benefitItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>
                    Chúng tôi sẽ quảng bá chỗ nghỉ của Quý vị trên Google
                  </span>
                </div>
              </div>

              <div style={styles.revenueRow}>
                <strong>VND 105.000</strong>
                <span>Doanh thu của Quý vị (bao gồm thuế)</span>
              </div>
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
                  Nếu tôi cảm thấy chưa chắc chắn về giá thì sao?
                </div>
                <button style={styles.closeButton}>×</button>
              </div>

              <p>
                Đừng lo lắng, Quý vị có thể đổi lại bất cứ lúc nào. Thậm chí Quý
                vị có thể thiết lập giá cuối tuần, giữa tuần và theo mùa, nhờ đó
                giúp Quý vị kiểm soát doanh thu tốt hơn.
              </p>
            </div>
          </Col>
        </Row>

        <div style={styles.buttonContainer}>
          <Button 
            style={styles.backButton}
            onClick={() => {
              navigate("/RoomNamingForm");
            }}
          >←</Button>
          <Button 
            style={styles.continueButton}
            onClick={() => {
              navigate("/RoomImageForm");
            }}
          >
            Tiếp tục
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default PricingSetupForm;
