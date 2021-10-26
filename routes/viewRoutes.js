const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get('/', authController.isLoggedIn, viewController.overview);
router.get('/post/:postID', authController.isLoggedIn, viewController.getPost);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/signup', authController.isLoggedIn, viewController.signup);
router.get(
  '/forgot-password',
  authController.isLoggedIn,
  viewController.forgotPassword
);
router.get(
  '/reset-password/:token',
  authController.isLoggedIn,
  viewController.resetPassword
);

router.get('/me',authController.protectRoute,  viewController.myAccount);
router.get('/me/posts',authController.protectRoute,  viewController.myPosts);
router.get('/me/bookmarks',authController.protectRoute,  viewController.myBookmarks);
router.get('/me/followers',authController.protectRoute,  viewController.myFollowers);
router.get('/me/posts/edit/:postID',authController.protectRoute,  viewController.editPost);
router.get('/me/posts/create',authController.protectRoute,  viewController.createPost);


router.get('/manage-users', authController.protectRoute, authController.restrictRouteTo('admin'), viewController.manageUsers);
router.get('/manage-posts', authController.protectRoute, authController.restrictRouteTo('admin'), viewController.managePosts);
router.get('/create-user', authController.protectRoute, authController.restrictRouteTo('admin'), viewController.createUser);

module.exports = router;
