import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaClock } from 'react-icons/fa';
import '../css/WaitPendingPage.css';
import * as Routers from "../utils/Routes";
import { useNavigate } from 'react-router-dom';

const WaitPendingPage = () => {
    const navigate= useNavigate();
    return (
    <Container fluid className="pending-container1">
      <div className="pending-content1 text-center">
        <div className="clock-icon1">
          <FaClock size={250} />
        </div>
        
        <h1 className="pending-title1" style={{fontSize: 60}}>Pending Approval</h1>
        <p className="pending-subtitle1" style={{fontSize: 40}}>Your hotel host account is under review</p>
        
        <div className="pending-details1">
          <div className="detail-item1">
            <span className="detail-label1">Status: </span>
            <span className="detail-value1" style={{color: 'orange'}}>Waiting For Pending From Admin</span>
          </div>
          
          <div className="detail-item1">
            <span className="detail-label1">Submission date: </span>
            <span className="detail-value1">12:03:01 20/10/2025</span>
          </div>
          
          <div className="detail-item1">
            <span className="detail-label1">Estimated time: </span>
            <span className="detail-value1">24-48 hours</span>
          </div>
        </div>
        
        <div className="pending-actions1">
          <Button variant="primary" style={{width: '140px'}}
            onClick={() => {
                navigate(Routers.LoginHotelPage)
            }}
          >
            Login Page
          </Button>
          <Button variant="secondary" style={{width: '140px'}}>
            Contact
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default WaitPendingPage;
