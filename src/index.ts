import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware
app.use(cors());
app.use(express.json());

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hallo von HotSeat-Backend!" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Verbunden mit MongoDB");
    // Server starten nach erfolgreicher Verbindung
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Fehler bei MongoDB-Verbindung:", err);
  });
