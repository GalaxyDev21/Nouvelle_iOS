import { 
    MESSAGES,
    GET_ALL_DOCUMENTS,
} from './actionType';
import 'firebase/firestore';
import {db} from '../../Component/Chat/firebaseConfig';
import NetInfo from "@react-native-community/netinfo";

export const GetMessages = (roomId) => async  dispatch  => {
  const netInfo = await NetInfo.fetch();
  const isConnected = netInfo.isInternetReachable;
  if(!isConnected){
    ShowBar('Please check your internet connection!' , 'warning');
    return;
  }
  const ref = db.collection('chats');
  ref.doc(roomId).collection('messages').orderBy("createdAt", "desc").onSnapshot(docs => {
    const messageArr = [];
    docs.forEach(doc => {
      const obj = {...doc.data(), id : doc.id};
      messageArr.push(obj);
    });
    dispatch({
      type: MESSAGES,
      payload: messageArr
    });
  });
}
export const getAllDocuments = (currentUserData) => async dispatch  =>  { 
  const netInfo = await NetInfo.fetch();
  const isConnected = netInfo.isInternetReachable;
  if(!isConnected){
    ShowBar('Please check your internet connection!' , 'warning');
    return;
  }
  if(currentUserData.role === 'employer'){
    console.log('Test as Host');
    db.collection('chats').where("host.id", "==", `${currentUserData.currentUserId}`).orderBy("lastMessageTimestamp", "desc").onSnapshot(docs => {
      let events=[];
      docs.forEach(doc => {
        const obj = {...doc.data(), id : doc.id};
        events.push(obj);
      });
      dispatch({
        type: GET_ALL_DOCUMENTS,
        payload: {chatRooms : events, role : currentUserData.role, userRole : 'emp'}
      });
    });
  }
  else if(currentUserData.role === 'freelancer' && currentUserData.coHost === 'yes'){
    db.collection('chats').where("host.id", "==", `${currentUserData.currentUserId}`).orderBy("lastMessageTimestamp", "desc").onSnapshot(docs => {
      let events=[];
      docs.forEach(doc => {
        const obj = {...doc.data(), id : doc.id};
        events.push(obj);
      });
      dispatch({
        type: GET_ALL_DOCUMENTS,
        payload: {chatRooms : events, role : currentUserData.role, userRole : 'emp'}
      });
    });
    db.collection('chats').where("contractor.id", '==', `${currentUserData.currentUserId}`).orderBy("lastMessageTimestamp", "desc").onSnapshot(docs => {
      let events=[];
      docs.forEach(doc => {
        const obj = {...doc.data(), id : doc.id};
        events.push(obj);
      });
      dispatch({
        type: GET_ALL_DOCUMENTS,
        payload: {chatRooms : events, role : currentUserData.role, userRole : 'free'}
      });
    });
  }
  else{
    db.collection('chats').where("contractor.id", '==', `${currentUserData.currentUserId}`).onSnapshot(docs=> { 
      const events = [];
      docs.forEach(doc => {
        const obj = {...doc.data(), id : doc.id};
        events.push(obj);
      });
      dispatch({
        type: GET_ALL_DOCUMENTS,
        payload: {chatRooms : events, role : currentUserData.role, userRole : 'emp'}
      });
    });
  }
}
