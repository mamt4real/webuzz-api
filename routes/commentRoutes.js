const express = require('express');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protectRoute,
    commentController.assignIDs,
    commentController.commentPost
  )
  .get(commentController.setDefaultFilter, commentController.getComments);

router
  .route('/:commentID')
  .get(commentController.getOne)
  .patch(
    authController.protectRoute,
    commentController.allowEdits,
    commentController.updateComment
  )
  .delete(
    authController.protectRoute,
    commentController.allowEdits,
    commentController.deleteComment
  );

router.use(authController.protectRoute);
router
  .route('/:commentID/like')
  .post(commentController.likeComment)
  .delete(commentController.likeComment);

/* router.route("/:pid/reply")
    .post(authController.protectRoute,commentController.replyComment)
    .get(commentController.getCommentReplies); */

module.exports = router;
