"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Form,
  Button,
  Card,
  Alert,
  Pagination,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { useNavigate } from "react-router-dom";
import TransactionDetail from "./TransactionDetail";
import { useDispatch, useSelector } from "react-redux";
import ReservationActions from "../../redux/reservation/actions";
import MonthlyPaymentActions from "@redux/monthlyPayment/actions";
import Utils from "@utils/Utils";

const Transaction = () => {
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.Reservation);
  const { list } = useSelector((state) => state.MonthlyPayment);
  const [selectedAdminYear, setSelectedAdminYear] = useState(
    new Date().getFullYear()
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("desc");
  const [detailReservation, setDetailReservation] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Trạng thái thông tin ngân hàng
  const [hasBankInfo, setHasBankInfo] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    branch: "",
  });
  const [savedBankInfo, setSavedBankInfo] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Gọi API lấy reservation theo filter, sort, month, year
    dispatch({
      type: ReservationActions.FETCH_RESERVATIONS,
      payload: {
        status: selectedStatus !== "All" ? selectedStatus : undefined,
        month: selectedMonth,
        year: selectedYear,
        sort: selectedSort,
      },
    });
    // Reset về trang 1 khi filter thay đổi
    setCurrentPage(1);
  }, [dispatch, selectedMonth, selectedYear, selectedStatus, selectedSort]);
  useEffect(() => {
    dispatch({
      type: MonthlyPaymentActions.FETCH_MONTHLY_PAYMENTS,
      payload: { year: selectedAdminYear },
    });
  }, [dispatch, selectedAdminYear]);

  const handleBankInfoChange = (e) => {
    const { name, value } = e.target;
    setBankInfo({
      ...bankInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin ngân hàng đã gửi:", bankInfo);
    setSavedBankInfo(bankInfo);
    setHasBankInfo(true);
    setShowForm(false);
    showToast.success("Tạo tài khoản ngân hàng thành công");
  };

  const handleEdit = () => {
    setBankInfo(savedBankInfo);
    setShowForm(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Tạo danh sách năm từ 2021 đến 2025
  const years = Array.from({ length: 5 }, (_, i) => 2021 + i);

  // Logic để hiển thị tháng dựa trên năm được chọn
  const getAvailableMonths = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11

    if (selectedYear === currentYear) {
      // Nếu là năm hiện tại (2025), chỉ hiển thị đến tháng hiện tại (tháng 5 = index 4)
      return months.slice(0, currentMonth + 1);
    } else {
      // Nếu là năm khác, hiển thị đủ 12 tháng
      return months;
    }
  };

  // Pagination logic
  const totalItems = reservations?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations?.slice(startIndex, endIndex) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tạo pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    // First page
    if (totalPages > maxVisiblePages && currentPage > 3) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (currentPage > 4) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    // Visible pages
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (totalPages > maxVisiblePages && currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    return items;
  };

  const totalCustomerPaid = reservations?.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );

  // Separate calculations for online and offline reservations
  const onlineReservations =
    reservations?.filter((r) => r.status !== "OFFLINE") || [];
  const offlineReservations =
    reservations?.filter((r) => r.status === "OFFLINE") || [];

  const onlineTotalPaid = onlineReservations.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );
  const offlineTotalPaid = offlineReservations.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );

  // Commission only calculated for online reservations
  const totalCommission = Math.floor(onlineTotalPaid * 0.12);

  // Host amount: online reservations (88%) + offline reservations (100%)
  const totalAmountToHost =
    Math.floor(onlineTotalPaid * 0.88) + offlineTotalPaid;

  const completedCount =
    reservations?.filter(
      (r) => r.status === "COMPLETED" || r.status === "CHECKED OUT"
    ).length || 0;
  const pendingCount =
    reservations?.filter((r) => r.status === "PENDING").length || 0;
  const bookedCount =
    reservations?.filter(
      (r) => r.status === "BOOKED" || r.status === "CHECKED IN"
    ).length || 0;

  return (
    <div className="main-content_1">
      <ToastProvider />
      <h4>Bảng điều khiển thanh toán chủ khách sạn</h4>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Kỳ thanh toán</Card.Header>
            <Card.Body>
              <Form>
                <Row className="align-items-end">
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label>Tháng</Form.Label>
                      <Form.Select
                        value={selectedMonth}
                        onChange={(e) => {
                          const newMonth = Number.parseInt(e.target.value);
                          setSelectedMonth(newMonth);
                        }}
                      >
                        {getAvailableMonths().map((month, index) => (
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label>Năm</Form.Label>
                      <Form.Select
                        value={selectedYear}
                        onChange={(e) => {
                          const newYear = Number.parseInt(e.target.value);
                          setSelectedYear(newYear);

                          // Nếu chuyển sang năm hiện tại và tháng hiện tại > tháng được chọn
                          const currentYear = new Date().getFullYear();
                          const currentMonth = new Date().getMonth();
                          if (
                            newYear === currentYear &&
                            selectedMonth > currentMonth
                          ) {
                            setSelectedMonth(currentMonth);
                          }
                        }}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label>Trạng thái</Form.Label>
                      <Form.Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="All">Tất cả</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CHECKED OUT">CHECKED OUT</option>
                        <option value="CHECKED IN">CHECKED IN</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="NOT PAID">NOT PAID</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label>Lọc theo:</Form.Label>
                      <Form.Select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                      >
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header as="h5">Tóm tắt thanh toán</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng thanh toán của khách:</span>
                <strong>{Utils.formatCurrency(totalCustomerPaid)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng hoa hồng (Admin):</span>
                <strong className="text-danger">
                  {Utils.formatCurrency(totalCommission)}
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng số tiền cho chủ khách sạn:</span>
                <strong className="text-success">
                  {Utils.formatCurrency(totalAmountToHost)}
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Hóa đơn Hoàn thành / Đang xử lý / Đang thực hiện:</span>
                <strong>
                  {completedCount}/{pendingCount}/{bookedCount}
                </strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header as="h5">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Danh sách thanh toán cho {getAvailableMonths()[selectedMonth - 1]}{" "}
              - {selectedYear}
            </span>
            <span className="text-muted">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, totalItems)} của{" "}
              {totalItems} kết quả
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Ngày đặt</th>
                <th>Phòng đặt</th>
                <th>Khách thanh toán</th>
                <th>Hoa hồng</th>
                <th>Số tiền cho chủ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations && currentReservations.length > 0 ? (
                currentReservations.map((reservation, index) => {
                  if (reservation.status !== "OFFLINE") {
                    return (
                      <tr
                        key={reservation._id}
                        onClick={() => {
                          setShowModal(true);
                          setDetailReservation(reservation);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{startIndex + index + 1}</td>
                        <td>{Utils.getDate(reservation.createdAt, 18)}</td>
                        <td>
                          <span>
                            {reservation.rooms &&
                              reservation.rooms.length > 0 &&
                              reservation.rooms.map((roomObj, idx) => {
                                console.log("ABC: ", roomObj);
                                return (
                                  <div key={idx}>
                                    {roomObj.room?.name} - {roomObj.quantity}{" "}
                                    rooms
                                  </div>
                                );
                              })}
                          </span>
                        </td>
                        <td>
                          {Utils.formatCurrency(reservation.totalPrice || 0)}
                        </td>
                        <td className="text-danger">
                          {Utils.formatCurrency(
                            Math.floor(reservation.totalPrice * 0.12 || 0)
                          )}
                        </td>
                        <td className="text-success">
                          {Utils.formatCurrency(
                            Math.floor(reservation.totalPrice * 0.88 || 0)
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              reservation.status === "COMPLETED"
                                ? "bg-secondary"
                                : reservation.status === "PENDING"
                                ? "bg-warning"
                                : reservation.status === "CANCELLED" ||
                                  reservation.status === "NOT PAID"
                                ? "bg-danger"
                                : reservation.status === "BOOKED"
                                ? "bg-success"
                                : reservation.status === "CHECKED OUT"
                                ? "bg-info"
                                : "bg-primary"
                            }`}
                            style={{
                              width: "100px",
                              height: "30px",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={reservation._id}
                        onClick={() => {
                          setShowModal(true);
                          setDetailReservation(reservation);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{startIndex + index + 1}</td>
                        <td>{Utils.getDate(reservation.createdAt, 18)}</td>
                        <td>
                          <span>
                            {reservation.rooms &&
                              reservation.rooms.length > 0 &&
                              reservation.rooms.map((roomObj, idx) => {
                                console.log("ABC: ", roomObj);
                                return (
                                  <div key={idx}>
                                    {roomObj.room?.name} - {roomObj.quantity}{" "}
                                    rooms
                                  </div>
                                );
                              })}
                          </span>
                        </td>
                        <td>
                          {Utils.formatCurrency(reservation.totalPrice || 0)}
                        </td>
                        <td className="text-danger">0</td>
                        <td className="text-success">
                          {Utils.formatCurrency(
                            Math.floor(reservation.totalPrice * 1 || 0)
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              reservation.status === "COMPLETED"
                                ? "bg-secondary"
                                : reservation.status === "PENDING"
                                ? "bg-warning"
                                : reservation.status === "CANCELLED" ||
                                  reservation.status === "NOT PAID"
                                ? "bg-danger"
                                : reservation.status === "BOOKED"
                                ? "bg-success"
                                : reservation.status === "CHECKED OUT"
                                ? "bg-info"
                                : "bg-primary"
                            }`}
                            style={{
                              width: "100px",
                              height: "30px",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không tìm thấy thanh toán nào cho kỳ này
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="table-secondary">
                <td colSpan="3" className="text-end">
                  <strong>Tổng:</strong>
                </td>
                <td>
                  <strong>{Utils.formatCurrency(totalCustomerPaid)}</strong>
                </td>
                <td>
                  <strong>{Utils.formatCurrency(totalCommission)}</strong>
                </td>
                <td>
                  <strong>{Utils.formatCurrency(totalAmountToHost)}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>{renderPaginationItems()}</Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Thanh toán từ Admin</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-0">
                  <Form.Label>Năm</Form.Label>
                  <Form.Select
                    value={selectedAdminYear}
                    onChange={(e) =>
                      setSelectedAdminYear(Number.parseInt(e.target.value))
                    }
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header as="h5">
          Danh sách doanh thu cho năm {selectedAdminYear}
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Tháng/Năm</th>
                <th>Tổng doanh thu</th>
                <th>Hoa hồng</th>
                <th>Số tiền cho chủ</th>
                <th>Trạng thái</th>
                <th>Ngày trả tiền</th>
              </tr>
            </thead>
            <tbody>
              {list && list.length > 0 ? (
                list.map((payment, index) => (
                  <tr key={payment._id} className="text-center">
                    <td>{index + 1}</td>
                    <td>
                      {payment.month}/{payment.year}
                    </td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td className="text-danger">
                      {formatCurrency(payment.amount * 0.15)}
                    </td>
                    <td className="text-success">
                      {formatCurrency(payment.amount * 0.85)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          payment.status === "COMPLETED"
                            ? "bg-success"
                            : payment.status === "PENDING"
                            ? "bg-warning"
                            : payment.status === "CANCELLED"
                            ? "bg-danger"
                            : "bg-info"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.paymentDate
                        ? Utils.getDate(payment.paymentDate)
                        : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không tìm thấy thanh toán nào cho kỳ này
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <TransactionDetail
        show={showModal}
        onHide={() => setShowModal(false)}
        handleClose={() => setShowModal(false)}
        detailReservation={detailReservation}
      />
    </div>
  );
};

export default Transaction;
