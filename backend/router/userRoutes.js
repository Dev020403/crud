const express = require("express");
const { registerController, loginController, deleteController, updateController, getAllUsersController } = require("../controller/useController");
const { verifyToken } = require("../middleware/middlewares");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.delete("/delete", verifyToken,deleteController);
router.put("/update", verifyToken,updateController);
router.get("/getAllUsers", verifyToken,getAllUsersController);

module.exports = router;
