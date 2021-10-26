import { apiCall } from './apiCall';

export const updatePost = async (postID, data) => {
  const options = {
    method: postID ? 'PATCH' : 'POST',
    url: `posts/${postID ? postID : ''}`,
    data,
  };
  console.log(options);
  const msg = `Post ${postID ? 'Updated' : 'Created'} Successfully`;
  await apiCall(
    options,
    () => setTimeout(location.assign('/me/posts'), 1500),
    msg
  );
};

export const bookmarkPost = async (
  postID,
  like = false,
  method = 'POST',
  model = 'posts'
) => {
  const options = {
    method,
    url: `${model}/${postID}/${
      like ? 'like' : 'bookmark'
    }`,
  };
  await apiCall(options);
};
