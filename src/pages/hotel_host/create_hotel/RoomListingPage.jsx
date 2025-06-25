import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Room from "@pages/room/Room";
import Utils from "@utils/Utils";
import Factories from "@redux/room/factories";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import { useAppSelector } from "@redux/store";
import ConfirmationModal from "@components/ConfirmationModal";
import { showToast, ToastProvider } from "@components/ToastContainer";

function RoomListingPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hotelDetail = useAppSelector((state) => state.Hotel.hotel) ?? [];
  const [showModalChangeStatus, setShowModalChangeStatus] = useState(false);
  useEffect(() => {
    fetchRooms();
  }, [hotelDetail._id]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Factories.fetchRoomByHotelId(hotelDetail._id);
      console.log("Fetched rooms:", response?.rooms);
      setRooms(Array.isArray(response?.rooms) ? response.rooms : []);
    } catch (error) {
      setError("Không thể tải danh sách phòng. Vui lòng thử lại.");
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const room = rooms.find((r) => r._id === id);
    if (!room) return;

    const newStatus = room.statusActive === "ACTIVE" ? "NONACTIVE" : "ACTIVE";

    try {
      // Call API to change status
      const response = await Factories.changeRoomStatus(id, newStatus);

      if (response && !response.error) {
        // Update local state with new status
        setRooms((prevRooms) =>
          prevRooms.map((r) =>
            r._id === id ? { ...r, statusActive: newStatus } : r
          )
        );
        showToast.success("Thay đổi trạng thái phòng thành công!");
      } else {
        throw new Error(response?.message || "Failed to change status");
      }
    } catch (error) {
      showToast.error("Không thể thay đổi trạng thái phòng. Vui lòng thử lại.");
      console.error("Error changing room status:", error);
      setError("Không thể thay đổi trạng thái phòng. Vui lòng thử lại.");
    }
  };

  const handleAdd = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleSave = async (roomData) => {
    try {
      let response;

      // Upload images first if there are new files
      if (roomData.imageFiles && roomData.imageFiles.length > 0) {
        const uploadResponse = await Factories.uploadRoomImages(
          roomData.imageFiles
        );
        if (uploadResponse && !uploadResponse.error) {
          // Add uploaded image URLs to roomData
          roomData.images = [
            ...(roomData.images || []),
            ...uploadResponse.data.images.map((img) => img.url),
          ];
        }
        // Remove imageFiles from roomData before sending to create/update API
        delete roomData.imageFiles;
      }

      if (editingRoom) {
        // Update existing room
        response = await Factories.updateRoom(editingRoom._id, roomData);
        if (response && !response.error) {
          // Update room in local state
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room._id === editingRoom._id ? response.room : room
            )
          );
        }
      } else {
        // Create new room
        response = await Factories.createRoom(roomData);
        if (response && !response.error) {
          // Add new room to local state
          setRooms((prevRooms) => [...prevRooms, response.room]);
        }
      }

      setShowModal(false);
      setEditingRoom(null);

      // Refresh rooms list to ensure data consistency
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      setError("Không thể lưu thông tin phòng. Vui lòng thử lại.");
    }
  };

  const getTotalBeds = (bedArray) => {
    if (!bedArray || !Array.isArray(bedArray)) return 0;
    return bedArray.reduce((total, bedItem) => total + bedItem.quantity, 0);
  };

  const renderIcon = (iconName) => {
    const iconLibraries = { ...FaIcons, ...MdIcons, ...GiIcons };
    const IconComponent = iconLibraries[iconName];
    return IconComponent ? (
      <IconComponent style={{ fontSize: "16px", color: "#0071c2" }} />
    ) : (
      <FaIcons.FaStar style={{ fontSize: "16px", color: "#0071c2" }} />
    );
  };

  const styles = {
    pageContainer: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      minHeight: "100vh",
      padding: "20px 0",
    },
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0 20px",
    },
    header: {
      background: "linear-gradient(135deg, #ffffff, #f8fafc)",
      borderRadius: "20px",
      padding: "30px",
      marginBottom: "30px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      border: "1px solid rgba(255,255,255,0.2)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "36px",
      fontWeight: "800",
      margin: 0,
      background: "linear-gradient(135deg, #0071c2, #005a9e)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    addButton: {
      background: "linear-gradient(135deg, #0071c2, #005a9e)",
      border: "none",
      borderRadius: "15px",
      padding: "15px 30px",
      fontWeight: "700",
      fontSize: "16px",
      color: "white",
      boxShadow: "0 6px 20px rgba(0, 113, 194, 0.3)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    roomCard: {
      background: "linear-gradient(135deg, #ffffff, #f8fafc)",
      border: "none",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      overflow: "hidden",
      marginBottom: "30px",
      position: "relative",
    },
    roomImage: {
      height: "250px",
      objectFit: "cover",
      transition: "transform 0.5s ease",
      width: "100%",
    },
    imageOverlay: {
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 3,
    },
    statusBadge: {
      padding: "8px 16px",
      borderRadius: "25px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    roomHeader: {
      padding: "25px 30px 20px",
      background: "linear-gradient(135deg, #ffffff, #f8fafc)",
      borderBottom: "1px solid #e2e8f0",
    },
    roomName: {
      fontSize: "22px",
      fontWeight: "700",
      margin: "0 0 8px 0",
      color: "#1a202c",
      lineHeight: "1.3",
    },
    roomPrice: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#0071c2",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    priceLabel: {
      fontSize: "12px",
      color: "#718096",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    roomDetails: {
      padding: "25px 30px",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "25px",
    },
    detailItem: {
      background: "linear-gradient(135deg, #f7fafc, #edf2f7)",
      padding: "15px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    detailLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#718096",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    detailValue: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#2d3748",
    },
    description: {
      background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
      padding: "20px",
      borderRadius: "15px",
      border: "1px solid #bae6fd",
      marginBottom: "20px",
    },
    descriptionLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#0369a1",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    descriptionText: {
      fontSize: "15px",
      color: "#1e40af",
      lineHeight: "1.6",
      fontWeight: "500",
    },
    facilitiesSection: {
      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
      padding: "20px",
      borderRadius: "15px",
      border: "1px solid #bbf7d0",
    },
    facilitiesTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#15803d",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    facilitiesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "10px",
    },
    facilityItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      background: "rgba(255,255,255,0.7)",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#166534",
    },
    actionButtons: {
      display: "flex",
      gap: "15px",
      padding: "25px 30px",
      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      borderTop: "1px solid #e2e8f0",
    },
    editButton: {
      background: "linear-gradient(135deg, #0071c2, #005a9e)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 24px",
      fontWeight: "600",
      fontSize: "14px",
      color: "white",
      flex: 1,
      boxShadow: "0 4px 12px rgba(0, 113, 194, 0.3)",
      transition: "all 0.3s ease",
    },
    statusToggle: {
      background: "transparent",
      border: "none",
      borderRadius: "20px",
      padding: "8px",
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "all 0.3s ease",
    },
    toggleSwitch: {
      width: "50px",
      height: "25px",
      backgroundColor: (isActive) => (isActive ? "#007bff" : "#6c757d"),
      borderRadius: "25px",
      position: "relative",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    toggleCircle: {
      width: "21px",
      height: "21px",
      backgroundColor: "white",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      left: (isActive) => (isActive ? "27px" : "2px"),
      transition: "left 0.3s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    emptyState: {
      textAlign: "center",
      padding: "100px 40px",
      background: "linear-gradient(135deg, #ffffff, #f8fafc)",
      borderRadius: "20px",
      border: "2px dashed #cbd5e0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
    },
    emptyIcon: {
      fontSize: "64px",
      marginBottom: "20px",
      opacity: "0.7",
    },
    emptyTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#2d3748",
      marginBottom: "12px",
    },
    emptyText: {
      fontSize: "16px",
      color: "#718096",
      lineHeight: "1.5",
    },
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div style={{ textAlign: "center" }}>
              <Spinner
                animation="border"
                role="status"
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: "#0071c2",
                }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#4a5568",
                }}
              >
                Đang tải danh sách phòng...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <Alert
            variant="danger"
            style={{
              borderRadius: "15px",
              border: "none",
              boxShadow: "0 8px 32px rgba(220, 38, 38, 0.1)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                {error}
              </span>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={fetchRooms}
                style={{ borderRadius: "8px" }}
              >
                🔄 Thử lại
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <ToastProvider/>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏨 Danh Sách Loại Phòng</h1>
          <Button
            style={styles.addButton}
            onClick={handleAdd}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(0, 113, 194, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(0, 113, 194, 0.3)";
            }}
          >
            <FaIcons.FaPlus />
            Thêm Loại Phòng Mới
          </Button>
        </div>

        {!Array.isArray(rooms) || rooms.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🏨</div>
            <h3 style={styles.emptyTitle}>Chưa có phòng nào</h3>
            <p style={styles.emptyText}>
              Hãy thêm phòng mới để bắt đầu quản lý khách sạn của bạn.
              <br />
              Bạn có thể tạo nhiều loại phòng khác nhau với các tiện nghi đa
              dạng.
            </p>
          </div>
        ) : (
          <Row className="g-4">
            {rooms.map((room, index) => (
              <Col key={room._id || index} xs={12} lg={6} xl={4}>
                <Card
                  style={styles.roomCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-10px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 60px rgba(0,0,0,0.15)";
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.08)";
                    const img = e.currentTarget.querySelector("img");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={
                        room.images && room.images.length > 0
                          ? room.images[0]
                          : "https://via.placeholder.com/400x250/e2e8f0/718096?text=No+Image"
                      }
                      style={styles.roomImage}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x250/e2e8f0/718096?text=No+Image";
                      }}
                    />
                    <div style={styles.imageOverlay}>
                      <Badge
                        bg={
                          room.statusActive === "ACTIVE"
                            ? "success"
                            : "secondary"
                        }
                        style={styles.statusBadge}
                      >
                        {room.statusActive === "ACTIVE"
                          ? "✅ Hoạt động"
                          : "⏸️ Không hoạt động"}
                      </Badge>
                    </div>
                  </div>

                  <div style={styles.roomHeader}>
                    <h3 style={styles.roomName}>{room.name || "Tên phòng"}</h3>
                    <div style={styles.roomPrice}>
                      <span style={styles.priceLabel}>Giá/đêm</span>
                      <span>
                        {room.price
                          ? Utils.formatCurrency(room.price)
                          : "0 VND"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.roomDetails}>
                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          <FaIcons.FaUsers />
                          Sức chứa
                        </span>
                        <span style={styles.detailValue}>
                          {room.capacity || 0} khách
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          <FaIcons.FaHashtag />
                          Số lượng
                        </span>
                        <span style={styles.detailValue}>
                          {room.quantity || 0} phòng
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.actionButtons}>
                    <div style={styles.statusToggle}>
                      <div
                        style={{
                          ...styles.toggleSwitch,
                          backgroundColor:
                            room.statusActive === "ACTIVE"
                              ? "#007bff"
                              : "#6c757d",
                        }}
                        onClick={() => {
                          setEditingRoom(room);
                          setShowModalChangeStatus(true);
                        }}
                      >
                        <div
                          style={{
                            ...styles.toggleCircle,
                            left:
                              room.statusActive === "ACTIVE" ? "27px" : "2px",
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      style={styles.editButton}
                      onClick={() => handleEdit(room)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(0, 113, 194, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 113, 194, 0.3)";
                      }}
                    >
                      <FaIcons.FaEdit style={{ marginRight: "8px" }} />
                      Chỉnh sửa
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <ConfirmationModal
          show={showModalChangeStatus}
          onHide={() => setShowModalChangeStatus(false)}
          onConfirm={() => {
            handleToggleStatus(editingRoom._id);
          }}
          title={
            editingRoom?.statusActive === "ACTIVE"
              ? "Tạm ngừng nhận phòng này"
              : "Cho phép nhận phòng này"
          }
          message={
            editingRoom?.statusActive === "ACTIVE"
              ? "Nếu bạn ngừng nhận phòng này, thì phòng này sẽ không được hiện trên web, nhưng các phòng này đã đặt sẽ vẫn tiếp tục diễn ra !!!"
              : "Nếu bạn mở nhận phòng này, thì phòng này sẽ được hiện trên web và có thể đặt được phòng này từ lúc mở nhận đặt phòng này !!!"
          }
          confirmButtonText="Xác nhận"
          cancelButtonText="Hủy bỏ"
          type={
            editingRoom?.statusActive === "ACTIVE" ? "danger" : "warning"
          }
        />
        <Room
          show={showModal}
          onHide={() => setShowModal(false)}
          handleClose={() => setShowModal(false)}
          onSave={handleSave}
          editingRoom={editingRoom}
        />
      </div>
    </div>
  );
}

export default RoomListingPage;
