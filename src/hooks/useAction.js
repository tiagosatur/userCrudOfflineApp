import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  getPosts, 
  registerPost,
  updatePost,
  clearAllPosts,
  deletePost,
} from '../store/post';


const useAction = () => {
  const dispatch = useDispatch();
  const makeAction = action =>
    useCallback(data => dispatch(action(data)), [dispatch]);

  const registerPostAction = makeAction(registerPost);
  const updatePostAction = makeAction(updatePost);
  const getPostsAction = makeAction(getPosts);
  const deletePostAction = makeAction(deletePost);

  const clearAllPopsAction = makeAction(clearAllPosts);
  


  return {
    getPostsAction,
    registerPostAction,
    updatePostAction,
    deletePostAction,
  };
};

export default useAction;
