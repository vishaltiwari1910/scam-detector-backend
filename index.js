import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Scam Detector API running");
});

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const lowerText = text.toLowerCase();

  let score = 0;
  let reasons = [];

  const rules = [
    {
      keywords: ["urgent", "immediately", "hurry", "today only"],
      weight: 20,
      reason: "Creates urgency to pressure the user"
    },
    {
      keywords: ["pay", "fee", "deposit", "registration"],
      weight: 25,
      reason: "Asks for money upfront"
    },
    {
      keywords: ["no interview", "guaranteed job", "direct joining"],
      weight: 30,
      reason: "Promises unrealistic job offers"
    },
    {
      keywords: ["bit.ly", "tinyurl", "wa.me"],
      weight: 15,
      reason: "Contains suspicious shortened links"
    },
    {
      keywords: ["hr", "ceo", "government approved"],
      weight: 10,
      reason: "Uses authority pressure"
    },
    {
      keywords: ["@gmail.com", "@yahoo.com", "@outlook.com"],
      weight: 15,
      reason: "Uses free email instead of company domain"
    },
    {
      keywords: ["whatsapp", "telegram", "dm me"],
      weight: 20,
      reason: "Only chat-based communication mentioned"
    },
    {
      keywords: ["!!!", "limited seats", "last chance", "act fast"],
      weight: 10,
      reason: "Psychological pressure tactics"
    }
  ];

  // MAIN LOGIC (IMPORTANT)
  
  rules.forEach(rule => {
    if (rule.keywords.some(k => lowerText.includes(k))) {
      score += rule.weight;
      reasons.push(rule.reason);
    }
  });

  let verdict = "Low Risk";
  if (score >= 60) verdict = "High Risk";
  else if (score >= 30) verdict = "Medium Risk";

  let message = "";
  if (score >= 60)
    message = "High chance of scam. Avoid and verify company details.";
  else if (score >= 30)
    message = "Suspicious offer. Do proper verification.";
  else
    message = "Looks safe but still verify before accepting.";

  res.json({
    score: Math.min(score, 100),
    verdict,
    message,
    reason: [...new Set(reasons)]
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
