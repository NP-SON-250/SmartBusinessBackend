import Database from "../Database/models";
import { saveToCloud } from "../helpers/cloudinary";
const Businesses = Database["Businesses"];
const Users = Database["Users"];

// Register Business

export const registerBusiness = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;

    const { name, type, description, profile } = req.body;
    if (!name || !type || !description) {
      return res.status(400).json({
        status: "400",
        message: "All fields are required!!",
      });
    }
    const checkBusinessName = await Businesses.findOne({
      where: { name: req.body.name },
    });
    if (checkBusinessName) {
      if (checkBusinessName.userId == loggedUser) {
        return res.status(400).json({
          status: "400",
          message:
            "This business name was registered for you before, update instead!!",
        });
      }
    }
    let savedProfile;
    if (req.file) savedProfile = await saveToCloud(req.file, res);
    const register = await Businesses.create({
      name,
      type,
      description,
      profile: savedProfile?.secure_url,
      userId: loggedUser,
    });
    return res.status(200).json({
      status: "200",
      message: "Business registered!!",
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
      message: "Failed to register a business",
      error: error.message,
    });
  }
};
// Getting all registered business

export const readAll = async (req, res) => {
  try {
    const read = await Businesses.findAll({
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
    });
    return res.status(200).json({
      status: "200",
      message: "Businesses retrieved!!",
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
      message: "Failed to retrieve businesses",
      error: error.message,
    });
  }
};

//Reading single business

export const readSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const readIt = await Businesses.findByPk(id, {
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
    });
    if (!readIt) {
      return res.status(404).json({
        status: "404",
        message: "Businesse not found",
      });
    }
    return res.status(200).json({
      status: "200",
      message: "Businesse retrieved!!",
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
      message: "Failed to retrieve businesse",
      error: error.message,
    });
  }
};

// Getting all registered business by business owner

export const readAllByOwner = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const read = await Businesses.findAll({
      include: [
        {
          model: Users,
          as: "businessOwner",
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
      message: "Businesses retrieved!!",
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
      message: "Failed to retrieve businesses",
      error: error.message,
    });
  }
};

// Updating business

export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, profile } = req.body;
    const checkId = await Businesses.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Business not found",
      });
    }
    let updatedProfile;
    if (req.file) updatedProfile = await saveToCloud(req.file, res);
    const values = {
      name,
      type,
      description,
      profile: updatedProfile?.secure_url,
    };
    const updateIt = await Businesses.update(values, { where: { id: id } });
    return res.status(200).json({
      status: "200",
      message: "Business updated!!",
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
      message: "Failed to update businesse",
      error: error.message,
    });
  }
};

// Deleting Business

export const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await Businesses.findByPk(id);
    if (!checkId) {
      return res.status(404).json({
        status: "404",
        message: "Business not found",
      });
    }
    const DeleteIt = await Businesses.destroy({ where: { id: id } });
    return res.status(200).json({
      status: "200",
      message: "Business with this Id " + req.params.id + " deleted!!",
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
      message: "Failed to delete businesse",
      error: error.message,
    });
  }
};
