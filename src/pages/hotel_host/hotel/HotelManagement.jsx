import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Image,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Clock,
  GeoAlt,
  Wifi,
  Tv,
  Droplet,
  Wind,
  Cup,
  Building,
  PersonCheck,
  ShieldCheck,
  Star,
  StarFill,
} from "react-bootstrap-icons";
import Hotel from "./Hotel";

import { useAppSelector } from "../../../redux/store";
import { useDispatch } from "react-redux";
import HotelActions from "../../../redux/hotel/actions";
import { showToast } from "@components/ToastContainer";
import "../../../css/hotelHost/HotelManagement.css";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import ConfirmationModal from "@components/ConfirmationModal";
import Factories from "@redux/hotel/factories";

function HotelManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const [formData, setFormData] = useState(Auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hotelinfo, setHotelinfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [showModalChangeStatus, setShowModalChangeStatus] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggle = async () => {
    try {
      const response = await Factories.changeStatusHotel(
        hotelinfo[0]._id,
        isActive
      );
      if (response?.status === 200) {
        console.log("1");
        setIsActive(!isActive);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchHotelInfo();
  }, []);

  const renderIcon = (iconName) => {
    const iconLibraries = {
      ...FaIcons,
      ...MdIcons,
      ...GiIcons,
    };

    const IconComponent = iconLibraries[iconName];
    return IconComponent ? (
      <IconComponent style={{ fontSize: "20px", color: "#1a2b49" }} />
    ) : null;
  };
  const fetchHotelInfo = () => {
    setLoading(true);
    dispatch({
      type: HotelActions.FETCH_OWNER_HOTEL,
      payload: {
        userId: formData._id,
        onSuccess: (data) => {
          setHotelinfo(data.hotels);
          setIsActive(data.hotels[0].ownerStatus === "ACTIVE" ? true : false);
          console.log("acsahjsikxx", data.hotels);
          setLoading(false);
        },

        onFailed: () => {
          showToast.error("Lấy thông tin khách sạn thất bại");
          setLoading(false);
        },
        onError: (err) => {
          console.error(err);
          showToast.error("Lỗi máy chủ khi lấy thông tin khách sạn");
          setLoading(false);
        },
      },
    });
  };

  const renderStars = (count = 0, total = 5) =>
    [...Array(total)].map((_, i) =>
      i < count ? (
        <StarFill key={i} className="text-warning" />
      ) : (
        <Star key={i} className="text-warning" />
      )
    );

  if (loading || !hotelinfo) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  console.log("infor: ", hotelinfo);

  return (
    <div className="main-content_1 p-3">
      <div style={styles.header}>
        {/* <h1>{hotelinfo[0]._id}</h1> */}
        <h1 style={styles.title}>Thông tin khách sạn</h1>

        <Button
          style={styles.addButton}
          onClick={() => {
            setSelectedHotelId(hotelinfo[0]._id);
            setShowModal(true);
          }}
        >
          + Chỉnh sửa khách sạn
        </Button>
      </div>
      <ConfirmationModal
        show={showModalChangeStatus}
        onHide={() => setShowModalChangeStatus(false)}
        onConfirm={handleToggle}
        title={
          isActive ? "Tạm ngừng nhận đặt phòng" : "Cho phép nhận đặt phòng"
        }
        message={
          isActive
            ? "Nếu bạn ngừng nhận đặt phòng, thì khách sạn sẽ không được hiện trên web, nhưng các phòng đã đặt sẽ vẫn tiếp tục diễn ra"
            : "Nếu bạn mở nhận đặt phòng, thì khách sạn sẽ được hiện trên web và có thể đặt được phòng từ lúc mở nhận đặt phòng"
        }
        confirmButtonText="Xác nhận"
        cancelButtonText="Hủy bỏ"
        type={isActive ? "danger" : "warning"}
      />
      <Card className="border-0 shadow">
        <Card.Body className="p-4">
          <div className="hotel-header mb-4">
            <div className="d-flex" style={{ alignItems: "center" }}>
              <h1 className="hotel-name">{hotelinfo[0]?.hotelName}</h1>
              <Form>
                <Form.Check
                  title="Trạng thái khách sạn"
                  type="switch"
                  id="custom-switch"
                  checked={isActive}
                  onChange={() => {
                    setShowModalChangeStatus(true);
                  }}
                  style={{
                    transform: "scale(2)",
                    marginLeft: "50px",
                  }}
                />
              </Form>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="stars me-2">{renderStars(hotelinfo[0].star)}</div>
              <Badge bg="warning" text="dark" className="star-badge">
                {hotelinfo.stars} sao
              </Badge>
            </div>
          </div>

          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className="main-image-container mb-3">
                <Image
                  src={
                    hotelinfo[0].images?.[selectedImage] || "/placeholder.svg"
                  }
                  alt="Ảnh khách sạn chính"
                  fluid
                  rounded
                  style={{
                    width: "100%",
                    maxHeight: "60vh", // thay vì số cứng, dùng % chiều cao màn hình
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </div>

              <div style={styles.imageThumbnails}>
                {hotelinfo[0].images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Ảnh ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      ...styles.thumbnail,
                      ...(selectedImage === index
                        ? styles.thumbnailActive
                        : {}),
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                ))}
              </div>
            </Col>

            <Col xs={12} sm={12} md={6} lg={6}>
              <Card className="info-card">
                <Card.Body>
                  <div className="info-section">
                    <h4 className="info-title">
                      <GeoAlt className="me-2" />
                      Địa chỉ
                    </h4>
                    <p className="mb-1">{hotelinfo[0].address}</p>
                  </div>

                  <div className="info-section">
                    <h4 className="info-title">
                      <Clock className="me-2" />
                      Giờ nhận phòng
                    </h4>
                    <div className="time-badge check-in">
                      Từ {hotelinfo[0].checkInStart} đến{" "}
                      {hotelinfo[0].checkInEnd}
                    </div>
                  </div>

                  <div className="info-section">
                    <h4 className="info-title">
                      <Clock className="me-2" />
                      Giờ trả phòng
                    </h4>
                    <div className="time-badge check-out">
                      Từ {hotelinfo[0].checkOutStart} đến{" "}
                      {hotelinfo[0].checkOutEnd}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              <div className="hotel-description mb-4 mt-3">
                <h2 className="section-title mb-3" style={{ fontSize: "20px" }}>
                  Mô tả về khách sạn
                </h2>
                {hotelinfo[0].description ? (
                  hotelinfo[0].description
                    .split("\n")
                    .map((para, index) => <p key={index}>{para}</p>)
                ) : (
                  <p>No description.</p>
                )}
              </div>
              <div className="hotel-description mb-4">
                <h2 className="section-title mb-3" style={{ fontSize: "20px" }}>
                  Liên lạc của khách sạn
                </h2>
                <p>Số điện thoại: {hotelinfo[0].phoneNumber ?? "No have"}</p>
                <p>Gmail: {hotelinfo[0].email ?? "No have"}</p>
              </div>
              <div className="hotel-amenities mb-4 mt-3">
                <h2 className="section-title mb-3" style={{ fontSize: "20px" }}>
                  Tiện nghi khách sạn
                </h2>
                <Row>
                  {hotelinfo[0].facilities?.map((facility, index) => (
                    <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                      <div className="amenity-item d-flex align-items-center gap-2">
                        {renderIcon(facility.icon)}
                        <span style={{ marginLeft: "5px" }}>
                          {facility.name}
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Hotel
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedHotelId={selectedHotelId}
      />
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  imageThumbnails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "flex-start",
  },
  thumbnail: {
    width: "calc(20% - 10px)", // 5 hình/1 hàng
    aspectRatio: "1 / 1", // giữ tỷ lệ vuông
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  thumbnailActive: {
    border: "2px solid #007bff",
  },
};

export default HotelManagement;
