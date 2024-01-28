import express from "express";
import { sellers, supplier, normal } from "../middleware/Authentication";

import {
  addStock,
  readAll,
  readAllByOwner,
  readSingle,
  updateStock,
  deleteStock,
} from "../controller/stockController";
import fileSaver from "../helpers/multer";
const stockRoute = express.Router();
stockRoute.post(
  "/stocks/addProductToStock/:id",
  normal,
  fileSaver.single("profile"),
  addStock
);
stockRoute.get("/stocks/readAllProducts", readAll);
stockRoute.get("/stocks/sellers/readYourProducts", sellers, readAllByOwner);
stockRoute.get("/stocks/suppliers/readYourProducts", supplier, readAllByOwner);
stockRoute.get("/stocks/singleProduct/:id", readSingle);
stockRoute.put(
  "/stocks/update/:id",
  normal,
  fileSaver.single("profile"),
  updateStock
);
stockRoute.delete("/stocks/delete/:id", normal, deleteStock);

export default stockRoute;
