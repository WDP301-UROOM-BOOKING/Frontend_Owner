import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import { FaKey, FaImage } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/hotelHost/MyAccountPage.css";
import ChangePassword from "./components/ChangePasswordHotel";
import ViewInformation from "./components/ViewInformationHotel";
import ViewAvatar from "./components/ViewAvatarHotel";
import { useLocation } from "react-router-dom";
import { ToastProvider } from "@components/ToastContainer";

function MyAccountHotelPage() {
  const location = useLocation();
  const { id } = location.state || {};
  useEffect(() => {
    if (id) {
      setIndexActive(id);
    }
  }, [location.state?.id]);
  const [indexActive, setIndexActive] = useState(0);
  const handleMenuClick = (index) => {
    setIndexActive(index);
  };
  const menuItems = [
    { name: "My Account", icon: <IoSettingsSharp /> },
    { name: "Change Password", icon: <FaKey /> },
    { name: "View Avatar", icon: <FaImage /> },
  ];

  return (
    <div className="main-content_1 p-3">
      <ToastProvider/>
      <Nav variant="tabs" activeKey={indexActive} className="mb-3">
        {menuItems.map((item, index) => (
          <Nav.Item key={item.name}>
            <Nav.Link eventKey={index} onClick={() => handleMenuClick(index)}>
              {item.icon}&nbsp;{item.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Row>
        <Col md={12}>
          <Card style={{ backgroundColor: "rgba(255, 255, 255,0.9)" }}>
            {indexActive === 0 && <ViewInformation />}
            {indexActive === 1 && <ChangePassword />}
            {indexActive === 2 && <ViewAvatar />}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default MyAccountHotelPage;