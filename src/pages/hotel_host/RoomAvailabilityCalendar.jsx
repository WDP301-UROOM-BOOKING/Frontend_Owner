import { useState } from "react"
import { Row, Col, Card, Badge, Button, Form, Tooltip, OverlayTrigger, Modal, Table } from "react-bootstrap"
import {
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaClock,
  FaSignInAlt,
  FaSignOutAlt,
  FaPrint,
  FaWifi,
  FaUtensils,
  FaWineGlassAlt,
  FaCar,
  FaSpa,
  FaSwimmingPool,
} from "react-icons/fa"
import { useAppSelector, useAppDispatch } from "@redux/store"
import RoomUnitActions from "@redux/room_unit/action"
import "../../css/hotelHost/BookingSchedule.css"

function RoomAvailabilityCalendar() {
  const dispatch = useAppDispatch()

  // Lấy dữ liệu từ Redux store với fallback
  const { 
    rooms = [], 
    bookings: rawBookings = [], 
    availableServices = [], 
    filters = {}, 
    loading = false, 
    error = null 
  } = useAppSelector((state) => state.RoomUnit)

  // Nếu availableServices trống, khởi tạo dữ liệu mẫu
  const defaultServices = [
    { id: 1, name: "WiFi", price: 5, icon: FaWifi },
    { id: 2, name: "Bữa sáng", price: 15, icon: FaUtensils },
    { id: 3, name: "Minibar", price: 20, icon: FaWineGlassAlt },
    { id: 4, name: "Đỗ xe", price: 10, icon: FaCar },
    { id: 5, name: "Spa", price: 50, icon: FaSpa },
    { id: 6, name: "Hồ bơi", price: 25, icon: FaSwimmingPool },
  ]

  const services = availableServices.length > 0 ? availableServices : defaultServices
  
  // Chuyển đổi bookings về đúng kiểu Date
  const bookings = rawBookings.map(b => ({
    ...b,
    startDate: b.startDate instanceof Date ? b.startDate : new Date(b.startDate),
    endDate: b.endDate instanceof Date ? b.endDate : new Date(b.endDate),
  }))

  // State cho ngày hiện tại và phạm vi hiển thị
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewDays, setViewDays] = useState(14) // Số ngày hiển thị
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filterRoomType, setFilterRoomType] = useState("all")

  // State mới cho quản lý phòng
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [showEditRoomModal, setShowEditRoomModal] = useState(false)
  const [roomToEdit, setRoomToEdit] = useState(null)

  // State mới cho nhận phòng và trả phòng
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showCheckOutModal, setShowCheckOutModal] = useState(false)
  const [checkInBooking, setCheckInBooking] = useState(null)
  const [checkOutBooking, setCheckOutBooking] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("credit")

  // Tạo ngày cho lịch
  const getDates = () => {
    const dates = []
    const startDate = new Date(currentDate)

    for (let i = 0; i < viewDays; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  // Định dạng ngày để hiển thị
  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
  }

  // Định dạng ngày trong tuần
  const formatDayOfWeek = (date) => {
    return date.toLocaleDateString("vi-VN", { weekday: "short" })
  }

  // Kiểm tra xem phòng có được đặt vào một ngày cụ thể không
  const isRoomBooked = (roomId, date) => {
    return bookings.some((booking) => booking.roomId === roomId && date >= booking.startDate && date < booking.endDate)
  }

  // Lấy thông tin đặt phòng cho một phòng và ngày cụ thể
  const getBooking = (roomId, date) => {
    return bookings.find((booking) => booking.roomId === roomId && date >= booking.startDate && date < booking.endDate)
  }

  // Kiểm tra xem hôm nay có phải là ngày nhận phòng cho một đặt phòng không
  const isCheckInDate = (booking, date) => {
    return date.toDateString() === booking.startDate.toDateString()
  }

  // Kiểm tra xem hôm nay có phải là ngày trả phòng cho một đặt phòng không
  const isCheckOutDate = (booking, date) => {
    const checkoutDate = new Date(booking.endDate)
    checkoutDate.setDate(checkoutDate.getDate() - 1)
    return date.toDateString() === checkoutDate.toDateString()
  }

  // Xử lý điều hướng ngày
  const navigateDate = (days) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  // Xử lý khi nhấp vào phòng để đặt
  const handleRoomClick = (room, date) => {
    const booking = getBooking(room.id, date)

    if (booking) {
      // Hiển thị chi tiết đặt phòng
      setSelectedBooking(booking)
      setShowDetailsModal(true)
    } else {
      // Hiển thị biểu mẫu đặt phòng
      setSelectedRoom({ ...room, date })
      setShowBookingModal(true)
    }
  }

  // Xử lý đặt phòng mới
  const handleAddBooking = (e) => {
    e.preventDefault()

    // Lấy dữ liệu biểu mẫu
    const guestName = e.target.guestName.value
    const startDate = new Date(selectedRoom.date)
    const nights = Number.parseInt(e.target.nights.value)
    const guestCount = Number.parseInt(e.target.guestCount.value)
    const idNumber = e.target.idNumber.value
    const phoneNumber = e.target.phoneNumber.value
    const email = e.target.email.value

    // Tính ngày kết thúc
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + nights)

    // Tạo đặt phòng mới
    const newBooking = {
      id: bookings.length + 1,
      roomId: selectedRoom.id,
      guestName,
      startDate,
      endDate,
      status: "confirmed",
      type: selectedRoom.type.toLowerCase(),
      guestCount,
      paymentStatus: "pending",
      checkedIn: false,
      checkedOut: false,
      services: [],
      depositAmount: 0,
      idNumber,
      phoneNumber,
      email,
    }

    // Thêm đặt phòng vào danh sách
    dispatch({
      type: RoomUnitActions.ADD_BOOKING_SUCCESS,
      payload: newBooking,
    })

    // Đóng modal
    setShowBookingModal(false)
  }

  // Mở modal chỉnh sửa phòng
  const openEditRoomModal = (room) => {
    setRoomToEdit(room)
    setShowEditRoomModal(true)
  }

  // Mở modal nhận phòng
  const openCheckInModal = (booking) => {
    setCheckInBooking(booking)
    setShowCheckInModal(true)
  }

  // Mở modal trả phòng
  const openCheckOutModal = (booking) => {
    console.log('Opening checkout modal for booking:', booking) // Debug
    setCheckOutBooking(booking)
    setSelectedServices([])
    setShowCheckOutModal(true)
  }

  // Xử lý xác nhận nhận phòng
  const handleCheckIn = (bookingId, depositAmount) => {
    dispatch({
      type: RoomUnitActions.CHECK_IN_SUCCESS,
      payload: { bookingId, depositAmount },
    })
    setShowCheckInModal(false)
  }

  // Xử lý xác nhận trả phòng
  const handleCheckOut = (bookingId, selectedServices) => {
    dispatch({
      type: RoomUnitActions.CHECK_OUT_SUCCESS,
      payload: { bookingId, selectedServices },
    })
    setShowCheckOutModal(false)
  }

  // Chuyển đổi lựa chọn dịch vụ
  const toggleService = (service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  // Tính tổng hóa đơn cho trả phòng
  const calculateBill = (booking) => {
    if (!booking) {
      return {
        roomCharge: 0,
        serviceCharge: 0,
        total: 0,
        deposit: 0,
        balance: 0,
      }
    }

    try {
      // Lấy giá phòng
      const room = rooms.find((r) => r.id === booking.roomId)
      const roomPrice = room ? room.price : 0

      // Tính số đêm
      const nights = Math.round((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24))

      // Tính phí phòng
      const roomCharge = roomPrice * nights

      // Tính phí dịch vụ - kiểm tra an toàn
      const serviceCharge = Array.isArray(selectedServices) 
        ? selectedServices.reduce((total, service) => total + (service.price || 0), 0)
        : 0

      // Tính tổng
      const total = roomCharge + serviceCharge

      // Tính số tiền còn lại (tổng - đặt cọc)
      const deposit = booking.depositAmount || 0
      const balance = total - deposit

      return {
        roomCharge,
        serviceCharge,
        total,
        deposit,
        balance,
      }
    } catch (error) {
      console.error('Error calculating bill:', error)
      return {
        roomCharge: 0,
        serviceCharge: 0,
        total: 0,
        deposit: 0,
        balance: 0,
      }
    }
  }

  // Lọc phòng dựa trên loại
  const filteredRooms =
    filterRoomType === "all"
      ? rooms
      : filterRoomType === "available"
        ? rooms.filter(
            (room) =>
              !bookings.some(
                (booking) =>
                  booking.roomId === room.id &&
                  currentDate >= booking.startDate &&
                  currentDate < booking.endDate &&
                  !booking.checkedOut,
              ),
          )
        : rooms.filter((room) => room.type.toLowerCase() === filterRoomType.toLowerCase())

  return (
    <div className="d-flex">
      <div className="main-content_1 p-3">
        <div className=" text-black d-flex justify-content-between align-items-center mb-3">
          <h4>Tổng quan khách sạn</h4>
          <div className="d-flex">
            <Button variant="outline-primary" className="me-2" onClick={() => navigateDate(-viewDays)}>
              &lt;&lt; Trước
            </Button>
            <div className="d-flex">
              <div style={{ color: "black" }} className="mt-1 me-2">
                <FaCalendarAlt className="me-2" style={{ justifyContent: "center", alignItems: "center" }} />
                {formatDate(currentDate)} - {formatDate(getDates()[getDates().length - 1])}
              </div>
            </div>

            <Button variant="outline-primary" onClick={() => navigateDate(viewDays)}>
              Sau &gt;&gt;
            </Button>
          </div>
        </div>

        <Card.Body className="p-0">
          {/* Bộ lọc và Hành động */}
          <div className="calendar-filters p-3  border-bottom">
            <Row className="align-items-center">
              <Col md={3}>
                <div className="d-flex align-items-center">
                  <FaFilter className="me-2 text-primary" />
                  <span className="fw-bold">Bộ lọc:</span>
                </div>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Loại phòng</Form.Label>
                  <Form.Select value={filterRoomType} onChange={(e) => setFilterRoomType(e.target.value)}>
                    <option value="all">Tất cả phòng</option>
                    <option value="available">Phòng trống</option>
                    <option value="Single room">Phòng đơn</option>
                    <option value="Double room">Phòng đôi</option>
                    <option value="Family room">Phòng gia đình</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Phạm vi hiển thị</Form.Label>
                  <Form.Select value={viewDays} onChange={(e) => setViewDays(Number.parseInt(e.target.value))}>
                    <option value="7">7 ngày</option>
                    <option value="14">14 ngày</option>
                    <option value="30">30 ngày</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Thêm tóm tắt tình trạng phòng ở đầu */}
          <Row className="mt-3 mb-2">
            <Col>
              <Card className="availability-summary">
                <Card.Body className="py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Tóm tắt tình trạng phòng:</strong>
                      <Badge bg="success" className="ms-2">
                        {
                          rooms.filter(
                            (r) =>
                              !bookings.some(
                                (b) =>
                                  b.roomId === r.id &&
                                  currentDate >= b.startDate &&
                                  currentDate < b.endDate &&
                                  !b.checkedOut,
                              ),
                          ).length
                        }{" "}
                        Trống
                      </Badge>
                      <Badge bg="danger" className="ms-2">
                        {
                          rooms.filter((r) =>
                            bookings.some(
                              (b) =>
                                b.roomId === r.id &&
                                currentDate >= b.startDate &&
                                currentDate < b.endDate &&
                                b.paymentStatus === "paid" &&
                                !b.checkedOut,
                            ),
                          ).length
                        }{" "}
                        Đã thuê
                      </Badge>
                      <Badge bg="warning" className="ms-2">
                        {
                          rooms.filter((r) =>
                            bookings.some(
                              (b) =>
                                b.roomId === r.id &&
                                currentDate >= b.startDate &&
                                currentDate < b.endDate &&
                                b.paymentStatus === "pending" &&
                                !b.checkedOut,
                            ),
                          ).length
                        }{" "}
                        Đang chờ
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Lưới lịch */}
          <div className="calendar-container">
            <div className="calendar-grid">
              {/* Hàng tiêu đề với ngày */}
              <div className="calendar-header">
                <div className="calendar-cell room-header">
                  Phòng
                  <div className="room-actions">
                    <small>Nhấp vào phòng để xem tùy chọn!!</small>
                  </div>
                </div>
                {getDates().map((date, index) => (
                  <div
                    key={index}
                    className={`calendar-cell date-header ${
                      date.getDay() === 0 || date.getDay() === 6 ? "weekend" : ""
                    }`}
                  >
                    <div className="day-of-week">{formatDayOfWeek(date)}</div>
                    <div className="date">{formatDate(date)}</div>
                  </div>
                ))}
              </div>

              {/* Hàng phòng */}
              {filteredRooms.map((room) => (
                <div key={room.id} className="calendar-row">
                  <div className="calendar-cell room-info">
                    <div className="room-header-row">
                      <div className="room-number">{room.name}</div>
                    </div>
                    <div className="room-type">
                      <Badge bg={room.type === "Single room" ? "info" : room.type === "Double room" ? "primary" : "success"}>
                        {room.type === "Single room" ? "Phòng Đơn" : room.type === "Double room" ? "Phòng Đôi" : "Phòng Gia Đình"}
                      </Badge>
                    </div>
                    <div className="room-capacity">
                      <FaUser /> {room.capacity}
                    </div>
                    <div className="room-price">${room.price}/đêm</div>
                  </div>

                  {/* Ô ngày */}
                  {getDates().map((date, dateIndex) => {
                    const isBooked = isRoomBooked(room.id, date)
                    const booking = isBooked ? getBooking(room.id, date) : null
                    const isPending = booking && booking.paymentStatus === "pending"
                    const isCheckedOut = booking && booking.checkedOut
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isCheckIn = booking && isCheckInDate(booking, date)
                    const isCheckOut = booking && isCheckOutDate(booking, date)

                    // Xác định lớp ô
                    let cellClass = "available"
                    if (isBooked) {
                      if (isCheckedOut) {
                        cellClass = "available"
                      } else if (isPending) {
                        cellClass = "pending"
                      } else {
                        cellClass = "booked"
                      }
                    }

                    return (
                      <div
                        key={dateIndex}
                        className={`calendar-cell date-cell ${cellClass} ${
                          date.getDay() === 0 || date.getDay() === 6 ? "weekend" : ""
                        }`}
                        onClick={() => !isBooked && handleRoomClick(room, date)}
                      >
                        {isBooked && !isCheckedOut ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                <strong>{booking.guestName}</strong>
                                <br />
                                Nhận phòng: {booking.startDate.toLocaleDateString()}
                                <br />
                                Trả phòng: {booking.endDate.toLocaleDateString()}
                                <br />
                                Trạng thái: {booking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                                <br />
                                {booking.checkedIn ? "Đã nhận phòng" : "Chưa nhận phòng"}
                              </Tooltip>
                            }
                          >
                            <div className="booking-info">
                              <div className="guest-name">{booking.guestName}</div>
                              <div className={`status-icon ${isPending ? "pending-icon" : "booked-icon"}`}>
                                {isPending ? <FaClock /> : <FaTimes />}
                              </div>

                              {/* Nút nhận phòng cho đặt phòng đang chờ vào ngày nhận phòng */}
                              {!booking.checkedIn && isCheckIn && isToday && (
                                <Button
                                  size="sm"
                                  variant="warning"
                                  className="check-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openCheckInModal(booking)
                                  }}
                                >
                                  <FaSignInAlt className="me-1" /> Nhận phòng
                                </Button>
                              )}

                              {/* Nút trả phòng cho phòng đã đặt vào ngày trả phòng */}
                              {booking.checkedIn && isCheckOut && isToday && !booking.checkedOut && (
                                <Button
                                  size="sm"
                                  variant="danger"
                                  className="check-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openCheckOutModal(booking)
                                  }}
                                >
                                  <FaSignOutAlt className="me-1" /> Trả phòng
                                </Button>
                              )}
                            </div>
                          </OverlayTrigger>
                        ) : (
                          <div className="available-cell">
                            <FaCheck className="available-icon" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Trạng thái trống nếu không có phòng phù hợp với bộ lọc */}
              {filteredRooms.length === 0 && (
                <div className="calendar-row empty-state">
                  <div className="calendar-cell empty-message" colSpan={getDates().length + 1}>
                    Không có phòng phù hợp với bộ lọc đã chọn.{" "}
                    <Button variant="link" onClick={() => setShowAddRoomModal(true)}>
                      Thêm phòng mới
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </div>

      {/* Modal đặt phòng */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đặt phòng {selectedRoom?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <Form onSubmit={handleAddBooking}>
              <Form.Group className="mb-3">
                <Form.Label>Tên khách</Form.Label>
                <Form.Control type="text" name="guestName" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số CMND/CCCD</Form.Label>
                <Form.Control type="text" name="idNumber" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control type="tel" name="phoneNumber" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ngày nhận phòng</Form.Label>
                <Form.Control type="text" value={selectedRoom.date.toLocaleDateString()} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số đêm</Form.Label>
                <Form.Control type="number" name="nights" min="1" defaultValue="1" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số khách</Form.Label>
                <Form.Control
                  type="number"
                  name="guestCount"
                  min="1"
                  max={selectedRoom.capacity}
                  defaultValue="1"
                  required
                />
                <Form.Text className="text-muted">Sức chứa tối đa: {selectedRoom.capacity}</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Loại phòng</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedRoom.type === "Single room" ? "Đơn" : selectedRoom.type === "Double room" ? "Đôi" : "Suite"}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giá mỗi đêm</Form.Label>
                <Form.Control type="text" value={`$${selectedRoom.price}`} disabled />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Xác nhận đặt phòng
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal chi tiết đặt phòng */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Chi tiết đặt phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <h4>
                Phòng {selectedBooking.roomId} - {selectedBooking.guestName}
              </h4>

              <div className="booking-details">
                <div className="detail-item">
                  <div className="detail-label">Nhận phòng:</div>
                  <div className="detail-value">{selectedBooking.startDate.toLocaleDateString()}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Trả phòng:</div>
                  <div className="detail-value">{selectedBooking.endDate.toLocaleDateString()}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Số đêm:</div>
                  <div className="detail-value">
                    {Math.round((selectedBooking.endDate - selectedBooking.startDate) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Loại phòng:</div>
                  <div className="detail-value">
                    <Badge
                      bg={
                        selectedBooking.type === "Single room"
                          ? "info"
                          : selectedBooking.type === "Double room"
                            ? "primary"
                            : "success"
                      }
                    >
                      {selectedBooking.type === "Single room" ? "Đơn" : selectedBooking.type === "Double room" ? "Đôi" : "Suite"}
                    </Badge>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Số khách:</div>
                  <div className="detail-value">{selectedBooking.guestCount}</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Trạng thái:</div>
                  <div className="detail-value">
                    <Badge bg={selectedBooking.status === "confirmed" ? "success" : "warning"}>
                      {selectedBooking.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                    </Badge>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Thanh toán:</div>
                  <div className="detail-value">
                    <Badge
                      bg={
                        selectedBooking.paymentStatus === "paid"
                          ? "success"
                          : selectedBooking.paymentStatus === "partially paid"
                            ? "info"
                            : "warning"
                      }
                    >
                      {selectedBooking.paymentStatus === "paid"
                        ? "Đã thanh toán"
                        : selectedBooking.paymentStatus === "partially paid"
                          ? "Thanh toán một phần"
                          : "Chưa thanh toán"}
                    </Badge>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Nhận phòng:</div>
                  <div className="detail-value">
                    <Badge bg={selectedBooking.checkedIn ? "success" : "secondary"}>
                      {selectedBooking.checkedIn ? "Đã nhận phòng" : "Chưa nhận phòng"}
                    </Badge>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Trả phòng:</div>
                  <div className="detail-value">
                    <Badge bg={selectedBooking.checkedOut ? "success" : "secondary"}>
                      {selectedBooking.checkedOut ? "Đã trả phòng" : "Chưa trả phòng"}
                    </Badge>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Liên hệ:</div>
                  <div className="detail-value">
                    {selectedBooking.phoneNumber}
                    <br />
                    {selectedBooking.email}
                  </div>
                </div>

                {selectedBooking.services && selectedBooking.services.length > 0 && (
                  <div className="detail-item">
                    <div className="detail-label">Dịch vụ:</div>
                    <div className="detail-value">
                      {selectedBooking.services.map((service) => (
                        <Badge key={service.id} bg="info" className="me-1 mb-1">
                          {service.name} (${service.price})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 d-flex justify-content-between">
                {!selectedBooking.checkedIn ? (
                  <Button variant="warning" onClick={() => openCheckInModal(selectedBooking)}>
                    <FaSignInAlt className="me-2" /> Nhận phòng
                  </Button>
                ) : !selectedBooking.checkedOut ? (
                  <Button variant="danger" onClick={() => openCheckOutModal(selectedBooking)}>
                    <FaSignOutAlt className="me-2" /> Trả phòng
                  </Button>
                ) : (
                  <Button variant="outline-primary">
                    <FaInfoCircle className="me-2" /> Xem chi tiết đầy đủ
                  </Button>
                )}
                <Button variant="outline-danger">
                  <FaTimes className="me-2" /> Hủy đặt phòng
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal nhận phòng */}
      <Modal show={showCheckInModal} onHide={() => setShowCheckInModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>
            <FaSignInAlt className="me-2" /> Nhận phòng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkInBooking && (
            <div>
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Thông tin khách</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Tên:</strong> {checkInBooking.guestName}
                      </p>
                      <p>
                        <strong>Số CMND/CCCD:</strong> {checkInBooking.idNumber}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {checkInBooking.phoneNumber}
                      </p>
                      <p>
                        <strong>Email:</strong> {checkInBooking.email}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Chi tiết đặt phòng</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Phòng:</strong> {checkInBooking.roomId} (
                        {rooms.find((r) => r.id === checkInBooking.roomId)?.type === "Single room"
                          ? "Đơn"
                          : rooms.find((r) => r.id === checkInBooking.roomId)?.type === "Double room"
                            ? "Đôi"
                            : "Suite"}
                        )
                      </p>
                      <p>
                        <strong>Nhận phòng:</strong> {checkInBooking.startDate.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Trả phòng:</strong> {checkInBooking.endDate.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Số đêm:</strong>{" "}
                        {Math.round((checkInBooking.endDate - checkInBooking.startDate) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p>
                        <strong>Số khách:</strong> {checkInBooking.guestCount}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Thông tin thanh toán</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Giá phòng mỗi đêm</Form.Label>
                          <Form.Control
                            type="text"
                            value={`$${rooms.find((r) => r.id === checkInBooking.roomId)?.price || 0}`}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tổng tiền phòng</Form.Label>
                          <Form.Control
                            type="text"
                            value={`$${
                              (rooms.find((r) => r.id === checkInBooking.roomId)?.price || 0) *
                              Math.round((checkInBooking.endDate - checkInBooking.startDate) / (1000 * 60 * 60 * 24))
                            }`}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số tiền đặt cọc</Form.Label>
                          <Form.Control
                            type="number"
                            id="depositAmount"
                            defaultValue={rooms.find((r) => r.id === checkInBooking.roomId)?.price || 0}
                            min="0"
                            step="0.01"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phương thức thanh toán</Form.Label>
                          <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="credit">Thẻ tín dụng</option>
                            <option value="cash">Tiền mặt</option>
                            <option value="bank">Chuyển khoản</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setShowCheckInModal(false)}>
                  Hủy
                </Button>
                <Button
                  variant="warning"
                  onClick={() => {
                    const depositAmount = Number.parseFloat(document.getElementById("depositAmount").value)
                    handleCheckIn(checkInBooking.id, depositAmount)
                  }}
                >
                  <FaSignInAlt className="me-2" /> Xác nhận nhận phòng
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal trả phòng */}
      <Modal show={showCheckOutModal} onHide={() => setShowCheckOutModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaSignOutAlt className="me-2" /> Trả phòng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkOutBooking ? (
            <div>
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Thông tin khách</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Tên:</strong> {checkOutBooking.guestName}
                      </p>
                      <p>
                        <strong>Số CMND/CCCD:</strong> {checkOutBooking.idNumber}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {checkOutBooking.phoneNumber}
                      </p>
                      <p>
                        <strong>Email:</strong> {checkOutBooking.email}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Chi tiết đặt phòng</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Phòng:</strong> {checkOutBooking.roomId} (
                        {rooms.find((r) => r.id === checkOutBooking.roomId)?.type === "Single room"
                          ? "Đơn"
                          : rooms.find((r) => r.id === checkOutBooking.roomId)?.type === "Double room"
                            ? "Đôi"
                            : "Suite"}
                        )
                      </p>
                      <p>
                        <strong>Nhận phòng:</strong> {checkOutBooking.startDate.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Trả phòng:</strong> {checkOutBooking.endDate.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Số đêm:</strong>{" "}
                        {Math.round((checkOutBooking.endDate - checkOutBooking.startDate) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p>
                        <strong>Số khách:</strong> {checkOutBooking.guestCount}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Dịch vụ bổ sung đã sử dụng</h5>
                </Card.Header>
                <Card.Body>
                  <p>Chọn các dịch vụ bổ sung mà khách đã sử dụng:</p>
                  <Row>
                    {Array.isArray(availableServices) && availableServices.length > 0 ? (
                      availableServices.map((service) => (
                        <Col md={4} key={service.id} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`service-${service.id}`}
                            label={
                              <span>
                                {service.icon && <service.icon className="me-2" />}
                                {service.name} (${service.price})
                              </span>
                            }
                            checked={selectedServices.some((s) => s.id === service.id)}
                            onChange={() => toggleService(service)}
                          />
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <p className="text-muted">Không có dịch vụ bổ sung nào.</p>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Tóm tắt hóa đơn</h5>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Mô tả</th>
                        <th className="text-end">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          Tiền phòng (
                          {Math.round((checkOutBooking.endDate - checkOutBooking.startDate) / (1000 * 60 * 60 * 24))}{" "}
                          đêm @ ${rooms.find((r) => r.id === checkOutBooking.roomId)?.price || 0}
                          /đêm)
                        </td>
                        <td className="text-end">${calculateBill(checkOutBooking).roomCharge.toFixed(2)}</td>
                      </tr>
                      {selectedServices.map((service) => (
                        <tr key={service.id}>
                          <td>{service.name}</td>
                          <td className="text-end">${service.price.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="fw-bold">Tổng chi phí</td>
                        <td className="text-end fw-bold">
                          $
                          {(
                            calculateBill(checkOutBooking).roomCharge + calculateBill(checkOutBooking).serviceCharge
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Đã đặt cọc</td>
                        <td className="text-end">
                          -${(checkOutBooking.depositAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="table-primary">
                        <td className="fw-bold">Số tiền cần thanh toán</td>
                        <td className="text-end fw-bold">${calculateBill(checkOutBooking).balance.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Phương thức thanh toán</Form.Label>
                      <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="credit">Thẻ tín dụng</option>
                        <option value="cash">Tiền mặt</option>
                        <option value="bank">Chuyển khoản</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setShowCheckOutModal(false)}>
                  Hủy
                </Button>
                <div>
                  <Button variant="danger" onClick={() => handleCheckOut(checkOutBooking.id, selectedServices)}>
                    <FaSignOutAlt className="me-2" /> Xác nhận trả phòng
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <p>Không thể tải thông tin đặt phòng.</p>
              <Button variant="secondary" onClick={() => setShowCheckOutModal(false)}>
                Đóng
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default RoomAvailabilityCalendar
