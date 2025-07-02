import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Utils from "@utils/Utils";
import Factories from "@redux/room/factories";

const ReservationActions = {
  FETCH_RESERVATIONS: "FETCH_RESERVATIONS",
  FETCH_RESERVATIONS_SUCCESS: "FETCH_RESERVATIONS_SUCCESS",
  FETCH_RESERVATIONS_FAILURE: "FETCH_RESERVATIONS_FAILURE",
};

const getRecentYears = (num = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: num }, (_, i) => currentYear - i);
};

const RevenuePage = () => {
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.Reservation);
  const hotelDetail = useSelector(state => state.Hotel.hotel);
  const hotelId = hotelDetail?._id;

  // Đặt các biến thời gian ở đầu component để mọi nơi đều dùng được
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // State cho filter mới
  const [periodType, setPeriodType] = useState("month"); // "month" | "year"
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State for real data
  const [realData, setRealData] = useState(null);

  // State for rooms
  const [rooms, setRooms] = useState([]);

  // Helper to get month name in Vietnamese
  const getMonthName = (month) => {
    const monthNames = [
      "T1", "T2", "T3", "T4", "T5", "T6",
      "T7", "T8", "T9", "T10", "T11", "T12"
    ];
    return monthNames[month - 1] || `T${month}`;
  };

  // Helper for currency formatting
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return amount;
    return Utils.formatCurrency(amount);
  };

  useEffect(() => {
    // Fetch reservations data using Redux like Transaction page
    dispatch({
      type: ReservationActions.FETCH_RESERVATIONS,
      payload: {
        year: selectedYear,
        sort: "desc",
      },
    });
  }, [dispatch, selectedYear]);

  useEffect(() => {
    if (hotelId) {
      Factories.fetchRoomByHotelId(hotelId).then(response => {
        setRooms(Array.isArray(response?.rooms) ? response.rooms : []);
      });
    }
  }, [hotelId]);

  // Process reservations data to create monthly stats
  useEffect(() => {
    if (reservations && reservations.length > 0) {
      console.log("Processing reservations:", reservations);
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const monthlyStats = [];

      // Lọc reservation chỉ của khách sạn owner hiện tại
      const filteredReservations = hotelId
        ? reservations.filter(res => {
            const resHotelId = res.hotel?._id || res.hotel;
            return resHotelId?.toString() === hotelId?.toString();
          })
        : [];

      // Group reservations by month
      for (let month = 1; month <= 12; month++) { // Thay đổi từ currentMonth thành 12
        const monthReservations = filteredReservations.filter(res => {
          const createdAt = new Date(res.createdAt);
          return createdAt.getFullYear() === selectedYear && // Sử dụng selectedYear
                 createdAt.getMonth() + 1 === month &&
                 res.status !== "NOT PAID";
        });

        const revenue = monthReservations.reduce((sum, res) => {
          const price = res.finalPrice > 0 ? res.finalPrice : res.totalPrice;
          return sum + price;
        }, 0);

        // Tính hoa hồng chỉ cho đơn online
        const onlineReservations = monthReservations.filter(res => res.status !== "OFFLINE");
        const onlineRevenue = onlineReservations.reduce((sum, res) => {
          const price = res.finalPrice > 0 ? res.finalPrice : res.totalPrice;
          return sum + price;
        }, 0);
        
        const commission = Math.floor(onlineRevenue * 0.12);
        const actualAmountToHost = revenue - commission;

        // Tính toán trạng thái thanh toán dựa trên trạng thái reservation
        let paymentStatus = null;
        if (monthReservations.length > 0) {
          const completedCount = monthReservations.filter(res => 
            res.status === "COMPLETED" || res.status === "CHECKED OUT"
          ).length;
          const pendingCount = monthReservations.filter(res => 
            res.status === "PENDING" || res.status === "BOOKED" || res.status === "CHECKED IN"
          ).length;
          const notPaidCount = monthReservations.filter(res => 
            res.status === "NOT PAID" || res.status === "CANCELLED"
          ).length;

          if (notPaidCount > 0 && completedCount === 0) {
            paymentStatus = "NOT_PAID";
          } else if (completedCount > 0 && pendingCount === 0) {
            paymentStatus = "PAID";
          } else if (completedCount > 0 && pendingCount > 0) {
            paymentStatus = "PARTIAL";
          } else if (pendingCount > 0) {
            paymentStatus = "PENDING";
          }
        }

        monthlyStats.push({
          month,
          year: selectedYear, // Sử dụng selectedYear
          revenue,
          commission,
          actualAmountToHost,
          reservationCount: monthReservations.length,
          monthlyPayment: 0,
          paymentStatus
        });
      }

      // Calculate room type stats với logic mới
      const roomTypeStats = [];
      const roomNames = rooms.map(room => room.name);

      roomNames.forEach(roomName => {
        // Lọc theo periodType và thời gian
        let relevantReservations = filteredReservations.filter(res => 
          res.rooms?.some(room => room.room?.name === roomName) &&
          res.status !== "NOT PAID"
        );

        // Thêm filter theo thời gian
        if (periodType === "month") {
          relevantReservations = relevantReservations.filter(res => {
            const createdAt = new Date(res.createdAt);
            return createdAt.getFullYear() === selectedYear && 
                   createdAt.getMonth() + 1 === selectedMonth;
          });
        } else if (periodType === "year") {
          relevantReservations = relevantReservations.filter(res => {
            const createdAt = new Date(res.createdAt);
            return createdAt.getFullYear() === selectedYear;
          });
        }

        const roomRevenue = relevantReservations.reduce((sum, res) => {
          const price = res.finalPrice > 0 ? res.finalPrice : res.totalPrice;
          return sum + price;
        }, 0);

        const quantity = relevantReservations.reduce((sum, res) => 
          sum + (res.rooms?.filter(room => room.room?.name === roomName)
            .reduce((qSum, room) => qSum + room.quantity, 0) || 0), 0
        );

        const avgPrice = relevantReservations.length > 0 ? roomRevenue / relevantReservations.length : 0;
        
        // Tính % dựa trên doanh thu của kỳ hiện tại
        const periodRevenue = periodType === "month" 
          ? monthlyStats.find(m => m.month === selectedMonth)?.revenue || 0
          : monthlyStats.reduce((sum, m) => sum + m.revenue, 0);
        
        const percent = periodRevenue > 0 ? ((roomRevenue / periodRevenue) * 100).toFixed(1) : 0;

        if (roomRevenue > 0 || quantity > 0) { // Chỉ thêm room có dữ liệu
          roomTypeStats.push({
            type: roomName,
            quantity,
            avgPrice,
            revenue: roomRevenue,
            percent
          });
        }
      });

      // Tính toán dữ liệu kênh đặt phòng - sử dụng tất cả reservation (không chỉ tháng hiện tại)
      const websiteReservations = reservations.filter(res => res.status !== "OFFLINE");
      const offlineReservations = reservations.filter(res => res.status === "OFFLINE");
      
      const websiteCount = websiteReservations.length;
      const offlineCount = offlineReservations.length;
      const totalCount = websiteCount + offlineCount;

      const bookingChannelData = {
        labels: ["Đặt phòng qua website", "Đặt phòng offline"],
        datasets: [{
          data: [websiteCount, offlineCount],
          backgroundColor: ["#4361ee", "#f72585"],
          borderWidth: 1,
        }]
      };

      setRealData({
        monthlyRevenueStats: monthlyStats,
        revenueByRoomType: roomTypeStats,
        totalRevenue: monthlyStats.reduce((sum, m) => sum + m.revenue, 0),
        completedRevenue: monthlyStats.reduce((sum, m) => sum + m.revenue, 0),
        revpar: 0,
        adr: 0,
        profit: monthlyStats.reduce((sum, m) => sum + m.actualAmountToHost, 0),
        bookingChannelData
      });
    }
  }, [reservations, selectedYear, selectedMonth, periodType, rooms, hotelId]); // Thêm dependencies

  // Fallback mock data - chỉ hiển thị từ tháng 1 đến tháng hiện tại
  const fallbackRevenueData = {
    labels: Array.from({ length: currentMonth }, (_, i) => getMonthName(i + 1)),
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: Array.from({ length: currentMonth }, (_, i) => 
          Math.floor(Math.random() * 50000) + 10000
        ),
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Room type rows - chỉ hiển thị dữ liệu thực tế
  const roomTypeRows = (() => {
    console.log("realData?.revenueByRoomType:", realData?.revenueByRoomType);
    console.log("realData?.revenueByRoomType?.length:", realData?.revenueByRoomType?.length);
    
    if (realData?.revenueByRoomType?.length > 0) {
      console.log("Using real room type data");
      return realData.revenueByRoomType.map(row => ({
        type: row.type,
        quantity: row.quantity,
        avgPrice: formatCurrency(row.avgPrice),
        revenue: formatCurrency(row.revenue),
        percent: row.percent + "%"
      }));
    } else {
      console.log("No real room type data available");
      return [];
    }
  })();

  // Hàm lọc dữ liệu theo periodType, selectedMonth, selectedYear
  const getFilteredMonthlyStats = () => {
    if (!realData?.monthlyRevenueStats) return [];
    if (periodType === "month") {
      // Khi filter là tháng, chỉ lấy dữ liệu của tháng được chọn (cho bảng/tổng hợp),
      // nhưng biểu đồ xu hướng sẽ lấy từ T1 đến tháng hiện tại của năm hiện tại
      return realData.monthlyRevenueStats.filter(
        item => item.month === selectedMonth && item.year === selectedYear
      );
    } else if (periodType === "year") {
      // Khi filter là năm, lấy tất cả tháng của năm đó
      return realData.monthlyRevenueStats.filter(
        item => item.year === selectedYear
      );
    }
    return [];
  };

  // Sử dụng dữ liệu đã lọc cho các thống kê
  const filteredStats = getFilteredMonthlyStats();

  // Biểu đồ doanh thu (xu hướng doanh thu) luôn là 12 tháng
  let revenueData;
  const stats = realData?.monthlyRevenueStats?.filter(item => item.year === selectedYear) || [];
  revenueData = {
    labels: Array.from({ length: 12 }, (_, i) => getMonthName(i + 1)),
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: Array.from({ length: 12 }, (_, i) => {
          const stat = stats.find(s => s.month === i + 1);
          return stat ? stat.revenue : 0;
        }),
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // KPI values
  const totalRevenue = filteredStats.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = filteredStats.reduce((sum, item) => sum + (item.commission || 0), 0);
  const totalActualAmount = filteredStats.reduce((sum, item) => sum + (item.actualAmountToHost || 0), 0);
  const totalReservation = filteredStats.reduce((sum, item) => sum + (item.reservationCount || 0), 0);
  const avgRevenue = filteredStats.length > 0 ? totalRevenue / filteredStats.length : 0;

  // Hàm lọc dữ liệu kênh đặt phòng theo periodType
  const getFilteredBookingChannelData = () => {
    if (!reservations || reservations.length === 0) {
      return {
        labels: ["Đặt phòng qua website", "Đặt phòng offline"],
        datasets: [{
          data: [0, 0],
          backgroundColor: ["#4361ee", "#f72585"],
          borderWidth: 1,
        }]
      };
    }
    let filteredReservations = [];
    if (periodType === "month") {
      filteredReservations = reservations.filter(res => {
        const createdAt = new Date(res.createdAt);
        return createdAt.getFullYear() === selectedYear && createdAt.getMonth() + 1 === selectedMonth;
      });
    } else if (periodType === "year") {
      filteredReservations = reservations.filter(res => {
        const createdAt = new Date(res.createdAt);
        return createdAt.getFullYear() === selectedYear;
      });
    }
    const websiteReservations = filteredReservations.filter(res => res.status !== "OFFLINE");
    const offlineReservations = filteredReservations.filter(res => res.status === "OFFLINE");
    const websiteCount = websiteReservations.length;
    const offlineCount = offlineReservations.length;
    return {
      labels: ["Đặt phòng qua website", "Đặt phòng offline"],
      datasets: [{
        data: [websiteCount, offlineCount],
        backgroundColor: ["#4361ee", "#f72585"],
        borderWidth: 1,
      }]
    };
  };

  // Booking channel data - sử dụng dữ liệu đã lọc theo periodType
  const bookingChannelData = getFilteredBookingChannelData();
  // Kiểm tra dữ liệu kênh đặt phòng có dữ liệu không
  const hasBookingData = bookingChannelData.datasets[0].data.some(val => val > 0);

  // UI filter mới
  const years = getRecentYears(5);
  // months: nếu là năm hiện tại thì chỉ list tới tháng hiện tại, nếu là năm trước thì đủ 12 tháng
  const months = Array.from({ length: selectedYear === currentYear ? currentMonth : 12 }, (_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Phân tích doanh thu</h4>
          <p className="text-muted">
            Theo dõi và phân tích doanh thu của khách sạn
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* Filter loại kỳ */}
          <select
            className="form-select form-select-sm me-2"
            value={periodType}
            onChange={e => {
              setPeriodType(e.target.value);
              // Reset filter value khi đổi loại kỳ
              if (e.target.value === "month") {
                setSelectedMonth(new Date().getMonth() + 1);
                setSelectedYear(new Date().getFullYear());
              } else if (e.target.value === "year") {
                setSelectedYear(new Date().getFullYear());
              }
            }}
            style={{ width: 120 }}
          >
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
          {/* Filter giá trị kỳ */}
          {periodType === "month" && (
            <>
              <select
                className="form-select form-select-sm me-2"
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                style={{ width: 110 }}
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                className="form-select form-select-sm me-2"
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                style={{ width: 90 }}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </>
          )}
          {periodType === "year" && (
            <select
              className="form-select form-select-sm me-2"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              style={{ width: 90 }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Thêm thống kê tổng hợp từ filter */}
      {filteredStats.length > 0 ? (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  {periodType === "month" ? "Doanh thu tháng hiện tại" : "Tổng doanh thu năm nay"}
                </h6>
                <h3 className="mb-0">
                  {formatCurrency(totalRevenue)}
                </h3>
                <small className="text-muted">
                  {totalReservation} đặt phòng
                </small>
                <div className="mt-2">
                  <small className="text-danger">
                    Hoa hồng: {formatCurrency(totalCommission)}
                  </small>
                  <br />
                  <small className="text-success">
                    Thực nhận: {formatCurrency(totalActualAmount)}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">
                  {periodType === "month" ? "Trung bình tháng" : "Trung bình năm"}
                </h6>
                <h3 className="mb-0">
                  {formatCurrency(avgRevenue)}
                </h3>
                <small className="text-muted">
                  Số kỳ: {filteredStats.length}
                </small>
                <div className="mt-2">
                  <small className="text-danger">
                    Tổng hoa hồng: {formatCurrency(totalCommission)}
                  </small>
                  <br />
                  <small className="text-success">
                    Tổng thực nhận: {formatCurrency(totalActualAmount)}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">Lợi nhuận</h6>
                <h3 className="mb-0">
                  {formatCurrency(totalActualAmount)}
                </h3>
                <small className="text-muted">
                  {periodType === "month" ? `Tháng ${selectedMonth} này` : `Năm ${selectedYear} này`}
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">Tổng đặt phòng</h6>
                <h3 className="mb-0">
                  {totalReservation}
                </h3>
                <small className="text-muted">
                  Trung bình: {filteredStats.length > 0 ? Math.round(totalReservation / filteredStats.length) : 0}
                </small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Chưa có dữ liệu doanh thu cho kỳ này. Vui lòng kiểm tra lại sau.
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Xu hướng doanh thu</h5>
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        callback: (value) => formatCurrency(value),
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">
                Kênh đặt phòng ({periodType === "month" ? "Tháng này" : "Năm nay"})
                {reservations && reservations.length > 0 && (
                  <small className="text-success ms-2">
                    <i className="bi bi-check-circle"></i> Dữ liệu thực tế
                  </small>
                )}
                {(!reservations || reservations.length === 0) && (
                  <small className="text-warning ms-2">
                    <i className="bi bi-exclamation-triangle"></i> Chưa có dữ liệu
                  </small>
                )}
              </h5>
              <div className="  -container">
                {hasBookingData ? (
                  <Pie
                    data={bookingChannelData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                              return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                            }
                          }
                        }
                      },
                    }}
                  />
                ) : (
                  <div className="alert alert-info mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Không có dữ liệu đặt phòng cho kỳ này.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">
            Phân tích doanh thu theo tên phòng 
            {periodType === "month" 
              ? ` trong tháng ${selectedMonth}/${selectedYear}` 
              : ` trong năm ${selectedYear}`
            }
            {realData?.revenueByRoomType?.length > 0 && (
              <small className="text-success ms-2">
                <i className="bi bi-check-circle"></i> Dữ liệu thực tế
              </small>
            )}
            {(!realData?.revenueByRoomType || realData.revenueByRoomType.length === 0) && (
              <small className="text-warning ms-2">
                <i className="bi bi-exclamation-triangle"></i> Chưa có dữ liệu
              </small>
            )}
          </h5>
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Tên phòng</th>
                  <th>Số lượng</th>
                  <th>Giá trung bình</th>
                  <th>Doanh thu</th>
                  <th>% Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {roomTypeRows.length > 0 ? (
                  roomTypeRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.type}</td>
                      <td>{row.quantity}</td>
                      <td>{row.avgPrice}</td>
                      <td>{row.revenue}</td>
                      <td>{row.percent}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      Chưa có dữ liệu doanh thu theo tên phòng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {(!realData?.revenueByRoomType || realData.revenueByRoomType.length === 0) && (
            <div className="alert alert-info mt-3">
              <i className="bi bi-info-circle me-2"></i>
              Dữ liệu sẽ được hiển thị khi có reservation trong hệ thống.
            </div>
          )}
        </div>
      </div>

      {/* Thêm bảng doanh thu theo tháng */}
      {filteredStats.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">
              Chi tiết doanh thu ({periodType === "month" ? "Tháng này" : "Năm nay"})
            </h5>
            <div className="table-responsive">
              <table className="table">
                <thead className="table-light">
                  <tr>
                    <th>Tháng</th>
                    <th>Năm</th>
                    <th>Doanh thu</th>
                    <th>Hoa hồng (đơn online 12%)</th>
                    <th>Thực nhận</th>
                    {/* <th>Thanh toán hàng tháng</th> */}
                    <th>Số lượng đặt phòng</th>
                    {/* <th>Trạng thái thanh toán</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.map((item, idx) => (
                    <tr key={idx}>
                      <td>{getMonthName(item.month)}</td>
                      <td>{item.year}</td>
                      <td className="fw-bold">{formatCurrency(item.revenue)}</td>
                      <td className="text-danger">{formatCurrency(item.commission || 0)}</td>
                      <td className="text-success">{formatCurrency(item.actualAmountToHost || 0)}</td>
                      {/* <td>{formatCurrency(item.monthlyPayment)}</td> */}
                      <td>{item.reservationCount || 0}</td>
                      {/* <td>
                        {item.paymentStatus ? (
                          <span className={`badge ${
                            item.paymentStatus === 'PAID' ? 'bg-success' : 
                            item.paymentStatus === 'PARTIAL' ? 'bg-info' :
                            item.paymentStatus === 'PENDING' ? 'bg-warning' :
                            item.paymentStatus === 'NOT_PAID' ? 'bg-danger' : 'bg-secondary'
                          }`}>
                            {item.paymentStatus === 'PAID' ? 'Đã thanh toán' : 
                             item.paymentStatus === 'PARTIAL' ? 'Thanh toán một phần' :
                             item.paymentStatus === 'PENDING' ? 'Chờ thanh toán' :
                             item.paymentStatus === 'NOT_PAID' ? 'Chưa thanh toán' : 'Không có'}
                          </span>
                        ) : (
                          <span className="badge bg-secondary">Không có</span>
                        )}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {realData && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-2"></i>
          Dữ liệu thực tế đã được tải thành công từ hệ thống.
          <small className="text-muted ms-2">
            Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
          </small>
          <br />
          <small className="text-muted">
            Số tháng có dữ liệu: {realData.monthlyRevenueStats?.length || 0} | 
            Số loại phòng: {realData.revenueByRoomType?.length || 0} |
            Tổng reservation: {totalReservation || 0}
          </small>
        </div>
      )}
      {!realData && reservations && reservations.length === 0 && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Chưa có dữ liệu reservation nào trong hệ thống. Vui lòng kiểm tra lại sau.
        </div>
      )}
    </>
  );
};

export default RevenuePage;
