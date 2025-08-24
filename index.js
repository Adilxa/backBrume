import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import routes from "./src/routes/index.js";

const corsOptions = {
  origin: [
    "http://localhost:3000", // React default
    "http://localhost:3001",
    "http://localhost:4200", // Angular default
    "http://localhost:8080", // Vue default

    // Backend порты для тестирования
    "http://localhost:5000",
    "http://localhost:8000",

    // Альтернативные хосты
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",

    // Продакшен домены
    "https://brume.kg/",
    "https://admin.brume.kg/",
  ],
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

app.get("/api", (req, res) => {
  return res.send("Hello world");
});

app.use(routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
