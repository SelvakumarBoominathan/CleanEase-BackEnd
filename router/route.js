import { Router } from "express";

const router = Router();

// Create or POST method

router.route("/register").post((req, res) => {
  res.json("register route");
});

// Update or PUT method

// Read or GET method

// Deleta or DEL Method

export default router;
