import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  ProgressBar,
  Alert,
  Row,
  Col,
  Navbar,
  Spinner,
} from "react-bootstrap";
import { Upload, CheckCircle, XCircle, X, FileEarmark } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/hotelHost/DocumentUpload.css";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { showToast, ToastProvider } from "@components/ToastContainer";
import Factories from "@redux/hotel/factories";

function DocumentUpload() {
  const navigate = useNavigate();
  
  // State for uploaded documents (from server)
  const [uploadedDocuments, setUploadedDocuments] = useState({
    businessLicense: null,
    fireSafety: null,
    taxCertificate: null,
    otherDocuments: [],
  });

  // State for local preview files
  const [localDocuments, setLocalDocuments] = useState({
    businessLicense: null,
    fireSafety: null,
    taxCertificate: null,
    otherDocuments: [],
  });

  const [uploadProgress, setUploadProgress] = useState({
    businessLicense: 0,
    fireSafety: 0,
    taxCertificate: 0,
    otherDocuments: 0,
  });

  const [uploadStatus, setUploadStatus] = useState({
    businessLicense: "",
    fireSafety: "",
    taxCertificate: "",
    otherDocuments: "",
  });

  console.log("uploadedDocuments:", uploadedDocuments);
  console.log("localDocuments:", localDocuments);
  console.log("uploadProgress:", uploadProgress);
  console.log("uploadStatus:", uploadStatus);

  const [isUploading, setIsUploading] = useState(false);

  // Validate file type and size
  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      showToast.error("Chỉ chấp nhận file PDF, JPG, PNG");
      return false;
    }

    if (file.size > maxSize) {
      showToast.error("Kích thước file không được vượt quá 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (event, documentType) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;

    if (documentType === 'otherDocuments') {
      // Handle multiple files for other documents
      const validFiles = Array.from(files).filter(validateFile);
      
      if (validFiles.length > 0) {
        const filesWithPreview = validFiles.map(file => ({
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          isLocal: true
        }));

        setLocalDocuments(prev => ({
          ...prev,
          [documentType]: [...prev[documentType], ...filesWithPreview]
        }));
      }
    } else {
      // Handle single file for required documents
      const file = files[0];
      
      if (validateFile(file)) {
        const fileObj = {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          isLocal: true
        };

        setLocalDocuments(prev => ({
          ...prev,
          [documentType]: fileObj
        }));

        // Simulate upload progress for UI feedback
        simulateUploadProgress(documentType);
      }
    }

    // Reset input value
    event.target.value = '';
  };

  const simulateUploadProgress = (documentType) => {
    let progress = 0;
    setUploadStatus(prev => ({ ...prev, [documentType]: "uploading" }));
    
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(prev => ({
        ...prev,
        [documentType]: progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus(prev => ({
          ...prev,
          [documentType]: "ready",
        }));
      }
    }, 200);
  };

  // Remove local document
  const removeLocalDocument = (documentType, index = null) => {
    if (documentType === 'otherDocuments' && index !== null) {
      const docToRemove = localDocuments[documentType][index];
      if (docToRemove.preview) {
        URL.revokeObjectURL(docToRemove.preview);
      }
      
      setLocalDocuments(prev => ({
        ...prev,
        [documentType]: prev[documentType].filter((_, i) => i !== index)
      }));
    } else {
      const docToRemove = localDocuments[documentType];
      if (docToRemove && docToRemove.preview) {
        URL.revokeObjectURL(docToRemove.preview);
      }
      
      setLocalDocuments(prev => ({
        ...prev,
        [documentType]: null
      }));
      
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
      setUploadStatus(prev => ({ ...prev, [documentType]: "" }));
    }
  };

  // Remove uploaded document
  const removeUploadedDocument = async (documentType, publicId, index = null) => {
    try {
      const response = await Factories.deleteHotelDocuments([publicId]);
      
      if (response.data && !response.data.error) {
        if (documentType === 'otherDocuments' && index !== null) {
          setUploadedDocuments(prev => ({
            ...prev,
            [documentType]: prev[documentType].filter((_, i) => i !== index)
          }));
        } else {
          setUploadedDocuments(prev => ({
            ...prev,
            [documentType]: null
          }));
        }
        
        showToast.success("Đã xóa tài liệu thành công!");
      } else {
        throw new Error(response.data?.message || "Không thể xóa tài liệu");
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      showToast.error("Có lỗi xảy ra khi xóa tài liệu: " + error.message);
    }
  };

  // Upload documents to server
  const uploadDocuments = async () => {
    try {
      setIsUploading(true);
      const uploadedDocs = { ...uploadedDocuments };

      // Upload single documents
      for (const docType of ['businessLicense', 'fireSafety', 'taxCertificate']) {
        const localDoc = localDocuments[docType];
        if (localDoc && localDoc.file) {
          const formData = new FormData();
          formData.append('document', localDoc.file);
          formData.append('documentType', docType);

          const response = await Factories.uploadHotelDocument(formData);
          
          if (response.data && !response.data.error) {
            uploadedDocs[docType] = response.data.data;
            // Clean up local preview
            if (localDoc.preview) {
              URL.revokeObjectURL(localDoc.preview);
            }
          }
        }
      }

      // Upload other documents
      const otherDocs = localDocuments.otherDocuments;
      if (otherDocs.length > 0) {
        for (const doc of otherDocs) {
          if (doc.file) {
            const formData = new FormData();
            formData.append('document', doc.file);
            formData.append('documentType', 'otherDocuments');

            const response = await Factories.uploadHotelDocument(formData);
            
            if (response.data && !response.data.error) {
              uploadedDocs.otherDocuments.push(response.data.data);
              // Clean up local preview
              if (doc.preview) {
                URL.revokeObjectURL(doc.preview);
              }
            }
          }
        }
      }

      setUploadedDocuments(uploadedDocs);
      
      // Clear local documents after successful upload
      setLocalDocuments({
        businessLicense: null,
        fireSafety: null,
        taxCertificate: null,
        otherDocuments: [],
      });

      showToast.success("Upload tài liệu thành công!");
      return true;
    } catch (error) {
      console.error('Error uploading documents:', error);
      showToast.error("Có lỗi xảy ra khi upload tài liệu: " + error.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check required documents
    const requiredDocs = ['businessLicense', 'fireSafety', 'taxCertificate'];
    const missingDocs = requiredDocs.filter(docType => 
      !uploadedDocuments[docType] && !localDocuments[docType]
    );

    if (missingDocs.length > 0) {
      showToast.error("Vui lòng upload đầy đủ tài liệu bắt buộc");
      return;
    }

    // Upload any pending local documents
    const hasLocalDocs = Object.values(localDocuments).some(doc => 
      doc && (doc.file || (Array.isArray(doc) && doc.length > 0))
    );

    if (hasLocalDocs) {
      const uploadSuccess = await uploadDocuments();
      if (!uploadSuccess) return;
    }

    // Navigate to next page
    navigate('/BookingPropertyChecklist');
  };

  const renderUploadStatus = (status) => {
    switch (status) {
      case "success":
      case "ready":
        return <CheckCircle className="text-success ms-2" />;
      case "uploading":
        return <Spinner animation="border" size="sm" className="ms-2" />;
      case "error":
        return <XCircle className="text-danger ms-2" />;
      default:
        return null;
    }
  };

  const renderDocumentPreview = (document, documentType, index = null) => {
    const isImage = document.type?.startsWith('image/') || document.url?.includes('.jpg') || document.url?.includes('.png');
    
    return (
      <div className="document-preview mb-2" key={index || 'single'}>
        <div className="preview-content">
          {isImage ? (
            <img 
              src={document.preview || document.url} 
              alt={document.name}
              className="preview-image"
            />
          ) : (
            <div className="file-icon">
              <FileEarmark size={48} />
            </div>
          )}
          <div className="document-info">
            <p className="document-name">{document.name}</p>
            <p className="document-size">
              {document.size ? (document.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
            </p>
            {document.isLocal && (
              <small className="text-warning">Chưa upload</small>
            )}
            {!document.isLocal && (
              <small className="text-success">✓ Đã lưu</small>
            )}
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          className="remove-btn"
          onClick={() => {
            if (document.isLocal) {
              removeLocalDocument(documentType, index);
            } else {
              removeUploadedDocument(documentType, document.public_ID, index);
            }
          }}
          title="Xóa tài liệu"
        >
          <X size={16} />
        </Button>
      </div>
    );
  };

  const getDocumentCount = (documentType) => {
    const uploaded = uploadedDocuments[documentType];
    const local = localDocuments[documentType];
    
    if (documentType === 'otherDocuments') {
      return (uploaded?.length || 0) + (local?.length || 0);
    } else {
      return (uploaded ? 1 : 0) + (local ? 1 : 0);
    }
  };

  return (
    <div style={styles.bookingApp}>
      <ToastProvider />
      
      {/* Navigation Bar */}
      <Navbar style={styles.navbarCustom}>
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold">
            <b style={{ fontSize: 30 }}>
              UR<span style={{ color: "#f8e71c" }}>OO</span>M
            </b>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-secondary text-white">
            <h4 className="mb-0">Upload Tài Liệu Kinh Doanh</h4>
          </Card.Header>
          <Card.Body>
            {isUploading && (
              <Alert variant="info" className="mb-4">
                <div className="d-flex align-items-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang upload tài liệu...
                </div>
              </Alert>
            )}

            <Alert variant="info" className="mb-4">
              Vui lòng upload các tài liệu cần thiết để hoàn tất đăng ký. 
              Tất cả tài liệu nên ở định dạng PDF hoặc hình ảnh (JPG, PNG).
            </Alert>

            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                {/* Business License */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          Giấy Phép Kinh Doanh
                          <span className="text-danger">*</span>
                          {renderUploadStatus(uploadStatus.businessLicense)}
                          <span className="badge bg-secondary ms-2">
                            {getDocumentCount('businessLicense')}/1
                          </span>
                        </Form.Label>

                        {/* File Input */}
                        <div className="upload-box">
                          <Form.Control
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "businessLicense")}
                            disabled={isUploading || getDocumentCount('businessLicense') >= 1}
                            style={{ display: getDocumentCount('businessLicense') >= 1 ? 'none' : 'block' }}
                          />
                          {getDocumentCount('businessLicense') === 0 && (
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>Kéo thả hoặc nhấn để chọn file</p>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {uploadProgress.businessLicense > 0 && uploadProgress.businessLicense < 100 && (
                          <ProgressBar
                            now={uploadProgress.businessLicense}
                            label={`${uploadProgress.businessLicense}%`}
                            className="mt-2"
                          />
                        )}

                        {/* Document Previews */}
                        <div className="document-list mt-3">
                          {uploadedDocuments.businessLicense && 
                            renderDocumentPreview(uploadedDocuments.businessLicense, 'businessLicense')}
                          {localDocuments.businessLicense && 
                            renderDocumentPreview(localDocuments.businessLicense, 'businessLicense')}
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Fire Safety Certificate */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          Giấy Chứng Nhận PCCC
                          <span className="text-danger">*</span>
                          {renderUploadStatus(uploadStatus.fireSafety)}
                          <span className="badge bg-secondary ms-2">
                            {getDocumentCount('fireSafety')}/1
                          </span>
                        </Form.Label>

                        <div className="upload-box">
                          <Form.Control
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "fireSafety")}
                            disabled={isUploading || getDocumentCount('fireSafety') >= 1}
                            style={{ display: getDocumentCount('fireSafety') >= 1 ? 'none' : 'block' }}
                          />
                          {getDocumentCount('fireSafety') === 0 && (
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>Kéo thả hoặc nhấn để chọn file</p>
                            </div>
                          )}
                        </div>

                        {uploadProgress.fireSafety > 0 && uploadProgress.fireSafety < 100 && (
                          <ProgressBar
                            now={uploadProgress.fireSafety}
                            label={`${uploadProgress.fireSafety}%`}
                            className="mt-2"
                          />
                        )}

                        <div className="document-list mt-3">
                          {uploadedDocuments.fireSafety && 
                            renderDocumentPreview(uploadedDocuments.fireSafety, 'fireSafety')}
                          {localDocuments.fireSafety && 
                            renderDocumentPreview(localDocuments.fireSafety, 'fireSafety')}
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Tax Certificate */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          Giấy Chứng Nhận Thuế
                          <span className="text-danger">*</span>
                          {renderUploadStatus(uploadStatus.taxCertificate)}
                          <span className="badge bg-secondary ms-2">
                            {getDocumentCount('taxCertificate')}/1
                          </span>
                        </Form.Label>

                        <div className="upload-box">
                          <Form.Control
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "taxCertificate")}
                            disabled={isUploading || getDocumentCount('taxCertificate') >= 1}
                            style={{ display: getDocumentCount('taxCertificate') >= 1 ? 'none' : 'block' }}
                          />
                          {getDocumentCount('taxCertificate') === 0 && (
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>Kéo thả hoặc nhấn để chọn file</p>
                            </div>
                          )}
                        </div>

                        {uploadProgress.taxCertificate > 0 && uploadProgress.taxCertificate < 100 && (
                          <ProgressBar
                            now={uploadProgress.taxCertificate}
                            label={`${uploadProgress.taxCertificate}%`}
                            className="mt-2"
                          />
                        )}

                        <div className="document-list mt-3">
                          {uploadedDocuments.taxCertificate && 
                            renderDocumentPreview(uploadedDocuments.taxCertificate, 'taxCertificate')}
                          {localDocuments.taxCertificate && 
                            renderDocumentPreview(localDocuments.taxCertificate, 'taxCertificate')}
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Other Documents */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold">
                          Tài Liệu Khác (Tùy chọn)
                          {renderUploadStatus(uploadStatus.otherDocuments)}
                          <span className="badge bg-secondary ms-2">
                            {getDocumentCount('otherDocuments')} files
                          </span>
                        </Form.Label>

                        <div className="upload-box">
                          <Form.Control
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "otherDocuments")}
                            multiple
                            disabled={isUploading}
                          />
                          <div className="upload-placeholder">
                            <Upload size={24} />
                            <p>Kéo thả hoặc nhấn để chọn nhiều file</p>
                          </div>
                        </div>

                        {uploadProgress.otherDocuments > 0 && uploadProgress.otherDocuments < 100 && (
                          <ProgressBar
                            now={uploadProgress.otherDocuments}
                            label={`${uploadProgress.otherDocuments}%`}
                            className="mt-2"
                          />
                        )}

                        <div className="document-list mt-3">
                          {uploadedDocuments.otherDocuments.map((doc, index) => 
                            renderDocumentPreview(doc, 'otherDocuments', index)
                          )}
                          {localDocuments.otherDocuments.map((doc, index) => 
                            renderDocumentPreview(doc, 'otherDocuments', index)
                          )}
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(-1)}
                  disabled={isUploading}
                >
                  Quay lại
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Gửi Tài Liệu"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <style jsx>{`
        .upload-box {
          position: relative;
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }

        .upload-box:hover {
          border-color: #0071c2;
          background-color: #f0f8ff;
        }

        .upload-placeholder {
          pointer-events: none;
        }

        .upload-placeholder p {
          margin: 8px 0 0 0;
          color: #6c757d;
          font-size: 14px;
        }

        .document-preview {
          display: flex;
          align-items: center;
          padding: 8px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background-color: #f8f9fa;
          position: relative;
        }

        .preview-content {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 12px;
        }

        .preview-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }

        .file-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          border-radius: 4px;
          color: #6c757d;
        }

        .document-info {
          flex: 1;
        }

        .document-name {
          margin: 0;
          font-weight: 500;
          font-size: 14px;
          color: #333;
          word-break: break-word;
        }

        .document-size {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #6c757d;
        }

        .remove-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin-left: 8px;
        }

        .document-list {
          max-height: 300px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .upload-box {
            padding: 16px;
          }
          
          .preview-image,
          .file-icon {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  bookingApp: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  navbarCustom: {
    backgroundColor: "#003580",
    padding: "10px 0"
  },
};

export default DocumentUpload;

