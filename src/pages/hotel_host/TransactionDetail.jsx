import React, { useState, useEffect } from "react";
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
import "../../css/hotelHost/BookingBill.css";
import { useParams } from "react-router-dom";
import Utils from "@utils/Utils";
import { useAppSelector } from "@redux/store";

const TransactionDetail = ({ detailReservation, show, handleClose }) => {
  const Auth = useAppSelector((state) => state.Auth.Auth);

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

  // Calculate total price from rooms and services
  const calculateTotalPrice = (rooms, services = [], checkInDate, checkOutDate) => {
    // Calculate number of nights
    const calculateNights = (checkIn, checkOut) => {
      if (!checkIn || !checkOut) return 1;
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return nights > 0 ? nights : 1;
    };

    const nights = calculateNights(checkInDate, checkOutDate);

    // Calculate rooms total
    const roomsTotal = rooms && Array.isArray(rooms) 
      ? rooms.reduce((total, roomItem) => {
          const roomPrice = roomItem.room?.price || 0;
          const quantity = roomItem.quantity || 1;
          // Room price = price per night × quantity × number of nights
          return total + roomPrice * quantity * nights;
        }, 0)
      : 0;

    // Calculate services total
    const servicesTotal = services && Array.isArray(services)
      ? services.reduce((total, serviceItem) => {
          const servicePrice = serviceItem.service?.price || 0;
          const quantity = serviceItem.quantity || 1;
          const daysCount = serviceItem.selectDate?.length || 1;
          // Service price = price × quantity × selected days
          return total + servicePrice * quantity * daysCount;
        }, 0)
      : 0;

    return roomsTotal + servicesTotal;
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `${amount}`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  console.log("detailReservation: ", detailReservation);

  return (
    <Modal show={show} onHide={handleClose} size="xl">
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
                src={
                  detailReservation?.hotel?.images?.[0]?.url
                }
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
                  {detailReservation?.hotel?.hotelName ||
                   detailReservation?.hotel?.name ||
                   "Hotel Name"}
                </p>

                <div className="check-dates-container">
                  <div className="check-date-box">
                    <p className="date-label">Check-in Date</p>
                    <p className="date-value">
                      {formatDate(detailReservation?.checkInDate)}
                    </p>
                  </div>

                  <div className="star-rating-container">
                    <p className="star-hotel-text">Star Hotel</p>
                    <StarRating rating={detailReservation?.hotel?.star ?? 4} />
                  </div>

                  <div className="check-date-box">
                    <p className="date-label">Check-out Date</p>
                    <p className="date-value">
                      {formatDate(detailReservation?.checkOutDate)}
                    </p>
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
                  <p className="date-created">
                    Date created: {formatDate(detailReservation?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="info-section">
                <h5 className="section-title">I. CUSTOMER INFORMATION</h5>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Customer name:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.user?.name || "N/A"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Phone number:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.user?.phoneNumber || "N/A"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Email:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.user?.email || "N/A"}
                  </Col>
                </Row>
              </div>

              {/* Hotel Information */}
              <div className="info-section">
                <h5 className="section-title">II. HOTEL INFORMATION</h5>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Phone number:
                  </Col>
                  <Col md={8} className="info-value">
                    {detailReservation?.hotel?.phoneNumber || "N/A"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={4} className="info-label">
                    Email:
                  </Col>
                  <Col md={8} className="info-value">
                    {Auth?.email || "N/A"}
                  </Col>
                </Row>
                {detailReservation?.hotel?.address && (
                  <Row className="mb-2">
                    <Col md={4} className="info-label">
                      Address:
                    </Col>
                    <Col md={8} className="info-value">
                      {detailReservation.hotel.address}
                    </Col>
                  </Row>
                )}
              </div>

              {/* Booking Information */}
              <div className="info-section">
                <Row className="mb-2">
                  <Col md={12} className="info-label">
                    <h5>III. BOOKING INFORMATION</h5>
                  </Col>
                </Row>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Rooms and Services</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rooms */}
                    {detailReservation?.rooms &&
                    Array.isArray(detailReservation.rooms) ? (
                      detailReservation.rooms.map((roomItem, index) => {
                        const nights = (() => {
                          if (!detailReservation.checkInDate || !detailReservation.checkOutDate) return 1;
                          const checkInDate = new Date(detailReservation.checkInDate);
                          const checkOutDate = new Date(detailReservation.checkOutDate);
                          const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
                          const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                          return nights > 0 ? nights : 1;
                        })();

                        return (
                          <tr key={`room-${index}`}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>Room:</strong> {roomItem.room?.name || "Phòng"}
                              <br />
                              <small className="text-muted">
                                {formatCurrency(roomItem.room?.price || 0)} × {roomItem.quantity} room × {nights} nights
                              </small>
                            </td>
                            <td>
                              {roomItem.quantity || 1}
                              <br />
                              <small className="text-muted">× {nights} nights</small>
                            </td>
                            <td>
                              {formatCurrency(
                                (roomItem.room?.price || 0) * (roomItem.quantity || 1) * nights
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : null}

                    {/* Services */}
                    {detailReservation?.services &&
                    Array.isArray(detailReservation.services) &&
                    detailReservation.services.length > 0 ? (
                      detailReservation.services.map((serviceItem, index) => (
                        <tr key={`service-${index}`}>
                          <td>{(detailReservation.rooms?.length || 0) + index + 1}</td>
                          <td>
                            <strong>Service:</strong> {serviceItem.service?.name || "Dịch vụ"}
                            <br />
                            <small className="text-muted">
                              Dates: {serviceItem.selectDate?.map(date => 
                                formatDate(date)
                              ).join(", ") || "N/A"}
                            </small>
                          </td>
                          <td>
                            {serviceItem.quantity / serviceItem.selectDate?.length || 1}
                            <br />
                            <small className="text-muted">
                              × {serviceItem.selectDate?.length || 1} days
                            </small>
                          </td>
                          <td>
                            {formatCurrency(
                              (serviceItem.service?.price || 0) * (serviceItem.quantity || 1)
                            )}
                          </td>
                        </tr>
                      ))
                    ) : null}

                    {/* Show message if no rooms or services */}
                    {(!detailReservation?.rooms || detailReservation.rooms.length === 0) &&
                     (!detailReservation?.services || detailReservation.services.length === 0) && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No booking information available
                        </td>
                      </tr>
                    )}

                    {/* Total Row */}
                    <tr className="total-row">
                      <td colSpan={2}>
                        <strong>Total amount</strong>
                      </td>
                      <td colSpan={2}>
                        <strong>
                          {formatCurrency(
                            detailReservation?.totalAmount ||
                            detailReservation?.totalPrice ||
                            calculateTotalPrice(
                              detailReservation?.rooms,
                              detailReservation?.services,
                              detailReservation?.checkInDate,
                              detailReservation?.checkOutDate
                            )
                          )}
                        </strong>
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
                  label="Agree to the Hotel and Website Terms & Privacy"
                  className="terms-checkbox"
                  defaultChecked={true}
                  disabled={true}
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
