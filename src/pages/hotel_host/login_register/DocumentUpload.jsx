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
} from "react-bootstrap";
import { Upload, CheckCircle, XCircle } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/hotelHost/DocumentUpload.css";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";

function DocumentUpload() {
  const navigate= useNavigate();
  const [documents, setDocuments] = useState({
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

  const handleFileChange = (event, documentType) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: file,
      }));

      // Simulate upload progress
      simulateUploadProgress(documentType);
    }
  };

  const simulateUploadProgress = (documentType) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({
        ...prev,
        [documentType]: progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus((prev) => ({
          ...prev,
          [documentType]: "success",
        }));
      }
    }, 300);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    alert("Documents submitted successfully!");
  };

  const renderUploadStatus = (status) => {
    if (status === "success") {
      return <CheckCircle className="text-success ms-2" />;
    } else if (status === "error") {
      return <XCircle className="text-danger ms-2" />;
    }
    return null;
  };

  return (
    <div style={styles.bookingApp}>
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
              <h4 className="mb-0">Document Upload</h4>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                Please upload the required documents to complete your
                registration. All documents should be in PDF or image format.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  {/* Business License */}
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body>
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            Business License
                            <span className="text-danger">*</span>
                            {renderUploadStatus(uploadStatus.businessLicense)}
                          </Form.Label>
                          <div className="upload-box">
                            <Form.Control
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) =>
                                handleFileChange(e, "businessLicense")
                              }
                              required
                            />
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>Drag & drop or click to upload</p>
                            </div>
                          </div>
                          {uploadProgress.businessLicense > 0 && (
                            <ProgressBar
                              now={uploadProgress.businessLicense}
                              label={`${uploadProgress.businessLicense}%`}
                              className="mt-2"
                            />
                          )}
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
                            Fire Safety Certificate
                            <span className="text-danger">*</span>
                            {renderUploadStatus(uploadStatus.fireSafety)}
                          </Form.Label>
                          <div className="upload-box">
                            <Form.Control
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) =>
                                handleFileChange(e, "fireSafety")
                              }
                              required
                            />
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>Drag & drop or click to upload</p>
                            </div>
                          </div>
                          {uploadProgress.fireSafety > 0 && (
                            <ProgressBar
                              now={uploadProgress.fireSafety}
                              label={`${uploadProgress.fireSafety}%`}
                              className="mt-2"
                            />
                          )}
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
                            Tax Registration Certificate
                            <span className="text-danger">*</span>
                            {renderUploadStatus(uploadStatus.taxCertificate)}
                          </Form.Label>
                          <div className="upload-box">
                            <Form.Control
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) =>
                                handleFileChange(e, "taxCertificate")
                              }
                              required
                            />
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>Drag & drop or click to upload</p>
                            </div>
                          </div>
                          {uploadProgress.taxCertificate > 0 && (
                            <ProgressBar
                              now={uploadProgress.taxCertificate}
                              label={`${uploadProgress.taxCertificate}%`}
                              className="mt-2"
                            />
                          )}
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
                            Other Supporting Documents
                            {renderUploadStatus(uploadStatus.otherDocuments)}
                          </Form.Label>
                          <div className="upload-box">
                            <Form.Control
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) =>
                                handleFileChange(e, "otherDocuments")
                              }
                              multiple
                            />
                            <div className="upload-placeholder">
                              <Upload size={24} />
                              <p>
                                Drag & drop or click to upload multiple files
                              </p>
                            </div>
                          </div>
                          {uploadProgress.otherDocuments > 0 && (
                            <ProgressBar
                              now={uploadProgress.otherDocuments}
                              label={`${uploadProgress.otherDocuments}%`}
                              className="mt-2"
                            />
                          )}
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button type="submit" variant="primary"
                    onClick={() => {
                      navigate('/BookingPropertyChecklist');
                    }}
                  >
                    Submit Documents
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>

  );
}

const styles = {
  // Main container styles
  bookingApp: {
    minHeight: "100vh"
  },
  
  // Navbar styles
  navbarCustom: {
    backgroundColor: "#003580",
    padding: "10px 0"
  },
  navbarBrand: {
    color: "#fff",
    fontWeight: "bold"
  },
}
export default DocumentUpload;

