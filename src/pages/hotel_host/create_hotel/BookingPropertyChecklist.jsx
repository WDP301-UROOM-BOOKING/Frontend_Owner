import React from "react";
import {
  Navbar,
  Container,
  Button,
  Row,
  Col,
  Card,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import HotelActions from "@redux/hotel/actions";
import RoomActions from "@redux/room/actions";
import { useAppSelector } from "@redux/store";
import ConfirmationModal from "@components/ConfirmationModal";
import Utils from "@utils/Utils";
import Room from "@pages/room/Room";
import { showToast, ToastProvider } from "@components/ToastContainer";

function BookingPropertyChecklist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  const [showServiceModal, setShowServiceModal] = React.useState(false);
  const [showRoomModal, setShowRoomModal] = React.useState(false);
  const [editingService, setEditingService] = React.useState(null);
  const [editingRoom, setEditingRoom] = React.useState(null);
  const [currentService, setCurrentService] = React.useState({
    name: "",
    description: "",
    price: "",
    type: "person",
  });
  const [currentRoom, setCurrentRoom] = React.useState({
    name: "",
    type: "Single Room",
    capacity: 1,
    quantity: 1,
    description: "",
    price: "",
    bed: [],
    facilities: [],
  });

  const createHotel = useAppSelector((state) => state.Hotel.createHotel);
  const createService = useAppSelector((state) => state.Hotel.createService);
  const createRoomList = useAppSelector((state) => state.Room.createRoomList);
  const createRoom = useAppSelector((state) => state.Room.createRoom);
  console.log("createRoom", createRoom);
  console.log("createHotel", createHotel);
  console.log("createService", createService);
  console.log("createRoomList", createRoomList);
  const serviceTypes = [
    { value: "person", label: "Theo người" },
    { value: "service", label: "Theo dịch vụ" },
    { value: "room", label: "Theo phòng" },
    { value: "day", label: "Theo ngày" },
    { value: "night", label: "Theo đêm" },
    { value: "month", label: "Theo tháng" },
    { value: "year", label: "Theo năm" },
  ];

  const roomTypes = [
    "Single Room",
    "Double Room", 
    "Family Room",
    "Suite",
    "VIP Room",
    "Deluxe Room",
  ];

  const handleEditService = (service, index) => {
    setEditingService(index);
    setCurrentService({
      ...service,
      price: service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    });
    setShowServiceModal(true);
  };
  
  const handleCreateService = () => {
    setEditingService(null);
    navigate(Routers.CreateService);
  };

  // Add missing service management functions
  const handleDeleteService = (index) => {
    dispatch({
      type: HotelActions.DELETE_SERVICE_CREATE,
      payload: { index },
    });

  };

  const handleInputChange = (field, value) => {
    setCurrentService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (price) => {
    if (!price) return "";
    // Remove all non-digit characters
    const numericValue = price.toString().replace(/\D/g, "");
    // Format with dots as thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Remove all non-digit characters for internal storage
    const numericValue = value.replace(/\D/g, "");
    setCurrentService(prev => ({
      ...prev,
      price: numericValue
    }));
  };

  const handleSaveService = () => {
    // Validate required fields
    if (!currentService.name || !currentService.description || !currentService.price) {
      return;
    }

    const serviceData = {
      ...currentService,
      price: parseInt(currentService.price.replace(/\D/g, "")) || 0
    };

    if (editingService !== null) {
      // Update existing service
      dispatch({
        type: HotelActions.EDIT_SERVICE_CREATE,
        payload: {
          index: editingService,
          serviceData,
        },
      });
    } else {
      // Add new service
      dispatch({
        type: HotelActions.SAVE_SERVICE_TO_CREATE_LIST,
        payload: serviceData,
      });
    }
    
    setShowServiceModal(false);
    setEditingService(null);
    setCurrentService({
      name: "",
      description: "",
      price: "",
      type: "person",
    });
  };

  // Room management handlers
  const handleEditRoom = (room, index) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const handleCreateRoom = () => {
    navigate(Routers.CreateRoom);
  };

  const handleSaveRoom = (roomData) => {
    if (editingRoom) {
      // Update existing room
      const roomIndex = createRoomList.findIndex(room => room === editingRoom);
      dispatch({
        type: RoomActions.EDIT_ROOM_IN_CREATE_LIST,
        payload: {
          index: roomIndex,
          roomData,
        },
      });
    } else {
      // Add new room
      dispatch({
        type: RoomActions.SAVE_ROOM_TO_CREATE_LIST,
        payload: roomData,
      });
    }
    setShowRoomModal(false);
  };

  const handleDeleteRoom = (index) => {
    dispatch({
      type: RoomActions.DELETE_ROOM_FROM_CREATE_LIST,
      payload: { index },
    });
    showToast.success("Bạn đã xóa phòng thành công!");
  };

  const handleComfirm = () => {
    dispatch({
      type: HotelActions.CREATE_HOTEL,
      payload: {
        createHotel: createHotel,
        createRoomList: createRoomList,
        createService: createService,
        onSuccess: () => {
          setShowModal(false);
        },
      },
    });
    dispatch({ type: HotelActions.CLEAR_HOTEL_CREATE });
    dispatch({ type: HotelActions.CLEAR_SERVICE_CREATE });
    dispatch({ type: RoomActions.CLEAR_ROOM_CREATE_LIST });
    navigate(Routers.WaitPendingPage);
  };

  return (
    <div style={styles.bookingApp}>
      {/* Navigation Bar */}
      <Navbar style={styles.navbarCustom}>
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold">
            <b style={{ fontSize: 30 }}>
              UR<span style={{ color: "#f8e71c" }}>OO</span>M
            </b>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container style={styles.mainContent}>
        {/* Step 1 - Completed */}
        <div style={styles.checklistItem}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <div style={styles.completedIcon}>✓</div>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 1</div>
              <div style={styles.stepTitle}>Thông tin chỗ nghỉ</div>
              <div style={styles.stepDescription}>
                Các thông tin cơ bản: Nhập tên chỗ nghỉ, địa chỉ, tiện nghi và
                nhiều hơn nữa.
              </div>
            </Col>
            <Col xs="auto">
              <a
                onClick={() => {
                  dispatch({
                    type: HotelActions.EDIT_HOTEL_DESCRIPTION_CREATE,
                    payload: {
                      checkCreateHotel: false,
                    },
                  });
                  navigate(Routers.BookingRegistration);
                }}
                style={styles.editLink}
              >
                Chỉnh sửa
              </a>
            </Col>
          </Row>
        </div>
        {/* Step 2 */}
        {/* <div style={styles.checklistItemLast}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <span
                  role="img"
                  aria-label="document"
                  style={{ fontSize: "24px" }}
                >
                  📄
                </span>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 2</div>
              <div style={styles.stepTitle}>Giấy tờ kinh doanh</div>
              <div style={styles.stepDescription}>
                Nhập thông tin thanh toán và hóa đơn trước khi mở để nhận đặt
                phòng.
                <br />
                <span style={{ fontStyle: "italic", color: "#888" }}>
                  * Có thể thêm sau đó
                </span>
              </div>
            </Col>
            <Col xs="auto">
              <Button
                style={styles.secondaryButton}
                onClick={() => {
                  navigate(Routers.DocumentUpload);
                }}
              >
                Thêm các thông tin cuối cùng
              </Button>
            </Col>
          </Row>
        </div> */}
        {/* Step 3 */}
        <div style={styles.checklistItem}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <span role="img" aria-label="room" style={{ fontSize: "24px" }}>
                  🛏️
                </span>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 2</div>
              <div style={styles.stepTitle}>Phòng</div>
              <div style={styles.stepDescription}>
                Hãy cho chúng tôi biết về phòng đầu tiên của Quý vị. Sau khi đã
                thiết lập xong một căn, Quý vị có thể thêm nhiều căn nữa.
                <br />
                <span style={{ fontStyle: "italic", color: "#888" }}>
                  * Có thể thêm sau đó
                </span>
              </div>
              <ToastProvider/>
              {/* Room List */}
              {createRoomList.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <h6>Danh sách phòng đã tạo:</h6>
                  <Row>
                    {createRoomList.map((room, index) => (
                      <Col md={12} key={index} className="mb-2">
                        <Card style={styles.serviceCard}>
                          <Card.Body style={{ padding: "10px" }}>
                            <div style={styles.serviceHeader}>
                              <h6 style={{ margin: 0, fontWeight: "bold" }}>
                                {room.name} - {room.type}
                              </h6>
                              <Badge bg="success">
                                {Utils.formatCurrency(room.price)}/đêm
                              </Badge>
                            </div>
                            <Row className="mb-2">
                              <Col md={6}>
                                <small><b>Sức chứa:</b> {room.capacity} người</small>
                              </Col>
                              <Col md={6}>
                                <small><b>Số lượng:</b> {room.quantity} phòng</small>
                              </Col>
                            </Row>
                            <p>
                              <b>Mô tả: </b>
                              {room.description.length > 100 
                                ? `${room.description.substring(0, 100)}...` 
                                : room.description}
                            </p>
                            {room.facilities && room.facilities.length > 0 && (
                              <div className="mb-2">
                                <small><b>Tiện nghi:</b> {room.facilities.slice(0, 3).join(", ")}
                                  {room.facilities.length > 3 && ` và ${room.facilities.length - 3} tiện nghi khác`}
                                </small>
                              </div>
                            )}
                            <div style={styles.serviceActions}>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleEditRoom(room, index)}
                                style={{ marginRight: "5px" }}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteRoom(index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Col>
            <Col xs="auto">
              <Button
                style={styles.actionButton}
                onClick={handleCreateRoom}
              >
                + Thêm phòng
              </Button>
            </Col>
          </Row>
        </div>

        {/* Step 4 */}
        <div style={styles.checklistItem}>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={styles.stepIcon}>
                <span
                  role="img"
                  aria-label="service"
                  style={{ fontSize: "24px" }}
                >
                  <i class="bi bi-people"></i>
                </span>
              </div>
            </Col>
            <Col>
              <div style={styles.stepNumber}>Bước 3</div>
              <div style={styles.stepTitle}>Dịch vụ đi kèm</div>
              <div style={styles.stepDescription}>
                Những dịch vụ đi kèm với phòng của quý vị. Sau khi đã thiết lập
                xong tối thiểu 1 phòng.
                <br />
                <span style={{ fontStyle: "italic", color: "#888" }}>
                  * Có thể thêm sau đó
                </span>
              </div>

              {/* Service List */}
              {createService.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <h6>Danh sách dịch vụ đã tạo:</h6>
                  <Row>
                    {createService.map((service, index) => (
                      <Col md={12} key={index} className="mb-2">
                        <Card style={styles.serviceCard}>
                          <Card.Body style={{ padding: "10px" }}>
                            <div style={styles.serviceHeader}>
                              <h6 style={{ margin: 0, fontWeight: "bold" }}>
                                Tên dịch vụ: {service.name}
                              </h6>
                              <Badge bg="primary">
                                {Utils.formatCurrency(service.price)}/
                                {service.type}
                              </Badge>
                            </div>
                            <p>
                              <b>Mô tả: </b>
                              {service.description}
                            </p>
                            <div style={styles.serviceActions}>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() =>
                                  handleEditService(service, index)
                                }
                                style={{ marginRight: "5px" }}
                              >
                                Sửa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteService(index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Col>
            <Col xs="auto">
              <Button style={styles.actionButton} onClick={handleCreateService}>
                + Thêm dịch vụ
              </Button>
            </Col>
          </Row>
        </div>

        {/* Confirmation Button */}
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <Button
            style={styles.confirmButton}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Xác nhận hoàn tất
          </Button>
        </div>
        <ConfirmationModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onConfirm={handleComfirm}
          title="Xác nhận tạo chỗ nghỉ"
          message="Bạn có chắc chắn muốn tạo chỗ nghỉ này không? Hành động này sẽ không thể hoàn tác."
          confirmButtonText="Tạo chỗ nghỉ"
          type="warning"
        />

        {/* Service Modal */}
        <Modal
          show={showServiceModal}
          onHide={() => setShowServiceModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingService !== null
                ? "Chỉnh sửa dịch vụ"
                : "Thêm dịch vụ mới"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên dịch vụ *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Bữa sáng, Buffet tối, Spa..."
                  value={currentService.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả dịch vụ *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả chi tiết về dịch vụ..."
                  value={currentService.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá dịch vụ ($) *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập giá dịch vụ"
                      value={formatPrice(currentService.price)}
                      onChange={handlePriceChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Loại tính phí *</Form.Label>
                    <Form.Select
                      value={currentService.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                    >
                      {serviceTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowServiceModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveService}
              disabled={
                !currentService.name ||
                !currentService.description ||
                !currentService.price
              }
            >
              {editingService !== null ? "Lưu thay đổi" : "Thêm dịch vụ"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Room Modal */}
        <Room 
          show={showRoomModal}
          handleClose={() => setShowRoomModal(false)}
          onSave={handleSaveRoom}
          editingRoom={editingRoom}
        />
      </Container>
    </div>
  );
}

// Define styles as a constant object
const styles = {
  // Main container styles
  bookingApp: {
    minHeight: "100vh",
  },

  // Navbar styles
  navbarCustom: {
    backgroundColor: "#003580",
    padding: "10px 0",
  },
  navbarBrand: {
    color: "#fff",
    fontWeight: "bold",
  },
  userInfo: {
    color: "#fff",
    textAlign: "right",
    marginRight: "15px",
  },
  userName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  userAddress: {
    fontSize: "12px",
  },
  languageSelector: {
    marginRight: "15px",
  },
  helpButton: {
    color: "#fff",
    textDecoration: "none",
  },
  helpIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    backgroundColor: "#fff",
    color: "#003580",
    borderRadius: "50%",
    fontWeight: "bold",
  },
  userIconCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    marginLeft: "10px",
  },

  // Main content styles
  mainContent: {
    maxWidth: "800px",
    margin: "30px auto",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  },

  // Checklist item styles
  checklistItem: {
    padding: "20px",
    borderBottom: "1px solid #e7e7e7",
  },
  checklistItemLast: {
    padding: "20px",
    borderBottom: "none",
  },
  stepNumber: {
    fontSize: "14px",
    color: "#6b6b6b",
    marginBottom: "5px",
  },
  stepTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  stepDescription: {
    fontSize: "14px",
    color: "#6b6b6b",
  },
  stepIcon: {
    width: "40px",
    height: "40px",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  completedIcon: {
    color: "#fff",
    backgroundColor: "#008009",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editLink: {
    color: "#0071c2",
    textDecoration: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  actionButton: {
    backgroundColor: "#0071c2",
    border: "none",
    padding: "8px 15px",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #e7e7e7",
    color: "#333",
    padding: "8px 15px",
  },
  serviceCard: {
    border: "1px solid #e7e7e7",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  serviceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
  },
  serviceActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
  },
  confirmButton: {
    backgroundColor: "#0071c2",
    border: "none",
    padding: "10px 20px",
    fontWeight: "bold",
    color: "white",
  },
};

export default BookingPropertyChecklist;
