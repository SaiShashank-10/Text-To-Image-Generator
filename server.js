const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const REPLICATE_API_TOKEN = process.env.REACT_APP_REPLICATE_API_TOKEN;

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, scheduler } = req.body;
    const response = await axios.post(
      "https://api.replicate.com/v1/models/stability-ai/stable-diffusion/predictions",
      {
        version: "latest", // Use latest version
        input: { prompt, scheduler },
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));