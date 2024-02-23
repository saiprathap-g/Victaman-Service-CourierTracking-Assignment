import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

class AdminLogin extends Component {
  state = {
    username: "",
    password: "",
    redirectToDashboard: false,
  };

  onSubmitSuccess = (jwtToken) => {
    const { history } = this.props;

    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    history.replace("/admin-dashboard");
  };

  handleLogin = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    try {
      const response = await fetch("http://localhost:4000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        this.onSubmitSuccess(data.jwtToken);
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { username, password } = this.state;

    const jwtToken = Cookies.get("jwt_token");

    if (jwtToken !== undefined) {
      return <Redirect to="/admin-dashboard" />;
    }
    return (
      <div className="admin-login-app">
        <header className="admin-login-header">
          <h1 className="admin-login-title">Courier Tracking App</h1>
          <p className="admin-login-company">
            Victamans Service Private Limited
          </p>
        </header>
        <div className="AdminLogin">
          <h2 className="AdminLogin-title">Admin Login</h2>
          <form className="AdminLogin-form" onSubmit={this.handleLogin}>
            <input
              className="AdminLogin-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={this.handleUsernameChange}
            />
            <input
              className="AdminLogin-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.handlePasswordChange}
            />
            <button className="AdminLogin-button" type="submit">
              Login
            </button>
          </form>
        </div>
        <footer className="admin-login-footer">
          <p>© 2022 Victamans Service Private Limited. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default AdminLogin;
