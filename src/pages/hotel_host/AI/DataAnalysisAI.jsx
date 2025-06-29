import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import RoomAvailabilityCalendar from "@pages/hotel_host/RoomAvailabilityCalendar";
import Transaction from "@pages/hotel_host/Transaction";
import AdditionalServicesPage from "../service/AdditionalServicesPage";
import RoomListingPage from "../../room/RoomListingPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import * as Routers from "../../../utils/Routes";
import MyAccountHotelPage from "../information/MyAccountHotelPage";
import HotelManagement from "../hotel/HotelManagement";
import ListFeedbackHotelPage from "../Feedback/ListFeedbackHotelPage";
import Chat from "../Chat";
import { useAppSelector } from "@redux/store";
import { Dropdown, Image } from "react-bootstrap";
import { useAppDispatch } from "@redux/store";
import DashBoardPage from "../dash_board/DashBoardPage";
import InsightAiPage from "./InSightAiPage";
import RevenuePage from "../revenue/RevenuePage";
import AuthActions from "@redux/auth/actions";
import { disconnectSocket } from "@redux/socket/socketSlice";
import { Manager } from "socket.io-client";
import ManagementBooking from "@pages/management_booking/ManagementBooking";
import MyReportPage from "../report/MyReportPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "revenue";
  });
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);
  const Socket = useAppSelector((state) => state.Socket.socket);

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-brand d-flex align-items-center justify-content-center">
            <i className="bi bi-building fs-2 me-2"></i>
            <h4 className="mb-0">Hotel partner</h4>
          </div>

          <ul className="nav flex-column">
            {/* <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("dashboard");
                }}
              >
                <i className="bi bi-speedometer2 nav-icon"></i>
                <span>Dashboard</span>
              </a>
            </li> */}
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "revenue" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("revenue");
                }}
              >
                <i className="bi bi-graph-up nav-icon"></i>
                <span>Doanh thu</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "transaction" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("transaction");
                }}
              >
                <i className="bi bi-credit-card nav-icon"></i>
                <span>Giao dịch</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "hotels" ? "active" : ""}`}
                href="#"
                onClick={() => {
                  setActiveTab("hotels");
                }}
              >
                <i className="bi bi-building"></i>
                <span style={{ marginLeft: "10px" }}>Quản lý khách sạn</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "services" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("services");
                }}
              >
                <i className="bi bi-people nav-icon"></i>
                <span>Quản lý dịch vụ</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "rooms" ? "active" : ""}`}
                href="#"
                onClick={() => {
                  setActiveTab("rooms");
                }}
              >
                <i className="bi bi-door-closed nav-icon"></i>
                <span>Quản lý loại phòng</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "bookings" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("bookings");
                }}
              >
                <i className="bi bi-calendar-check nav-icon"></i>
                <span>Đặt phòng</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "management_bookings" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("management_bookings");
                }}
              >
                <i className="bi-clipboard-data" />
                <span style={{ marginLeft: "10px" }}>Quản lý đặt phòng</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "feedbacks" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("feedbacks");
                }}
              >
                <i className="bi-chat-left-text" />
                <span style={{ marginLeft: "10px" }}>Đánh giá khách sạn</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "mess" ? "active" : ""}`}
                href="#"
                onClick={() => {
                  setActiveTab("mess");
                }}
              >
                <i className="bi bi-chat-dots nav-icon"></i>
                <span>Tin nhắn</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "my_report" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("my_report");
                }}
              >
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span style={{marginLeft: '5px'}}>Quản lý báo cáo</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "setting" ? "active" : ""
                }`}
                href="#"
                onClick={() => {
                  setActiveTab("setting");
                }}
              >
                <i className="bi bi-gear nav-icon"></i>
                <span>Cài đặt</span>
              </a>
            </li>
          </ul>

          <div className="mt-auto p-3">
            <div className="ai-assistant-card p-3">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-robot fs-3 me-2"></i>
                <h6 className="mb-0">Trợ lý AI</h6>
              </div>
              <p className="small mb-2">
                Hỏi tôi bất cứ điều gì về khách sạn của bạn
              </p>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nhập câu hỏi..."
                />
                <button className="btn btn-primary btn-sm">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          {/* Header */}
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container-fluid">
              <button className="btn btn-sm" type="button">
                <i className="bi bi-list fs-5"></i>
              </button>
              <div className="d-flex align-items-center">
                {/* <div className="dropdown me-3">
                  <button
                    className="btn btn-sm position-relative"
                    type="button"
                  >
                    <i className="bi bi-bell fs-5"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      3
                    </span>
                  </button>
                </div> */}
                {Auth._id !== -1 && (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      className="login-btn d-flex align-items-center"
                    >
                      <a
                        style={{
                          display: "inline-block",
                          maxWidth: "150px", // hoặc width tùy bạn
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {Auth.name}
                      </a>{" "}
                      <Image
                        src={
                          Auth?.image?.url != "" &&
                          Auth?.image?.url != undefined
                            ? Auth?.image?.url
                            : "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
                        }
                        roundedCircle
                        width="30"
                        height="30"
                        className="ms-2 me-2"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          dispatch(disconnectSocket());
                          dispatch({ type: AuthActions.LOGOUT });
                          navigate(Routers.HomeHotel, {
                            state: {
                              message: "Logout account successfully !!!",
                            },
                          });
                        }}
                      >
                        Đăng xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </nav>

          {/* Dashboard Content */}
          <div className="container-fluid">
            {/* {activeTab === "dashboard" && (
              <DashBoardPage setActiveTab={setActiveTab} />
            )} */}

            {activeTab === "ai-insights" && <InsightAiPage />}

            {activeTab === "bookings" && (
              <>
                <RoomAvailabilityCalendar />
              </>
            )}

            {activeTab === "transaction" && (
              <>
                <Transaction />
              </>
            )}

            {activeTab === "hotels" && (
              <>
                <HotelManagement />
              </>
            )}

            {activeTab === "rooms" && (
              <>
                <RoomListingPage />
              </>
            )}

            {activeTab === "services" && (
              <>
                <AdditionalServicesPage />
              </>
            )}

            {activeTab === "settings" && (
              <>
                <MyAccountHotelPage />
              </>
            )}

            {activeTab === "feedbacks" && (
              <>
                <ListFeedbackHotelPage />
              </>
            )}
            {activeTab === "mess" && (
              <>
                <Chat />
              </>
            )}
            {activeTab === "setting" && (
              <>
                <MyAccountHotelPage />
              </>
            )}

            {activeTab === "revenue" && <RevenuePage />}
            {activeTab === "management_bookings" && <ManagementBooking />}
            {activeTab === "my_report" && <MyReportPage />}
          </div>
        </div>
      </div>

      <style>
        {`
          body {
            margin: 0;
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa;
            overflow-x: hidden;
          }
          
          .sidebar {
            width: 250px;
            min-height: 100vh;
            padding: 0;
            display: flex;
            flex-direction: column;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            background-color: #212529;
            color: white;
          }
          
          .sidebar-brand {
            background-color: #212529;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px 0;
          }
          
          .main-content {
            flex-grow: 1;
            margin-left: 250px;
            min-height: 100vh;
            background-color: #f8f9fa;
          }
          
          .nav-item {
            margin-bottom: 2px;
          }
          
          .nav-link {
            padding: 12px 20px;
            transition: all 0.3s;
            color: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
          }
          
          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #fff !important;
          }
          
          .nav-link.active {
            background-color: #0d6efd;
            color: #fff;
          }
          
          .nav-icon {
            width: 20px;
            margin-right: 10px;
            text-align: center;
          }
          
          .card {
            border-radius: 10px;
            transition: transform 0.3s, box-shadow 0.3s;
            margin-bottom: 20px;
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          
          .light-primary {
            background-color: rgba(13, 110, 253, 0.1);
            color: #0d6efd;
          }
          
          .light-success {
            background-color: rgba(25, 135, 84, 0.1);
            color: #198754;
          }
          
          .light-warning {
            background-color: rgba(255, 193, 7, 0.1);
            color: #ffc107;
          }
          
          .light-info {
            background-color: rgba(13, 202, 240, 0.1);
            color: #0dcaf0;
          }
          
          .ai-assistant-card {
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
          }
          
          .ai-insight-item {
            transition: all 0.3s;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #f8f9fa;
            border-left: 5px solid #0d6efd;
          }
          
          .ai-insight-item:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .insight-icon {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          
          .chart-container {
            height: 250px;
          }
          
          .table th {
            font-weight: 600;
            font-size: 0.85rem;
          }
          
          .table-hover tbody tr:hover {
            background-color: rgba(13, 110, 253, 0.05);
          }
          
          @media (max-width: 992px) {
            .sidebar {
              width: 70px !important;
            }
            
            .sidebar .nav-link span, .sidebar-brand h4 {
              display: none;
            }
            
            .main-content {
              margin-left: 70px !important;
            }
          }
          
          @media (max-width: 768px) {
            .sidebar {
              width: 0 !important;
              transform: translateX(-100%);
            }
            
            .main-content {
              margin-left: 0 !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default App;
