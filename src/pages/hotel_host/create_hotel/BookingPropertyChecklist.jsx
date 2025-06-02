import React from "react";
import { Navbar, Container, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import HotelActions from "@redux/hotel/actions";
import { useAppSelector } from "@redux/store";
import ConfirmationModal from "@components/ConfirmationModal";

function BookingPropertyChecklist() {
  const navigate = useNavigate();
  const dispatch= useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  const createHotel = useAppSelector((state) => state.Hotel.createHotel)
  const handleComfirm = () => {
    dispatch({
      type: HotelActions.CREATE_HOTEL,
      payload: {
        createHotel: createHotel,
        onSuccess: () => {
          setShowModal(false);
        },
      },
    });
    navigate(Routers.WaitPendingPage);
  }

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

      {/* Main Content */}
      <Container style={styles.mainContent}>
        {/* Step 1 - Completed */}
        <div style={styles.checklistItem}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <div style={styles.completedIcon}>✓</div>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 1</div>
              <div style={styles.stepTitle}>Thông tin chỗ nghỉ</div>
              <div style={styles.stepDescription}>
                Các thông tin cơ bản: Nhập tên chỗ nghỉ, địa chỉ, tiện nghi và
                nhiều hơn nữa.
              </div>
            </Col>
            <Col xs="auto">
              <a
                onClick={() => {
                  dispatch({
                    type: HotelActions.EDIT_HOTEL_DESCRIPTION_CREATE,
                    payload: {
                      checkCreateHotel: false,
                    },
                  });
                  navigate(Routers.BookingRegistration);
                }}
                style={styles.editLink}
              >
                Chỉnh sửa
              </a>
            </Col>
          </Row>
        </div>

        {/* Step 2 */}
        <div style={styles.checklistItem}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <span role="img" aria-label="room" style={{ fontSize: "24px" }}>
                  🛏️
                </span>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 2</div>
              <div style={styles.stepTitle}>Phòng</div>
              <div style={styles.stepDescription}>
                Hãy cho chúng tôi biết về phòng đầu tiên của Quý vị. Sau khi đã
                thiết lập xong một căn, Quý vị có thể thêm nhiều căn nữa.
              </div>
            </Col>
            <Col xs="auto">
              <Button
                style={styles.actionButton}
                onClick={() => {
                  navigate("/CreateRoom");
                }}
              >
                Thêm phòng
              </Button>
            </Col>
          </Row>
        </div>

        {/* Step 3 */}
        <div style={styles.checklistItem}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <span
                  role="img"
                  aria-label="photo"
                  style={{ fontSize: "24px" }}
                >
                  🖼️
                </span>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 3</div>
              <div style={styles.stepTitle}>Dịch vụ đi kèm</div>
              <div style={styles.stepDescription}>
                Những dịch vụ đi kèm với phòng của quý vị. Sau khi đã thiết lập
                xong tối thiểu 1 phòng.
              </div>
            </Col>
            <Col xs="auto">
              <Button style={styles.actionButton}>Thêm dịch vụ</Button>
            </Col>
          </Row>
        </div>

        {/* Step 4 */}
        <div style={styles.checklistItemLast}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <span
                  role="img"
                  aria-label="document"
                  style={{ fontSize: "24px" }}
                >
                  📄
                </span>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 4</div>
              <div style={styles.stepTitle}>Những bước cuối cùng</div>
              <div style={styles.stepDescription}>
                Nhập thông tin thanh toán và hóa đơn trước khi mở để nhận đặt
                phòng.
              </div>
            </Col>
            <Col xs="auto">
              <Button
                style={styles.secondaryButton}
                onClick={() => {
                  navigate(Routers.DocumentUpload);
                }}
              >
                Thêm các thông tin cuối cùng
              </Button>
            </Col>
          </Row>
        </div>
        {/* Confirmation Button */}
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <Button
            style={styles.confirmButton}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Xác nhận hoàn tất
          </Button>
        </div>
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleComfirm}
        title="Xác nhận tạo chỗ nghỉ"
        message="Bạn có chắc chắn muốn tạo chỗ nghỉ này không? Hành động này sẽ không thể hoàn tác."
        confirmButtonText="Tạo chỗ nghỉ"
        type="warning"
      />
      </Container>
    </div>
  );
}

// Define styles as a constant object
const styles = {
  // Main container styles
  bookingApp: {
    minHeight: "100vh",
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
  userInfo: {
    color: "#fff",
    textAlign: "right",
    marginRight: "15px",
  },
  userName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  userAddress: {
    fontSize: "12px",
  },
  languageSelector: {
    marginRight: "15px",
  },
  helpButton: {
    color: "#fff",
    textDecoration: "none",
  },
  helpIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    backgroundColor: "#fff",
    color: "#003580",
    borderRadius: "50%",
    fontWeight: "bold",
  },
  userIconCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    marginLeft: "10px",
  },

  // Main content styles
  mainContent: {
    maxWidth: "800px",
    margin: "30px auto",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  },

  // Checklist item styles
  checklistItem: {
    padding: "20px",
    borderBottom: "1px solid #e7e7e7",
  },
  checklistItemLast: {
    padding: "20px",
    borderBottom: "none",
  },
  stepNumber: {
    fontSize: "14px",
    color: "#6b6b6b",
    marginBottom: "5px",
  },
  stepTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  stepDescription: {
    fontSize: "14px",
    color: "#6b6b6b",
  },
  stepIcon: {
    width: "40px",
    height: "40px",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  completedIcon: {
    color: "#fff",
    backgroundColor: "#008009",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editLink: {
    color: "#0071c2",
    textDecoration: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  actionButton: {
    backgroundColor: "#0071c2",
    border: "none",
    padding: "8px 15px",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #e7e7e7",
    color: "#333",
    padding: "8px 15px",
  },
};

export default BookingPropertyChecklist;
