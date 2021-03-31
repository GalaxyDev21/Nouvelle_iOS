import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import combReducer from './combineReducer';

  const initialState =  {} ;  
  const middleware = [thunk];
  const store = createStore(
    combReducer,
    initialState,
    applyMiddleware(...middleware) 
  );
   export default store ;
