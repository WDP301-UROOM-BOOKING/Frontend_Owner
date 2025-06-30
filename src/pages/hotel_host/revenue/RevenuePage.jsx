import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Utils from "@utils/Utils";

const ReservationActions = {
  FETCH_RESERVATIONS: "FETCH_RESERVATIONS",
  FETCH_RESERVATIONS_SUCCESS: "FETCH_RESERVATIONS_SUCCESS",
  FETCH_RESERVATIONS_FAILURE: "FETCH_RESERVATIONS_FAILURE",
};

const RevenuePage = () => {
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.Reservation);

  // State for real data
  const [realData, setRealData] = useState(null);

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
        // Lấy tất cả reservation từ tháng 1 đến hiện tại
        year: new Date().getFullYear(),
        sort: "desc",
      },
    });
  }, [dispatch]);

  // Process reservations data to create monthly stats
  useEffect(() => {
    if (reservations && reservations.length > 0) {
      console.log("Processing reservations:", reservations);
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const monthlyStats = [];

      // Group reservations by month
      for (let month = 1; month <= currentMonth; month++) {
        const monthReservations = reservations.filter(res => {
          const createdAt = new Date(res.createdAt);
          return createdAt.getFullYear() === currentYear && 
                 createdAt.getMonth() + 1 === month &&
                 res.status !== "NOT PAID";
        });

        const revenue = monthReservations.reduce((sum, res) => {
          const price = res.finalPrice > 0 ? res.finalPrice : res.totalPrice;
          return sum + price;
        }, 0);

        // Tính hoa hồng chỉ cho đơn online (không tính cho OFFLINE)
        const onlineReservations = monthReservations.filter(res => res.status !== "OFFLINE");
        const onlineRevenue = onlineReservations.reduce((sum, res) => {
          const price = res.finalPrice > 0 ? res.finalPrice : res.totalPrice;
          return sum + price;
        }, 0);
        
        const commission = Math.floor(onlineRevenue * 0.12);
        const actualAmountToHost = revenue - commission; // Tổng doanh thu - hoa hồng

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
          year: currentYear,
          revenue,
          commission,
          actualAmountToHost,
          reservationCount: monthReservations.length,
          monthlyPayment: 0, // Sẽ cập nhật sau nếu cần
          paymentStatus
        });
      }

      // Calculate room type stats
      const roomTypeStats = [];
      const roomNames = [...new Set(reservations.flatMap(res => 
        res.rooms?.map(room => room.room?.name).filter(Boolean) || []
      ))];

      roomNames.forEach(roomName => {
        const roomReservations = reservations.filter(res => 
          res.rooms?.some(room => room.room?.name === roomName) &&
          res.status !== "NOT PAID"
        );

        const roomRevenue = roomReservations.reduce((sum, res) => {
          const price = res.finalPrice > 0 ? res.finalPrice : res.totalPrice;
          return sum + price;
        }, 0);

        const quantity = roomReservations.reduce((sum, res) => 
          sum + (res.rooms?.filter(room => room.room?.name === roomName)
            .reduce((qSum, room) => qSum + room.quantity, 0) || 0), 0
        );

        const avgPrice = roomReservations.length > 0 ? roomRevenue / roomReservations.length : 0;
        const percent = roomRevenue > 0 ? ((roomRevenue / monthlyStats.reduce((sum, m) => sum + m.revenue, 0)) * 100).toFixed(1) : 0;

        roomTypeStats.push({
          type: roomName,
          quantity,
          avgPrice,
          revenue: roomRevenue,
          percent
        });
      });

      // Tính toán dữ liệu kênh đặt phòng - chỉ từ tháng hiện tại
      const currentMonthForBooking = new Date().getMonth() + 1;
      const currentYearForBooking = new Date().getFullYear();
      
      const currentMonthReservations = reservations.filter(res => {
        const createdAt = new Date(res.createdAt);
        return createdAt.getFullYear() === currentYearForBooking && 
               createdAt.getMonth() + 1 === currentMonthForBooking;
      });
      
      const websiteReservations = currentMonthReservations.filter(res => res.status !== "OFFLINE");
      const offlineReservations = currentMonthReservations.filter(res => res.status === "OFFLINE");
      
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
  }, [reservations]);

  // Fallback mock data - chỉ hiển thị từ tháng 1 đến tháng hiện tại
  const currentMonth = new Date().getMonth() + 1;
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

  // Use real data if available, otherwise fallback
  const revenueData = realData?.monthlyRevenueStats ? {
    labels: realData.monthlyRevenueStats.map(item => getMonthName(item.month)),
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: realData.monthlyRevenueStats.map(item => item.revenue),
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  } : fallbackRevenueData;

  // KPI values - sử dụng tổng doanh thu cho hiển thị chính
  const totalRevenue = realData?.totalRevenue ?? 1250000000;
  const completedRevenue = realData?.completedRevenue ?? 1000000000;
  const revpar = realData?.revpar ?? 1800000;
  const adr = realData?.adr ?? 2200000;
  const profit = realData?.profit ?? 420000000;

  // Fallback booking channel data
  const fallbackBookingChannelData = {
    labels: ["Đặt phòng qua website", "Đặt phòng offline"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#4361ee", "#f72585"],
      borderWidth: 1,
    }]
  };

  // Booking channel data - sử dụng real data hoặc fallback
  const bookingChannelData = realData?.bookingChannelData || fallbackBookingChannelData;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>Phân tích doanh thu</h4>
          <p className="text-muted">
            Theo dõi và phân tích doanh thu của khách sạn
          </p>
        </div>
        <div className="d-flex">
          <select className="form-select form-select-sm me-2">
            <option>Tháng này</option>
            <option>Quý này</option>
            <option>Năm nay</option>
            <option>Tùy chỉnh</option>
          </select>
          <button className="btn btn-sm btn-outline-primary">
            <i className="bi bi-download me-1"></i> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Thêm thống kê tổng hợp từ tháng 1 đến tháng hiện tại */}
      {realData?.monthlyRevenueStats && realData.monthlyRevenueStats.length > 0 ? (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">Doanh thu tháng hiện tại</h6>
                <h3 className="mb-0">
                  {(() => {
                    const currentMonth = new Date().getMonth() + 1;
                    const currentYear = new Date().getFullYear();
                    const currentMonthData = realData.monthlyRevenueStats.find(
                      item => item.month === currentMonth && item.year === currentYear
                    );
                    return formatCurrency(currentMonthData?.revenue || 0);
                  })()}
                </h3>
                <small className="text-muted">
                  {(() => {
                    const currentMonth = new Date().getMonth() + 1;
                    const currentYear = new Date().getFullYear();
                    const currentMonthData = realData.monthlyRevenueStats.find(
                      item => item.month === currentMonth && item.year === currentYear
                    );
                    return `${currentMonthData?.reservationCount || 0} đặt phòng`;
                  })()}
                </small>
                <div className="mt-2">
                  <small className="text-danger">
                    Hoa hồng: {(() => {
                      const currentMonth = new Date().getMonth() + 1;
                      const currentYear = new Date().getFullYear();
                      const currentMonthData = realData.monthlyRevenueStats.find(
                        item => item.month === currentMonth && item.year === currentYear
                      );
                      return formatCurrency(currentMonthData?.commission || 0);
                    })()}
                  </small>
                  <br />
                  <small className="text-success">
                    Thực nhận: {(() => {
                      const currentMonth = new Date().getMonth() + 1;
                      const currentYear = new Date().getFullYear();
                      const currentMonthData = realData.monthlyRevenueStats.find(
                        item => item.month === currentMonth && item.year === currentYear
                      );
                      return formatCurrency(currentMonthData?.actualAmountToHost || 0);
                    })()}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">Tổng doanh thu từ T1 đến hiện tại</h6>
                <h3 className="mb-0">
                  {formatCurrency(realData.monthlyRevenueStats.reduce((sum, item) => sum + item.revenue, 0))}
                </h3>
                <small className="text-muted">
                  Trung bình: {formatCurrency(realData.monthlyRevenueStats.reduce((sum, item) => sum + item.revenue, 0) / realData.monthlyRevenueStats.length)}
                </small>
                <div className="mt-2">
                  <small className="text-danger">
                    Tổng hoa hồng: {formatCurrency(realData.monthlyRevenueStats.reduce((sum, item) => sum + (item.commission || 0), 0))}
                  </small>
                  <br />
                  <small className="text-success">
                    Tổng thực nhận: {formatCurrency(realData.monthlyRevenueStats.reduce((sum, item) => sum + (item.actualAmountToHost || 0), 0))}
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
                  {formatCurrency(realData.monthlyRevenueStats.reduce((sum, item) => sum + (item.actualAmountToHost || 0), 0))}
                </h3>
                <small className="text-muted">
                  Từ tháng 1 đến hiện tại
                </small>
                <div className="mt-2">
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 15.8% so với kỳ trước
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="text-muted">Tổng đặt phòng từ T1 đến hiện tại</h6>
                <h3 className="mb-0">
                  {realData.monthlyRevenueStats.reduce((sum, item) => sum + (item.reservationCount || 0), 0)}
                </h3>
                <small className="text-muted">
                  Trung bình: {Math.round(realData.monthlyRevenueStats.reduce((sum, item) => sum + (item.reservationCount || 0), 0) / realData.monthlyRevenueStats.length)}
                </small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Chưa có dữ liệu doanh thu từ tháng 1 đến hiện tại. Vui lòng kiểm tra lại sau.
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
                Kênh đặt phòng (Tháng {new Date().getMonth() + 1})
                {realData?.bookingChannelData && (
                  <small className="text-success ms-2">
                    <i className="bi bi-check-circle"></i> Dữ liệu thực tế
                  </small>
                )}
                {!realData?.bookingChannelData && (
                  <small className="text-warning ms-2">
                    <i className="bi bi-exclamation-triangle"></i> Chưa có dữ liệu
                  </small>
                )}
              </h5>
              <div className="chart-container">
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
              </div>
              {!realData?.bookingChannelData && (
                <div className="alert alert-info mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Dữ liệu sẽ được hiển thị khi có reservation trong hệ thống.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">
            Phân tích doanh thu theo tên phòng
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
      {realData?.monthlyRevenueStats && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">
              Chi tiết doanh thu theo tháng (từ tháng 1 đến tháng hiện tại)
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
                    <th>Thanh toán hàng tháng</th>
                    <th>Số lượng đặt phòng</th>
                    <th>Trạng thái thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {realData.monthlyRevenueStats.map((item, idx) => (
                    <tr key={idx}>
                      <td>{getMonthName(item.month)}</td>
                      <td>{item.year}</td>
                      <td className="fw-bold">{formatCurrency(item.revenue)}</td>
                      <td className="text-danger">{formatCurrency(item.commission || 0)}</td>
                      <td className="text-success">{formatCurrency(item.actualAmountToHost || 0)}</td>
                      <td>{formatCurrency(item.monthlyPayment)}</td>
                      <td>{item.reservationCount || 0}</td>
                      <td>
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
                      </td>
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
            Số tên phòng: {realData.revenueByRoomType?.length || 0} |
            Tổng reservation: {reservations?.length || 0}
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
