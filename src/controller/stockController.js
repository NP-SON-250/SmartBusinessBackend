import Database from "../Database/models";
import { saveToCloud } from "../helpers/cloudinary";
const Stocks = Database["Stocks"];
const Businesses = Database["Businesses"];
const Users = Database["Users"];

// Recording stock

export const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profile, category, quantity, unitCost, salePrice } = req.body;
    if (!name || !category || !quantity || !unitCost || !salePrice) {
      return res.status(400).json({
        status: "400",
        message: "All fields are require!!",
      });
    }
    const checkBusId = await Businesses.findByPk(id);
    if (!checkBusId) {
      return res.status(404).json({
        status: "404",
        message: "Business not found",
      });
    }
    const checkStockName = await Stocks.findOne({
      where: { name: req.body.name },
    });
    if (checkStockName) {
      if (checkStockName.businessId == id) {
        return res.status(400).json({
          status: "400",
          message:
            "Stock name with this name was previously rcorded for you, update instead!!!",
        });
      }
    }
    const totalCalculator = req.body.quantity * req.body.unitCost;
    let savedProfile;
    if (req.file) savedProfile = await saveToCloud(req.file, res);
    const register = await Stocks.create({
      name,
      profile: savedProfile?.secure_url,
      category,
      quantity,
      unitCost,
      total: totalCalculator,
      salePrice,
      businessId: id,
    });
    return res.status(200).json({
      status: "200",
      message: "Stock recorded!!",
      data: register,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to record stock",
      error: error.message,
    });
  }
};

// Reading all stocks by owner

export const readAllByOwner = async (req, res) => {
  const loggedUser = req.loggedInUser.id;
  try {
    const read = await Stocks.findAll({
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
      message: "Failed to retrieve stocks",
      error: error.message,
    });
  }
};

// Reading all stocks

export const readAll = async (req, res) => {
  try {
    const read = await Stocks.findAll({
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
      message: "Failed to retrieve stocks",
      error: error.message,
    });
  }
};

//Reading single stock

export const readSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const readIt = await Stocks.findByPk(id, {
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
    });
    if (!readIt) {
      return res.status(404).json({
        status: "404",
        message: "Stock not found",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Stock retrieved!!",
      data: readIt,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve stock",
      error: error.message,
    });
  }
};

// Updating stock

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profile, category, quantity, unitCost, salePrice } = req.body;
    const checkId = await Stocks.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Stock not found",
      });
    }
    let updatedProfile;
    if (req.file) updatedProfile = await saveToCloud(req.file, res);
    const values = {
      name,
      category,
      quantity,
      unitCost,
      salePrice,
      profile: updatedProfile?.secure_url,
    };
    const updateIt = await Stocks.update(values, { where: { id: id } });
    return res.status(200).json({
      status: "200",
      message: "Stock updated!!",
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
      message: "Failed to update stock",
      error: error.message,
    });
  }
};

// Deleting Stock

export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await Stocks.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Stock not found",
      });
    }
    const DeleteIt = await Stocks.destroy({ where: { id: id } });
    return res.status(200).json({
      status: "200",
      message: "Stock with this Id " + req.params.id + " deleted!!",
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
      message: "Failed to delete stock",
      error: error.message,
    });
  }
};
