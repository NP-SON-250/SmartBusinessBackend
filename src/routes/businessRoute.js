import express from "express";
import { sellers, supplier, normal } from "../middleware/Authentication";
import {
  registerBusiness,
  readAll,
  readAllByOwner,
  readSingle,
  updateBusiness,
  deleteBusiness,
} from "../controller/businessController";
import fileSaver from "../helpers/multer";

const businessRoute = express.Router();
businessRoute.post(
  "/business/register",
  normal,
  fileSaver.single("profile"),
  registerBusiness
);

businessRoute.get("/business/readAll", readAll);
businessRoute.get("/business/readAll/bysupplier", supplier, readAllByOwner);
businessRoute.get("/business/readAll/byseller", sellers, readAllByOwner);
businessRoute.get("/business/readSingle/:id", readSingle);
businessRoute.put(
  "/business/update/:id",
  normal,
  fileSaver.single("profile"),
  updateBusiness
);
businessRoute.delete("/business/delete/:id", normal, deleteBusiness);

export default businessRoute;
