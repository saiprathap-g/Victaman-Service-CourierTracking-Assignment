import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashBoard";
import UserTracking from "./components/UserTracking";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={UserTracking} />
        <Route path="/admin" component={AdminLogin} />
        <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
