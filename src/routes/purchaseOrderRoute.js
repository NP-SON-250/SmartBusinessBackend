import express from "express";
import fileSaver from "../helpers/multer";
import { sellers, supplier, normal } from "../middleware/Authentication";

import {
  makePurchase,
  readAllByBuyer,
  readAllBySeller,
  reagSingleOrder,
  updateOrder,
  updateOrderByBuyer,
  deleteOrder,
} from "../controller/purchaseOrderController";

const purchaseRoute = express.Router();
purchaseRoute.post(
    "/purchaseOrders/makeOrder/:id",
    normal,
    fileSaver.single("profile"),
    makePurchase
  );
  purchaseRoute.get("/purchaseOrders/readYourOrders",normal, readAllByBuyer);
  purchaseRoute.get("/purchaseOrders/sellers/readAllOrders", sellers, readAllBySeller);
  purchaseRoute.get("/purchaseOrders/singleProduct/:id", reagSingleOrder);
  purchaseRoute.put(
    "/purchaseOrders/update/:id",
    normal,
    fileSaver.single("profile"),
    updateOrderByBuyer
  );
  purchaseRoute.put(
    "/purchaseOrders/update/seller/:id",
    sellers,
    fileSaver.single("profile"),
    updateOrder
  );
  purchaseRoute.delete("/purchaseOrders/delete/:id", normal, deleteOrder);
  
  export default purchaseRoute;
  