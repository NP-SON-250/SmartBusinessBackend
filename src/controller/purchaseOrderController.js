import Database from "../Database/models";
const PurchaseOrders = Database["PurchaseOrders"];
const Businesses = Database["Businesses"];
const Users = Database["Users"];
const Stocks = Database["Stocks"];
const Sales = Database["Sales"];

// Make purchase order
export const makePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.loggedInUser.id;
    const { quantity, location, phone } = req.body;
    if (!quantity || !location || !phone) {
      return res.status(400).json({
        status: "400",
        message: "All fields are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        status: "400",
        message: "Quantity can not be less or equal to zero",
      });
    }

    const findSalePrice = await Stocks.findOne({
      where: { id: id },
    });

    if (!findSalePrice) {
      return res.status(404).json({
        status: "404",
        message: "Stock not found",
      });
    }

    const amountCalculator = req.body.quantity * findSalePrice.salePrice;
    const order = await PurchaseOrders.create({
      quantity,
      amount: amountCalculator,
      location,
      phone,
      buyerId: loggedUser,
      stockId: id,
    });

    return res.status(200).json({
      status: "200",
      message: "Your order has been sent!!",
      data: order,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to make purchase order",
      error: error.message,
    });
  }
};

//Reading all orders by buyer

export const readAllByBuyer = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const read = await PurchaseOrders.findAll({
      include: [
        {
          model: Stocks,
          as: "orderedFrom",
          attributes: [
            "id",
            "name",
            "profile",
            "category",
            "quantity",
            "salePrice",
          ],
          include: [
            {
              model: Businesses,
              as: "stockOwner",
              include: [
                {
                  model: Users,
                  as: "businessOwner",
                  attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "profile",
                    "role",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Users,
          as: "orderedBy",
          where: {
            id: loggedUser,
          },
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "password",
            "profile",
            "role",
          ],
        },
      ],
    });
    return res.status(200).json({
      status: "200",
      message: "Stocks retrieved!!",
      data: read,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve purchase order",
      error: error.message,
    });
  }
};

//Reading single order

export const reagSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const readSingle = await PurchaseOrders.findByPk(id, {
      include: [
        {
          model: Stocks,
          as: "orderedFrom",
          attributes: [
            "id",
            "name",
            "profile",
            "category",
            "quantity",
            "salePrice",
          ],
          include: [
            {
              model: Businesses,
              as: "stockOwner",
              include: [
                {
                  model: Users,
                  as: "businessOwner",
                  attributes: [
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "profile",
                    "role",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Users,
          as: "orderedBy",
          attributes: [
            "firstName",
            "lastName",
            "email",
            "password",
            "profile",
            "role",
          ],
        },
      ],
    });
    if (!readSingle) {
      return res.status(404).json({
        status: "404",
        message: "Purchase order not found",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Your order retrieved!!",
      data: readSingle,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve your purchase order",
      error: error.message,
    });
  }
};

//Reading all orders by seller

export const readAllBySeller = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const read = await PurchaseOrders.findAll({
      include: [
        {
          model: Stocks,
          as: "orderedFrom",
          attributes: [
            "id",
            "name",
            "profile",
            "category",
            "quantity",
            "salePrice",
          ],
          include: [
            {
              model: Businesses,
              as: "stockOwner",
              attributes: [
                "id",
                "name",
                "type",
                "description",
                "profile",
                "createdAt",
              ],
              where: {
                userId: loggedUser,
              },
              include: [
                {
                  model: Users,
                  as: "businessOwner",
                  attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "profile",
                    "role",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Users,
          as: "orderedBy",
          attributes: [
            "firstName",
            "lastName",
            "email",
            "password",
            "profile",
            "role",
          ],
        },
      ],
    });
    return res.status(200).json({
      status: "200",
      message: "Purchase order retrieved!!",
      data: read,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve purchase order",
      error: error.message,
    });
  }
};

// Updating order by seller
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const checkId = await PurchaseOrders.findByPk(id);

    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Order not found",
      });
    }

    const values = {
      status,
    };
    if (status === "delivered") {
      values.deliveredDate = new Date();
    }

    const [updateCount, updatedOrder] = await PurchaseOrders.update(values, {
      where: { id: id },
      returning: true,
    });

    if (status === "delivered") {
      const checkStockId = await Stocks.findByPk(checkId.stockId);

      if (!checkStockId) {
        return res.status(404).json({
          status: "404",
          message: "Stock not found",
        });
      }
      if (checkId.status === "delivered") {
        return res.status(400).json({
          status: "400",
          message: "No change made!!",
        });
      }
      const newQuantity = checkStockId.quantity - checkId.quantity;
      const newAmount = checkStockId.unitCost * newQuantity;
      const values = {
        quantity: newQuantity,
        total: newAmount,
      };
      const updateStock = await Stocks.update(values, {
        where: { id: checkId.stockId },
      });
      const checkExisistence = await Sales.findOne({ where: { orderId: id } });
      if (!checkExisistence) {
        const addSales = await Sales.create({
          orderId: id,
          amount: checkId.amount,
        });
      }
    }

    return res.status(200).json({
      status: "200",
      message: "Order updated!!",
      data: updatedOrder,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// Updating order by buyer

export const updateOrderByBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, location, phone } = req.body;
    const checkId = await PurchaseOrders.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Order not found",
      });
    }
    if (quantity <= 0) {
      return res.status(400).json({
        status: "400",
        message: "Quantity can not be less or equal to zero",
      });
    }

    const findSalePrice = await Stocks.findOne({
      where: { id: id },
    });

    if (!findSalePrice) {
      return res.status(404).json({
        status: "404",
        message: "Stock not found",
      });
    }

    const amountCalculator = req.body.quantity * findSalePrice.salePrice;
    const values = {
      quantity,
      amount: amountCalculator,
      location,
      phone,
    };
    const updateIt = await PurchaseOrders.update(values, { where: { id: id } });
    return res.status(200).json({
      status: "200",
      message: "Order updated!!",
      data: checkId,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// Deleting Stock

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await PurchaseOrders.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Order not found",
      });
    }
    const DeleteIt = await PurchaseOrders.destroy({ where: { id: id } });
    return res.status(200).json({
      status: "200",
      message: "Order with this Id " + req.params.id + " deleted!!",
      data: DeleteIt,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to delete order",
      error: error.message,
    });
  }
};
