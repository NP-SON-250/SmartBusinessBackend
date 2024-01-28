import Jwt from "jsonwebtoken";
import Database from "../Database/models";

const Users = Database["Users"];

// Admins

export const admin = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "401",
        message: "You need to login first!!",
      });
    }

    const decoded = await Jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await Users.findByPk(decoded.id);
    console.log(loggedInUser);
    if (!loggedInUser) {
      res.status(403).json({
        status: "403",
        message: "Your token has expired, Login again!!",
      });
    }

    if (loggedInUser.role !== "admin") {
      res.status(401).json({
        status: "401",
        message: "Only admin allowed to do this!!",
      });
    } else {
      req.loggedInUser = loggedInUser;
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

//Sellers
export const sellers = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "401",
        message: "You need to login first!!",
      });
    }

    const decoded = await Jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await Users.findByPk(decoded.id);
    console.log(loggedInUser);
    if (!loggedInUser) {
      res.status(403).json({
        status: "403",
        message: "Your token has expired, Login again!!",
      });
    }

    if (loggedInUser.role !== "seller") {
      res.status(401).json({
        status: "401",
        message: "Only seller allowed to do this!!",
      });
    } else {
      req.loggedInUser = loggedInUser;
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

//Suppliers
export const supplier = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "401",
        message: "You need to login first!!",
      });
    }

    const decoded = await Jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await Users.findByPk(decoded.id);
    console.log(loggedInUser);
    if (!loggedInUser) {
      res.status(403).json({
        status: "403",
        message: "Your token has expired, Login again!!",
      });
    }

    if (loggedInUser.role !== "supplier") {
      res.status(401).json({
        status: "401",
        message: "Only supplier allowed to do this!!",
      });
    } else {
      req.loggedInUser = loggedInUser;
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};

// Normal users

export const normal = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "401",
        message: "Login first!!",
      });
    }

    const decoded = await Jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await Users.findByPk(decoded.id);

    if (!loggedInUser) {
      res.status(403).json({
        status: "403",
        message: "Your token has expired, Login again!!",
      });
    } else {
      req.loggedInUser = loggedInUser;
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      error: error.message,
    });
  }
};
