import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"

const InsightAiPage = () => {
      // Dữ liệu AI Insights
  const aiInsights = [
    {
      id: 1,
      title: "Dự đoán nhu cầu cao điểm",
      description: "Dự kiến nhu cầu tăng 23% vào tháng 7-8. Cân nhắc tăng giá phòng và chuẩn bị nhân sự.",
      impact: "high",
      category: "demand",
    },
    {
      id: 2,
      title: "Phân tích tỷ lệ hoàn trả",
      description: "Tỷ lệ hoàn trả giảm 5% so với quý trước. Chính sách hủy linh hoạt đang phát huy hiệu quả.",
      impact: "medium",
      category: "operations",
    },
    {
      id: 3,
      title: "Phân khúc khách hàng mới nổi",
      description: "Phát hiện sự gia tăng 15% khách du lịch một mình. Cân nhắc tạo gói dịch vụ đặc biệt.",
      impact: "medium",
      category: "customers",
    },
    {
      id: 4,
      title: "Cơ hội tăng doanh thu",
      description: "Phân tích cho thấy tiềm năng tăng 18% doanh thu từ dịch vụ spa nếu có gói combo với phòng.",
      impact: "high",
      category: "revenue",
    },
    {
      id: 5,
      title: "Tối ưu hóa nhân sự",
      description: "Mô hình dự đoán cho thấy có thể giảm 7% chi phí nhân sự bằng cách điều chỉnh lịch làm việc.",
      impact: "medium",
      category: "operations",
    },
  ]

    return (
        <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4>AI Insights</h4>
                    <p className="text-muted">Phân tích thông minh và dự đoán từ AI</p>
                  </div>
                  <div className="d-flex">
                    <select className="form-select form-select-sm me-2">
                      <option>Tất cả danh mục</option>
                      <option>Nhu cầu</option>
                      <option>Doanh thu</option>
                      <option>Khách hàng</option>
                      <option>Vận hành</option>
                    </select>
                    <select className="form-select form-select-sm me-2">
                      <option>Tất cả mức độ</option>
                      <option>Cao</option>
                      <option>Trung bình</option>
                      <option>Thấp</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  {aiInsights.map((insight) => (
                    <div key={insight.id} className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div
                              className={`insight-icon me-3 ${
                                insight.category === "demand"
                                  ? "light-primary"
                                  : insight.category === "revenue"
                                    ? "light-success"
                                    : insight.category === "customers"
                                      ? "light-info"
                                      : "light-warning"
                              }`}
                            >
                              <i
                                className={`bi ${
                                  insight.category === "demand"
                                    ? "bi-graph-up"
                                    : insight.category === "revenue"
                                      ? "bi-cash-coin"
                                      : insight.category === "customers"
                                        ? "bi-people"
                                        : "bi-gear"
                                } fs-4`}
                              ></i>
                            </div>
                            <div>
                              <span className={`badge ${insight.impact === "high" ? "bg-danger" : "bg-warning"} mb-1`}>
                                {insight.impact === "high" ? "Quan trọng" : "Trung bình"}
                              </span>
                              <h5 className="mb-0">{insight.title}</h5>
                            </div>
                          </div>
                          <p className="mb-3">{insight.description}</p>
                          <div className="d-flex justify-content-between">
                            <span className="badge bg-light text-dark">
                              {insight.category === "demand"
                                ? "Nhu cầu"
                                : insight.category === "revenue"
                                  ? "Doanh thu"
                                  : insight.category === "customers"
                                    ? "Khách hàng"
                                    : "Vận hành"}
                            </span>
                            <button className="btn btn-sm btn-outline-primary">Xem chi tiết</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Dự đoán nhu cầu theo mùa</h5>
                    <Bar
                      data={{
                        labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
                        datasets: [
                          {
                            label: "Tỷ lệ lấp đầy dự kiến (%)",
                            data: [65, 68, 72, 78, 82, 88, 92, 90, 85, 76, 70, 80],
                            backgroundColor: "#4cc9f0",
                          },
                          {
                            label: "Giá phòng trung bình dự kiến (triệu VND)",
                            data: [1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.0, 1.7, 1.5, 1.4, 1.6],
                            backgroundColor: "#f72585",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </>
    );
}

export default InsightAiPage