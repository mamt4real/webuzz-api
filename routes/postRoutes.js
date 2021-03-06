const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:postID/comments', commentRouter);

router
  .route('/')
  .get(postController.setDefaultFilter, postController.getAll)
  .post(
    authController.protectRoute,
    postController.uploadCoverPhoto,
    postController.resizeCoverPhoto,
    postController.assignIDs,
    postController.createPost
  );

router
  .route('/:postID')
  .get(postController.getOne)
  .patch(
    authController.protectRoute,
    postController.allowEdits,
    postController.uploadCoverPhoto,
    postController.resizeCoverPhoto,
    postController.updatePost
  )
  .delete(
    authController.protectRoute,
    postController.allowEdits,
    postController.deletePost
  );

router.use(authController.protectRoute);

router.post(
  '/:postID/publish',
  authController.restrictRouteTo('admin'),
  postController.publishPost
);

router
  .route('/:postID/bookmark')
  .post(postController.addToBookmarks)
  .get(postController.getBookmarks)
  .delete(postController.addToBookmarks);

router
  .route('/:postID/like')
  .post(postController.likePost)
  .delete(postController.likePost);

module.exports = router;
