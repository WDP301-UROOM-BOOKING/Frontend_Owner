
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  ProgressBar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Star, StarFill, ExclamationTriangleFill } from "react-bootstrap-icons";
import "../../../css/hotelHost/ListFeedbackHotelPage.css";
import ReportedFeedbackHotel from "./ReportedFeedbackHotel";
import FeedbackActions from "../../../redux/feedback/actions";
import HotelActions from "@redux/hotel/actions";
import CustomPagination from "@components/CustomPagination";

const ListFeedbackHotelPage = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector((state) => state.Feedback);
  console.log("feedbacks: ", feedbacks);
  const auth = useSelector((state) => state.Auth.Auth);
  const hotel = useSelector((state) => state.Hotel.hotel);
  
  const [showModal, setShowModal] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedStar, setSelectedStar] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState({});

  const ratingLabels = ["Cơ bản", "Tiêu Chuẩn", "Khá Tốt", "Tốt", "Rất Tốt"];
  const feedbackStats = [
    feedbacks.ratingBreakdown.oneStar || 0,
    feedbacks.ratingBreakdown.twoStar || 0,
    feedbacks.ratingBreakdown.threeStar || 0,
    feedbacks.ratingBreakdown.fourStar || 0,
    feedbacks.ratingBreakdown.fiveStar || 0,
  ];

  const filteredFeedbacks = useMemo(() => {
    if (!Array.isArray(feedbacks.feedbacks)) return [];
    return feedbacks.feedbacks;
  }, [feedbacks.feedbacks]);

  useEffect(() => {
    if (auth) {
      dispatch({
        type: HotelActions.FETCH_OWNER_HOTEL,
        payload: { id: auth._id },
      });
    }
  }, [auth, dispatch]);

  useEffect(() => {
    console.log("Hotel: ", hotel);
    if (!hotel) return;

    const query = {
      page: activePage,
      ...(selectedStar > 0 && { star: selectedStar }),
    };

    dispatch({
      type: FeedbackActions.FETCH_FEEDBACK_BY_HOTELID,
      payload: { hotelId: hotel._id, query },
    });
  }, [activePage, selectedStar, dispatch, hotel]);

  const renderStars = useCallback((count, total = 5) => {
    return Array.from({ length: total }).map((_, i) =>
      i < count ? (
        <StarFill key={i} className="text-warning" />
      ) : (
        <Star key={i} className="text-warning" />
      )
    );
  }, []);

  const total = feedbacks?.total || 0;
  const limit = feedbacks?.limit || 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="main-content_1 p-3">
      <h2 className="fw-bold my-4">
        Những review khách của du khách về {hotel?.hotelName}
      </h2>

      <p className="text-muted mb-4">
        Xếp hạng và đánh giá tổng thể {hotel?.hotelName}
      </p>

      <Row className="mb-4 justify-content-center align-items-center">
        <Col md={3} />
        <Col md={3} style={{ justifyContent: "center", alignItems: "center" }}>
          <Row>
            <Col xs="auto">
              <Card
                style={{
                  background:
                    "linear-gradient(to bottom right, #e6f3ff, #ffffff)",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 0 8px rgba(0, 123, 255, 0.15)",
                  border: "6px solid rgba(0, 123, 255, 0.15)",
                }}
              >
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <span
                    style={{
                      fontSize: "60px",
                      fontWeight: 600,
                      color: "#0099ff",
                    }}
                  >
                    {Number(feedbacks?.averageRating).toFixed(1)}
                  </span>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <h2
                style={{
                  color: "#007bff",
                  fontWeight: "700",
                  marginBottom: "0",
                  fontSize: "30px",
                }}
              >
                {feedbacks?.averageRating === 5
                  ? "Rất tốt"
                  : feedbacks?.averageRating > 4
                  ? "Tốt"
                  : feedbacks?.averageRating > 3
                  ? "Khá tốt"
                  : feedbacks?.averageRating > 2
                  ? "Tiêu chuẩn"
                  : feedbacks?.averageRating > 1
                  ? "Cơ bản"
                  : feedbacks?.averageRating == 0
                  ? "Không đánh giá"
                  : ""}
              </h2>

              <p
                style={{
                  marginBottom: "4px",
                  fontWeight: "500",
                  fontSize: "24px",
                  color: "#000",
                }}
              >
                Từ {feedbacks?.totalFeedback} đánh giá
              </p>

              <div
                style={{
                  fontSize: "18px",
                  color: "gray",
                }}
              >
                By domestic travelers in{" "}
                <span style={{ fontWeight: "600", color: "#6c757d" }}>
                  uroom
                </span>
                <sup>®</sup>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          {ratingLabels.map((label, idx) => (
            <div key={idx} className="rating-item">
              <div className="d-flex justify-content-between mb-1">
                <span>
                  {label} ({idx + 1} star)
                </span>
                <span>{feedbackStats[idx]}</span>
              </div>
              <ProgressBar
                style={{ height: "20px" }}
                now={
                  feedbacks &&
                  (feedbackStats[idx] / feedbacks?.totalFeedback) * 100
                }
              />
            </div>
          ))}
        </Col>
        <Col md={2} />
      </Row>

      <h2 className="fw-bold mb-4">Đánh giá của du khách</h2>

      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <span className="me-2">Filter:</span>
        </Col>
        <Col xs="auto">
          <Form.Select
            style={{ width: "120px" }}
            value={selectedStar}
            onChange={(e) => {
              setSelectedStar(Number(e.target.value));
              setActivePage(1);
            }}
          >
            <option value={0}>All star</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} star{star > 1 ? "s" : ""}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {filteredFeedbacks.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-4"
            style={{
              width: 140,
              height: 140,
              transition: "transform 0.3s",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/empty-state.svg"
              alt="No data"
              style={{ width: 80, height: 80, opacity: 0.75 }}
            />
          </div>
          <h5 className="text-muted fw-semibold">No Reviews Yet</h5>
          <p className="text-secondary mb-0" style={{ maxWidth: 300 }}>
            This hotel hasn’t received any reviews yet. Be the first to share
            your experience!
          </p>
        </div>
      ) : (
        filteredFeedbacks.map((review) => (
          <Card key={review._id} className="mb-3 border-0 shadow-sm">
            <Card.Body className="p-0 m-4">
              <Row className="g-0 justify-content-between">
                <Col md={12}>
                  <Button
                    variant="link"
                    className="text-dark p-0"
                    style={{ position: "absolute", top: 15, right: 15 }}
                    onClick={() => {
                      setSelectedFeedback(review);
                      setShowModal(true);
                    }}
                  >
                    <ExclamationTriangleFill size={20} color="red" />
                  </Button>

                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      <Image
                        src={
                          review.user?.image?.url ||
                          "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg" ||
                          "/placeholder.svg"
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
                          {review?.user?.name || "Ẩn danh"}
                        </h6>
                        <div>
                          {renderStars(review.rating)}
                          <small className="text-muted ms-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p>{review.content}</p>

                  <div>
                    <b className="text-primary p-0 me-3">
                      {review.likedBy?.length || 0} lượt thích
                    </b>
                    <b className="text-danger p-0">
                      {review.dislikedBy?.length || 0} lượt không thích
                    </b>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      <div className="d-flex justify-content-center mt-4">
        <CustomPagination
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={setActivePage}
        />
      </div>

      <ReportedFeedbackHotel
        show={showModal}
        onHide={() => setShowModal(false)}
        feedback={selectedFeedback}
      />
    </div>
  );
};

export default ListFeedbackHotelPage;
