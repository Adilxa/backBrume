import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger.js";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());

// Убираем все CORS настройки из Express!
// app.use(cors(corsOptions)); // УДАЛИТЬ
// Остальные CORS middleware тоже удалить

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/api", (req, res) => {
  return res.send("Hello world");
});

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
