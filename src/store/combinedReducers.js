import { combineReducers } from 'redux';

import postReducer from './post';

const combinedReducers = combineReducers({
  postReducer,
});

export default combinedReducers;
