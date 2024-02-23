import React, { Component } from "react";
import Cookies from "js-cookie";
import UpdatePackageForm from "../UpdatePackageForm";
import DeletePackageButton from "../DeletePackageButton";

import "./index.css";

class AdminDashboard extends Component {
  state = {
    packageData: {
      user_id: "",
      tracking_number: "",
      status: "",
      origin: "",
      destination: "",
      delivery_address: "",
      location: "",
    },
    packages: [],
  };

  handleLogout = () => {
    Cookies.remove("jwt_token");
    window.location.href = "/admin";
  };

  componentDidMount() {
    this.fetchPackages();
  }

  fetchPackages = async () => {
    const jwtToken = Cookies.get("jwt_token");

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };

    try {
      const response = await fetch("http://localhost:4000/packages", options);
      if (response.ok) {
        const data = await response.json();
        this.setState({ packages: data });
      } else {
        console.error("Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      packageData: { ...this.state.packageData, [name]: value },
    });
  };

  handleAddPackage = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch("http://localhost:4000/packages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(this.state.packageData),
      });
      if (response.ok) {
        alert("Package added successfully");
        this.setState({
          packageData: {
            user_id: "",
            tracking_number: "",
            status: "",
            origin: "",
            destination: "",
            delivery_address: "",
            location: "",
          },
        });
        this.fetchPackages();
      } else {
        alert("Failed to add package");
      }
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  handleUpdatePackage = async (trackingNumber, newStatus, newLocation) => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch(
        `http://localhost:4000/packages/${trackingNumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ status: newStatus, location: newLocation }),
        }
      );
      if (response.ok) {
        const updatedPackages = this.state.packages.map((pkg) => {
          if (pkg.tracking_number === trackingNumber) {
            return { ...pkg, status: newStatus, location: newLocation };
          }
          return pkg;
        });
        this.setState({ packages: updatedPackages });
        alert("Package updated successfully");
      } else {
        alert("Failed to update package");
      }
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  handleDeletePackage = async (trackingNumber) => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch(
        `http://localhost:4000/packages/${trackingNumber}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.ok) {
        const updatedPackages = this.state.packages.filter(
          (pkg) => pkg.tracking_number !== trackingNumber
        );
        this.setState({ packages: updatedPackages });
        alert("Package deleted successfully");
      } else {
        alert("Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  render() {
    const { packageData, packages } = this.state;

    return (
      <div className="admin-dashboard">
        <div className="top-bar">
          <h2>Admin Dashboard</h2>
          <button className="logout-button" onClick={this.handleLogout}>
            Logout
          </button>
        </div>
        <div className="package-form">
          <h3>Add Package</h3>
          <input
            type="text"
            name="user_id"
            placeholder="User ID"
            value={packageData.user_id}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="tracking_number"
            placeholder="Tracking Number"
            value={packageData.tracking_number}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={packageData.status}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="origin"
            placeholder="Origin"
            value={packageData.origin}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={packageData.destination}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="delivery_address"
            placeholder="Delivery Address"
            value={packageData.delivery_address}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={packageData.location}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleAddPackage}>Add Package</button>
        </div>
        <div className="package-list">
          <h3>Packages</h3>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Tracking Number</th>
                <th>Status</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Delivery Address</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.tracking_number}>
                  <td>{pkg.user_id}</td>
                  <td>{pkg.tracking_number}</td>
                  <td>{pkg.status}</td>
                  <td>{pkg.origin}</td>
                  <td>{pkg.destination}</td>
                  <td>{pkg.delivery_address}</td>
                  <td>{pkg.location}</td>
                  <td>
                    <UpdatePackageForm
                      package={pkg}
                      onUpdate={this.handleUpdatePackage}
                    />
                    <DeletePackageButton
                      packageId={pkg.tracking_number}
                      onDelete={this.handleDeletePackage}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
