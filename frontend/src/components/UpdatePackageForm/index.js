import React, { Component } from "react";

import "./index.css";

class UpdatePackageForm extends Component {
  state = {
    updatedStatus: this.props.package.status,
    updatedLocation: this.props.package.location,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onUpdate(
      this.props.package.tracking_number,
      this.state.updatedStatus,
      this.state.updatedLocation
    );
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div style={{ display: "flex", padding: "10px" }}>
          <label>Status:</label>
          <input
            type="text"
            className="status-ele"
            name="updatedStatus"
            placeholder="Updated Status"
            value={this.state.updatedStatus}
            onChange={this.handleInputChange}
          />
        </div>
        <div style={{ display: "flex", padding: "10px" }}>
          <label>Location: </label>
          <input
            type="text"
            name="updatedLocation"
            className="status-ele"
            placeholder="Updated Location"
            value={this.state.updatedLocation}
            onChange={this.handleInputChange}
          />
        </div>

        <button className="actions-change-button" type="submit">
          Update Package
        </button>
      </form>
    );
  }
}

export default UpdatePackageForm;
