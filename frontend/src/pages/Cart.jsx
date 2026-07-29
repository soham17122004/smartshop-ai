import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
} from "react-icons/fa";

import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import "../styles/Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(items);
  };

  const saveCart = (items) => {
    localStorage.setItem(
      "cart",
      JSON.stringify(items)
    );

    setCart(items);

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const increaseQty = (asin) => {
    const updated = cart.map((item) =>
      item.asin === asin
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updated);
  };

  const decreaseQty = (asin) => {
    const updated = cart.map((item) =>
      item.asin === asin
        ? {
            ...item,
            quantity: Math.max(
              1,
              item.quantity - 1
            ),
          }
        : item
    );

    saveCart(updated);
  };

  const removeItem = (asin) => {
    const updated = cart.filter(
      (item) => item.asin !== asin
    );

    saveCart(updated);

    toast.success("🗑️ Product removed");
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        item.quantity,
    0
  );

  const delivery =
    subtotal === 0 || subtotal >= 999
      ? 0
      : 99;

  const total = subtotal + delivery;

  return (
    <>
      <Navbar />

      <section className="cart-page">

        <div className="cart-header">

          <div>

            <h1>
              <FaShoppingCart />
              Shopping Cart
            </h1>

            <p>
              {cart.length} Item
              {cart.length !== 1 && "s"}
            </p>

          </div>

        </div>

        {cart.length === 0 ? (

          <div className="empty-cart">

            <FaShoppingCart />

            <h2>
              Your Cart is Empty
            </h2>

            <p>
              Looks like you haven't added
              anything yet.
            </p>

            <Link to="/">
              <button className="continue-btn">
                <FaArrowLeft />
                Continue Shopping
              </button>
            </Link>

          </div>

        ) : (

          <div className="cart-layout">

            <div className="cart-items">

              {cart.map((item) => (

                <article
                  key={item.asin}
                  className="cart-card"
                >

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={item.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />

                  <div className="cart-info">

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.brand ||
                        "Amazon"}
                    </p>

                    <h2>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </h2>

                    <div className="qty-box">

                      <button
                        onClick={() =>
                          decreaseQty(
                            item.asin
                          )
                        }
                      >
                        <FaMinus />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.asin
                          )
                        }
                      >
                        <FaPlus />
                      </button>

                    </div>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeItem(
                          item.asin
                        )
                      }
                    >
                      <FaTrash />
                      Remove
                    </button>

                  </div>

                </article>

              ))}

            </div>

            <aside className="cart-summary">

              <h2>
                Order Summary
              </h2>

              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="summary-row">

                <span>
                  Delivery
                </span>

                <span>
                  {delivery === 0
                    ? "FREE"
                    : `₹${delivery}`}
                </span>

              </div>

              <hr />

              <div className="summary-total">

                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <Link to="/checkout">

                <button className="checkout-btn">
                  Proceed to Checkout
                </button>

              </Link>

            </aside>

          </div>

        )}

      </section>

    </>
  );
}

export default Cart;