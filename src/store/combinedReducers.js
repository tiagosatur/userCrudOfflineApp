import { combineReducers } from 'redux';

import userReducer from './user';

const combinedReducers = combineReducers({
  userReducer,
});

export default combinedReducers;
