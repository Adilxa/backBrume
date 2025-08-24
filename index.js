import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import routes from "./src/routes/index.js";

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4200",
    "http://localhost:8080",
    "http://localhost:5000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://brume.kg",
    "https://admin.brume.kg",
    "http://brume.kg",
    "http://admin.brume.kg",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-Real-IP",
    "X-Forwarded-For",
    "X-Forwarded-Proto",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false, // добавьте это
};

dotenv.config();

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/api", (req, res) => {
  return res.send("Hello world");
});

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
