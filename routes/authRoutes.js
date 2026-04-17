const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/token", authController.refreshToken);
router.get("/users/city/:city", authController.getUsersByCity);

router.get("/profile", authenticateToken, (req, res) => {
    res.send("Protected route");
});


module.exports = router;