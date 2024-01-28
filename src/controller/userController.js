import Database from "../Database/models";
import { saveToCloud } from "../helpers/cloudinary";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const Users = Database["Users"];

export const buyerRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, profile } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: "400",
        message: "All Fields Are Required",
      });
    }

    const verifyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!verifyEmail.test(email)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid Email format",
      });
    }
    const checkEmail = await Users.findOne({
      where: { email: req.body.email },
    });
    if (checkEmail) {
      return res.status(400).json({
        status: "400",
        message: "Email taken",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: "400",
        message:
          "Password should be at least 8 characters long and contain a mix of numbers and characters",
      });
    }

    let savedProfile;
    if (req.file) savedProfile = await saveToCloud(req.file, res);

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const registerUser = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPass,
      profile: savedProfile?.secure_url,
    });

    return res.status(200).json({
      status: "200",
      message: "Account created well",
      data: registerUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to create an account",
      error: error.message,
    });
  }
};
export const addBusinessOwner = async (req, res) => {
  try {
    const { firstName, lastName, email, password, profile, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: "400",
        message: "All Fields Are Required",
      });
    }

    const verifyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!verifyEmail.test(email)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid Email format",
      });
    }
    const checkEmail = await Users.findOne({
      where: { email: req.body.email },
    });
    if (checkEmail) {
      return res.status(400).json({
        status: "400",
        message: "Email taken",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: "400",
        message:
          "Password should be at least 8 characters long and contain a mix of numbers and characters",
      });
    }

    let savedProfile;
    if (req.file) savedProfile = await saveToCloud(req.file, res);

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const registerUser = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPass,
      profile: savedProfile?.secure_url,
      role,
    });

    return res.status(200).json({
      status: "200",
      message: "User Registered",
      data: registerUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to create user",
      error: error.message,
    });
  }
};

//Login to the system

export const userLogin = async (req, res) => {
  try {
    const userLogin = await Users.findOne({ where: { email: req.body.email } });
    if (!userLogin) {
      return res.status(404).json({
        status: "404",
        message: "User Not Found",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, userLogin.password);
    if (!isMatch) {
      return res.status(404).json({
        status: "404",
        message: "Password Incorrect",
      });
    }
    const token = await Jwt.sign({ id: userLogin.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIREDTIME,
    });
    return res.status(200).json({
      status: "200",
      message: "User Login Succees",
      users: userLogin,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Login Failed",
      error: error.message,
    });
  }
};

// Getting all users
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({});
    return res.status(200).json({
      status: "200",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
export const getSingleUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {});
    if (!user) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "200",
      message:
        "A single user with User ID:" +
        " " +
        req.params.id +
        " " +
        "retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve a User",
      error: error.message,
    });
  }
};

// updating a user

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { firstName, lastName, email, password, profile, role } = req.body;
    if (email) {
      const checkEmail = await User.findOne({
        where: { email: req.body.email },
      });
      if (checkEmail) {
        if (checkEmail.id != id) {
          return res.status(400).json({
            status: "400",
            message: "Email Used In Our Database",
          });
        }
      }
    }
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }
    let updatedProfile;
    if (req.file) updatedProfile = await uploadToCloud(req.file, res);
    if (password) {
      const encryptPass = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, encryptPass);
      const values = {
        firstName,
        lastName,
        email,
        password: hashedPass,
        profile: updatedProfile?.secure_url,
        role,
      };
      const userUpdate = await Users.update(values, { where: { id: id } });
      return res.status(200).json({
        status: "200",
        message: "User Update succeed",
      });
    } else {
      if (req.file) updatedProfile = await uploadToCloud(req.file, res);
      const values = {
        firstName,
        lastName,
        email,
        profile: updatedProfile?.secure_url,
        role,
      };
      const userUpdate = await Users.update(values, { where: { id: id } });
      return res.status(200).json({
        status: "200",
        message: "User Update succeed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failded to Update User ata",
      error: error.message,
    });
  }
};

// delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const findUser = await Users.findByPk(id);
    if (!findUser) {
      return res.status(404).json({
        status: "404",
        message: "User not found",
      });
    }
    const deletedUser = await Users.destroy({ where: { id: id } });

    return res.status(200).json({
      status: "200",
      message:
        "User with user ID:with User ID:" +
        " " +
        req.params.id +
        " " +
        "deleted successfully",
      data: findUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Error occurred",
      error: error.message,
    });
  }
};
