import { useContext } from 'react';
import './Explore.css';
import { AppContext } from '../../context/AppContext.jsx';

const Explore = () => {
  const { categories } = useContext(AppContext);
  console.log(categories);

  return (
    <div className="explore-container text-light">
      <div className="left-column">
        <div className="first-row scrollable">
          <h6>Categories</h6>
          {/* You can map categories here */}
        </div>
        <hr className="horizontal-line" />
        <div className="second-row scrollable">
          <h6>Items</h6>
          {/* Display items here */}
        </div>
      </div>

      <div className="right-column">
        <div className="customer-form-container">
          <h6>Customer Form</h6>
        </div>
        <hr className="horizontal-line" />
        <div className="cart-items-container scrollable">
          <h6>Cart Items</h6>
        </div>
        <div className="cart-summary-container">
          <h6>Cart Summary</h6>
        </div>
      </div>
    </div>
  );
};

export default Explore;
