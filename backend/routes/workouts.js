const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");
const router = express.Router();
//require auth for all workout routes
router.use(requireAuth);
//GET all workouts
router.get("/", getWorkouts);

//Get single workout

router.get("/:id", getWorkout);

//POST single workout
router.post("/", createWorkout);

//DELETE single workout
router.delete("/:id", deleteWorkout);

//Update single workout
router.patch("/:id", updateWorkout);

module.exports = router;
