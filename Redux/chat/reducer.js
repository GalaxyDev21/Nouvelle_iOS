import {
     MESSAGES,
     GET_ALL_DOCUMENTS,
    } from './actionType';
    //import moment from 'moment-timezone';

const initialState = {
  messages : [],
  chatRooms : [],
  hostChatRooms : [],
  contChatRooms : [],
  isChatRoomLoaded : false,
  userRole : ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MESSAGES:
      return {
        ...state ,
        messages : action.payload
      };
    case GET_ALL_DOCUMENTS:
      if(action.payload.userRole === 'emp'){
        state.hostChatRooms = action.payload.chatRooms;
      }
      else if(action.payload.userRole === 'free'){
        state.contChatRooms = action.payload.chatRooms;
      }
      return {
        ...state ,
        chatRooms : action.payload.userRole === 'emp' ? [...state.hostChatRooms] : [...state.hostChatRooms, ...state.contChatRooms],
        isChatRoomLoaded : true,
        userRole : action.payload.role,
      };
    default:
      return state;
  }
}