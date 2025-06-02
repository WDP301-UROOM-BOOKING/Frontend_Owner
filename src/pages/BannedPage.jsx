import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import '../css/BannedPage.css'
import { useNavigate } from 'react-router-dom';
import * as Routers from "@utils/Routes";

const BannedPage = () => {
  const navigate= useNavigate();

  return (
    <Container fluid className="banned-container">
      <div className="banned-content text-center">
        <div className="lock-icon">
          <FaLock size={250}/>
        </div>
        
        <h1 className="banned-title" style={{fontSize: 60}}>Banned</h1>
        <p className="banned-subtitle" style={{fontSize: 40}}>Your account has been locked</p>
        
        <div className="banned-details">
          <div className="detail-item">
            <span className="detail-label">Reason: </span>
            <span className="detail-value" style={{color: 'red'}}>Violation of standards</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Date locked: </span>
            <span className="detail-value">12:03:01 20/10/2025</span>
          </div>
        </div>
        
        <div className="banned-actions">
          <Button
            onClick={() => {
              navigate(Routers.HomeHotel)
            }}
            variant="primary" className="home-btn" style={{width: '140px'}}
          >
            Home Page
          </Button>
          <Button variant="danger" className="contact-btn" style={{width: '140px'}}>
            Contact
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default BannedPage;
