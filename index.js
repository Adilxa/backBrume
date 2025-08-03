import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import routes from "./src/routes/index.js";

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // для поддержки старых браузеров
};

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  return res.send("Hello world");
});

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
