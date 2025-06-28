import React, { useState } from "react";
import * as Routers from "../../../utils/Routes";
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
import { useDispatch, useSelector } from "react-redux";
import RoomActions from "@redux/room/actions";
import { showToast, ToastProvider } from "@components/ToastContainer";
import Utils from "@utils/Utils";
import ConfirmationModal from "@components/ConfirmationModal";

function PricingSetupForm() {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [price, setPrice] = useState("0");
  const createRoom = useSelector(state => state.Room.createRoom);
  

  const handlePriceChange = (e) => {
    // Remove non-digits and format
    const value = e.target.value.replace(/\D/g, "");
    setPrice(value);
  };

  const handleContinue = () => {
    // Save pricing and complete room creation
    const finalPrice = Number(price);
    
    dispatch({
      type: RoomActions.SAVE_ROOM_PRICING_CREATE,
      payload: { price: finalPrice }
    });

    // Add completed room to create list
    const completeRoom = {
      ...createRoom,
      price: finalPrice
    };

    dispatch({
      type: RoomActions.SAVE_ROOM_TO_CREATE_LIST,
      payload: completeRoom
    });

    // Clear current room creation data
    dispatch({
      type: RoomActions.CLEAR_ROOM_CREATE
    });

    showToast.success("Thêm phòng thành công!");
    navigate(Routers.BookingPropertyChecklist);
  };
  
  const styles = {
    bookingApp: {
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
    },
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
            <h5>Thông tin cơ bản</h5>
          </div>
          <ProgressBar style={{ height: "20px" }}>
            <ProgressBar variant="primary" now={25} key={1} />
            <ProgressBar variant="primary" now={25} key={2} />
            <ProgressBar variant="primary" now={25} key={3} />
            <ProgressBar variant="primary" now={25} key={4} />
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
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={Utils.formatCurrency(price)}
                    onChange={handlePriceChange}
                    placeholder="Nhập giá phòng"
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
                <strong>{Utils.formatCurrency(price * 88 / 100)}</strong>
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
              navigate("/RoomImageForm");
            }}
          >←</Button>
          <Button 
            style={styles.continueButton}
            onClick={() => setShowAcceptModal(true)}
          >
            Hoàn thành
          </Button>
        </div>
      </Container>
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleContinue}
        title="Confirm Acceptance"
        message="Are you sure you want to create room setup?"
        confirmButtonText="Accept"
        type="accept"
      />
    </div>
  );
}

export default PricingSetupForm;
