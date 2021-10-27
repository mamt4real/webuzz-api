import {
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
} from './login.js';
import { updatePost, bookmarkPost } from './postSettings';
import {
  updateData,
  followUser,
  createUser,
  deleteAccount,
} from './userSettings';
import { commentPost } from './commentSettings';
import { showConfirmation } from './alert.js';

const loginform = document.querySelector('#form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const postForm = document.querySelector('#post-edit');
const commentForm = document.querySelector('#comment-post-form');
const userEditForm = document.querySelector('#user-edit.form');
const signupForm = document.querySelector('#signup--form');
const forgotPassForm = document.querySelector('#form-forgot-pass');
const userPassForm = document.querySelector('#user-password.form');
const bookmarkBtn = document.querySelector('#bookmark');
const resetPassBtn = document.getElementById('reset-pass-btn');
const likeBtns = document.querySelectorAll('.like-btn');
const followButtons = document.querySelectorAll('.follow-btn');
const deleteUserBtns = document.querySelectorAll('.delete-user-btn');
const searchButton = document.getElementById('search-btn');
const createUserForm = document.getElementById('user-create-form');

if (logoutButton) logoutButton.addEventListener('click', logout);
if (bookmarkBtn)
  bookmarkBtn.addEventListener('click', () => bookmarkPost(bookmarkBtn.value));

if (likeBtns.length > 0)
  likeBtns.forEach((btn) => {
    const model = btn.classList.contains('like-btn--post')
      ? 'posts'
      : 'comments';
    btn.addEventListener('click', () => {
      bookmarkPost(
        btn.value,
        true,
        btn.innerText === 'LIKE' ? 'POST' : 'DELETE',
        model
      );
      btn.innerText = btn.innerText === 'LIKE' ? 'DISLIKE' : 'LIKE';
    });
  });

if (followButtons.length > 0)
  followButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const method = btn.classList.contains('btn--red') ? 'DELETE' : 'POST';
      await followUser(btn.value, method);
    });
  });

if (deleteUserBtns.length > 0)
  deleteUserBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      showConfirmation(
        'Delete Account',
        'Are you sure you want to delete this account?',
        () => deleteAccount(btn.value)
      );
    });
  });

if (postForm)
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(postForm);
    const updatePostButton = document.getElementById('update');
    await updatePost(updatePostButton.value, data);
  });

if (commentForm)
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('comment-content').value;
    const postID = document.getElementById('comment-post-btn').value;
    await commentPost(content, postID);
  });

if (userEditForm)
  userEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(userEditForm);
    await updateData(data);
  });

if (createUserForm)
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(createUserForm);
    await createUser(data);
  });

if (userPassForm)
  userPassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('#save-pass').textContent = 'Updating...';
    const data = {
      password: document.querySelector('#password-current').value,
      newpassword: document.querySelector('#password').value,
      confirmpass: document.querySelector('#password-confirm').value,
    };
    await updateData(data, true);
    document.querySelector('#save-pass').textContent = 'Save Password';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });

if (loginform)
  loginform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      confirmpass: document.getElementById('password-confirm').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
    };
    signup(data);
  });

if (forgotPassForm)
  forgotPassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('send-link-btn').textContent = 'Sending..';
    const email = document.getElementById('email').value;
    await forgotPassword({ email });
    document.getElementById('send-link-btn').textContent = 'Send Reset Link';
  });

if (resetPassBtn)
  resetPassBtn.addEventListener('click', async (e) => {
    resetPassBtn.textContent = 'Loading...';
    e.preventDefault();
    const data = {
      password: document.getElementById('password').value,
      confirmpass: document.getElementById('password-confirm').value,
    };
    await resetPassword(data, resetPassBtn.value);
    resetPassBtn.textContent = 'Reset Password';
  });

if (searchButton)
  searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;
    const searchQuery = query ? `${searchButton.value}=${query}` : '';
    location.search = searchQuery;
  });
