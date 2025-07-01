import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import ConfirmationModal from "@components/ConfirmationModal";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { useDispatch } from "react-redux";
import AuthActions from "../../../../redux/auth/actions";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const initialFormData = {
    oldPassword: "",
    newPassword: "",
    againNewPassword: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const handleCancel = () => {
    const { oldPassword, newPassword, againNewPassword } = formData;
    if (!oldPassword || !newPassword || !againNewPassword) {
      showToast.warning("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }
    setFormData(initialFormData); // Reset form
    showToast.info("Đã hủy thay đổi mật khẩu.");
    setShowUpdateModal(false);
  };

  const handleSave = () => {
    const { oldPassword, newPassword, againNewPassword } = formData;

    if (!oldPassword || !newPassword || !againNewPassword) {
      showToast.warning("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (
      oldPassword.length < 8 ||
      newPassword.length < 8 ||
      againNewPassword.length < 8
    ) {
      showToast.warning("Tất cả mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (newPassword !== againNewPassword) {
      showToast.warning("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    dispatch({
      type: AuthActions.CHANGE_PASSWORD,
      payload: {
        data: {
          currentPassword: oldPassword,
          newPassword,
          confirmPassword: againNewPassword,
        },
        onSuccess: () => {
          showToast.success("Đổi mật khẩu thành công!");
          setFormData(initialFormData);
        },
        onFailed: (msg) => {
          showToast.warning(`Đổi mật khẩu thất bại: ${msg}`);
        },
        onError: (err) => {
          console.error(err);
          showToast.warning("Đã xảy ra lỗi khi đổi mật khẩu.");
        },
      },
    });

    setShowAcceptModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAcceptModal(true);
  };

  return (
    <Card.Body>
      <h2 className="fw-bold mb-4">Đổi Mật Khẩu</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 500 }}>Mật khẩu cũ</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu cũ của bạn"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="py-2"
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-0 text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 500 }}>Mật khẩu mới</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới của bạn"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="py-2"
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-0 text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 500 }}>
                Xác nhận mật khẩu mới
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới của bạn"
                  name="againNewPassword"
                  value={formData.againNewPassword}
                  onChange={handleChange}
                  className="py-2"
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 top-0 text-decoration-none text-muted h-100 d-flex align-items-center pe-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
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
        message="Bạn có chắc chắn muốn thay đổi mật khẩu mới này không?"
        confirmButtonText="Đồng ý"
        type="accept"
      />
    </Card.Body>
  );
};

export default ChangePassword;