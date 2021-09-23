const express = require("express");
const userController = require("../controllers/users");
const authController = require("../controllers/authController");
const postRouter= require("./postRoutes");

const router = express.Router();

router.use("/me/posts",postRouter);

router.post("/login",authController.signin)
router.post("/signup",authController.signup);
router.post("/forgotpassword",authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authController.protectRoute)

router.patch("/updatepassword",authController.updatePassword);
router.patch("/updateme",userController.updateMe);
router.delete("/deleteme",userController.deleteMe);
router.get("/me",userController.getMe,userController.getUser);

router.route("/followers")
    .get(userController.getFollowers)
    .post(userController.follow)
    .delete(userController.unFollow)

router.use(authController.restrictRouteTo("admin"));

router.route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route("/:userID")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;