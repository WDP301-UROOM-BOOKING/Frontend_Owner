import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Image,
  Pagination,
} from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import ReportFeedbacksActions from "../../../redux/reportedFeedback/actions";
import FeedbackActions from "../../../redux/feedback/actions";
import { showToast } from "@components/ToastContainer";
import { Star, StarFill } from "react-bootstrap-icons";
import ConfirmationModal from "@components/ConfirmationModal";
import Utils from "../../../utils/Utils";

const STATUS_OPTIONS = ["Tất cả", "Chờ xử lý", "Đã duyệt", "Đã từ chối"];

const MyReportPage = () => {
  const dispatch = useAppDispatch();
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const [reportFeedbacks, setReportFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  useEffect(() => {
    if (Auth._id) fetchUserReports(Auth._id);
  }, [Auth._id]);

  const fetchUserReports = (userId) => {
    setLoading(true);
    dispatch({
      type: ReportFeedbacksActions.FETCH_REPORTS_BY_USERID,
      payload: {
        userId,
        onSuccess: (data) => {
          console.log("Dữ liệu", data);
          fetchAllFeedbacks(data);
        },
        onFailed: () => setLoading(false),
        onError: (err) => {
          showToast.error("Lỗi máy chủ khi tải báo cáo phản hồi");
          console.error(err);
          setLoading(false);
        },
      },
    });
  };

  const fetchAllFeedbacks = async (reportList) => {
    try {
      const results = await Promise.all(
        reportList.map((report) => {
          const hasHotel =
            report.feedback?.hotel?.hotelName &&
            report.feedback?.hotel?.address;
          if (hasHotel) return Promise.resolve(report);

          return new Promise((resolve, reject) => {
            dispatch({
              type: FeedbackActions.FETCH_FEEDBACK_BY_ID,
              payload: {
                feedbackId: report?.feedback?._id,
                onSuccess: (feedbackData) => {
                  resolve({ ...report, feedback: feedbackData });
                },
                onFailed: () => reject("Không thể tải phản hồi"),
                onError: (err) => reject(err),
              },
            });
          });
        })
      );

      setReportFeedbacks(results);
    } catch (err) {
      console.error("Lỗi khi tải thông tin phản hồi đầy đủ với thông tin khách sạn:", err);
      showToast.error("Lỗi khi tải dữ liệu phản hồi chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  // Map Vietnamese options to English status for filtering
  const getStatusForFilter = (vietnameseOption) => {
    const mapping = {
      "Tất cả": "all",
      "Chờ xử lý": "pending",
      "Đã duyệt": "approved",
      "Đã từ chối": "rejected"
    };
    return mapping[vietnameseOption] || "all";
  };

  const filteredReports = reportFeedbacks.filter((report) => {
    if (!report.status) return false;

    const normalizedStatus = report.status.trim().toLowerCase();
    const selectedFilter = getStatusForFilter(sortOption);

    return selectedFilter === "all" || normalizedStatus === selectedFilter;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    if (filteredReports.length <= itemsPerPage) return null;

    const pages = [];

    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        Math.abs(page - currentPage) <= 1
      ) {
        if (pages.length > 0 && page !== pages[pages.length - 1] + 1) {
          pages.push("ellipsis");
        }
        pages.push(page);
      }
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />

          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
            ) : (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                <b
                  style={{
                    color: page === currentPage ? "white" : "#0d6efd",
                  }}
                >
                  {page}
                </b>
              </Pagination.Item>
            )
          )}

          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    );
  };

  const handleDeleteFeedback = (report) => {
    setSelectedFeedbackId(report._id);
    setShowAcceptModal(true);
  };

  const confirmDeleteFeedback = () => {
    if (!selectedFeedbackId) {
      showToast.error("Thiếu ID phản hồi.");
      return;
    }

    dispatch({
      type: ReportFeedbacksActions.DELETE_REPORTED_FEEDBACK,
      payload: {
        reportId: selectedFeedbackId,
        onSuccess: () => {
          setReportFeedbacks(
            reportFeedbacks.filter(
              (report) => report._id !== selectedFeedbackId
            )
          );
          showToast.success("Xóa phản hồi thành công!");
          setShowAcceptModal(false);
        },
        onFailed: (msg) => {
          showToast.error(msg || "Không thể xóa phản hồi");
          setShowAcceptModal(false);
        },
        onError: (err) => {
          showToast.error("Lỗi máy chủ khi xóa phản hồi");
          console.error(err);
          setShowAcceptModal(false);
        },
      },
    });
  };

  const renderStars = (count, total = 5) => {
    const stars = [];
    for (let i = 0; i < total; i++) {
      if (i < count) {
        stars.push(<StarFill key={i} className="text-warning" />);
      } else {
        stars.push(<Star key={i} className="text-warning" />);
      }
    }
    return stars;
  };

  useEffect(() => {
    if (paginatedReports.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginatedReports, currentPage]);

  const getStatusDisplayText = (status) => {
    const statusMapping = {
      "pending": "Chờ xử lý",
      "approved": "Đã duyệt",
      "rejected": "Đã từ chối",
      "reject": "Đã từ chối"
    };
    return statusMapping[status?.toLowerCase()] || status;
  };

  return (
    <Container fluid className="bg-light py-4">
      <h2 className="fw-bold mb-4">Báo Cáo Phản Hồi Của Tôi</h2>

      {/* Filter by status */}
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <span className="me-2">Lọc theo trạng thái:</span>
        </Col>
        <Col xs="auto">
          <Form.Select
            className="border-primary"
            style={{ width: "200px" }}
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Feedback list */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-4"
            style={{
              width: 140,
              height: 140,
              transition: "transform 0.3s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="/empty-state.svg"
              alt="Không có dữ liệu"
              style={{ width: 80, height: 80, opacity: 0.75 }}
            />
          </div>
          <h5 className="text-muted fw-semibold">
            Chưa Có Báo Cáo {sortOption}
          </h5>
          <p className="text-secondary mb-0" style={{ maxWidth: 350 }}>
            Bạn chưa có báo cáo {sortOption} nào.
          </p>
        </div>
      ) : (
        <>
          {paginatedReports.map((report) => (
            <Card key={report._id} className="mb-4 border-0 shadow rounded-4">
              <Card.Body className="p-4">
                <Row className="g-4 align-items-center">
                  <Col md={5} className="border-end border-2">
                    {report.feedback?.statusActive === "NONACTIVE" ? (
                      <div className="text-muted fst-italic text-center">
                        <p className="mb-0">Phản hồi đã bị xóa</p>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex align-items-center mb-3">
                          <Image
                            src={
                              report.feedback?.user?.image?.url ||
                              "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
                            }
                            roundedCircle
                            style={{ width: 50, height: 50, marginRight: 12 }}
                          />
                          <div>
                            <h6 className="mb-0">
                              {report.feedback?.user.name || "Người dùng không xác định"}
                            </h6>
                          </div>
                        </div>
                        <div className="mb-1">
                          <strong>Đánh giá:</strong>{" "}
                          {renderStars(report.feedback.rating || 0)}
                        </div>
                        <div className="mb-1">
                          <strong>Tạo lúc:</strong>{" "}
                          {Utils.getDate(report.feedback.createdAt, 4)}
                        </div>
                        <p className="mb-2">
                          <strong>Mô tả:</strong>{" "}
                          {report.feedback?.content || "Không có nội dung phản hồi"}
                        </p>
                        <div className="d-flex gap-3 mt-2">
                          <b className="text-primary p-0 me-3">
                            <FaThumbsUp className="me-1" />
                            {report.feedback?.likedBy?.length || 0} thích
                          </b>
                          <b className="text-danger p-0">
                            <FaThumbsDown className="me-1" />
                            {report.feedback?.dislikedBy?.length || 0} không thích
                          </b>
                        </div>
                      </>
                    )}
                  </Col>

                  <Col md={7}>
                    {report.status.toLowerCase() === "pending" && (
                      <button
                        onClick={() => handleDeleteFeedback(report)}
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          border: "none",
                          background: "transparent",
                          color: "gray",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          zIndex: 1,
                        }}
                        aria-label="Xóa"
                      >
                        &times;
                      </button>
                    )}

                    <p className="mb-1">
                      <strong>Lý do:</strong> {report.reason}
                    </p>
                    <p className="mb-1">
                      <strong>Mô tả:</strong> {report.description}
                    </p>
                    <div className="mb-1">
                      <strong>Tạo báo cáo lúc:</strong>{" "}
                      {Utils.getDate(report.createdAt, 4)}
                    </div>
                    <p className="mb-0">
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        className={`badge px-3 py-1 rounded-pill fw-medium ${
                          report.status?.toLowerCase() === "pending"
                            ? "bg-warning text-dark"
                            : report.status?.toLowerCase() === "approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {getStatusDisplayText(report.status)}
                      </span>
                    </p>

                    {(report.status === "REJECT" || report.status?.toLowerCase() === "rejected") &&
                      report.rejectReason?.trim() && (
                        <p className="text-danger mt-2 mb-0">
                          <strong>Lý do từ chối:</strong> {report.rejectReason}
                        </p>
                      )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
      {renderPagination()}

      {/* Confirmation modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={confirmDeleteFeedback}
        title="Xác Nhận Xóa"
        message="Bạn có chắc chắn muốn xóa báo cáo phản hồi này không?"
        confirmButtonText="Xác nhận"
        type="warning"
      />
    </Container>
  );
};

export default MyReportPage;