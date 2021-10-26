const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const QueryHandler = require('../utils/queryHandler');
const catchAsync = require('../utils/catchAsync');
const MyError = require('../utils/myError');

const getAll = (Model, template, x) =>
  catchAsync(async (req, res, next) => {
    let processed = new QueryHandler(Model.find(), req.query, '').process();
    const results = await processed;
    res.status(200).render(template, {
      results,
      classStatus: x,
      title: `Manage ${Model.modelName}s`
    });
  });

exports.home = catchAsync(async (req, res, next) => {
  res.status(200).render('base', {
    title: 'An official Coding Challenge Gurus Training Site',
    post: 'The rise of Computing',
    user: 'Me',
  });
});

exports.overview = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .select('-content')
    .populate('authorID', 'name image about');
  res.status(200).render('overview', {
    title: 'Overview Page',
    posts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postID)
    .populate('comments')
    .populate('authorID', 'name image username about');

  if (!post) throw new MyError('No Post with that ID found', 404);

  res.status(200).render('post', {
    title: post.title,
    post,
  });
});

exports.login = (req, res, next) => {
  res.status(200).render('login', { title: 'Login Page' });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).render('forgotPassword', { title: 'Forgot Password' });
};

exports.resetPassword = (req, res, next) => {
  res.status(200).render('reset', {
    title: 'Reset Your Password',
    token: req.params.token,
  });
};

exports.signup = (req, res, next) => {
  res.status(200).render('signup', { title: 'Signup Page' });
};

exports.myAccount = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .render('userSettings', { title: 'My Account', classStatus: 0 });
});

exports.myPosts = catchAsync(async (req, res, next) => {
  let processed = new QueryHandler(Post.find({ authorID: res.locals.user.id }), req.query, '').process();
  const posts = await processed;
  res.status(200).render('myPosts', {
    title: 'My Posts',
    posts,
    classStatus: 1,
    bookmarked: false,
  });
});

exports.myBookmarks = catchAsync(async (req, res, next) => {
  const bookmarks = await User.findById(req.user.id)
    .populate({
      path: 'bookmarks',
      fields: 'title coverImg title summary tags dateCreated',
    })
    .select('bookmarks');
  res.status(200).render('myPosts', {
    title: 'My Boookmarks',
    posts: bookmarks.bookmarks,
    classStatus: 3,
    bookmarked: true,
  });
});

exports.myFollowers = catchAsync(async (req, res, next) => {
  const temp = await User.findById(req.user.id)
    .populate({
      path: 'followers',
      fields: 'name image username',
    })
    .populate({
      path: 'following',
      fields: 'name image username',
    })
    .select('followers following');
  res.status(200).render('followers', {
    title: 'Follow Un-Follow',
    followers: temp.followers,
    followings: temp.following,
    classStatus: 2,
  });
});

exports.editPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postID);
  if (!post) throw new MyError('No Post with that ID found', 404);
  res.status(200).render('editPost', {
    title: post.title,
    post,
    classStatus: 1,
    create: false,
  });
});

exports.createPost = (req, res, next) => {
  const post = {
    title: '',
    summary: '',
    tags: [],
    coverImg: 'default.png',
    content: '',
  };

  res.status(200).render('editPost', {
    title: 'Create new Post',
    post,
    classStatus: 1,
    create: true,
  });
};

exports.createUser = (req, res, next) => {
  res.status(200).render('newUser',{
    title: 'Create new user',
    classStatus: 4
  });
}

exports.manageUsers = getAll(User, 'manageUsers', 4);
exports.managePosts = getAll(Post, 'managePosts', 5);
