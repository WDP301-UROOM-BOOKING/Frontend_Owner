import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Room from "@pages/room/Room";
import Utils from "@utils/Utils";

function RoomListingPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Phòng Đơn Hạng Bình Dân",
      roomType: "Phòng đơn",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/280947638.jpg?k=28d6f3d93337dccf4fd7b25369fb6cb6a51818b1e359af9b60ea5c29c913726d&o=",
      capacity: 1,
      beds: {
        singleBed: 1,
        doubleBed: 0,
        kingBed: 0,
        superKingBed: 0,
      },
      bathroom: "Riêng",
      price: 450,
      count: 1,
      size: "15 - 20 m²",
    },
    {
      id: 2,
      name: "Phòng Đôi Tiêu Chuẩn",
      roomType: "Phòng 2 giường đơn",
      image: "https://cf.bstatic.com/xdata/images/hotel/max500/280949903.jpg?k=ffdbb282a1cbeeed2f59a1f85fae47c82e9556624a13703e4d8616640d533c92&o=",
      capacity: 2,
      beds: {
        singleBed: 0,
        doubleBed: 1,
        kingBed: 0,
        superKingBed: 0,
      },
      bathroom: "Riêng",
      price: 300,
      count: 3,
      size: "20 - 30 m²",
    },
    {
      id: 3,
      name: "Phòng Standard",
      roomType: "Phòng gia đình",
      image: "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTMKBEV-sK78U-3N6IbGcRH0ppKRxxPDG4pc0HbrNOTgrGhD7ogDa6oKDhqGnxhrTFVdgUAHxyIuFbdq-pzVzU",
      capacity: 2,
      beds: {
        singleBed: 2,
        doubleBed: 0,
        kingBed: 0,
        superKingBed: 0,
      },
      bathroom: "Riêng",
      price: 440,
      count: 3,
      size: "20 - 30 m²",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      setRooms(rooms.filter((room) => room.id !== id));
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

  const handleSave = (roomData) => {
    if (editingRoom) {
      // Update existing room
      setRooms(rooms.map(room => 
        room.id === editingRoom.id 
          ? { ...roomData, id: editingRoom.id }
          : room
      ));
    } else {
      // Add new room
      const newRoom = {
        ...roomData,
        id: Math.max(...rooms.map(r => r.id), 0) + 1
      };
      setRooms([...rooms, newRoom]);
    }
    setShowModal(false);
    setEditingRoom(null);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getTotalBeds = (beds) => {
    return beds.singleBed + beds.doubleBed + beds.kingBed + beds.superKingBed;
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "30px auto",
      padding: "0 15px",
    },
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
      backgroundColor: "#0071c2",
      border: "none",
    },
    roomCard: {
      marginBottom: "20px",
      border: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      overflow: "hidden",
    },
    roomCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
    roomImage: {
      height: "200px",
      objectFit: "cover",
      borderBottom: "1px solid #f0f0f0",
    },
    roomHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "15px 20px",
      borderBottom: "1px solid #f0f0f0",
      backgroundColor: "#f9f9f9",
    },
    roomName: {
      fontSize: "18px",
      fontWeight: "bold",
      margin: 0,
    },
    roomPrice: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#0071c2",
    },
    roomDetails: {
      padding: "15px 20px",
    },
    detailsTable: {
      marginBottom: "15px",
    },
    tableCell: {
      padding: "8px 0",
      borderColor: "#f0f0f0",
    },
    amenitiesList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "15px",
      marginBottom: "15px",
    },
    amenityBadge: {
      backgroundColor: "#e6f2ff",
      color: "#0071c2",
      fontWeight: "normal",
      padding: "6px 12px",
    },
    actionButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      padding: "10px 20px",
      borderTop: "1px solid #f0f0f0",
    },
    editButton: {
      backgroundColor: "#0071c2",
      border: "none",
    },
    deleteButton: {
      backgroundColor: "white",
      color: "#e74c3c",
      border: "1px solid #e74c3c",
    },
    emptyState: {
      textAlign: "center",
      padding: "50px 0",
      color: "#6b6b6b",
    },
  };

  return (
    <div className="main-content_1 p-3">
      <div style={styles.header}>
        <h1 style={styles.title}>Danh Sách Phòng</h1>
        <Button
          style={styles.addButton}
          onClick={handleAdd}
        >
          + Thêm Phòng Mới
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>Không có phòng nào</h3>
          <p>Hãy thêm phòng mới để bắt đầu</p>
        </div>
      ) : (
        <Row>
          {rooms.map((room) => (
            <Col key={room.id} xs={12} md={4} lg={4} xl={4}>
              <Card
                style={styles.roomCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <Card.Img
                  variant="top"
                  src={room.image}
                  style={styles.roomImage}
                />

                <div style={styles.roomHeader}>
                  <h3 style={styles.roomName}>{room.name}</h3>
                  <div style={styles.roomPrice}>
                     {Utils.formatCurrency(room.price)}
                  </div>
                </div>

                <div style={styles.roomDetails}>
                  <Table borderless style={styles.detailsTable}>
                    <tbody>
                      <tr>
                        <td style={styles.tableCell}>
                          <strong>Lượng khách:</strong>
                        </td>
                        <td style={styles.tableCell}>{room.capacity}</td>
                        <td style={styles.tableCell}>
                          <strong>Giường:</strong>
                        </td>
                        <td style={styles.tableCell}>{getTotalBeds(room.beds)}</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>
                          <strong>Phòng tắm:</strong>
                        </td>
                        <td style={styles.tableCell}>{room.bathroom}</td>
                        <td style={styles.tableCell}>
                          <strong>Diện tích:</strong>
                        </td>
                        <td style={styles.tableCell}>{room.size}</td>
                      </tr>
                      <tr>
                        <td style={styles.tableCell}>
                          <strong>Phòng loại này:</strong>
                        </td>
                        <td style={styles.tableCell}>{room.count}</td>
                        <td style={styles.tableCell}>
                          <strong>Loại phòng:</strong>
                        </td>
                        <td style={styles.tableCell}>{room.roomType}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div style={styles.actionButtons}>
                  <Button
                    variant="outline-danger"
                    style={styles.deleteButton}
                    onClick={() => handleDelete(room.id)}
                  >
                    Xóa
                  </Button>
                  <Button
                    style={styles.editButton}
                    onClick={() => handleEdit(room)}
                  >
                    Chỉnh sửa
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      <Room
        show={showModal}
        onHide={() => setShowModal(false)}
        handleClose={() => setShowModal(false)}
        onSave={handleSave}
        editingRoom={editingRoom}
      />
    </div>
  );
}

export default RoomListingPage;
