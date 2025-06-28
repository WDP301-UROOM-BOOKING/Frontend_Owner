import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  InputGroup,
  Modal,
  Alert,
  Spinner, // Add Spinner import
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Utils from "@utils/Utils";
import { roomFacilities, bedTypes } from "@utils/data";
import { useAppSelector } from "@redux/store";
import ConfirmationModal from "@components/ConfirmationModal";
import { toast } from 'react-toastify'; // Add this import if not already imported

function Room({ show, handleClose, onSave, editingRoom }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Phòng đơn",
    price: 120000,
    capacity: 1,
    description: "",
    quantity: 1,
    images: [],
    bed: [],
    facilities: [],
    statusActive: "NONACTIVE",
  });
  console.log("bed: ", formData.bed);
  console.log("editingRoom: ", editingRoom);
  const [errors, setErrors] = useState({});
  const hotelDetail = useAppSelector((state) => state.Hotel.hotel) ?? {};
  console.log("editingRoom: ", editingRoom);
  // Room type options
  const roomTypes = [
    "Single Room",
    "Double Room",
    "Family Room",
    "Suite",
    "VIP Room",
    "Deluxe Room",
  ];

  // Reset form when modal opens/closes or when editing room changes
  useEffect(() => {
    if (editingRoom) {
      // Process facilities to get facility names for checking
      let facilitiesNames = [];
      if (editingRoom.facilities && Array.isArray(editingRoom.facilities)) {
        facilitiesNames = editingRoom.facilities
          .map((facility) => {
            // If facility is an object with name property
            if (typeof facility === "object" && facility.name) {
              return facility.name;
            }
            // If facility is just a string (facility name)
            if (typeof facility === "string") {
              return facility;
            }
            return null;
          })
          .filter(Boolean);
      }

      // Process bed data - handle nested bed object structure
      let bedData = [];
      if (editingRoom.bed && Array.isArray(editingRoom.bed)) {
        bedData = editingRoom.bed.map((bedItem) => {
          // bedItem.bed is an object with _id, name, etc.
          return {
            bed: bedItem.bed?.name || bedItem.bed?._id || bedItem.bed, // Use bed name for select
            bedId: bedItem.bed?._id || bedItem.bed, // Store bed ID separately
            quantity: bedItem.quantity || 1,
          };
        });
      }
      console.log("bedData: ", bedData);
      setFormData({
        name: editingRoom.name || "",
        type: editingRoom.type || "Phòng đơn",
        price: editingRoom.price || 120000,
        capacity: editingRoom.capacity || 1,
        description: editingRoom.description || "",
        quantity: editingRoom.quantity || 1,
        images: editingRoom.images || [],
        bed: bedData,
        facilities: facilitiesNames,
        statusActive: editingRoom.statusActive || "NONACTIVE",
      });
    } else {
      setFormData({
        name: "",
        type: "Phòng đơn",
        price: 120000,
        capacity: 1,
        description: "",
        quantity: 1,
        images: [],
        bed: [],
        facilities: [],
        statusActive: "NONACTIVE",
      });
    }
    setErrors({});
  }, [editingRoom, show]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  console.log("formData.bed: ", formData.bed);
  const handleBedChange = (index, field, value) => {
    const newBeds = [...formData.bed];
    if (!newBeds[index]) {
      newBeds[index] = { bed: "", bedId: "", quantity: 1 };
    }

    if (field === "bed") {     
      const selectedBedType = bedTypes.find((bedType) => bedType._id === Number(value));
      if(selectedBedType) {
        newBeds[index].bed = selectedBedType.name; // Store bed name for display
        newBeds[index].bedId = selectedBedType._id; // Store bed ID for API
      }
    } else {
      newBeds[index][field] = value;
    }

    setFormData((prev) => ({
      ...prev,
      bed: newBeds,
    }));
  };

  const addBed = () => {
    setFormData((prev) => ({
      ...prev,
      bed: [...prev.bed, { bed: "", bedId: "", quantity: 1 }],
    }));
  };

  const removeBed = (index) => {
    setFormData((prev) => ({
      ...prev,
      bed: prev.bed.filter((_, i) => i !== index),
    }));
  };

  const handleFacilityChange = (facility, checked) => {
    setFormData((prev) => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, facility]
        : prev.facilities.filter((f) => f !== facility),
    }));
  };

  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState([]); // Add this state for preview images

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs for selected images
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);

    setIsUploadingImages(true);
    setUploadProgress(0);

    try {
      // Store files for upload
      setFormData((prev) => ({
        ...prev,
        imageFiles: files,
      }));

      // Simulate upload progress (you can replace this with actual Cloudinary upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // If you want to upload immediately, uncomment this:
      // await uploadImagesToCloudinary(files);

      setTimeout(() => {
        setUploadProgress(100);
        setIsUploadingImages(false);
      }, 2000);
    } catch (error) {
      console.error("Error uploading images:", error);
      setIsUploadingImages(false);
      setPreviewImages([]); // Clear preview on error
      // Handle error (show toast, alert, etc.)
    }
  };

  // Modify removePreviewImage function
  const removePreviewImage = (index) => {
    const totalImages = formData.images.length + previewImages.length;
    
    if (totalImages <= 5) {
      toast.error("Phòng phải có ít nhất 5 ảnh!");
      return;
    }

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    // Also remove from imageFiles if needed
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles
        ? prev.imageFiles.filter((_, i) => i !== index)
        : [],
    }));
  };

  // Add this function to remove images
  const removeImage = (index) => {
    const totalImages = formData.images.length + previewImages.length;
    
    if (totalImages <= 5) {
      toast.error("Phòng phải có ít nhất 5 ảnh!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Update validateForm function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng là bắt buộc";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Loại phòng là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả phòng là bắt buộc";
    }

    if (formData.price <= 0) {
      newErrors.price = "Giá phòng phải lớn hơn 0";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Sức chứa phải lớn hơn 0";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phòng phải lớn hơn 0";
    }

    // Check minimum images requirement
    const totalImages = formData.images.length + previewImages.length;
    if (totalImages < 5) {
      newErrors.images = "Phòng phải có ít nhất 5 ảnh";
      toast.error("Phòng phải có ít nhất 5 ảnh!");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsUploadingImages(true);

      try {
        // Process bed data to match API format
        const processedBeds = formData.bed
          .filter((bed) => bed.bed && bed.quantity > 0)
          .map((bed) => ({
            bed: bed.bedId || bed.bed,
            quantity: Number(bed.quantity),
          }));

        const roomData = {
          hotelId: hotelDetail._id,
          name: formData.name,
          type: formData.type,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          description: formData.description,
          quantity: Number(formData.quantity),
          bed: processedBeds,
          facilities: formData.facilities,
          images: formData.images,
          statusActive: formData.statusActive,
          imageFiles: formData.imageFiles,
        };

        await onSave(roomData);
        setIsUploadingImages(false);
      } catch (error) {
        setIsUploadingImages(false);
        console.error("Error saving room:", error);
      }
    }
    setShowUpdateModal(false);
    handleClose();
  };

  // Helper function to check if a facility is selected
  const isFacilitySelected = (facilityName) => {
    return formData.facilities.includes(facilityName);
  };

  // Helper function to get bed name by ID or name
  const getBedNameById = (bedIdOrName) => {
    console.log("bedIdOrName: ", bedIdOrName);
    // First try to find by _id
    let bedType = bedTypes.find((bed) => bed._id === bedIdOrName);
    // If not found, try to find by name
    if (!bedType) {
      bedType = bedTypes.find((bed) => bed.name === bedIdOrName);
    }
    return bedType ? bedType.name : "Không xác định";
  };

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <ConfirmationModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onConfirm={handleSubmit}
        title="Confirm Update"
        message="Are you sure you want to update this room?"
        confirmButtonText="Update"
        type="warning"
      />
      <Modal.Header closeButton>
        <Modal.Title>
          {editingRoom ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Room Name */}
          <Form.Group className="mb-3">
            <Form.Label>Tên phòng *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên phòng"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Room Type */}
          <Form.Group className="mb-3">
            <Form.Label>Loại phòng *</Form.Label>
            <Form.Select
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              isInvalid={!!errors.type}
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.type}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Price and Capacity */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giá phòng/đêm (VND) *</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sức chứa (người) *</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleInputChange("capacity", e.target.value)
                  }
                  isInvalid={!!errors.capacity}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.capacity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Quantity */}
          <Form.Group className="mb-3">
            <Form.Label>Số lượng phòng *</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              isInvalid={!!errors.quantity}
              //disabled={editingRoom}
            />
            <Form.Control.Feedback type="invalid">
              {errors.quantity}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Mô tả phòng *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập mô tả chi tiết về phòng"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Beds */}
          <Form.Group className="mb-3">
            <Form.Label>Loại giường</Form.Label>
            {formData.bed.map((bed, index) => (
              <Row key={index} className="mb-2">
                <Col md={6}>
                  <Form.Select
                    value={bed.bedId || bed.bed || ""}
                    onChange={(e) =>
                      handleBedChange(index, "bed", e.target.value)
                    }
                  >
                    <option value="0">Chọn loại giường</option>
                    {bedTypes
                      .filter((bedType) => {
                        // Show the bed type if:
                        // 1. It's not selected in any other bed selection
                        // 2. OR it's the current bed selection
                        const isSelectedInOtherBeds = formData.bed.some(
                          (selectedBed, selectedIndex) =>
                            selectedIndex !== index &&
                            (selectedBed.bedId === bedType._id || selectedBed.bed === bedType._id)
                        );
                        return !isSelectedInOtherBeds;
                      })
                      .map((bedType) => (
                        <option key={bedType._id} value={bedType._id}>
                          {bedType.name} - {bedType.bedWidth}
                        </option>
                      ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Số lượng"
                    value={bed.quantity}
                    onChange={(e) =>
                      handleBedChange(index, "quantity", e.target.value)
                    }
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeBed(index)}
                  >
                    Xóa
                  </Button>
                </Col>
              </Row>
            ))}

            {/* Display selected beds summary */}
            {formData.bed.length > 0 && (
              <div
                className="mt-2 p-2"
                style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
              >
                <small className="text-muted">
                  <strong>Giường đã chọn:</strong>
                  <ul className="mb-0 mt-1">
                    {formData.bed.map((bed, index) => (
                      <li key={index}>
                        {getBedNameById(bed.bed)} x {bed.quantity}
                      </li>
                    ))}
                  </ul>
                </small>
              </div>
            )}
            <br></br>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addBed}
              className="mt-2"
              disabled={formData.bed.length >= bedTypes.length}
            >
              + Thêm giường
            </Button>
          </Form.Group>

          {/* Facilities */}
          <Form.Group className="mb-3">
            <Form.Label>Tiện nghi</Form.Label>
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Row>
                {roomFacilities.map((facility) => (
                  <Col md={6} key={facility.name} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`facility-${facility.name}`}
                      label={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <facility.iconTemp
                            style={{
                              color: isFacilitySelected(facility.name)
                                ? "#0071c2"
                                : "#6c757d",
                              fontSize: "18px",
                              marginTop: "2px",
                              transition: "color 0.3s ease",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: isFacilitySelected(facility.name)
                                  ? "700"
                                  : "600",
                                fontSize: "14px",
                                color: isFacilitySelected(facility.name)
                                  ? "#0071c2"
                                  : "#333",
                              }}
                            >
                              {facility.name}
                            </div>
                            <small
                              style={{
                                color: "#6c757d",
                                fontSize: "12px",
                                lineHeight: "1.3",
                              }}
                            >
                              {facility.description}
                            </small>
                          </div>
                        </div>
                      }
                      checked={isFacilitySelected(facility.name)}
                      onChange={(e) =>
                        handleFacilityChange(facility.name, e.target.checked)
                      }
                      style={{ marginBottom: "8px" }}
                    />
                  </Col>
                ))}
              </Row>
            </div>
            <small className="text-muted mt-2 d-block">
              Đã chọn: <strong>{formData.facilities.length}</strong> tiện nghi
              {formData.facilities.length > 0 && (
                <span className="ms-2">({formData.facilities.join(", ")})</span>
              )}
            </small>
          </Form.Group>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh phòng *</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploadingImages}
            />
            <Form.Text className="text-muted">
              Ảnh sẽ được upload lên Cloudinary. <strong>Tối thiểu 5 ảnh.</strong>
            </Form.Text>

            {/* Show current image count */}
            <div className="mt-2">
              <small className="text-muted">
                Tổng số ảnh: <strong>{formData.images.length + previewImages.length}</strong> 
                {(formData.images.length + previewImages.length) < 5 && (
                  <span className="text-danger ms-2">
                    (Cần thêm {5 - (formData.images.length + previewImages.length)} ảnh)
                  </span>
                )}
                {(formData.images.length + previewImages.length) >= 5 && (
                  <span className="text-success ms-2">✓ Đủ số lượng ảnh</span>
                )}
              </small>
            </div>

            {/* Loading indicator */}
            {isUploadingImages && (
              <div
                className="mt-3 p-3"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Đang upload ảnh... {uploadProgress}%</span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            )}

            {/* Show preview images (newly selected images) */}
            {previewImages.length > 0 && (
              <div className="mt-3">
                <small className="text-muted d-block mb-2">
                  <strong>Ảnh mới chọn ({previewImages.length}):</strong>
                </small>
                <Row className="mt-2">
                  {previewImages.map((preview, index) => (
                    <Col md={3} key={`preview-${index}`} className="mb-2">
                      <div style={{ position: "relative" }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "2px solid #007bff", // Blue border for new images
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            padding: "2px 6px",
                          }}
                          onClick={() => removePreviewImage(index)}
                          disabled={isUploadingImages || (formData.images.length + previewImages.length <= 5)}
                          title={(formData.images.length + previewImages.length <= 5) ? "Không thể xóa - cần tối thiểu 5 ảnh" : "Xóa ảnh"}
                        >
                          ×
                        </Button>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "5px",
                            left: "5px",
                            backgroundColor: "rgba(0, 123, 255, 0.8)",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          MỚI
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Show existing images for edit mode */}
            {formData.images.length > 0 && (
              <div className="mt-3">
                <small className="text-muted d-block mb-2">
                  <strong>Ảnh hiện tại ({formData.images.length}):</strong>
                </small>
                <Row className="mt-2">
                  {formData.images.map((image, index) => (
                    <Col md={3} key={`existing-${index}`} className="mb-2">
                      <div style={{ position: "relative" }}>
                        <img
                          src={image}
                          alt={`Room ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "1px solid #dee2e6", // Gray border for existing images
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            padding: "2px 6px",
                          }}
                          onClick={() => removeImage(index)}
                          disabled={isUploadingImages || (formData.images.length + previewImages.length <= 5)}
                          title={(formData.images.length + previewImages.length <= 5) ? "Không thể xóa - cần tối thiểu 5 ảnh" : "Xóa ảnh"}
                        >
                          ×
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Error message for images */}
            {errors.images && (
              <div className="text-danger mt-2 small">
                {errors.images}
              </div>
            )}
          </Form.Group>

          {/* Status - only show in edit mode */}
          {editingRoom && (
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                disabled={true}
                value={formData.statusActive}
                onChange={(e) =>
                  handleInputChange("statusActive", e.target.value)
                }
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="NONACTIVE">Không hoạt động</option>
              </Form.Select>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleClose();
          }}
          disabled={isUploadingImages}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setShowUpdateModal(true);
          }}
          disabled={isUploadingImages}
        >
          {isUploadingImages ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang xử lý...
            </>
          ) : editingRoom ? (
            "Cập nhật"
          ) : (
            "Thêm phòng"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Room;
