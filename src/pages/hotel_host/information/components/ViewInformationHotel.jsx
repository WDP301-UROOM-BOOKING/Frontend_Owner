import { Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ConfirmationModal from "@components/ConfirmationModal";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { useAppSelector } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import AuthActions from "../../../../redux/auth/actions";

import Utils from "@utils/Utils";
import "react-datepicker/dist/react-datepicker.css";
import { getToken } from "@utils/handleToken";

const ViewInformation = () => {
  const dispatch = useDispatch();
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const [formData, setFormData] = useState(Auth);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  console.log("formData: ", formData);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    setFormData(Auth);
    setShowUpdateModal(false);
  };

  const handleSave = () => {
    console.log("Token: ", getToken());
    dispatch({
      type: AuthActions.UPDATE_PROFILE,
      payload: {
        data: formData,
        onSuccess: (user) => {
          showToast.success("Cập nhật thông tin thành công!");
          setFormData({ ...user });
          setShowAcceptModal(false);
        },
        onFailed: (msg) => {
          showToast.warning(`Cập nhật thất bại: ${msg}`);
          setShowAcceptModal(false);
        },
        onError: (err) => {
          showToast.warning("Đã xảy ra lỗi!");
          console.error(err);
          setShowAcceptModal(false);
        },
      },
    });
  };

  return (
    <Card.Body>
      <h2 className="fw-bold mb-4">Xem Thông Tin</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên của bạn"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Giới tính</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Nam"
                  name="gender"
                  id="MALE"
                  value="MALE"
                  checked={formData.gender === "MALE"}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Nữ"
                  name="gender"
                  id="FEMALE"
                  value="FEMALE"
                  checked={formData.gender === "FEMALE"}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ngày sinh</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  placeholder="DD/MM/YYYY"
                  name="birthDate"
                  value={
                    formData.birthDate
                      ? Utils.getDate(formData.birthDate, 3)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>CMND/CCCD</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số CMND/CCCD của bạn"
                name="cmnd"
                value={formData.cmnd}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại của bạn"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập email của bạn"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                style={{ backgroundColor: "white" }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Form.Group>
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập địa chỉ của bạn"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button
            variant="danger"
            className="me-2"
            style={{ width: "100px" }}
            onClick={() => {
              setShowUpdateModal(true);
            }}
          >
            HỦY BỎ
          </Button>
          <Button
            variant="primary"
            type="submit"
            style={{ width: "100px" }}
            onClick={() => {
              setShowAcceptModal(true);
            }}
          >
            LƯU
          </Button>
        </div>
      </Form>

      {/* Update Confirmation Modal */}
      <ConfirmationModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onConfirm={handleCancel}
        title="Xác nhận hủy bỏ"
        message="Bạn có chắc chắn muốn khôi phục lại thông tin này không?"
        confirmButtonText="Xác nhận"
        type="warning"
      />

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleSave}
        title="Xác nhận cập nhật"
        message="Bạn có chắc chắn muốn cập nhật thông tin mới này không?"
        confirmButtonText="Đồng ý"
        type="accept"
      />

    </Card.Body>
  );
};

export default ViewInformation;
