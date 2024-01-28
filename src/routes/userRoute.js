import express from "express";
import { admin } from "../middleware/Authentication";
import {
  buyerRegister,
  userLogin,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  addBusinessOwner,
} from "../controller/userController";

import fileSaver from "../helpers/multer";

const userRoute = express.Router();
userRoute.post("/users/signUp", fileSaver.single("profile"), buyerRegister);
userRoute.post(
  "/users/registerOwner",
  admin,
  fileSaver.single("profile"),
  addBusinessOwner
);
userRoute.post("/users/login", fileSaver.single("profile"), userLogin);
userRoute.get("/users/get/users", getUsers);
userRoute.get("/users/get/single/:id", getSingleUser);
userRoute.put("/users/update/:id", fileSaver.single("profile"), updateUser);
userRoute.delete("/users/delete/:id", deleteUser);

export default userRoute;
