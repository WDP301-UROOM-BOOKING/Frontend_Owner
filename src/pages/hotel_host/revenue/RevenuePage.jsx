import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

const RevenuePage = () => {
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

  // Dữ liệu biểu đồ kênh đặt phòng
  const bookingChannelData = {
    labels: [
      "Website khách sạn",
      "OTAs",
      "Đại lý du lịch",
      "Trực tiếp",
      "Khác",
    ],
    datasets: [
      {
        data: [30, 40, 15, 10, 5],
        backgroundColor: [
          "#4cc9f0",
          "#4361ee",
          "#3a0ca3",
          "#7209b7",
          "#f72585",
        ],
        borderWidth: 1,
      },
    ],
  };

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

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-muted">Tổng doanh thu</h6>
              <h3 className="mb-0">1.25 Tỷ</h3>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> 12.5% so với kỳ trước
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-muted">RevPAR</h6>
              <h3 className="mb-0">1.8M</h3>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> 8.3% so với kỳ trước
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-muted">ADR</h6>
              <h3 className="mb-0">2.2M</h3>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> 5.2% so với kỳ trước
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-muted">Lợi nhuận</h6>
              <h3 className="mb-0">420M</h3>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> 15.8% so với kỳ trước
              </small>
            </div>
          </div>
        </div>
      </div>

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
              <h5 className="card-title mb-4">Kênh đặt phòng</h5>
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
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">
            Phân tích doanh thu theo loại phòng
          </h5>
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Loại phòng</th>
                  <th>Số lượng</th>
                  <th>Tỷ lệ lấp đầy</th>
                  <th>Giá trung bình</th>
                  <th>Doanh thu</th>
                  <th>% Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard</td>
                  <td>20</td>
                  <td>85%</td>
                  <td>1.2M</td>
                  <td>408M</td>
                  <td>32.6%</td>
                </tr>
                <tr>
                  <td>Deluxe</td>
                  <td>15</td>
                  <td>78%</td>
                  <td>1.8M</td>
                  <td>421M</td>
                  <td>33.7%</td>
                </tr>
                <tr>
                  <td>Suite</td>
                  <td>8</td>
                  <td>65%</td>
                  <td>3.5M</td>
                  <td>364M</td>
                  <td>29.1%</td>
                </tr>
                <tr>
                  <td>Presidential</td>
                  <td>2</td>
                  <td>45%</td>
                  <td>6.5M</td>
                  <td>58.5M</td>
                  <td>4.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenuePage;
