const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const membershipController = require("../controllers/membershipController");
const authentication = require("../middlewares/authentication");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Registration Public
router.post("/registration", membershipController.registration);
router.post("/login", membershipController.login);

// API Registration Private
router.use(authentication);
router.get("/profile", membershipController.profile);
router.put("/profile/update", membershipController.profileUpdate);
router.put(
  "/profile/image",
  upload.single("profile_image"),
  membershipController.profileImage
);

router.use(errorHandler);

module.exports = router;
