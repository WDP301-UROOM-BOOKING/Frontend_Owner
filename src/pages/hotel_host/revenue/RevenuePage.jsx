import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";

const RevenuePage = () => {
  // State for real data
  const [realData, setRealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch real data from backend
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/dashboard-owner/metrics", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setRealData(json.data);
        } else {
          setRealData(null);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu thực tế");
        setRealData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fallback mock data
  const fallbackRevenueData = {
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

  // Fallback booking channel data
  const fallbackBookingChannelData = {
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

  // Fallback room type data
  const fallbackRoomTypeRows = [
    { type: "Standard", quantity: 20, occupancy: "85%", avgPrice: "1.2M", revenue: "408M", percent: "32.6%" },
    { type: "Deluxe", quantity: 15, occupancy: "78%", avgPrice: "1.8M", revenue: "421M", percent: "33.7%" },
    { type: "Suite", quantity: 8, occupancy: "65%", avgPrice: "3.5M", revenue: "364M", percent: "29.1%" },
    { type: "Presidential", quantity: 2, occupancy: "45%", avgPrice: "6.5M", revenue: "58.5M", percent: "4.6%" },
  ];

  // Helper for currency formatting
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return amount;
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  // Use real data if available, otherwise fallback
  const revenueData = realData?.revenueData ? {
    ...fallbackRevenueData,
    datasets: [
      {
        ...fallbackRevenueData.datasets[0],
        data: realData.revenueData,
      },
      fallbackRevenueData.datasets[1],
    ],
  } : fallbackRevenueData;

  // KPI values - sử dụng tổng doanh thu cho hiển thị chính
  const totalRevenue = realData?.totalRevenue ?? 1250000000;
  const completedRevenue = realData?.completedRevenue ?? 1000000000;
  const revpar = realData?.revpar ?? 1800000;
  const adr = realData?.adr ?? 2200000;
  const profit = realData?.profit ?? 420000000;

  // Booking channel data (mock, unless you have real data)
  const bookingChannelData = fallbackBookingChannelData;

  // Room type rows (mock, unless you have real data)
  const roomTypeRows = realData?.revenueByRoomType?.length > 0
    ? realData.revenueByRoomType.map(row => ({
        type: row.type,
        quantity: row.quantity,
        occupancy: (row.occupancy * 100).toFixed(0) + "%",
        avgPrice: formatCurrency(row.avgPrice),
        revenue: formatCurrency(row.revenue),
        percent: row.percent + "%"
      }))
    : fallbackRoomTypeRows;

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
              <h3 className="mb-0">{formatCurrency(totalRevenue)}</h3>
              <small className="text-success">
                <i className="bi bi-arrow-up"></i> 12.5% so với kỳ trước
              </small>
              <div className="mt-2">
                <small className="text-muted">
                  Đã hoàn thành: {formatCurrency(completedRevenue)}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-muted">RevPAR</h6>
              <h3 className="mb-0">{formatCurrency(revpar)}</h3>
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
              <h3 className="mb-0">{formatCurrency(adr)}</h3>
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
              <h3 className="mb-0">{formatCurrency(profit)}</h3>
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
                {roomTypeRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.type}</td>
                    <td>{row.quantity}</td>
                    <td>{row.occupancy}</td>
                    <td>{row.avgPrice}</td>
                    <td>{row.revenue}</td>
                    <td>{row.percent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {loading && (
        <div className="alert alert-info">Đang tải dữ liệu thực...</div>
      )}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
    </>
  );
};

export default RevenuePage;
