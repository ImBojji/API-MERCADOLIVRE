import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

export default function handler(req, res) {
  return app(req, res);
}
