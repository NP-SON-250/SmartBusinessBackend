import express from "express";
import fileSaver from "../helpers/multer";
import { sellers, supplier, normal } from "../middleware/Authentication";

import { 
    makeSupplyOrder,
    readAllBySeller,
    reagSingleOrder,
    readAllBySupplier,
    updateOrder,
    updateOrderBySeller,
    deleteOrder,
 } from "../controller/supplyOrderController";

const supplyOrderRoute = express.Router();
supplyOrderRoute.post(
    "/supplyOrders/makeOrder/:id",
    sellers,
    fileSaver.single("profile"),
    makeSupplyOrder
  );
  supplyOrderRoute.get("/supplyOrders/readYourOrders",sellers, readAllBySeller);
  supplyOrderRoute.get("/supplyOrders/supplier/readAllOrders", supplier, readAllBySupplier);
  supplyOrderRoute.get("/supplyOrders/singleOrder/:id", reagSingleOrder);
  supplyOrderRoute.put(
    "/supplyOrders/update/:id",
    sellers,
    fileSaver.single("profile"),
    updateOrderBySeller
  );
  supplyOrderRoute.put(
    "/supplyOrders/update/supplier/:id",
    supplier,
    fileSaver.single("profile"),
    updateOrder
  );
  supplyOrderRoute.delete("/supplyOrders/delete/:id", sellers, deleteOrder);
  
  export default supplyOrderRoute;
  