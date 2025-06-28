import { showToast, ToastProvider } from "@components/ToastContainer";
import HotelActions from "@redux/hotel/actions";
import Factories from "@redux/hotel/factories";
import RoomActions from "@redux/room/actions";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Utils from "@utils/Utils";
import { useEffect, useState } from "react";
import Select from "react-select";

// Options for select inputs
const adultsOptions = Array.from({ length: 20 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} Adults`,
}));

const childrenOptions = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: `${i} Children`,
}));

// Select styles
const selectStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #ddd",
    borderRadius: "8px",
    minHeight: "40px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#1a2b49",
    },
  }),
};

const ManagementBooking = () => {
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [hotelId, setHotelId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Date states
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [checkinDate, setCheckinDate] = useState(today);
  const [checkoutDate, setCheckoutDate] = useState(tomorrow);

  // Guest selection states
  const [selectedAdults, setSelectedAdults] = useState(adultsOptions[1]);
  const [selectedChildren, setSelectedChildren] = useState(childrenOptions[0]);

  const [searchParams, setSearchParams] = useState({
    checkinDate: today,
    checkoutDate: tomorrow,
    numberOfPeople: 1,
    page: 1,
    limit: 10,
  });

  // Add new states for reservation modal
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRoomsForReservation, setSelectedRoomsForReservation] =
    useState({});
  const [selectedServicesForReservation, setSelectedServicesForReservation] =
    useState({});
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [serviceSelectedDates, setServiceSelectedDates] = useState({});
  const [reservationCustomer, setReservationCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const dispatch = useAppDispatch();

  const fetchHotelInfo = () => {
    setLoading(true);
    dispatch({
      type: HotelActions.FETCH_OWNER_HOTEL,
      payload: {
        userId: Auth._id,
        onSuccess: (data) => {
          setHotelInfo(data.hotels);
          setHotelId(data.hotels[0]._id);
          setLoading(false);
        },
        onFailed: () => {
          showToast.error("Lấy thông tin khách sạn thất bại");
          setLoading(false);
        },
        onError: (err) => {
          console.error(err);
          showToast.error("Lỗi máy chủ khi lấy thông tin khách sạn");
          setLoading(false);
        },
      },
    });
  };

  useEffect(() => {
    fetchHotelInfo();
  }, []);

  // Update searchParams when dates or guest count changes
  useEffect(() => {
    setSearchParams({
      checkinDate: checkinDate,
      checkoutDate: checkoutDate,
      numberOfPeople: selectedAdults.value + selectedChildren.value,
      page: 1,
      limit: 10,
    });
  }, [checkinDate, checkoutDate, selectedAdults, selectedChildren]);

  const fetchRooms = (isMounted) => {
    dispatch({
      type: RoomActions.FETCH_ROOM,
      payload: {
        hotelId,
        query: searchParams,
        onSuccess: (roomList) => {
          if (isMounted) {
            if (Array.isArray(roomList)) {
              setRooms(roomList);
            } else {
              console.warn("Unexpected data format received:", roomList);
            }
          }
        },
        onFailed: (msg) => {
          if (isMounted) {
            console.error("Failed to fetch rooms:", msg);
          }
        },
        onError: (err) => {
          if (isMounted) {
            console.error("Server error:", err);
          }
        },
      },
    });
  };

  // Fetch rooms when hotelId or searchParams change
  useEffect(() => {
    let isMounted = true;

    if (hotelId && searchParams.checkinDate && searchParams.checkoutDate) {
        fetchRooms(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [hotelId, dispatch, searchParams]);

  const handleSearchRooms = () => {
    setSelectedRoomsForReservation({});
    setSelectedServicesForReservation({});
    setServiceQuantities({});
    setServiceSelectedDates({});
    setIsSearching(true);

    // Update searchParams to trigger room fetch
    setSearchParams({
      checkinDate: checkinDate,
      checkoutDate: checkoutDate,
      numberOfPeople: selectedAdults.value + selectedChildren.value,
      page: 1,
      limit: 10,
    });

    // Reset searching state after a short delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  // Add new functions for reservation
  const handleRoomQuantityChange = (roomId, quantity) => {
    setSelectedRoomsForReservation((prev) => ({
      ...prev,
      [roomId]: quantity,
    }));
  };

  const handleServiceSelection = (service) => {
    setSelectedServicesForReservation((prev) => {
      const isSelected = prev[service._id];
      if (isSelected) {
        const newSelected = { ...prev };
        delete newSelected[service._id];

        // Remove service quantities and dates
        setServiceQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[service._id];
          return newQuantities;
        });
        setServiceSelectedDates((prev) => {
          const newDates = { ...prev };
          delete newDates[service._id];
          return newDates;
        });

        return newSelected;
      } else {
        setServiceQuantities((prev) => ({
          ...prev,
          [service._id]: 1,
        }));
        return {
          ...prev,
          [service._id]: service,
        };
      }
    });
  };

  const handleServiceQuantityChange = (serviceId, quantity) => {
    if (quantity < 1) return;
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceId]: quantity,
    }));
  };

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate < lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleDateSelection = (serviceId, date) => {
    setServiceSelectedDates((prev) => {
      const currentDates = prev[serviceId] || [];
      const dateStr = date.toISOString();

      if (currentDates.includes(dateStr)) {
        return {
          ...prev,
          [serviceId]: currentDates.filter((d) => d !== dateStr),
        };
      } else {
        return {
          ...prev,
          [serviceId]: [...currentDates, dateStr],
        };
      }
    });
  };

  const handleReservationSubmit = async () => {
    // Validate room selection
    const selectedRoomIds = Object.keys(selectedRoomsForReservation).filter(
      (roomId) => selectedRoomsForReservation[roomId] > 0
    );

    if (selectedRoomIds.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một phòng");
      return;
    }

    // Validate date selection
    if (!checkinDate || !checkoutDate) {
      showToast.error("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    if (new Date(checkinDate) >= new Date(checkoutDate)) {
      showToast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    if (new Date(checkinDate) < new Date().setHours(0, 0, 0, 0)) {
      showToast.error("Ngày nhận phòng không được là ngày trong quá khứ");
      return;
    }

    // Validate room availability
    const roomValidationErrors = [];
    selectedRoomIds.forEach((roomId) => {
      const room = rooms.find((r) => r._id === roomId);
      const selectedQuantity = selectedRoomsForReservation[roomId];

      if (room && selectedQuantity > room.availableQuantity) {
        roomValidationErrors.push(
          `Phòng ${room.name}: Chỉ còn ${room.availableQuantity} phòng trống, bạn đã chọn ${selectedQuantity} phòng`
        );
      }
    });

    if (roomValidationErrors.length > 0) {
      showToast.error(roomValidationErrors.join("; "));
      return;
    }

    // Validate guest capacity
    const totalGuestCapacity = selectedRoomIds.reduce((total, roomId) => {
      const room = rooms.find((r) => r._id === roomId);
      const quantity = selectedRoomsForReservation[roomId];
      return total + (room ? room.capacity * quantity : 0);
    }, 0);

    const totalGuests = selectedAdults.value + selectedChildren.value;
    if (totalGuests > totalGuestCapacity) {
      showToast.error(
        `Số lượng khách (${totalGuests}) vượt quá sức chứa của phòng đã chọn (${totalGuestCapacity})`
      );
      return;
    }

    // Validate service selection (if any services are selected)
    const selectedServices = Object.values(selectedServicesForReservation);
    const serviceValidationErrors = [];

    selectedServices.forEach((service) => {
      const selectedDates = serviceSelectedDates[service._id] || [];
      const quantity = serviceQuantities[service._id] || 1;

      if (selectedDates.length === 0) {
        serviceValidationErrors.push(
          `Dịch vụ ${service.name}: Vui lòng chọn ít nhất một ngày sử dụng`
        );
      }

      if (quantity < 1) {
        serviceValidationErrors.push(
          `Dịch vụ ${service.name}: Số lượng phải lớn hơn 0`
        );
      }

      // Validate service dates are within booking period
      const checkinTime = new Date(checkinDate).getTime();
      const checkoutTime = new Date(checkoutDate).getTime();

      selectedDates.forEach((dateStr) => {
        const serviceDate = new Date(dateStr).getTime();
        if (serviceDate < checkinTime || serviceDate >= checkoutTime) {
          serviceValidationErrors.push(
            `Dịch vụ ${service.name}: Ngày sử dụng phải trong khoảng thời gian lưu trú`
          );
        }
      });
    });

    if (serviceValidationErrors.length > 0) {
      showToast.error(serviceValidationErrors.join("; "));
      return;
    }

    // Validate customer information (if needed for offline booking)
    if (!Auth._id) {
      showToast.error("Thông tin người dùng không hợp lệ");
      return;
    }

    // Validate hotel selection
    if (!hotelId) {
      showToast.error("Vui lòng chọn khách sạn");
      return;
    }

    // Calculate and validate total price
    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      showToast.error("Tổng giá trị đặt phòng phải lớn hơn 0");
      return;
    }

    // Validate minimum booking duration (if needed)
    const nights = Math.ceil(
      (new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) {
      showToast.error("Thời gian lưu trú phải ít nhất 1 đêm");
      return;
    }

    // Process reservation data
    const reservationData = {
      hotelId: hotelId,
      checkInDate: checkinDate,
      checkOutDate: checkoutDate,
      totalPrice: totalPrice,
      finalPrice: totalPrice,
      roomDetails: selectedRoomIds.map((roomId) => ({
        room: {
          _id: roomId,
        },
        amount: selectedRoomsForReservation[roomId],
      })),
      serviceDetails: Object.values(selectedServicesForReservation).map(
        (service) => ({
          _id: service._id,
          quantity: serviceQuantities[service._id] || 1,
          selectedDates: serviceSelectedDates[service._id] || [],
        })
      ),
    };

    console.log("Reservation Data:", reservationData);

    try {
      const response = await Factories.create_booking_offline(reservationData);
      console.log("response >> ", response);
      if (response?.status === 200) {
        console.log("response >> ", response);
        const unpaidReservationId = response?.data?.unpaidReservation?._id;

        if (!unpaidReservationId) {
          showToast.error("Không thể tạo đặt phòng. Vui lòng thử lại.");
          return;
        }
        setSelectedRoomsForReservation({});
        setSelectedServicesForReservation({});
        setServiceQuantities({});
        setServiceSelectedDates({});
        fetchRooms(true);
        showToast.success("Đặt phòng thành công.");
      } else if (response?.status === 201) {
        console.log("response >> ", response);
        const reservationId = response?.data?.reservation?._id;

        if (!reservationId) {
          showToast.error("Không thể tạo đặt phòng. Vui lòng thử lại.");
          return;
        }
        setSelectedRoomsForReservation({});
        setSelectedServicesForReservation({});
        setServiceQuantities({});
        setServiceSelectedDates({});
        fetchRooms(true);
        showToast.success("Bạn đã đặt phòng thành công.");
      } else {
        const errorMessage =
          response?.data?.message || "Lỗi không xác định khi tạo đặt phòng";
        showToast.error(errorMessage);
        console.log("error create booking:", response);
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Lỗi máy chủ khi tạo đặt phòng. Vui lòng thử lại.";
      showToast.error(errorMessage);
    } finally {
      // Reset modal state
      setShowReservationModal(false);

      // Reset form data
      setSelectedRoomsForReservation({});
      setSelectedServicesForReservation({});
      setServiceQuantities({});
      setServiceSelectedDates({});
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    const nights = Math.ceil(
      (new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24)
    );

    // Calculate room prices
    Object.keys(selectedRoomsForReservation).forEach((roomId) => {
      const room = rooms.find((r) => r._id === roomId);
      if (room && selectedRoomsForReservation[roomId] > 0) {
        total += room.price * selectedRoomsForReservation[roomId] * nights;
      }
    });

    // Calculate service prices
    Object.values(selectedServicesForReservation).forEach((service) => {
      const quantity = serviceQuantities[service._id] || 1;
      const selectedDates = serviceSelectedDates[service._id] || [];
      total += service.price * quantity * selectedDates.length;
    });

    return total;
  };

  return (
    <div className="management-booking">
      <ToastProvider />
      <h1>Quản lý đặt phòng</h1>

      {/* Search Section */}
      <div
        className="search-section"
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Tìm kiếm phòng trống</h3>
          <button
            className="btn btn-success"
            onClick={() => setShowReservationModal(true)}
            disabled={!hotelId || rooms.length === 0}
          >
            <i className="fas fa-plus me-2"></i>
            Tạo đơn đặt phòng offline
          </button>
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label htmlFor="checkinDate" className="form-label">
              Ngày nhận phòng
            </label>
            <input
              type="date"
              id="checkinDate"
              className="form-control"
              value={checkinDate}
              min={today}
              onChange={(e) => setCheckinDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="checkoutDate" className="form-label">
              Ngày trả phòng
            </label>
            <input
              type="date"
              id="checkoutDate"
              className="form-control"
              value={checkoutDate}
              min={checkinDate || today}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />
          </div>

          <div className="col-md-2 mb-3">
            <label className="form-label">Người lớn</label>
            <Select
              value={selectedAdults}
              onChange={setSelectedAdults}
              options={adultsOptions}
              styles={selectStyles}
              isSearchable={false}
            />
          </div>

          <div className="col-md-2 mb-3">
            <label className="form-label">Trẻ em</label>
            <Select
              value={selectedChildren}
              onChange={setSelectedChildren}
              options={childrenOptions}
              styles={selectStyles}
              isSearchable={false}
            />
          </div>

          <div className="col-md-2 mb-3 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={handleSearchRooms}
              disabled={isSearching || !checkinDate || !checkoutDate}
            >
              {isSearching ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="rooms-section mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Danh sách phòng trống</h3>
          <span className="badge bg-secondary fs-6">
            {rooms.length} loại phòng
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải danh sách phòng...</p>
          </div>
        ) : rooms.length > 0 ? (
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{ transition: "transform 0.2s ease-in-out" }}
                >
                  <div className="card-header bg-white border-0 pb-2">
                    <h5 className="card-title mb-1 text-primary fw-bold">
                      {room.name}
                    </h5>
                    <p className="text-muted small mb-0">
                      {room.roomType?.name || room.type}
                    </p>
                  </div>

                  <div className="card-body pt-2">
                    {/* Price Section */}
                    <div className="d-flex align-items-center mb-3">
                      <span className="h4 text-success fw-bold mb-0">
                        {Utils.formatCurrency(room.price)}
                      </span>
                      <span className="text-muted ms-2">/đêm</span>
                    </div>

                    {/* Room Info Grid */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center p-2 bg-light rounded">
                          <i className="fas fa-users text-primary me-2"></i>
                          <div>
                            <small className="text-muted d-block">
                              Sức chứa
                            </small>
                            <strong>{room.capacity} người</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center p-2 bg-light rounded">
                          <i className="fas fa-door-open text-success me-2"></i>
                          <div>
                            <small className="text-muted d-block">
                              Còn trống
                            </small>
                            <strong>{room.availableQuantity}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Status */}
                    <div className="row g-2">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                          <span className="text-muted">Đã đặt:</span>
                          <span className="badge bg-warning text-dark">
                            {Number(room.quantity) -
                              Number(room.availableQuantity)}{" "}
                            phòng
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Availability Indicator */}
                  <div className="card-footer bg-white border-0 pt-0">
                    {room.availableQuantity > 0 ? (
                      <div className="d-flex align-items-center text-success">
                        <i className="fas fa-check-circle me-2"></i>
                        <small>Có phòng trống</small>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center text-danger">
                        <i className="fas fa-times-circle me-2"></i>
                        <small>Hết phòng</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <i
                className="fas fa-bed text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
            </div>
            <h5 className="text-muted">
              {hotelId
                ? "Không có phòng trống trong khoảng thời gian này"
                : "Vui lòng chọn ngày để xem phòng trống"}
            </h5>
            <p className="text-muted mb-0">
              Thử thay đổi ngày checkin/checkout hoặc số lượng khách
            </p>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      <div
        className={`modal fade ${showReservationModal ? "show" : ""}`}
        style={{ display: showReservationModal ? "block" : "none" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo đặt phòng mới</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowReservationModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Customer Information */}
                <div className="col-md-4">
                  <h6>Thông tin khách hàng</h6>
                  <div className="mb-3">
                    <label className="form-label">Tên khách hàng</label>
                    <input
                      type="text"
                      className="form-control"
                      value={Auth.name}
                      onChange={(e) =>
                        setReservationCustomer((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={Auth.email}
                      onChange={(e) =>
                        setReservationCustomer((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={Auth.phoneNumber}
                      onChange={(e) =>
                        setReservationCustomer((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="mt-4">
                    <h6>Tóm tắt đặt phòng</h6>
                    <div className="bg-light p-3 rounded">
                      <p>
                        <strong>Check-in:</strong> {checkinDate}
                      </p>
                      <p>
                        <strong>Check-out:</strong> {checkoutDate}
                      </p>
                      <p>
                        <strong>Số khách:</strong>{" "}
                        {selectedAdults.value + selectedChildren.value}
                      </p>
                      <hr />
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {Utils.formatCurrency(calculateTotalPrice())}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Selection */}
                <div className="col-md-4">
                  <h6>Chọn phòng</h6>
                  <div style={{ maxHeight: "520px", overflowY: "auto" }}>
                    {rooms.map((room) => (
                      <div key={room._id} className="card mb-2">
                        <div className="card-body p-3">
                          <h6 className="card-title">{room.name}</h6>
                          <p className="card-text small">
                            {room.roomType?.name} -{" "}
                            {Utils.formatCurrency(room.price)}/đêm
                          </p>
                          <p className="small text-muted">
                            Còn trống: {room.availableQuantity} phòng
                          </p>
                          <div className="d-flex align-items-center">
                            <label className="me-2">Số lượng:</label>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: "80px" }}
                              value={selectedRoomsForReservation[room._id] || 0}
                              onChange={(e) =>
                                handleRoomQuantityChange(
                                  room._id,
                                  parseInt(e.target.value)
                                )
                              }
                            >
                              {Array.from(
                                { length: room.availableQuantity + 1 },
                                (_, i) => (
                                  <option key={i} value={i}>
                                    {i}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Selection */}
                <div className="col-md-4">
                  <h6>Chọn dịch vụ</h6>
                  <div style={{ maxHeight: "520px", overflowY: "auto" }}>
                    {hotelInfo?.[0]?.services?.map((service) => {
                      const isSelected =
                        selectedServicesForReservation[service._id];
                      const quantity = serviceQuantities[service._id] || 1;
                      const selectedDates =
                        serviceSelectedDates[service._id] || [];

                      return (
                        <div key={service._id} className="card mb-2">
                          <div className="card-body p-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={() => handleServiceSelection(service)}
                              />
                              <label className="form-check-label">
                                <strong>{service.name}</strong>
                              </label>
                            </div>
                            <p className="small text-muted">
                              {Utils.formatCurrency(service.price)}/
                              {service.type}
                            </p>

                            {isSelected && (
                              <div className="mt-2">
                                <div className="d-flex align-items-center mb-2">
                                  <label className="me-2">Số lượng:</label>
                                  <div
                                    className="input-group input-group-sm"
                                    style={{ width: "120px" }}
                                  >
                                    <button
                                      className="btn btn-outline-secondary"
                                      type="button"
                                      onClick={() =>
                                        handleServiceQuantityChange(
                                          service._id,
                                          quantity - 1
                                        )
                                      }
                                      disabled={quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <input
                                      type="text"
                                      className="form-control text-center"
                                      value={quantity}
                                      readOnly
                                    />
                                    <button
                                      className="btn btn-outline-secondary"
                                      type="button"
                                      onClick={() =>
                                        handleServiceQuantityChange(
                                          service._id,
                                          quantity + 1
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="mb-2">
                                  <label className="form-label small">
                                    Chọn ngày sử dụng:
                                  </label>
                                  <div className="d-flex flex-wrap gap-1">
                                    {getDatesBetween(
                                      new Date(checkinDate),
                                      new Date(checkoutDate)
                                    ).map((date) => {
                                      const dateStr = date.toISOString();
                                      const isDateSelected =
                                        selectedDates.includes(dateStr);

                                      return (
                                        <button
                                          key={dateStr}
                                          type="button"
                                          className={`btn btn-sm ${
                                            isDateSelected
                                              ? "btn-primary"
                                              : "btn-outline-primary"
                                          }`}
                                          onClick={() =>
                                            handleDateSelection(
                                              service._id,
                                              date
                                            )
                                          }
                                        >
                                          {date.getDate()}/{date.getMonth() + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowReservationModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleReservationSubmit}
              >
                Tạo đặt phòng
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReservationModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ManagementBooking;
