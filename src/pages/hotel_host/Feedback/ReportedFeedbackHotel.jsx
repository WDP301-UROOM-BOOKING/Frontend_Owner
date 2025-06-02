import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Card, Container, Form, Modal } from "react-bootstrap";
import { Image } from "react-bootstrap";
import { AlertTriangle, CheckCircle, CircleAlertIcon } from "lucide-react";
import { Star, StarFill } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import ReportFeedbackActions from "@redux/reportedFeedback/actions";
import FeedbackActions from "../../../redux/feedback/actions";
import { showToast } from "@components/ToastContainer";
import { Spinner } from "react-bootstrap";
const ReportedFeedbackHotel = ({ show, onHide, feedback }) => {
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const onSuccess = () => {
    setShowModal("success");
    setValidated(false);

    // Reset form
    setFormData({
      reason: "",
      description: "",
    });
  };

  const onFailed = (data) => {
    setShowModal("failed");
    setError(data);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      dispatch({
        type: ReportFeedbackActions.REPORT_FEEDBACK,
        payload: { ...formData, feedbackId: feedback._id, onSuccess, onFailed },
      });
    } catch {
      showToast("Có vấn đề khi report");
    }
  };

  const renderStars = (count, total = 5) => {
    return [...Array(total)].map((_, i) =>
      i < count ? (
        <StarFill key={i} className="text-warning" />
      ) : (
        <Star key={i} className="text-warning" />
      )
    );
  };

  return (
    <>
      {/* Modal chính */}
      <Modal show={show} onHide={onHide} size="xl">
        <div className="p-3">
          <h2 className="fw-bold text-secondary mb-4">
            Report Inappropriate Feedback
          </h2>
          <Card.Body>
            <p className="text-muted mb-4">
              Use this form to report feedback that contains incorrect
              information, fraud, threats, or other inappropriate content.
            </p>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Feedback <span className="text-danger">*</span>
                </Form.Label>
                {loading ? (
                  <Spinner animation="border" />
                ) : feedback ? (
                  <Card className="border-0">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <Image
                          src={
                            feedback?.user?.image?.url ||
                            "https://via.placeholder.com/50"
                          }
                          roundedCircle
                          style={{
                            width: "50px",
                            height: "50px",
                            marginRight: "10px",
                          }}
                        />

                        <div>
                          <h6 className="mb-0">
                            {feedback?.user?.name || "Ẩn danh"}
                          </h6>
                          <div>
                            {renderStars(feedback?.rating || 0)}
                            <small className="text-muted ms-2">
                              {new Date(
                                feedback?.createdAt
                              ).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </div>
                      <p>
                        {feedback?.content || "Không có nội dung phản hồi."}
                      </p>
                      <div>
                        <b className="text-primary p-0 me-3">
                          {feedback?.likedBy?.length || 0} lượt thích
                        </b>
                        <b className="text-danger p-0">
                          {feedback?.dislikedBy?.length || 0} lượt không thích
                        </b>
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  <p>Không tìm thấy feedback.</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Loại báo cáo <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn lý do báo cáo</option>
                  <option value="Incorrect Information">Thông tin không chính xác</option>
                  <option value="Fraudulent Content">Nội dung gian lận</option>
                  <option value="Threatening or Harassing">Đe dọa hoặc quấy rối</option>
                  <option value="Inappropriate Content">Nội dung không phù hợp</option>
                  <option value="Spam">Thư rác</option>
                  <option value="Other">Khác</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Vui lòng chọn loại báo cáo.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Mổ tả <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Vui lòng cung cấp thông tin chi tiết về vấn đề này.
                </Form.Control.Feedback>
              </Form.Group>

              <Alert variant="warning" className="d-flex align-items-center">
                <AlertTriangle className="me-2" />
                <div>
                  Báo cáo sai có thể dẫn đến hạn chế tài khoản. Vui lòng đảm bảo
                  báo cáo của bạn là chính xác.
                </div>
              </Alert>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <Button
                  variant="outline-danger"
                  className="me-md-2"
                  style={{ width: "140px" }}
                  onClick={onHide}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "140px" }}
                >
                 Lưu
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </Modal>

      {/* Modal cảm ơn */}
      <Modal show={showModal} onHide={() => setShowModal()}>
        <Container className="py-5">
          <Card.Body className="text-center p-5">
            {showModal !== "success" ? (
              <CircleAlertIcon className="mb-3" size={50} />
            ) : (
              <CheckCircle className="text-success mb-3" size={50} />
            )}
            <h2>
              Report Submitted{" "}
              {showModal === "success" ? "Successfully" : "Failed"}
            </h2>
            <p className="mb-4">
              {showModal === "success"
                ? "Thank you for your report. Our team will review it and take appropriate action."
                : error}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setShowModal();
                onHide();
              }}
            >
              Đóng
            </Button>
          </Card.Body>
        </Container>
      </Modal>
    </>
  );
};

export default ReportedFeedbackHotel;
