import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Card, Form, Button } from "react-bootstrap";
import AuthActions from "../../../../redux/auth/actions";
import { useAppSelector } from "../../../../redux/store";
import { useDispatch } from "react-redux";
import { showToast, ToastProvider } from "@components/ToastContainer";
import ConfirmationModal from "@components/ConfirmationModal";

function ViewAvatar() {
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(Auth?.image?.url);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Xử lý mở modal
  const handleOpenModal = () => setShowAvatarModal(true);
  const handleCloseModal = () => setShowAvatarModal(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleUploadFile = () => {
    if (!selectedFile) {
      showToast.warning("Vui lòng chọn tệp để tải lên.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    setLoading(true);
    dispatch({
      type: AuthActions.UPDATE_AVATAR,
      payload: {
        formData: formData,
        onSuccess: (MsgYes) => {
          setLoading(false);
          showToast.success(MsgYes || "Cập nhật ảnh đại diện thành công!");
          setSelectedImage(Auth.image.url); // Cập nhật lại ảnh sau khi upload
        },
        onFailed: (MsgNo) => {
          showToast.warning(MsgNo || "Cập nhật ảnh đại diện thất bại.");
          setLoading(false);
        },
        onError: (MsgNo) => {
          showToast.warning(MsgNo || "Đã xảy ra lỗi!");
          setLoading(false);
        },
      },
    });
  };

  return (
    <Card.Body>
      <h2 className="fw-bold mb-4">Xem Ảnh Đại Diện</h2>
      <div className="text-center">
        <img
          src={
            selectedImage != "" && selectedImage
              ? selectedImage
              : "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
          }
          className="rounded-circle mb-2"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
          alt="ảnh đại diện"
        />
        <br />
        <Button
          className="fw-bold mb-4"
          variant="outline-primary"
          onClick={handleOpenModal}
        >
          Xem Ảnh Đại Diện
        </Button>
      </div>
      <p className="text-center text-muted">
        Kích thước tệp tối đa là 1 MB
        <br />
        Định dạng JPEG, PNG, JPG, ...
      </p>
      <Form>
        <Form.Group controlId="formFile" className="mb-3 text-center">
          <Form.Control
            name="avatar"
            type="file"
            className="d-inline-block w-auto"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button
            variant="danger"
            className="me-2"
            onClick={() => {
              setShowUpdateModal(true);
            }}
          >
            HỦY BỎ
          </Button>
          <Button
            variant="primary"
            disabled={loading} // disable khi loading
            onClick={() => {
              setShowAcceptModal(true);
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Đang tải lên...
              </>
            ) : (
              "Tải lên"
            )}
          </Button>
        </div>
      </Form>

      {/* Avatar Modal */}
      <Modal
        show={showAvatarModal}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ảnh Đại Diện Khách Hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <img
            src={
              selectedImage != "" && selectedImage
                ? selectedImage
                : "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
            }
            alt="Ảnh đại diện khách hàng"
            className="img-fluid"
            style={{ height: "480px", width: "480px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Update Confirmation Modal */}
      <ConfirmationModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onConfirm={() => {
          setSelectedImage(Auth.image.url);
          setSelectedFile();
        }}
        title="Xác nhận hủy bỏ"
        message="Bạn có chắc chắn muốn khôi phục lại ảnh đại diện này không?"
        confirmButtonText="Xác nhận"
        type="warning"
      />

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleUploadFile}
        title="Xác nhận cập nhật"
        message="Bạn có chắc chắn muốn cập nhật ảnh đại diện mới này không?"
        confirmButtonText="Đồng ý"
        type="accept"
      />
    </Card.Body>
  );
}

export default ViewAvatar;