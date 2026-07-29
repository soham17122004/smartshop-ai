import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  FaChartLine,
  FaShoppingBag,
  FaRupeeSign,
  FaBoxes,
  FaSearch,
  FaSync,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminProductModal from "../components/AdminProductModal";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_items_sold: 0,
    avg_order_value: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [productModalOpen, setProductModalOpen] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get("/api/orders"),
        api.get("/api/admin/stats"),
      ]);

      if (Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Fetch Admin Error:", error);
      toast.error("Failed to fetch Admin orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${orderId} updated to ${newStatus}`);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mobile.includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />

      <div className="admin-page">
        {/* Admin Header Banner */}
        <div className="admin-header">
          <div>
            <span className="admin-badge">⚡ Real-Time Store Management</span>
            <h2>Admin Order & Catalog Dashboard</h2>
            <p>Monitor live customer orders, add new products, and manage fulfillment.</p>
          </div>

          <div className="admin-header-btns">
            <button
              className="add-product-btn"
              onClick={() => setProductModalOpen(true)}
            >
              <FaPlus /> Add New Product
            </button>
            <button className="refresh-btn" onClick={fetchAdminData}>
              <FaSync className={loading ? "spin" : ""} /> Refresh Data
            </button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="admin-kpi-grid">
          <div className="kpi-card kpi-purple">
            <div className="kpi-icon">
              <FaRupeeSign />
            </div>
            <div>
              <h3>₹{Number(stats.total_revenue || 0).toLocaleString("en-IN")}</h3>
              <p>Total Store Revenue</p>
            </div>
          </div>

          <div className="kpi-card kpi-blue">
            <div className="kpi-icon">
              <FaShoppingBag />
            </div>
            <div>
              <h3>{stats.total_orders || 0}</h3>
              <p>Total Placed Orders</p>
            </div>
          </div>

          <div className="kpi-card kpi-emerald">
            <div className="kpi-icon">
              <FaBoxes />
            </div>
            <div>
              <h3>{stats.total_items_sold || 0}</h3>
              <p>Total Products Sold</p>
            </div>
          </div>

          <div className="kpi-card kpi-orange">
            <div className="kpi-icon">
              <FaChartLine />
            </div>
            <div>
              <h3>₹{Number(stats.avg_order_value || 0).toLocaleString("en-IN")}</h3>
              <p>Average Order Value</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="admin-filter-bar">
          <div className="admin-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter-pills">
            {["All", "Processing", "Shipped", "Delivered", "Cancelled", "Return Requested", "Refunded"].map((status) => (
              <button
                key={status}
                className={`status-pill ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Live Orders Section */}
        <div className="admin-orders-container">
          <div className="orders-table-header">
            <h3>Recent Customer Orders ({filteredOrders.length})</h3>
          </div>

          {loading ? (
            <div className="admin-loading">
              <FaSync className="spin" />
              <p>Loading live store orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="admin-empty">
              <p>📦 No customer orders match your search criteria.</p>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  {/* Card Header */}
                  <div className="order-card-header">
                    <div className="order-id-box">
                      <span className="order-id">{order.id}</span>
                      <span className="order-time">
                        <FaClock /> {order.timestamp}
                      </span>
                    </div>

                    <div className="order-status-selector">
                      <label>Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`status-select status-${order.status.toLowerCase().replace(" ", "-")}`}
                      >
                        <option value="Processing">Processing ⏳</option>
                        <option value="Shipped">Shipped 🚚</option>
                        <option value="Delivered">Delivered ✅</option>
                        <option value="Cancelled">Cancelled ❌</option>
                        <option value="Return Requested">Return Requested ↩️</option>
                        <option value="Return Approved">Return Approved ✔️</option>
                        <option value="Refunded">Refunded 💰</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info & Order Grid */}
                  <div className="order-card-body">
                    {/* Left: Customer Info */}
                    <div className="customer-info-box">
                      <h4>
                        <FaUser /> {order.name}
                      </h4>
                      <p>📞 {order.mobile}</p>
                      <p>✉️ {order.email}</p>
                      <p className="address">
                        <FaMapMarkerAlt /> {order.address}
                      </p>
                      <span className="payment-tag">
                        💳 Payment: <strong>{order.payment}</strong>
                      </span>
                    </div>

                    {/* Right: Items Purchased List */}
                    <div className="order-items-box">
                      <h4>Purchased Items ({order.items?.length || 0})</h4>
                      <div className="items-mini-list">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="item-mini-card">
                            <img
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                              }
                              alt={item.title}
                            />
                            <div className="item-mini-details">
                              <span className="title">{item.title}</span>
                              <span className="qty-price">
                                Qty: {item.quantity} × ₹
                                {Number(item.price).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Calculation */}
                      <div className="order-total-bar">
                        <span>
                          Subtotal: ₹
                          {Number(order.subtotal || 0).toLocaleString("en-IN")}
                        </span>
                        {order.discount > 0 && (
                          <span className="discount-tag">
                            Discount: -₹{order.discount}
                          </span>
                        )}
                        <strong className="grand-total">
                          Total Paid: ₹
                          {Number(order.total || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Add Product Modal */}
      <AdminProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onProductAdded={() => {
          fetchAdminData();
        }}
      />

      <Footer />
    </>
  );
}

export default AdminDashboard;
