import { apiCall } from './apiCall';

const route = 'users/';

export const updateData = async (data, isPassword = false) => {
  const options = {
    method: 'PATCH',
    url: `${route}${isPassword ? 'updatepassword' : 'updateme'}`,
    data,
  };
  const msg = `${isPassword ? 'Password' : 'Details'} Updated Successfully`;
  await apiCall(options, false, msg);
};

export const createUser = async (data) => {
  const options = {
    method: 'POST',
    url: route,
    data
  }
  await apiCall(options, () => setTimeout(location.assign('/manage-users'),1500),"Account Created Successfully");
}

export const followUser = async (userID, method) => {
  const options = {
    method,
    url: route + 'followers',
    data: {
      userID,
    },
  };
  await apiCall(options);
};

export const deleteAccount = async (userID) => {
  const options = {
    method: 'DELETE',
    url: route + userID,
  };
  await apiCall(
    options,
    () => setTimeout(location.reload(true), 1500),
    'Account Deleted Successfully'
  );
};
