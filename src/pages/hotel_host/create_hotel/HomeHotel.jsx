import { Container, Row, Col, Navbar, Button, Card } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../../css/hotelHost/HomeHotel.css"
import { CheckCircle } from "react-bootstrap-icons"
import * as Routers from "../../../utils/Routes"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@redux/store"
import AuthActions from "@redux/auth/actions"

function HomeHotel() {
  const navigate = useNavigate()
  const Auth = useAppSelector((state) => state.Auth.Auth)
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (Auth._id != -1) {
      if(Auth.ownerHotel?.length() > 0) {
        navigate(Routers.DataAnalysisAI)
      }else{
        dispatch({ type: AuthActions.LOGOUT });
      }
    }
  }) 
  return (
    <div className="booking-app">
      <Navbar bg="primary" variant="dark" className="booking-navbar">
        <Container>
          <Navbar.Brand href="#home">
            <b style={{ fontSize: 30 }}>
              UR<span style={{ color: "#f8e71c" }}>OO</span>M
            </b>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <div className="language-selector me-3">
              <img
                src="https://t-cf.bstatic.com/design-assets/assets/v3.99.1/images-flags/Vn@3x.png"
                alt="Cờ Việt Nam"
                className="flag-icon"
              />
              <span className="text-white ms-2">Đã là đối tác?</span>
            </div>
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => {
                navigate(Routers.LoginHotelPage)
              }}
            >
              Đăng nhập
            </Button>
            <Button variant="light">Trợ giúp</Button>
          </div>
        </Container>
      </Navbar>

      <div className="hero-section1">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <div className="hero-content">
                <h1>
                  Đăng ký
                  <div className="highlight-text">căn hộ</div>
                  của bạn trên Uroom.com
                </h1>
                <p className="hero-description" style={{ fontSize: 20, fontWeight: 500 }}>
                  Cho dù việc cho thuê là đam mê phụ hay công việc toàn thời gian của bạn, hãy đăng ký nhà của bạn ngay
                  hôm nay và nhanh chóng bắt đầu kiếm thêm thu nhập.
                </p>
              </div>
            </Col>
            <Col md={5}>
              <Card className="registration-card">
                <Card.Body>
                  <h2 className="registration-title">Đăng ký miễn phí</h2>

                  <div className="benefit-item">
                    <div className="check-icon">✓</div>
                    <div className="benefit-text">45% chủ nhà nhận được đặt phòng đầu tiên trong vòng một tuần</div>
                  </div>

                  <div className="benefit-item">
                    <div className="check-icon">✓</div>
                    <div className="benefit-text">Lựa chọn giữa đặt phòng ngay lập tức và yêu cầu đặt phòng</div>
                  </div>

                  <div className="benefit-item">
                    <div className="check-icon">✓</div>
                    <div className="benefit-text">Chúng tôi sẽ hỗ trợ thanh toán cho bạn</div>
                  </div>

                  <Button
                    variant="primary"
                    className="start-button"
                    onClick={() => {
                      navigate(Routers.RegisterHotelPage)
                    }}
                  >
                    Bắt đầu ngay <span className="arrow">→</span>
                  </Button>

                  <div className="continue-section">
                    <p className="continue-text">Đã bắt đầu đăng ký?</p>
                    <a href="#" className="continue-link">
                      Tiếp tục đăng ký của bạn
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col xs={12} className="text-center">
            <h2 className="fw-bold fs-1 mb-5">Đăng ký với sự an tâm</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <Row className="g-4">
              {/* Cột trái */}
              <Col md={6}>
                {/* Lợi ích 1 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Thanh toán thiệt hại</h5>
                    <p className="mb-0">
                      {" "}
                      <a href="#" className="text-primary text-decoration-none">
                        Chương trình bảo vệ
                      </a>{" "}
                      của chúng tôi bảo vệ tài sản của bạn trong trường hợp bị hư hại.
                    </p>
                  </div>
                </div>

                {/* Lợi ích 2 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Quy tắc nhà riêng của bạn</h5>
                    <p className="mb-0">
                      Thông báo quy tắc nhà của bạn cho khách tiềm năng, họ phải đồng ý với các quy tắc này để đặt
                      phòng.
                    </p>
                  </div>
                </div>

                {/* Lợi ích 3 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Chọn cách bạn muốn nhận đặt phòng</h5>
                    <p className="mb-0">
                      Hoặc là cho phép khách đặt phòng ngay lập tức, hoặc{" "}
                      <a href="#" className="text-primary text-decoration-none">
                        xem xét yêu cầu đặt phòng
                      </a>{" "}
                      trước khi chấp nhận.
                    </p>
                  </div>
                </div>

                {/* Lợi ích 4 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Bảo vệ khỏi các khiếu nại trách nhiệm</h5>
                    <p className="mb-0">
                      Nhận{" "}
                      <a href="#" className="text-primary text-decoration-none">
                        bảo vệ chống lại các khiếu nại trách nhiệm
                      </a>{" "}
                      từ khách và hàng xóm lên đến €/£/$1,000,000 cho mỗi lần đặt phòng.
                    </p>
                  </div>
                </div>
              </Col>

              {/* Cột phải */}
              <Col md={6}>
                {/* Lợi ích 5 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Nhận thanh toán và bảo đảm tài chính của bạn</h5>
                    <p className="mb-0">
                      Nhận thanh toán được đảm bảo và bảo vệ khỏi gian lận thông qua{" "}
                      <a href="#" className="text-primary text-decoration-none">
                        Thanh toán bởi Booking.com
                      </a>
                      .
                    </p>
                  </div>
                </div>

                {/* Lợi ích 6 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Khách đã được xác minh</h5>
                    <p className="mb-0">
                      Chúng tôi xác minh địa chỉ email và thẻ tín dụng của khách cho đối tác trên Thanh toán bởi
                      Booking.com.
                    </p>
                  </div>
                </div>

                {/* Lợi ích 7 */}
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Hỗ trợ mạnh mẽ</h5>
                    <p className="mb-0">
                      Tiếp cận hỗ trợ bằng 45 ngôn ngữ và quản lý tài sản của bạn thông qua Pulse, ứng dụng của chúng
                      tôi dành cho đối tác như bạn.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={12} md={6} lg={4}>
                <Button
                  variant="primary"
                  className="px-4 py-2 fw-bold"
                  onClick={() => {
                    navigate(Routers.LoginHotelPage)
                  }}
                >
                  Đăng ký với sự an tâm ngay hôm nay
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default HomeHotel

