import * as Routers from "../../../utils/Routes";
import React, { useState, useEffect } from 'react'
import {
  Navbar,
  Container,
  Button,
  Form,
  Card,
  ProgressBar,
  Row,
  Col,
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ArrowLeft } from 'lucide-react'
import { cityOptionSelect, districtsByCity, wardsByDistrict } from '@utils/data'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@redux/store'
import { showToast, ToastProvider } from '@components/ToastContainer'
import HotelActions from '@redux/hotel/actions'


export default function BookingLocation() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const createHotel = useAppSelector((state) => state.Hotel.createHotel)

  // Initialize state with values from Redux store or empty strings
  const [selectedCity, setSelectedCity] = useState(createHotel?.city || '')
  const [selectedDistrict, setSelectedDistrict] = useState(createHotel?.district || '')
  const [selectedWard, setSelectedWard] = useState(createHotel?.ward || '')
  const [specificAddress, setSpecificAddress] = useState(createHotel?.specificAddress || '')
  const [generalAddress, setGeneralAddress] = useState(createHotel?.address || '')

  const [availableDistricts, setAvailableDistricts] = useState([])
  const [availableWards, setAvailableWards] = useState([])

  // Initialize districts and wards when component mounts with existing data
  useEffect(() => {
    if (selectedCity) {
      const districts = districtsByCity[selectedCity] || []
      setAvailableDistricts(districts)
      
      if (selectedDistrict) {
        const wards = wardsByDistrict[selectedDistrict] || []
        setAvailableWards(wards)
      }
    }
  }, []) // Run only on mount

  // Update districts when city changes
  useEffect(() => {
    if (selectedCity) {
      const districts = districtsByCity[selectedCity] || []
      setAvailableDistricts(districts)
      
      // Only reset district and ward if the current district is not valid for the new city
      const isDistrictValid = districts.some(d => d.value === selectedDistrict)
      if (!isDistrictValid) {
        setSelectedDistrict('')
        setSelectedWard('')
        setAvailableWards([])
      }
    } else {
      setAvailableDistricts([])
      setSelectedDistrict('')
      setSelectedWard('')
      setAvailableWards([])
    }
  }, [selectedCity])

  // Update wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const wards = wardsByDistrict[selectedDistrict] || []
      setAvailableWards(wards)
      
      // Only reset ward if the current ward is not valid for the new district
      const isWardValid = wards.some(w => w.value === selectedWard)
      if (!isWardValid) {
        setSelectedWard('')
      }
    } else {
      setAvailableWards([])
      setSelectedWard('')
    }
  }, [selectedDistrict])

  // Update general address when location changes
  useEffect(() => {
    const addressParts = []
    if (specificAddress?.trim()) addressParts.push(specificAddress.trim())
    if (selectedWard) addressParts.push(selectedWard)
    if (selectedDistrict) addressParts.push(selectedDistrict)
    if (selectedCity) addressParts.push(selectedCity)
    
    setGeneralAddress(addressParts.join(', '))
  }, [specificAddress, selectedWard, selectedDistrict, selectedCity])

  const handleContinue = () => {
    // Validate required fields
    if (!selectedCity) {
      showToast.warning('Vui lòng chọn thành phố')
      return
    }
    if (!selectedDistrict) {
      showToast.warning('Vui lòng chọn quận/huyện')
      return
    }
    if (!selectedWard) {
      showToast.warning('Vui lòng chọn phường/xã')
      return
    }
    if (!specificAddress?.trim()) {
      showToast.warning('Vui lòng nhập địa chỉ cụ thể')
      return
    }

    // Dispatch action to save data
    dispatch({
      type: HotelActions.SAVE_HOTEL_ADDRESS_CREATE,
      payload: {
        specificAddress: specificAddress.trim(),
        address: generalAddress,
        city: selectedCity,
        district: selectedDistrict,
        ward: selectedWard,
      },
    })

    // Navigate to next step
    navigate(Routers.BookingPropertyFacility)
  }

  const handleBack = () => {
    // Save current data before going back
    dispatch({
      type: HotelActions.SAVE_HOTEL_ADDRESS_CREATE,
      payload: {
        specificAddress: specificAddress?.trim() || '',
        address: generalAddress,
        city: selectedCity,
        district: selectedDistrict,
        ward: selectedWard,
      },
    })
    
    // Navigate back (you can replace with actual back route)
    navigate(Routers.BookingPropertyName)
  }

  return (
    <div className="booking-app">
      <ToastProvider />
      
      {/* Navigation Bar */}
      <Navbar style={{ backgroundColor: '#003580' }}>
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold">
            <b style={{ fontSize: 30 }}>
              UR<span style={{ color: '#f8e71c' }}>OO</span>M
            </b>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Progress Bar */}
      <Container className="mt-4">
        <div className="progress-section">
          <div className="progress-label mb-2">
            <h5>Thông tin cơ bản</h5>
          </div>
          <ProgressBar style={{ height: '20px' }}>
            <ProgressBar variant="primary" now={20} key={1} />
            <ProgressBar variant="primary" now={20} key={2} />
            <ProgressBar variant="secondary" now={20} key={3} />
            <ProgressBar variant="secondary" now={20} key={4} />
            <ProgressBar variant="secondary" now={20} key={5} />
          </ProgressBar>
        </div>
      </Container>

      {/* Main Content */}
      <Container className="main-content py-4">
        <Row>
          <Col md={7}>
            <div className="mb-4">
              <h1 className="main-heading">Chỗ nghỉ của Quý vị ở đâu?</h1>
            </div>

            {/* Property Form */}
            <div className="property-form-card">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Thành phố <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select 
                    className="form-input"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    isInvalid={!selectedCity}
                  >
                    <option value="">Chọn thành phố</option>
                    {cityOptionSelect.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Quận/Huyện <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select 
                    className="form-input"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedCity}
                    isInvalid={selectedCity && !selectedDistrict}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {availableDistricts.map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))}
                  </Form.Select>
                  {!selectedCity && (
                    <Form.Text className="text-muted">
                      Vui lòng chọn thành phố trước
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Phường/Xã <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select 
                    className="form-input"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                    isInvalid={selectedDistrict && !selectedWard}
                  >
                    <option value="">Chọn phường/xã</option>
                    {availableWards.map((ward) => (
                      <option key={ward.value} value={ward.value}>
                        {ward.label}
                      </option>
                    ))}
                  </Form.Select>
                  {!selectedDistrict && (
                    <Form.Text className="text-muted">
                      Vui lòng chọn quận/huyện trước
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Địa chỉ cụ thể <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số nhà, tên đường..."
                    className="form-input"
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    isInvalid={!specificAddress?.trim()}
                  />
                  <Form.Text className="text-muted">
                    Ví dụ: 123 Đường Nguyễn Văn A
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Địa chỉ tổng quát</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Địa chỉ sẽ được tạo tự động"
                    className="form-input"
                    value={generalAddress}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Địa chỉ này sẽ hiển thị cho khách hàng
                  </Form.Text>
                </Form.Group>
              </Form>
            </div>

            <div className="navigation-buttons mt-4">
              <Button
                variant="outline-primary"
                className="back-button"
                onClick={handleBack}
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </Button>
              <Button
                variant="primary"
                className="continue-button"
                onClick={handleContinue}
                disabled={!selectedCity || !selectedDistrict || !selectedWard || !specificAddress?.trim()}
              >
                Tiếp tục
              </Button>
            </div>
          </Col>

          <Col md={5}>
            <div className="info-cards">
              {/* First Info Card */}
              <Card className="info-card mb-4">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div className="info-icon thumbs-up">
                      <span role="img" aria-label="thumbs up">
                        👍
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">
                        Tôi nên chú ý điều gì khi điền thông tin địa chỉ?
                      </h5>
                      <ul className="info-list mt-3">
                        <li>Chọn thành phố, quận, phường đúng</li>
                        <li>Tránh sử dụng chữ viết tắt</li>
                        <li>Đúng với thực tế trên Google Maps</li>
                        <li>Điền đầy đủ số nhà và tên đường</li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Second Info Card */}
              <Card className="info-card">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div className="info-icon lightbulb">
                      <span role="img" aria-label="lightbulb">
                        💡
                      </span>
                    </div>
                    <div className="info-content">
                      <h5 className="info-title">
                        Tại sao tôi cần điền đúng địa chỉ cho chỗ nghỉ của mình?
                      </h5>
                      <p className="info-text mt-3">
                        Địa chỉ chính xác giúp khách hàng dễ dàng tìm thấy chỗ nghỉ của bạn. 
                        Thông tin này sẽ hiển thị trên bản đồ và trong kết quả tìm kiếm, 
                        giúp tăng độ tin cậy và khả năng đặt phòng từ khách hàng.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .booking-app {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .progress-section {
          margin: 0 auto;
        }

        .progress-label {
          font-size: 14px;
          color: #333;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .main-heading {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .property-form-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }

        .form-input {
          height: 45px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-input:focus {
          border-color: #0071c2;
          box-shadow: 0 0 0 0.2rem rgba(0, 113, 194, 0.25);
        }

        .form-input:disabled {
          background-color: #f8f9fa;
          opacity: 0.7;
        }

        .form-input.is-invalid {
          border-color: #dc3545;
        }

        .navigation-buttons {
          display: flex;
          gap: 12px;
        }

        .back-button {
          width: 50px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-color: #0071c2;
          color: #0071c2;
          border-radius: 6px;
        }

        .back-button:hover {
          background-color: #0071c2;
          color: white;
        }

        .continue-button {
          flex: 1;
          height: 45px;
          background-color: #0071c2;
          border: none;
          font-weight: 600;
          border-radius: 6px;
          transition: background-color 0.15s ease-in-out;
        }

        .continue-button:hover:not(:disabled) {
          background-color: #005999;
        }

        .continue-button:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
          opacity: 0.6;
          cursor: not-allowed;
        }

        .info-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease-in-out;
        }

        .info-card:hover {
          transform: translateY(-2px);
        }

        .info-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 20px;
          background-color: #f8f9fa;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
        }

        .info-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 0;
          color: #333;
        }

        .info-list {
          padding-left: 20px;
          margin-bottom: 0;
        }

        .info-list li {
          margin-bottom: 8px;
          color: #666;
        }

        .info-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .main-heading {
            font-size: 24px;
          }
          
          .property-form-card {
            padding: 16px;
          }
          
          .navigation-buttons {
            flex-direction: column;
          }
          
          .back-button {
            width: 100%;
            order: 2;
          }
          
          .continue-button {
            order: 1;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  )
}
