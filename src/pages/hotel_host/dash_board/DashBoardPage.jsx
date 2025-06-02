import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
const DashBoardPage = ({ setActiveTab }) => {
  const revenueData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: [
          12500, 13200, 15400, 18900, 21500, 25800, 28900, 27600, 24300, 19800,
          16500, 22100,
        ],
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Dự đoán (AI)",
        data: [
          12000, 13000, 15000, 19000, 22000, 26000, 29000, 28000, 24000, 20000,
          17000, 23000,
        ],
        borderColor: "#f72585",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };
  // Dữ liệu biểu đồ phân khúc khách hàng
  const customerSegmentData = {
    labels: [
      "Doanh nhân",
      "Gia đình",
      "Cặp đôi",
      "Du lịch một mình",
      "Đoàn du lịch",
    ],
    datasets: [
      {
        data: [35, 25, 20, 10, 10],
        backgroundColor: [
          "#4361ee",
          "#3a0ca3",
          "#4cc9f0",
          "#f72585",
          "#7209b7",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu AI Insights
  const aiInsights = [
    {
      id: 1,
      title: "Dự đoán nhu cầu cao điểm",
      description:
        "Dự kiến nhu cầu tăng 23% vào tháng 7-8. Cân nhắc tăng giá phòng và chuẩn bị nhân sự.",
      impact: "high",
      category: "demand",
    },
    {
      id: 2,
      title: "Phân tích tỷ lệ hoàn trả",
      description:
        "Tỷ lệ hoàn trả giảm 5% so với quý trước. Chính sách hủy linh hoạt đang phát huy hiệu quả.",
      impact: "medium",
      category: "operations",
    },
    {
      id: 3,
      title: "Phân khúc khách hàng mới nổi",
      description:
        "Phát hiện sự gia tăng 15% khách du lịch một mình. Cân nhắc tạo gói dịch vụ đặc biệt.",
      impact: "medium",
      category: "customers",
    },
    {
      id: 4,
      title: "Cơ hội tăng doanh thu",
      description:
        "Phân tích cho thấy tiềm năng tăng 18% doanh thu từ dịch vụ spa nếu có gói combo với phòng.",
      impact: "high",
      category: "revenue",
    },
    {
      id: 5,
      title: "Tối ưu hóa nhân sự",
      description:
        "Mô hình dự đoán cho thấy có thể giảm 7% chi phí nhân sự bằng cách điều chỉnh lịch làm việc.",
      impact: "medium",
      category: "operations",
    },
  ];

  // Dữ liệu đặt phòng gần đây
  const recentBookings = [
    {
      id: "B-7829",
      guest: "Nguyễn Văn A",
      room: "Deluxe 301",
      checkin: "15/06/2025",
      checkout: "18/06/2025",
      status: "Đã xác nhận",
      amount: "4,500,000 VND",
    },
    {
      id: "B-7830",
      guest: "Trần Thị B",
      room: "Suite 502",
      checkin: "16/06/2025",
      checkout: "20/06/2025",
      status: "Đã thanh toán",
      amount: "12,800,000 VND",
    },
    {
      id: "B-7831",
      guest: "Lê Văn C",
      room: "Standard 205",
      checkin: "16/06/2025",
      checkout: "17/06/2025",
      status: "Đang xử lý",
      amount: "1,200,000 VND",
    },
    {
      id: "B-7832",
      guest: "Phạm Thị D",
      room: "Deluxe 305",
      checkin: "17/06/2025",
      checkout: "22/06/2025",
      status: "Đã xác nhận",
      amount: "7,500,000 VND",
    },
    {
      id: "B-7833",
      guest: "Hoàng Văn E",
      room: "Suite 501",
      checkin: "18/06/2025",
      checkout: "25/06/2025",
      status: "Đã thanh toán",
      amount: "18,900,000 VND",
    },
  ];
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Tổng quan khách sạn</h4>
        <div className="d-flex">
          <select className="form-select form-select-sm me-2">
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option defaultValue="selected">Tháng này</option>
            <option>Quý này</option>
            <option>Năm nay</option>
          </select>
          <button className="btn btn-sm btn-outline-primary">
            <i className="bi bi-download me-1"></i> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Tỷ lệ lấp đầy</h6>
                  <h3 className="mb-0">82.5%</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 4.2% so với tháng trước
                  </small>
                </div>
                <div className="stat-icon light-primary">
                  <i className="bi bi-house-door fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Doanh thu trung bình/phòng</h6>
                  <h3 className="mb-0">2.4M</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 6.8% so với tháng trước
                  </small>
                </div>
                <div className="stat-icon light-success">
                  <i className="bi bi-cash-stack fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Đánh giá trung bình</h6>
                  <h3 className="mb-0">4.7/5</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> 0.2 so với tháng trước
                  </small>
                </div>
                <div className="stat-icon light-warning">
                  <i className="bi bi-star fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Tỷ lệ khách quay lại</h6>
                  <h3 className="mb-0">28.3%</h3>
                  <small className="text-danger">
                    <i className="bi bi-arrow-down"></i> 1.5% so với tháng trước
                  </small>
                </div>
                <div className="stat-icon light-info">
                  <i className="bi bi-repeat fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title">Phân tích doanh thu</h5>
                  <p className="text-muted small mb-0">
                    So sánh doanh thu thực tế với dự đoán AI
                  </p>
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary">
                    Ngày
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Tuần
                  </button>
                  <button className="btn btn-sm btn-primary">Tháng</button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Năm
                  </button>
                </div>
              </div>
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        drawBorder: false,
                      },
                      ticks: {
                        callback: (value) => value / 1000 + "K",
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
              <h5 className="card-title">Phân khúc khách hàng</h5>
              <p className="text-muted small mb-4">
                Phân tích theo loại khách hàng
              </p>
              <div className="chart-container">
                <Doughnut
                  data={customerSegmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                    cutout: "70%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights and Bookings */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">AI Insights</h5>
                <a
                  href="#"
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() => {
                    setActiveTab("ai-insights");
                  }}
                >
                  Xem tất cả
                </a>
              </div>
              <div className="ai-insights-list">
                {aiInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="ai-insight-item">
                    <div className="d-flex align-items-center mb-2">
                      <span
                        className={`badge ${
                          insight.impact === "high" ? "bg-danger" : "bg-warning"
                        } me-2`}
                      >
                        {insight.impact === "high"
                          ? "Quan trọng"
                          : "Trung bình"}
                      </span>
                      <h6 className="mb-0">{insight.title}</h6>
                    </div>
                    <p className="mb-0 small">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title">Đặt phòng gần đây</h5>
                <a
                  href="#"
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() => {
                    setActiveTab("bookings");
                  }}
                >
                  Xem tất cả
                </a>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Khách hàng</th>
                      <th>Check-in</th>
                      <th>Trạng thái</th>
                      <th>Số tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.slice(0, 4).map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.guest}</td>
                        <td>{booking.checkin}</td>
                        <td>
                          <span
                            className={`badge ${
                              booking.status === "Đã xác nhận"
                                ? "bg-success"
                                : booking.status === "Đã thanh toán"
                                ? "bg-primary"
                                : "bg-warning"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardPage;
