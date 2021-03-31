import { combineReducers } from 'redux';
import createJobReducer from './createJob/jobReducer';
import chatReducer from './chat/reducer';

export default combineReducers({
  createJob : createJobReducer,
  chating : chatReducer
});