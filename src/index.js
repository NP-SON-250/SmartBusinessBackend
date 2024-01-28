import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// import routes here
import userRoute from "./routes/userRoute";
import businessRoute from "./routes/businessRoute";
import stockRoute from "./routes/stockRoute";
import purchaseRoute from "./routes/purchaseOrderRoute";
import supplyOrderRoute from "./routes/supplyOrderRoute";
import { Sequelize } from "sequelize";
dotenv.config();
const db = new Sequelize(process.env.DbConnection);
const connectToDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
connectToDatabase();

const app = express();

//Documentation Side

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart city survey system",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:2000",
      },
    ],
    security: [
      {
        BearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/docs/*.js"], //determination of path
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require app to use imported routes

app.use("/Smartbusiness/API", userRoute);
app.use("/Smartbusiness/API", businessRoute);
app.use("/Smartbusiness/API", stockRoute);
app.use("/Smartbusiness/API", purchaseRoute);
app.use("/Smartbusiness/API", supplyOrderRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "200",
    author: "Alema Soft",
    message: "Welcome to Smart Business API",
  });
});
const PORT = process.env.PORT || 2300;
app.listen(PORT, () => {
  console.log(`Server is running on port:http://localhost:${PORT}`);
});
