const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");

const router = express.Router();

router.use("/:postID/comments", commentRouter);

router.route("/")
    .get(postController.getAll)
    .post(authController.protectRoute,postController.assignIDs,postController.createPost)

router.route("/stats")
    .get(postController.postStats);
    
router.route("/:postID")
    .get(postController.getOne)
    .patch(authController.protectRoute,postController.updatePost)
    .delete(authController.protectRoute,authController.restrictRouteTo("admin"),postController.deletePost);

router.use(authController.protectRoute);

router.route("/stats")
    .get(authController.restrictRouteTo("admin"),postController.postStats);

router.route("/:postID/bookmark")
    .post(postController.addToBookmarks)
    .get(postController.getBookmarks);

router.route("/:postID/like")
    .post(postController.likePost)
    .delete(postController.likePost);

module.exports = router;