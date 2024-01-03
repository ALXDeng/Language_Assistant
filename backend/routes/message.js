const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createMessage } = require("../controllers/messageController");

const router = express.Router();

router.use(requireAuth);
router.post("/", createMessage);

module.exports = router;
