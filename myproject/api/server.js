import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

export default function handler(req, res) {
  return app(req, res);
}
