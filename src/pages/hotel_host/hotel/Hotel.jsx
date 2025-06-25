import React, { useEffect, useState } from "react";
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
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  cityOptionSelect,
  districtsByCity,
  listFacilities,
  wardsByDistrict,
} from "@utils/data";
import { useAppSelector } from "../../../redux/store";
import { useDispatch } from "react-redux";
import HotelActions from "../../../redux/hotel/actions";
import { showToast } from "@components/ToastContainer";
import ConfirmationModal from "@components/ConfirmationModal";
import Factories from "@redux/hotel/factories"; // Import factories
import { Upload, X } from "lucide-react"; // Import icons

function Hotel({ show, handleClose, selectedHotelId }) {
  const [bedCount, setBedCount] = useState({
    singleBed: 1,
    doubleBed: 0,
    kingBed: 0,
    superKingBed: 0,
  });

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const half = Math.ceil(listFacilities.length / 2);
  const facilitiesCol1 = listFacilities.slice(0, half);
  const facilitiesCol2 = listFacilities.slice(half);
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const [loading, setLoading] = useState(false);
  const [hotelinfo, setHotelinfo] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(Auth);

  const [address, setAddress] = useState("");
  console.log("districtOptions: ", districtOptions);

  useEffect(() => {
    if (show) {
      fetchHotelInfo();
    }
  }, [show]);

  const fetchHotelInfo = () => {
    setLoading(true);
    dispatch({
      type: HotelActions.FETCH_OWNER_HOTEL,
      payload: {
        userId: formData._id,
        onSuccess: (data) => {
          setHotelinfo(data.hotels);
          console.log("hello tài dương", data.hotels);
          setLoading(false);
        },
        onFailed: () => {
          showToast.error("Lấy thông tin khách sạn thất bại");
          setLoading(false);
        },
        onError: (err) => {
          console.error(err);
          showToast.error("Lỗi máy chủ khi lấy thông tin khách sạn");
          setLoading(false);
        },
      },
    });
  };

  useEffect(() => {
    if (selectedCity && districtsByCity[selectedCity]) {
      setDistrictOptions(districtsByCity[selectedCity]);
    } else {
      setDistrictOptions([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict && wardsByDistrict[selectedDistrict]) {
      setWardOptions(wardsByDistrict[selectedDistrict]);
    } else {
      setWardOptions([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedHotelId) {
      // TODO: fetch dữ liệu khách sạn từ selectedHotelId
      console.log("Hotel ID được chọn:", selectedHotelId);
    }
  }, [selectedHotelId]);

  const getDistrictOptions = (cityValue) => {
    return districtsByCity[cityValue] || [];
  };

  const findCityValue = (cityLabel) => {
    const city = cityOptionSelect.find((c) => cityLabel.includes(c.label));
    return city ? city.value : "";
  };

  const findDistrictValue = (districtLabel, cityValue) => {
    const districts = districtsByCity[cityValue] || [];
    const district = districts.find((d) => districtLabel.includes(d.label));
    return district ? district.value : "";
  };

  const findWardValue = (wardLabel, districtValue) => {
    const wards = wardsByDistrict[districtValue] || [];
    const ward = wards.find((w) => wardLabel.includes(w.label));
    return ward ? ward.value : "";
  };

  useEffect(() => {
    if (hotelinfo?.length) {
      const fullAddress = hotelinfo[0].address;
      const parts = fullAddress.split(",").map((s) => s.trim());

      const cityLabel = parts.find((p) => p.includes("Thành phố")) || "";
      const districtLabel = parts.length === 4 ? parts[2] : parts[1];
      const wardLabel = parts.length === 4 ? parts[1] : "";
      const addressDetail = parts.slice(0, 1).join(", ");

      const cityValue = findCityValue(cityLabel);
      const districtValue = findDistrictValue(districtLabel, cityValue);
      const wardValue = findWardValue(wardLabel, districtValue);

      setSelectedCity(cityValue);

      const districts = getDistrictOptions(cityValue);
      setDistrictOptions(districts);

      // Đảm bảo districtValue có trong districts trước khi setSelectedDistrict
      if (districts.some((d) => d.value === districtValue)) {
        console.log("ABC: ", districtValue);
        setSelectedDistrict(districtValue);

        // Cập nhật danh sách phường/xã
        const wards = wardsByDistrict[districtValue] || [];
        setWardOptions(wards);

        // Đặt phường/xã đã chọn
        if (wards.some((w) => w.value === wardValue)) {
          setSelectedWard(wardValue);
        } else {
          setSelectedWard("");
        }
      } else {
        setSelectedDistrict("");
        setSelectedWard("");
      }

      setAddress(addressDetail);

      console.log("Full Address:", fullAddress);
      console.log("City Label:", cityLabel);
      console.log("District Label:", districtLabel);
      console.log("Ward Label:", wardLabel);
      console.log("City Value:", cityValue);
      console.log("District Value (from function):", districtValue);
      console.log("Ward Value (from function):", wardValue);
    }
  }, [hotelinfo]);

  useEffect(() => {
    if (selectedCity) {
      const districts = getDistrictOptions(selectedCity);
      console.log("🏙️ City selected:", selectedCity);
      console.log("🏘️ District list:", districts);
      setDistrictOptions(districts);
    }
  }, [selectedCity]);
  useEffect(() => {
    console.log("SelectedDistrict changed:", selectedDistrict);
  }, [selectedDistrict]);

  const [checkInStart, setCheckInStart] = useState("");
  const [checkInEnd, setCheckInEnd] = useState("");
  const [checkOutStart, setCheckOutStart] = useState("");
  const [checkOutEnd, setCheckOutEnd] = useState("");
  const [showModal, setShowModal] = useState(false);

  console.log("Check-in Start:", checkInStart);
  console.log("Check-in End:", checkInEnd);
  console.log("Check-out Start:", checkOutStart);
  console.log("Check-out End:", checkOutEnd);
  useEffect(() => {
    if (hotelinfo?.[0]) {
      setCheckInStart(hotelinfo[0].checkInStart);
      setCheckInEnd(hotelinfo[0].checkInEnd);
      setCheckOutStart(hotelinfo[0].checkOutStart);
      setCheckOutEnd(hotelinfo[0].checkOutEnd);
    }
  }, [hotelinfo]);

  const [hotelFacilities, setHotelFacilities] = useState([]);

  useEffect(() => {
    if (hotelinfo && hotelinfo.length > 0 && hotelinfo[0].facilities) {
      setHotelFacilities(hotelinfo[0].facilities.map((f) => f.name));
    }
  }, [hotelinfo]);

  // Xử lý thay đổi checkbox
  const handleFacilityChange = (facilityName) => {
    setHotelFacilities((prev) => {
      if (prev.includes(facilityName)) {
        // Bỏ tick
        return prev.filter((name) => name !== facilityName);
      } else {
        // Tick
        return [...prev, facilityName];
      }
    });
  };
  console.log("szzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", hotelinfo?.[0]?._id);

  /// UPDATE_HOTEL
  const handleSave = async () => {
    if (!hotelinfo?.[0]?._id) {
      showToast.error("Không tìm thấy ID khách sạn để cập nhật.");
      return;
    }

    const cityLabel =
      cityOptionSelect.find((c) => c.value === selectedCity)?.label || "";
    const districtLabel =
      districtOptions.find((d) => d.value === selectedDistrict)?.label || "";
    const wardLabel =
      wardOptions.find((w) => w.value === selectedWard)?.label || "";

    if (!address || !cityLabel || !districtLabel || !wardLabel) {
      showToast.error(
        "Vui lòng điền đầy đủ địa chỉ, thành phố, quận và phường."
      );
      return;
    }

    // Check minimum images requirement
    const totalImages = hotelImages.length + previewImages.length;
    if (totalImages < 5) {
      showToast.error("Khách sạn phải có ít nhất 5 ảnh!");
      return;
    }

    const fullAddress = `${address}, ${wardLabel}, ${districtLabel}, Thành phố ${cityLabel}`;

    try {
      let uploadedImages = [];
      
      // Upload new images if any
      if (previewImages.length > 0) {
        uploadedImages = await uploadImages();
        if (uploadedImages.length === 0 && previewImages.length > 0) {
          return; // Upload failed
        }
      }

      // Combine existing and new images
      const allImages = [...hotelImages, ...uploadedImages];
      
      // Clear local images after successful upload
      setPreviewImages([]);

      const updateData = {
        hotelName: hotelinfo?.[0]?.hotelName,
        description: hotelinfo?.[0]?.description || "",
        address: fullAddress,
        phoneNumber: hotelinfo?.[0]?.phoneNumber || "0934726073",
        services: hotelinfo?.[0]?.services || [],
        facilities: hotelFacilities,
        rating: hotelinfo?.[0]?.rating || 0,
        star: hotelinfo?.[0]?.star || 0,
        pricePerNight: hotelinfo?.[0]?.pricePerNight || 0,
        images: allImages, // Use combined images
        businessDocuments: hotelinfo?.[0]?.businessDocuments || [],
        adminStatus: hotelinfo?.[0]?.adminStatus || "",
        ownerStatus: hotelinfo?.[0]?.ownerStatus || "",
        checkInStart,
        checkInEnd,
        checkOutStart,
        checkOutEnd,
        email: hotelinfo?.[0]?.email || "",
      };

      setLoading(true);

      dispatch({
        type: HotelActions.UPDATE_HOTEL,
        payload: {
          hotelId: hotelinfo?.[0]?._id,
          updateData,
          onSuccess: (data) => {
            showToast.success("Cập nhật khách sạn thành công!");
            setLoading(false);
            window.location.reload();
            handleClose();
          },
          onFailed: (message) => {
            showToast.error(message || "Cập nhật khách sạn thất bại!");
            setLoading(false);
          },
          onError: (err) => {
            console.error(err);
            showToast.error("Lỗi máy chủ trong khi cập nhật khách sạn.");
            setLoading(false);
          },
        },
      });
    } catch (error) {
      console.error('Error in handleSave:', error);
      showToast.error("Có lỗi xảy ra: " + error.message);
      setLoading(false);
    }
  };

  const [hotelImages, setHotelImages] = useState([]);
  useEffect(() => {
    if (hotelinfo?.length > 0 && hotelinfo[0].images) {
      setHotelImages(hotelinfo[0].images); // hotelinfo[0].images = [url1, url2, ...]
    }
  }, [hotelinfo]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState([]); // For local file preview
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      showToast.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP");
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showToast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Remove max image limit - allow unlimited images
    // Create preview objects for local files
    const filesWithPreview = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      isLocal: true
    }));

    setPreviewImages(prev => [...prev, ...filesWithPreview]);
  };

  const removePreviewImage = (index) => {
    const imageToRemove = previewImages[index];
    const totalImages = hotelImages.length + previewImages.length;
    
    if (totalImages <= 5) {
      showToast.error("Khách sạn phải có ít nhất 5 ảnh!");
      return;
    }

    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const removeUploadedImage = async (index) => {
    const imageToRemove = hotelImages[index];
    const totalImages = hotelImages.length + previewImages.length;
    
    if (totalImages <= 5) {
      showToast.error("Khách sạn phải có ít nhất 5 ảnh!");
      return;
    }
    
    try {
      // Call API to delete from Cloudinary
      const response = await Factories.deleteHotelImages([imageToRemove.public_ID]);
      
      if (response.data && !response.data.error) {
        // Remove from local state
        setHotelImages(hotelImages.filter((_, i) => i !== index));
        showToast.success("Đã xóa ảnh thành công!");
      } else {
        throw new Error(response.data?.message || "Không thể xóa ảnh");
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast.error("Có lỗi xảy ra khi xóa ảnh: " + error.message);
    }
  };

  const uploadImages = async () => {
    if (previewImages.length === 0) return [];

    try {
      setIsUploadingImages(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      previewImages.forEach((imgObj) => {
        formData.append('images', imgObj.file);
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await Factories.uploadHotelImages(formData);
      
      if (response.data && !response.data.error) {
        // Cleanup local previews
        previewImages.forEach(img => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });

        setUploadProgress(100);
        showToast.success("Upload ảnh thành công!");
        return response.data.data.images;
      } else {
        throw new Error(response.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast.error("Có lỗi xảy ra khi upload ảnh: " + error.message);
      return [];
    } finally {
      setIsUploadingImages(false);
      setUploadProgress(0);
    }
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [previewImages]);

  const totalImages = hotelImages.length + previewImages.length;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <div className="booking-app bg-light">
        <ConfirmationModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onConfirm={handleSave}
          title="Xác nhận chỉnh sửa"
          message="Bạn muốn chỉnh sửa thông tin khách sản đúng không?"
          confirmButtonText="Chỉnh sửa"
          cancelButtonText="Hủy bỏ"
          type="success"
        />
        <Container className="py-4">
          <h2 className="mb-4 fw-bold">Chi tiết phòng</h2>

          {/* Room Type Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                  Tên chỗ nghỉ
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên chỗ nghỉ"
                  className="form-input"
                  value={hotelinfo?.[0]?.hotelName || ""}
                  onChange={(e) => {
                    const updatedHotels = [...hotelinfo];
                    updatedHotels[0] = {
                      ...updatedHotels[0],
                      hotelName: e.target.value,
                    };
                    setHotelinfo(updatedHotels);
                  }}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Room Type Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Form>
                {/* Thành phố */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Thành phố
                  </Form.Label>
                  <Form.Select
                    className="form-input"
                    value={selectedCity}
                    onChange={(e) => {
                      const cityVal = e.target.value;
                      setSelectedCity(cityVal);

                      const districts = getDistrictOptions(cityVal);
                      setDistrictOptions(districts);
                      setSelectedDistrict("");
                    }}
                  >
                    <option value="">Chọn thành phố</option>
                    {cityOptionSelect.map((city, index) => (
                      <option key={index} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Quận */}
                {/* <h1>{selectedDistrict || "Chưa chọn quận"}</h1> */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Quận / Huyện
                  </Form.Label>
                  <Form.Select
                    className="form-input"
                    value={selectedDistrict}
                    onChange={(e) => {
                      console.log("Quận đã chọn:", e.target.value);
                      setSelectedDistrict(e.target.value);
                    }}
                  >
                    <option value="">Chọn quận</option>
                    {districtOptions.map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* <h1>{selectedDistrict || "Chưa chọn quận"}</h1> */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Phường / Xã
                  </Form.Label>
                  <Form.Select
                    className="form-input"
                    value={selectedWard}
                    onChange={(e) => {
                      console.log("Phường/xã đã chọn:", e.target.value);
                      setSelectedWard(e.target.value);
                    }}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Chọn phường/xã</option>
                    {wardOptions.map((ward) => (
                      <option key={ward.value} value={ward.value}>
                        {ward.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Địa chỉ cụ thể */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Địa chỉ
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập địa chỉ cụ thể"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {/* Room Size Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Các tiện nghi
                  </Form.Label>
                  <Row>
                    <Col md={6}>
                      {facilitiesCol1.map((facility, index) => (
                        <Form.Check
                          key={`facility1-${index}`}
                          type="checkbox"
                          label={facility.name}
                          checked={hotelFacilities.includes(facility.name)}
                          onChange={() => handleFacilityChange(facility.name)}
                        />
                      ))}
                    </Col>
                    <Col md={6}>
                      {facilitiesCol2.map((facility, index) => (
                        <Form.Check
                          key={`facility2-${index}`}
                          type="checkbox"
                          label={facility.name}
                          checked={hotelFacilities.includes(facility.name)}
                          onChange={() => handleFacilityChange(facility.name)}
                        />
                      ))}
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          {/* Guest Capacity Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              {/* Nhận phòng */}
              <Row className="mb-2">
                <Col>
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Thời gian nhận trả phòng
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Từ</Form.Label>
                  <Form.Select
                    value={checkInStart}
                    onChange={(e) => setCheckInStart(e.target.value)}
                  >
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label>Đến</Form.Label>
                  <Form.Select
                    value={checkInEnd}
                    onChange={(e) => setCheckInEnd(e.target.value)}
                  >
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Trả phòng */}
              <Row className="mb-2 mt-4">
                <Col>
                  <h6>Trả phòng</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Từ</Form.Label>
                  <Form.Select
                    value={checkOutStart}
                    onChange={(e) => setCheckOutStart(e.target.value)}
                  >
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label>Đến</Form.Label>
                  <Form.Select
                    value={checkOutEnd}
                    onChange={(e) => setCheckOutEnd(e.target.value)}
                  >
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Room Name Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                {/* Facility Form */}
                <div
                  className="facility-form-card"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                  }}
                >
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        Tiêu chuẩn khách sạn
                      </Form.Label>
                      <Form.Select
                        value={hotelinfo?.[0]?.star?.toString() || ""}
                        onChange={(e) => {
                          const updatedHotels = [...hotelinfo];
                          updatedHotels[0] = {
                            ...updatedHotels[0],
                            star: e.target.value,
                          };
                          setHotelinfo(updatedHotels);
                        }}
                      >
                        <option value="1">1 sao</option>
                        <option value="2">2 sao</option>
                        <option value="3">3 sao</option>
                        <option value="4">4 sao</option>
                        <option value="5">5 sao</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        Liên lạc của khách sạn
                      </Form.Label>
                      <Col>
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập số điện thoại"
                          className="form-input"
                          value={hotelinfo?.[0]?.phoneNumber || ""}
                          onChange={(e) => {
                            const updatedHotels = [...hotelinfo];
                            updatedHotels[0] = {
                              ...updatedHotels[0],
                              phoneNumber: e.target.value,
                            };
                            setHotelinfo(updatedHotels);
                          }}
                        />
                      </Col>
                      <Col>
                        <Form.Label>Gmail</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập email khách sạn"
                          className="form-input"
                          value={hotelinfo?.[0]?.email || ""}
                          onChange={(e) => {
                            const updatedHotels = [...hotelinfo];
                            updatedHotels[0] = {
                              ...updatedHotels[0],
                              email: e.target.value,
                            };
                            setHotelinfo(updatedHotels);
                          }}
                        />
                      </Col>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        Mô tả về khách sạn{" "}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        value={hotelinfo?.[0]?.description || ""}
                        placeholder="Nhập mô tả khách sạn..."
                        onChange={(e) => {
                          const updatedHotels = [...hotelinfo];
                          updatedHotels[0] = {
                            ...updatedHotels[0],
                            description: e.target.value, // cập nhật đúng field description
                          };
                          setHotelinfo(updatedHotels);
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </Row>
            </Card.Body>
          </Card>
          {/* Images Section - Updated */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                    Hình ảnh khách sạn <span className="text-danger">*</span>
                    <span className="text-muted ms-2">({totalImages} ảnh)</span>
                  </Form.Label>

                  {/* Loading indicator */}
                  {isUploadingImages && (
                    <Alert variant="info" className="mb-3">
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
                    </Alert>
                  )}

                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploadingImages}
                  />
                  <Form.Text className="text-muted">
                    Chấp nhận JPG, PNG, WEBP. Tối đa 5MB mỗi ảnh. <strong>Tối thiểu 5 ảnh, không giới hạn tối đa.</strong>
                  </Form.Text>

                  {/* Show current image count */}
                  <div className="mt-2">
                    <small className="text-muted">
                      Tổng số ảnh: <strong>{totalImages}</strong> 
                      {totalImages < 5 && (
                        <span className="text-danger ms-2">
                          (Cần thêm {5 - totalImages} ảnh)
                        </span>
                      )}
                      {totalImages >= 5 && (
                        <span className="text-success ms-2">✓ Đủ số lượng ảnh</span>
                      )}
                    </small>
                  </div>

                  {/* Show preview images (newly selected images) */}
                  {previewImages.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2">
                        <strong>Ảnh mới chọn ({previewImages.length}):</strong>
                      </small>
                      <Row className="mt-2">
                        {previewImages.map((imgObj, index) => (
                          <Col md={3} key={`preview-${index}`} className="mb-3">
                            <div style={{ position: "relative" }}>
                              <img
                                src={imgObj.preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "2px solid #007bff",
                                }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  padding: "4px 8px",
                                  borderRadius: "50%",
                                  width: "30px",
                                  height: "30px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                                onClick={() => removePreviewImage(index)}
                                disabled={isUploadingImages || totalImages <= 5}
                                title={totalImages <= 5 ? "Không thể xóa - cần tối thiểu 5 ảnh" : "Xóa ảnh"}
                              >
                                ×
                              </Button>
                              <div className="mt-2">
                                <small className="text-muted d-block" style={{ fontSize: "13px" }}>
                                  {imgObj.name.length > 20 ? `${imgObj.name.substring(0, 20)}...` : imgObj.name}
                                </small>
                                <small className="text-warning d-block" style={{ fontSize: "12px" }}>
                                  Chưa upload ({(imgObj.size / 1024 / 1024).toFixed(1)}MB)
                                </small>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Show existing images */}
                  {hotelImages.length > 0 && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2">
                        <strong>Ảnh hiện tại ({hotelImages.length}):</strong>
                      </small>
                      <Row className="mt-2">
                        {hotelImages.map((img, index) => (
                          <Col md={3} key={`existing-${index}`} className="mb-3">
                            <div style={{ position: "relative" }}>
                              <img
                                src={img.url || "/placeholder.svg"}
                                alt={`Hotel image ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #dee2e6",
                                }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  padding: "4px 8px",
                                  borderRadius: "50%",
                                  width: "30px",
                                  height: "30px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                                onClick={() => removeUploadedImage(index)}
                                disabled={isUploadingImages || totalImages <= 5}
                                title={totalImages <= 5 ? "Không thể xóa - cần tối thiểu 5 ảnh" : "Xóa ảnh"}
                              >
                                ×
                              </Button>
                              <div className="mt-2">
                                <small className="text-success d-block" style={{ fontSize: "11px" }}>
                                  ✓ Đã lưu trên cloud
                                </small>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Error message for images */}
                  {totalImages < 5 && (
                    <div className="text-danger mt-2 small">
                      <strong>Khách sạn phải có ít nhất 5 ảnh</strong>
                    </div>
                  )}

                  {/* Add bulk actions for multiple selection */}
                  {(previewImages.length > 0 || hotelImages.length > 0) && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            <strong>Thao tác nhanh:</strong>
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          {previewImages.length > 0 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                if (totalImages - previewImages.length >= 5) {
                                  // Cleanup preview URLs
                                  previewImages.forEach(img => {
                                    if (img.preview) {
                                      URL.revokeObjectURL(img.preview);
                                    }
                                  });
                                  setPreviewImages([]);
                                  showToast.success("Đã xóa tất cả ảnh chưa upload!");
                                } else {
                                  showToast.error("Không thể xóa - cần giữ lại tối thiểu 5 ảnh!");
                                }
                              }}
                              disabled={isUploadingImages || (totalImages - previewImages.length < 5)}
                            >
                              Xóa tất cả ảnh mới
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <Row className="mt-4">
            <Col xs={6}>
              <Button
                variant="outline-danger"
                className="w-100 py-2"
                onClick={handleClose}
                disabled={isUploadingImages}
              >
                Hủy bỏ
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="primary"
                className="w-100 py-2"
                onClick={() => {
                  setShowModal(true);
                }}
                disabled={isUploadingImages || totalImages < 5}
              >
                {isUploadingImages ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Chỉnh sửa"
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </Modal>
  );
}

export default Hotel;
