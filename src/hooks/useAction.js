import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  getUsers, 
  registerUser,
  updateUser,
  clearAllUsers,
  deleteUser,
} from '../store/user';


const useAction = () => {
  const dispatch = useDispatch();
  const makeAction = action =>
    useCallback(data => dispatch(action(data)), [dispatch]);

  const registerUserAction = makeAction(registerUser);
  const updateUserAction = makeAction(updateUser);
  const getUsersAction = makeAction(getUsers);
  const deleteUserAction = makeAction(deleteUser);

  const clearAllPopsAction = makeAction(clearAllUsers);
  


  return {
    getUsersAction,
    registerUserAction,
    updateUserAction,
    deleteUserAction,
  };
};

export default useAction;
