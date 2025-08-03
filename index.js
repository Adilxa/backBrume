import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import routes from "./src/routes/index.js";

dotenv.config();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      // Development
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:4200",
      "http://localhost:8080",
      "http://localhost:5000",
      "http://localhost:8000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",

      // Production - убрал слэш в конце!
      "https://brume-c1pk-5j2nxjppu-adilxas-projects.vercel.app",

      // Добавляем IP адрес вашего сервера
      "http://84.54.12.45:5000",
      "https://84.54.12.45:5000",

      "https://yourapp.com",
      "https://api.yourapp.com",
    ];

    // Разрешаем запросы без origin (например, мобильные приложения, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS Error: Origin not allowed:", origin);
      callback(new Error(`CORS Error: Origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

const app = express();

// ВАЖНО: Порядок middleware имеет значение!
app.use(cors(corsOptions));
app.use(express.json());

// Добавляем обработку preflight запросов
app.options("*", cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  res.json({ message: "Hello world", timestamp: new Date().toISOString() });
});

app.use(routes);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
      origin: req.headers.origin,
    });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for origins:`, corsOptions.origin);
});
