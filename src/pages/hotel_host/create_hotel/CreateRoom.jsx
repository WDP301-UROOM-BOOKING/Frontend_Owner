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
import { useLocation, useNavigate } from "react-router-dom";

function CreateRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bedCount, setBedCount] = useState({
    singleBed: 1,
    doubleBed: 0,
    kingBed: 0,
    superKingBed: 0,
  });

  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);

  const handleBedCountChange = (bedType, value) => {
    setBedCount({
      ...bedCount,
      [bedType]: value,
    });
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
            <ProgressBar variant="secondary" now={25} key={2} />
            <ProgressBar variant="secondary" now={25} key={3} />
            <ProgressBar variant="secondary" now={25} key={4} />
          </ProgressBar>
        </div>
      </Container>

      <Container style={styles.formContainer}>
        <h2 style={styles.formTitle}>Chi tiết phòng</h2>

        <div style={styles.formSection}>
          <Form.Group className="mb-3">
            <Form.Label>Đây là loại chỗ nghỉ gì?</Form.Label>
            <Form.Select>
              <option>Phòng đơn</option>
              <option>Phòng đôi</option>
              <option>Phòng giường đôi/ 2 giường đơn</option>
              <option>Phòng gia đình</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quý vị có bao nhiêu phòng loại này?</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={roomCount}
              onChange={(e) => setRoomCount(parseInt(e.target.value) || 1)}
              style={styles.numberInput}
            />
          </Form.Group>
        </div>

        <div style={styles.formSection}>
          <Form.Label>Có loại giường nào trong phòng này?</Form.Label>

          <div style={styles.bedRow}>
            <div style={styles.bedInfo}>
              <span style={styles.bedIcon}>🛏️</span>
              <div>
                <p style={styles.bedName}>Giường đơn</p>
                <p style={styles.bedSize}>Rộng 90 - 130 cm</p>
              </div>
            </div>
            <InputGroup style={styles.numberInput}>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange(
                    "singleBed",
                    Math.max(0, bedCount.singleBed - 1)
                  )
                }
              >
                -
              </Button>
              <Form.Control
                value={bedCount.singleBed}
                readOnly
                style={{ textAlign: "center" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange("singleBed", bedCount.singleBed + 1)
                }
              >
                +
              </Button>
            </InputGroup>
          </div>

          <div style={styles.bedRow}>
            <div style={styles.bedInfo}>
              <span style={styles.bedIcon}>🛏️</span>
              <div>
                <p style={styles.bedName}>Giường đôi</p>
                <p style={styles.bedSize}>Rộng 131 - 150 cm</p>
              </div>
            </div>
            <InputGroup style={styles.numberInput}>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange(
                    "doubleBed",
                    Math.max(0, bedCount.doubleBed - 1)
                  )
                }
              >
                -
              </Button>
              <Form.Control
                value={bedCount.doubleBed}
                readOnly
                style={{ textAlign: "center" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange("doubleBed", bedCount.doubleBed + 1)
                }
              >
                +
              </Button>
            </InputGroup>
          </div>

          <div style={styles.bedRow}>
            <div style={styles.bedInfo}>
              <span style={styles.bedIcon}>🛏️</span>
              <div>
                <p style={styles.bedName}>Giường lớn (cỡ King)</p>
                <p style={styles.bedSize}>Rộng 151 - 180 cm</p>
              </div>
            </div>
            <InputGroup style={styles.numberInput}>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange(
                    "kingBed",
                    Math.max(0, bedCount.kingBed - 1)
                  )
                }
              >
                -
              </Button>
              <Form.Control
                value={bedCount.kingBed}
                readOnly
                style={{ textAlign: "center" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange("kingBed", bedCount.kingBed + 1)
                }
              >
                +
              </Button>
            </InputGroup>
          </div>

          <div style={styles.bedRow}>
            <div style={styles.bedInfo}>
              <span style={styles.bedIcon}>🛏️</span>
              <div>
                <p style={styles.bedName}>Giường rất lớn (cỡ Super King)</p>
                <p style={styles.bedSize}>Rộng 181 - 210 cm</p>
              </div>
            </div>
            <InputGroup style={styles.numberInput}>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange(
                    "superKingBed",
                    Math.max(0, bedCount.superKingBed - 1)
                  )
                }
              >
                -
              </Button>
              <Form.Control
                value={bedCount.superKingBed}
                readOnly
                style={{ textAlign: "center" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleBedCountChange(
                    "superKingBed",
                    bedCount.superKingBed + 1
                  )
                }
              >
                +
              </Button>
            </InputGroup>
          </div>
        </div>
        
        <div style={styles.formSection}>
          <Form.Label>Phòng này rộng bao nhiêu?</Form.Label>
          <Row className="mb-3">
            <Col>
              <Form.Label>Diện tích phòng - không kể toilet</Form.Label>
              <Form.Select>
                <option>Chọn diện tích</option>
                <option>Dưới 10 m²</option>
                <option>10 - 15 m²</option>
                <option>15 - 20 m²</option>
                <option>20 - 30 m²</option>
                <option>Trên 30 m²</option>
              </Form.Select>
            </Col>
          </Row>
        </div>
        
        <div style={styles.formSection}>
          <Form.Label>Bao nhiêu khách có thể nghỉ ở phòng này?</Form.Label>
          <InputGroup style={{ maxWidth: "120px" }}>
            <Button
              variant="outline-secondary"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            >
              -
            </Button>
            <Form.Control
              value={guestCount}
              readOnly
              style={{ textAlign: "center" }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setGuestCount(guestCount + 1)}
            >
              +
            </Button>
          </InputGroup>
        </div>

        <Row className="mt-4 mb-5">
          <Col xs={1}>
            <Button
              style={styles.backButton}
              className="w-100"
              onClick={() => {
                navigate("/BookingPropertyChecklist");
              }}
            >
              ←
            </Button>
          </Col>
          <Col xs={11}>
            <Button
              style={styles.continueButton}
              className="w-100"
              onClick={() => {
                navigate("/RoomNamingForm");
              }}
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
  header: {
    backgroundColor: "#003580",
    padding: "10px 0",
    marginBottom: "20px",
  },
  logo: {
    height: "24px",
    marginLeft: "20px",
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
  },
  bedRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  bedInfo: {
    display: "flex",
    alignItems: "center",
  },
  bedIcon: {
    width: "24px",
    height: "24px",
    marginRight: "10px",
  },
  bedName: {
    fontWeight: "bold",
    margin: "0",
  },
  bedSize: {
    fontSize: "12px",
    color: "#6b6b6b",
    margin: "0",
  },
  numberInput: {
    width: "120px",
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
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
  },
  infoBox: {
    backgroundColor: "#ebf3ff",
    border: "1px solid #d2e3fc",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  closeIcon: {
    cursor: "pointer",
    float: "right",
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


export default CreateRoom;
