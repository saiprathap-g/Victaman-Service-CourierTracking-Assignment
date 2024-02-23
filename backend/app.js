const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const dbPath = path.join(__dirname, "Database", "CourierTracking.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_KEY", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        // Check if the user is admin
        const { username } = payload;
        const isAdmin = await checkAdmin(username);
        if (isAdmin) {
          next();
        } else {
          response.status(403);
          response.send("Unauthorized access");
        }
      }
    });
  }
};

const checkAdmin = async (username) => {
  const adminQuery = `
    SELECT * FROM Admins WHERE username = ?;
  `;
  const admin = await db.get(adminQuery, [username]);
  return admin ? true : false;
};

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
    SELECT * FROM Admins WHERE username = ?;
  `;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser !== undefined) {
    const isPasswordMatched = password === dbUser.password;
    if (isPasswordMatched === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  } else {
    response.status(400);
    response.send("Invalid user");
  }
});

// Middleware to authenticate admin requests

// Admin operations

app.get("/packages", authenticateToken, async (request, response) => {
  const getPackagesQuery = `
    SELECT * FROM Packages;
  `;
  const packages = await db.all(getPackagesQuery);
  response.json(packages);
});

app.post("/packages/", async (request, response) => {
  const {
    user_id,
    tracking_number,
    status,
    origin,
    destination,
    delivery_address,
  } = request.body;
  const addPackageQuery = `
    INSERT INTO Packages (user_id, tracking_number, status, origin, destination,delivery_address)
    VALUES (?, ?, ?, ?, ?,?);
  `;
  await db.run(addPackageQuery, [
    user_id,
    tracking_number,
    status,
    origin,
    destination,
    delivery_address,
  ]);
  response.send("Package Successfully Added");
});

app.put(
  "/packages/:tracking_number/",
  authenticateToken,
  async (request, response) => {
    const { tracking_number } = request.params;
    const { status, location } = request.body;
    const updatePackageQuery = `
    UPDATE Packages
    SET status = ?,
        location = ?
    WHERE tracking_number = ?;
  `;
    try {
      await db.run(updatePackageQuery, [status, location, tracking_number]);
      response.send("Package Updated Successfully");
    } catch (error) {
      console.error("Error updating package:", error);
      response.status(500).send("Error updating package");
    }
  }
);

app.delete(
  "/packages/:tracking_number/",
  authenticateToken,
  async (request, response) => {
    const { tracking_number } = request.params;
    const deletePackageQuery = `
    DELETE FROM Packages
    WHERE tracking_number = ?;
  `;
    try {
      await db.run(deletePackageQuery, [tracking_number]);
      response.send("Package Removed Successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      response.status(500).send("Error deleting package");
    }
  }
);

app.get("/track/:tracking_number", async (request, response) => {
  const { tracking_number } = request.params;
  const trackPackageQuery = `
    SELECT * FROM Packages WHERE tracking_number = ?;
  `;
  const packageDetails = await db.get(trackPackageQuery, [tracking_number]);
  if (packageDetails) {
    response.send(packageDetails);
  } else {
    response.status(404).send("Package not found");
  }
});

module.exports = app;
