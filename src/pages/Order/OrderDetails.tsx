import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../../app/reducer/orderSlice";
import "../../assets/css/order/OrderDetailsPage.css";

// Define types for the order, product, and user details
interface Product {
  images: string[];
  productName: string;
  productCode: string;
  selectedSize: string;
  price: number;
  qty: number;
}

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  shipToDifferentAddress: boolean;
  deliveryAddress: string;
}

interface Order {
  orderId: string;
  createdAt: string;
  orderStatus: string;
  cart: Product[];
  deliveryCharges: number;
  subtotal: number;
  grandTotal: number;
  paymentMethod: string;
  selectedBank: string;
  userDetails: UserDetails;
}

interface State {
  order: {
    order: Order | null;
    status: string;
    error: string | null;
  };
}

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch();

  const order = useSelector((state: State) => state.order.order);
  const orderStatus = useSelector((state: State) => state.order.status);
  const orderError = useSelector((state: State) => state.order.error);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  const formatCurrency = (amount: number): string => {
    return `₨${amount.toFixed(2)}`;
  };

  if (orderStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (orderError) {
    return (
      <div className="error-message">
        Failed to load order details: {orderError}
      </div>
    );
  }

  if (!order) {
    return <div className="no-order-message">No order details found</div>;
  }

  return (
    <div className="order-details-page">
      <div className="order-header">
        <h2 className="order-id">
          Order {order.orderId} <span>paid</span>
        </h2>
        <p className="order-date">
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p className="order-status pa">{order.orderStatus}</p>
      </div>
      <div className="order-details-container">
        {/* Left Section - Product Details */}
        <div className="order-details-section product-details">
          <div className="product-info-section">
            <table className="product-info-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className="product-info-body">
                {order.cart.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div className="product-item">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? `https://api.mhbstore.com/${product.images[0]}`
                              : "default_image_url"
                          }
                          alt={product.productName}
                          className="product-image"
                        />
                        <span className="product-name">
                          {product.productName}
                        </span>
                      </div>
                      <p className="product-code">
                        Product Code: {product.productCode}
                      </p>
                      <p className="product-size">
                        Size: {product.selectedSize}
                      </p>
                    </td>
                    <td className="product-price">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="product-quantity">{product.qty}</td>
                    <td className="product-total">
                      {formatCurrency(product.price * product.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sp-container">
            <div className="shipping-info">
              <h3 className="section-title">Shipping</h3>
              <p className="shipping-method">Method: Standard</p>
              <p className="shipping-fee">
                Fee: {formatCurrency(order.deliveryCharges)}
              </p>
            </div>
            <div className="payment-summary">
              <h3 className="section-title">Payment Summary</h3>
              <p className="subtotal">
                Subtotal: {formatCurrency(order.subtotal)}
              </p>
              <p className="delivery-fee">
                Delivery Fee: {formatCurrency(order.deliveryCharges)}
              </p>
              <div className="total-amount">
                <h4>Total: {formatCurrency(order.grandTotal)}</h4>
              </div>
            </div>
            {/* Added Payment Details Section */}
            <div className="payment-details">
              <h3 className="section-title">Payment Details</h3>
              <p className="payment-method">
                Payment Method: {order.paymentMethod}
              </p>
              <p className="selected-bank">
                Selected Bank: {order.selectedBank}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Customer Details */}
        <div className="order-details-section customer-details">
          <div className="customer-info">
            <h3 className="section-title">Customer</h3>
            <p className="customer-name">
              <strong>Name:</strong> {order.userDetails.name}
            </p>
          </div>
          <div className="customer-contact">
            <p className="customer-email">
              <strong>Email:</strong> {order.userDetails.email}
            </p>
            <p className="customer-mobile">
              <strong>Phone:</strong> {order.userDetails.mobile}
            </p>
          </div>
          <div className="address-info">
            <h3 className="section-title">Shipping Address</h3>

            <p className="address">
              <strong>Country/Region:</strong> {order.userDetails.country}
            </p>
            <p className="address">
              <strong>Province:</strong> {order.userDetails.province}
            </p>
            <p className="address">
              <strong>City:</strong> {order.userDetails.city}
            </p>
            <p className="address">
              <strong>Postal Code:</strong> {order.userDetails.postalCode}
            </p>
            <p className="address">
              <strong>Address:</strong> {order.userDetails.address}
            </p>
          </div>

          <div className="billing-address-info">
            <h3 className="section-title">Billing Address</h3>
            <p className="address">
              <strong>Address:</strong>{" "}
              {order.userDetails.shipToDifferentAddress
                ? order.userDetails.deliveryAddress
                : order.userDetails.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
