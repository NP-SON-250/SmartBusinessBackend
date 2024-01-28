import Database from "../Database/models";
const SupplyOrders = Database["SupplyOrders"];
const Businesses = Database["Businesses"];
const Users = Database["Users"];
const Stocks = Database["Stocks"];
const Sales = Database["Sales"];

// Make Supplys order
export const makeSupplyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.loggedInUser.id;
    const findBusId = await Businesses.findOne({
      where: { userId: loggedUser },
    });
    const busId = findBusId.id;
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
    const order = await SupplyOrders.create({
      quantity,
      amount: amountCalculator,
      location,
      phone,
      businessId: busId,
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
      message: "Failed to make Supplys order",
      error: error.message,
    });
  }
};

//Reading all orders by seller

export const readAllBySeller = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const read = await SupplyOrders.findAll({
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
          model: Businesses,
          as: "orderedBy",
          where: {
            userId: loggedUser,
          },
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
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

//Reading single order

export const reagSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const readSingle = await SupplyOrders.findByPk(id, {
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
      ],
    });
    if (!readSingle) {
      return res.status(404).json({
        status: "404",
        message: "Supplys order not found",
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
      message: "Failed to retrieve your Supplys order",
      error: error.message,
    });
  }
};

//Reading all orders by suppliers

export const readAllBySupplier = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const read = await SupplyOrders.findAll({
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
      ],
    });
    return res.status(200).json({
      status: "200",
      message: "Supplys order retrieved!!",
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
      message: "Failed to retrieve Supplys order",
      error: error.message,
    });
  }
};

// Updating order by supplier
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const checkId = await SupplyOrders.findByPk(id);

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
    const [updateCount, updatedOrder] = await SupplyOrders.update(values, {
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
      const checkInStock = await Stocks.findOne({
        where: { businessId: checkId.businessId },
      });
      if (checkInStock) {
        if (checkInStock.name === checkStockId.name) {
          //updating
          const updateValues = {
            quantity: checkInStock.quantity + checkId.quantity,
          };
          const updateStock = await Stocks.update(updateValues, {
            where: { id: checkInStock.id },
          });
        }
        if (checkInStock.name != checkStockId.name) {
          //inserting
          const saveNew = await Stocks.create({
            name: checkStockId.name,
            profile: checkStockId.profile,
            category: checkStockId.category,
            quantity: checkId.quantity,
            unitCost: checkId.amount / checkId.quantity,
            total: checkId.quantity * (checkId.amount / checkId.quantity),
            salePrice: 0.0,
            businessId: checkId.businessId,
          });
        }
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

// Updating order by seller

export const updateOrderBySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, location, phone } = req.body;
    const checkId = await SupplyOrders.findByPk(id);
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
    const updateIt = await SupplyOrders.update(values, { where: { id: id } });
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
    const checkId = await SupplyOrders.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Order not found",
      });
    }
    const DeleteIt = await SupplyOrders.destroy({ where: { id: id } });
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
