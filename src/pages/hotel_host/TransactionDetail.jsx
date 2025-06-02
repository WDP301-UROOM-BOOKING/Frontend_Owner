import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Image,
  Modal,
} from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
// import Banner from "../../images/banner.jpg";
import "../../css/hotelHost/BookingBill.css";
import { useParams } from "react-router-dom";
import Utils from "@utils/Utils";
import { useAppSelector } from "@redux/store";

const TransactionDetail = ({detailReservation, show, handleClose }) => {

  const Auth = useAppSelector((state) => state.Auth.Auth)
  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} className="star filled" />
          ) : (
            <FaRegStar key={index} className="star" />
          )
        )}
      </div>
    );
  };
    // Calculate total price from rooms
  const calculateTotalPrice = (rooms) => {
    if (!rooms || !Array.isArray(rooms)) return 0;
    return rooms.reduce((total, roomItem) => {
      const roomPrice = roomItem.room?.price || 0;
      const quantity = roomItem.quantity || 1;
      return total + roomPrice * quantity;
    }, 0);
  };
  console.log("detailReservation: ", detailReservation)
  return (
    <Modal show={show} onHide={handleClose} size="xl" style={{marginTop: "130px"}}>
      <div className="p-3">
        <Container fluid className="booking-bill-container">
          <Modal.Header>
            <Modal.Title>Transaction Detail</Modal.Title>
            <Button variant="close" onClick={handleClose} />
          </Modal.Header>

          <Row className="g-0">
            {/* Left side - Hotel Image and Info */}
            <Col
              md={5}
              className="hotel-info-section"
              style={{ paddingTop: "20px", paddingLeft: "20px" }}
            >
              <Image
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/647144068.jpg?k=acaba5abb30178b9f1c312eb53c94e59996dd9e624bb1835646a2a427cf87f0a&o=&hp=1"
                alt="Hotel Room"
                style={{
                  height: "510px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="hotel-details">
                <h5 className="hotel-name-title">Hotel Name</h5>
                <p className="hotel-full-name">
                  {detailReservation?.hotel?.hotelName}
                </p>

                <div className="check-dates-container">
                  <div className="check-date-box">
                    <p className="date-label">Checkin Dates</p>
                    <p className="date-value">{Utils.getDate(detailReservation?.checkInDate, 1)}</p>
                  </div>

                  <div className="star-rating-container">
                    <p className="star-hotel-text">Star Hotel</p>
                    <StarRating rating={detailReservation?.hotel?.star ?? 0} />
                  </div>

                  <div className="check-date-box">
                    <p className="date-label">Checkout Dates</p>
                    <p className="date-value">{Utils.getDate(detailReservation?.checkOutDate, 1)}</p>
                  </div>
                </div>
              </div>
            </Col>

            {/* Right side - Booking Bill */}
            <Col md={7} className="bill-section">
              <div className="bill-header">
                <h2 className="uroom-title">
                  <b style={{ fontSize: 30 }}>
                    UR<span style={{ color: "#f8e71c" }}>OO</span>M
                  </b>
                </h2>
                <div className="booking-bill-header">
                  <h4>Booking Bill</h4>
                  <p className="date-created">Date created: {Utils.getDate(detailReservation?.createdAt, 1)}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="info-section">
                <h5 className="section-title">I. INFORMATION CUSTOMER</h5>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Name Customer:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.user?.name}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Contact Customer:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.user?.phoneNumber}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Email Customer:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.user?.email}
                  </Col>
                </Row>
              </div>

              {/* Hotel Information */}
              <div className="info-section">
                <h5 className="section-title">II. INFORMATION HOTEL</h5>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Contact Hotel:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.hotel?.phoneNumber}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Email Hotel:
                  </Col>
                  <Col md={8} className="info-value">
                    {Auth.email}
                  </Col>
                </Row>
              </div>

              {/* Booking Information */}
              <div className="info-section">
                    <Row className="mb-2">
                      <Col md={12} className="info-label">
                      <h5>III. BOOKING INFORMATION</h5>
                      </Col>
                    </Row>
                    <Table bordered className="booking-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Room name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailReservation.rooms &&
                        Array.isArray(detailReservation?.rooms) ? (
                          detailReservation.rooms.map((roomItem, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{roomItem.room?.name || "Phòng"}</td>
                              <td>{roomItem.quantity || 1}</td>
                              <td>
                                {Utils.formatCurrency(roomItem.room?.price * roomItem.quantity || 0)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No room information available
                            </td>
                          </tr>
                        )}
                        <tr className="total-row">
                          <td colSpan={2}>Total amount</td>
                          <td colSpan={2}>
                            {Utils.formatCurrency(
                              detailReservation.totalAmount ||
                                calculateTotalPrice(detailReservation.rooms)
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

              {/* Customer Signature */}
              <div className="info-section">
                <h5 className="section-title">IV. CUSTOMER SIGNATURE</h5>
                <Form.Check
                  type="checkbox"
                  id="terms-checkbox"
                  label="Agree the Terms & Privacy of hotels and web"
                  className="terms-checkbox"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Modal>
  );
};

export default TransactionDetail;
