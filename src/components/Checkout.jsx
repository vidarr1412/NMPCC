import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Checkout.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import syntax
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState(location.state?.selectedProducts || []);
  const [totalAmount, setTotalAmount] = useState(0);

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('');
  const token = localStorage.getItem('token'); // Replace this with how you store the token
  const decodedToken = token ? jwtDecode(token) : {};
  const userid = decodedToken.id;

  console.log("Decoded _id from token:", userid); // Log the decoded ID for debugging
  useEffect(() => {
    const total = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
    setTotalAmount(total);
  }, [selectedProducts]);

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };
 

  const handleConfirmation = async () => {
    try {
      // Decode the token to extract _id
      const token = localStorage.getItem('token'); // Replace this with how you store the token
      const decodedToken = token ? jwtDecode(token) : {};
      const user_id = decodedToken.id;
      const user_idd=user_id;
      console.log(user_id)
      const checkoutData = {
        user_idd, // Pass the extracted ID here
        contactInfo,
        selectedProducts,
        deliveryMethod,
        paymentMethod,
        totalAmount,
      };
  
      const response = await axios.post("http://localhost:5000/checkout", checkoutData);
      alert(response.data.message); // Display success message
      navigate("/");
    } catch (error) {
      console.error("Error saving checkout data:", error);
      alert("Failed to confirm purchase. Please try again.");
    }
  };
  

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Column - Products List */}
        <div className="left-column">
        <button className="back-btn" onClick={() => navigate(-1)}>
        <h1 className="checkout-title">Your Products</h1>
        </button>
          {selectedProducts.length === 0 ? (
            <p className="empty-cart">No products selected</p>
          ) : (
            selectedProducts.map((product, index) => (
              <div className="product-item">
               
                <img src={product.picture ? `http://localhost:5000/${product.picture}` : "https://via.placeholder.com/150"}alt={product.name} className="product-image" />
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Price: ₱{product.price}</p>
                  <div className="quantity-container">
                    <label htmlFor={`quantity-${index}`} className="quantity-label">Quantity:</label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}  // Prevent non-numeric input
                      className="quantity-input"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="total-amount">
            <h3>Total Amount: ₱{totalAmount}</h3>
          </div>
        </div>

        {/* Right Column - Forms for Contact, Delivery, and Payment */}
        <div className="right-column">
          <h2>Contact Information</h2>
          <form>
            <label>Name:</label>
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              className="input-field"
              required
            />
            <label>Email:</label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="input-field"
              required
            />
            <label>Phone:</label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="input-field"
              required
            />

            <h2>Delivery Method</h2>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Delivery Method</option>
              <option value="standard">Standard Delivery</option>
              <option value="express">Express Delivery</option>
            </select>

            <h2>Payment Method</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </form>

          <button onClick={handleConfirmation} className="confirm-button">
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
