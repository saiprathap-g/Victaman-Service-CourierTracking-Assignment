import React, { Component } from "react";
import "./index.css";

class UserTracking extends Component {
  state = {
    trackingNumber: "",
    packageDetails: null,
  };

  fetchPackageDetails = async () => {
    const { trackingNumber } = this.state;
    try {
      const response = await fetch(
        `http://localhost:4000/track/${trackingNumber}`
      );
      if (response.ok) {
        const data = await response.json();
        this.setState({ packageDetails: data });
      } else {
        alert("Package not found");
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
    }
  };

  handleInputChange = (event) => {
    this.setState({ trackingNumber: event.target.value });
  };

  handleTrackButtonClick = () => {
    this.fetchPackageDetails();
  };

  handleAdminLogin = () => {
    const { history } = this.props;
    history.replace("/admin");
  };

  render() {
    const { trackingNumber, packageDetails } = this.state;
    return (
      <div className="UserTracking">
        <div className="admin-redirect">
          <button
            type="button"
            className="admin-button"
            onClick={this.handleAdminLogin}
          >
            Admin Login
          </button>
        </div>
        <header className="UserTracking-header">
          <h1 className="UserTracking-title">Courier Tracking App</h1>
          <p className="UserTracking-company">
            Victamans Service Private Limited
          </p>
        </header>
        <div className="UserTracking-form">
          <input
            className="UserTracking-input"
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={this.handleInputChange}
          />
          <button
            className="UserTracking-button"
            onClick={this.handleTrackButtonClick}
          >
            Track Package
          </button>
        </div>
        {packageDetails && (
          <div className="UserTracking-details">
            <h2>Package Details</h2>
            <p>Tracking Number: {packageDetails.tracking_number}</p>
            <p>Status: {packageDetails.status}</p>
            <p>Origin: {packageDetails.origin}</p>
            <p>Destination: {packageDetails.destination}</p>
            <p>Delivery Address: {packageDetails.delivery_address}</p>
            <p>Location:{packageDetails.location}</p>
          </div>
        )}
        <footer className="UserTracking-footer">
          <p>© 2022 Victamans Service Private Limited. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default UserTracking;
