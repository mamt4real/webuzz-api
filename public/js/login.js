import '@babel/polyfill';
import {apiCall} from './apiCall';

const baseRoute = 'users/';

export const login = async (email, password) => {
  const options = {
    method: 'POST',
    url: baseRoute + 'login',
    data: {
      email,
      password,
    },
  };
  const callback = () =>
    setTimeout(() => {
      location.assign('/');
    }, 1500);
  await apiCall(options, callback, 'Logged In successfully');
};

export const logout = async () => {
  const options = {
    method: 'GET',
    url: baseRoute + 'logout',
  };
  await apiCall(options, () =>
    setTimeout(() => {
      location.assign('/');
    }, 1500)
  );
};

export const signup = async (data) => {
  const options = {
    method: 'POST',
    url: baseRoute + 'signup',
    data,
  };
  await apiCall(
    options,
    () =>
      setTimeout(() => {
        location.assign('/');
      }, 1500),
    'Account Created Successfully'
  );
};

export const forgotPassword = async (data) => {
  const options = {
    method: 'POST',
    url: baseRoute + 'forgotpassword',
    data,
  };
  await apiCall(options, () =>
    setTimeout(() => {
      location.assign('/login');
    }, 1500)
  );
};

export const resetPassword = async (data, token) => {
  const options = {
    method: 'PATCH',
    url: `${baseRoute}/resetpassword/${token}`,
    data,
  };

  await apiCall(
    options,
    setTimeout(() => {
      location.assign('/');
    }, 1500),
    'Passsword Resetted Successfully'
  );
};
