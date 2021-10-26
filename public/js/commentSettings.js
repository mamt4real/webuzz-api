import {apiCall} from "./apiCall";

const route = 'comments/';

export const commentPost = async (content, postID) => {
    const options = {
        method: 'POST',
        url: `posts/${postID}/${route}`,
        data:{
            content
        }
    }
    await apiCall(options,() => location.reload(true), 'Your Comment have been submitted!');
}