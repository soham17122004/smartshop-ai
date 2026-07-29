import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FaBoxOpen,
  FaClock,
  FaMapMarkerAlt,
  FaPrint,
  FaCheckCircle,
  FaTruck,
  FaSync,
  FaArrowLeft,
  FaTimesCircle,
  FaUndoAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return modal state
  const [returnModal, setReturnModal] = useState({ open: false, orderId: null });
  const [returnReason, setReturnReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // track which orderId is in action

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders");
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Cancel order ${orderId}? This cannot be undone.`)) return;
    setActionLoading(orderId);
    try {
      await api.post(`/api/orders/${orderId}/cancel`);
      toast.success(`✅ Order ${orderId} has been cancelled successfully.`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not cancel order.");
    } finally {
      setActionLoading(null);
    }
  };

  const openReturnModal = (orderId) => {
    setReturnReason("");
    setReturnModal({ open: true, orderId });
  };

  const handleSubmitReturn = async () => {
    if (!returnReason.trim()) {
      toast.warning("Please enter a reason for your return request.");
      return;
    }
    setActionLoading(returnModal.orderId);
    try {
      await api.post(`/api/orders/${returnModal.orderId}/return`, { reason: returnReason });
      toast.success(`↩️ Return request for ${returnModal.orderId} submitted successfully!`);
      setReturnModal({ open: false, orderId: null });
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not submit return request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #0f172a; }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .header h1 { margin: 0; color: #6366f1; }
            .order-meta { font-size: 14px; color: #475569; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
            .table th { background: #f8fafc; }
            .total-row { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>SmartShop AI</h1>
              <p>Official Order Tax Invoice</p>
            </div>
            <div>
              <h3>${order.id}</h3>
              <p>${order.timestamp}</p>
            </div>
          </div>

          <div class="order-meta">
            <p><strong>Customer Name:</strong> ${order.name}</p>
            <p><strong>Mobile:</strong> ${order.mobile} | <strong>Email:</strong> ${order.email}</p>
            <p><strong>Shipping Address:</strong> ${order.address}</p>
            <p><strong>Payment Method:</strong> ${order.payment}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>₹${Number(item.price).toLocaleString("en-IN")}</td>
                  <td>₹${(Number(item.price) * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-row">
            <p>Subtotal: ₹${Number(order.subtotal || 0).toLocaleString("en-IN")}</p>
            ${order.discount > 0 ? `<p style="color: #10b981;">Discount: -₹${order.discount}</p>` : ""}
            <p>Delivery: ${order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</p>
            <p style="font-size: 22px; color: #6366f1;">Total Paid: ₹${Number(order.total || 0).toLocaleString("en-IN")}</p>
          </div>

          <div class="footer">
            <p>Thank you for shopping with SmartShop AI!</p>
            <p>© ${new Date().getFullYear()} SmartShop AI Inc.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const getStatusIcon = (status) => {
    if (status === "Delivered") return <FaCheckCircle />;
    if (status === "Cancelled") return <FaTimesCircle />;
    if (status === "Return Requested") return <FaUndoAlt />;
    return <FaTruck />;
  };

  return (
    <>
      <Navbar />

      <div className="my-orders-page">
        <div className="orders-header">
          <div>
            <span className="orders-badge">
              <FaBoxOpen /> Purchase History
            </span>
            <h2>My Orders &amp; Invoices</h2>
            <p>Track delivery status, cancel processing orders, or request returns.</p>
          </div>

          <Link to="/" className="back-btn">
            <FaArrowLeft /> Back to Store
          </Link>
        </div>

        {loading ? (
          <div className="orders-loading">
            <FaSync className="spin" />
            <p>Fetching your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <h1>📦</h1>
            <h2>No Orders Placed Yet</h2>
            <p>Explore our store and place your first order!</p>
            <Link to="/" className="shop-now-btn">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-history-card">
                {/* Top Bar */}
                <div className="card-top">
                  <div>
                    <span className="order-number">{order.id}</span>
                    <span className="order-date">
                      <FaClock /> {order.timestamp}
                    </span>
                  </div>

                  <div className="card-actions">
                    <span className={`status-badge status-${order.status.toLowerCase().replace(" ", "-")}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>

                    <button className="print-receipt-btn" onClick={() => handlePrint(order)}>
                      <FaPrint /> Print Invoice
                    </button>

                    {/* Cancel button — only for Processing */}
                    {order.status === "Processing" && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={actionLoading === order.id}
                      >
                        <FaTimesCircle />
                        {actionLoading === order.id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}

                    {/* Return/Refund button — only for Delivered */}
                    {order.status === "Delivered" && (
                      <button
                        className="return-order-btn"
                        onClick={() => openReturnModal(order.id)}
                        disabled={actionLoading === order.id}
                      >
                        <FaUndoAlt />
                        Return / Refund
                      </button>
                    )}
                  </div>
                </div>

                {/* Return reason pill if submitted */}
                {order.status === "Return Requested" && order.return_reason && (
                  <div className="return-reason-pill">
                    <FaExclamationTriangle /> Return Reason: <strong>{order.return_reason}</strong>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="order-timeline-bar">
                  <div className={`step ${["Processing", "Shipped", "Delivered"].includes(order.status) ? "active" : ""}`}>
                    <span>1. Processing</span>
                  </div>
                  <div className={`step ${["Shipped", "Delivered"].includes(order.status) ? "active" : ""}`}>
                    <span>2. Shipped</span>
                  </div>
                  <div className={`step ${order.status === "Delivered" ? "active" : ""}`}>
                    <span>3. Delivered</span>
                  </div>
                  {order.status === "Cancelled" && (
                    <div className="step step-cancelled active">
                      <span>❌ Cancelled</span>
                    </div>
                  )}
                  {order.status === "Return Requested" && (
                    <div className="step step-return active">
                      <span>↩️ Return Requested</span>
                    </div>
                  )}
                </div>

                {/* Items Grid */}
                <div className="order-items-grid">
                  <div className="items-column">
                    <h4>Purchased Items</h4>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"}
                          alt={item.title}
                        />
                        <div>
                          <h5>{item.title}</h5>
                          <span className="qty">
                            Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="shipping-column">
                    <h4>Shipping Address</h4>
                    <p className="recipient">
                      <strong>{order.name}</strong> ({order.mobile})
                    </p>
                    <p className="addr">
                      <FaMapMarkerAlt /> {order.address}
                    </p>
                    <span className="pay-method">Payment Method: {order.payment}</span>

                    <div className="total-box">
                      <span>Total Paid:</span>
                      <strong>₹{Number(order.total || 0).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Return Request Modal ===== */}
      {returnModal.open && (
        <div className="modal-backdrop" onClick={() => setReturnModal({ open: false, orderId: null })}>
          <div className="return-modal" onClick={(e) => e.stopPropagation()}>
            <div className="return-modal-header">
              <h3><FaUndoAlt /> Return / Refund Request</h3>
              <p>Order <strong>{returnModal.orderId}</strong></p>
            </div>

            <div className="return-modal-body">
              <label>Select Return Reason</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="return-reason-select"
              >
                <option value="">-- Select a reason --</option>
                <option value="Product damaged on delivery">Product damaged on delivery</option>
                <option value="Wrong item delivered">Wrong item delivered</option>
                <option value="Product not as described">Product not as described</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Better price available elsewhere">Better price available elsewhere</option>
                <option value="Product quality not satisfactory">Product quality not satisfactory</option>
                <option value="Missing parts or accessories">Missing parts or accessories</option>
              </select>

              <label style={{ marginTop: "14px" }}>Additional Details (optional)</label>
              <textarea
                className="return-reason-textarea"
                placeholder="Describe your issue in more detail..."
                rows={3}
                value={returnReason.includes("\n") ? returnReason.split("\n").slice(1).join("\n") : ""}
                onChange={(e) => {
                  const sel = returnReason.split("\n")[0];
                  setReturnReason(sel ? `${sel}\n${e.target.value}` : e.target.value);
                }}
              />
            </div>

            <div className="return-modal-footer">
              <button
                className="return-cancel-btn"
                onClick={() => setReturnModal({ open: false, orderId: null })}
              >
                Close
              </button>
              <button
                className="return-submit-btn"
                onClick={handleSubmitReturn}
                disabled={actionLoading === returnModal.orderId}
              >
                <FaUndoAlt />
                {actionLoading === returnModal.orderId ? "Submitting..." : "Submit Return Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default MyOrders;
