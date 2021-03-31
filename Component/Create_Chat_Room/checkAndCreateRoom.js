import {db} from '../Chat/firebaseConfig';
export const checkAndCreateRoom = async (name, contractorId, friendRole, currentUserData) => {
  return new Promise (async(resolve , reject) => {
    const friendID = contractorId.toString();
    if(currentUserData.role === 'employer'){
      const host = {id : currentUserData.currentUserId, name: currentUserData.userName, isMessageRead : false};
      const contractor = {id : friendID, name: name, isMessageRead : false};
      const ref = db.collection('chats');
      ref.where('host.id', '==', currentUserData.currentUserId).where('contractor.id', '==', friendID)
      .get().then(docs => {
        let room = {};
        docs.forEach(snapShot => {
          room = snapShot.data();
          room.id = snapShot.id;
        });
        if(!room.id){
          var timestamp =(Math.round(new Date().getTime()/1000)).toString();
          room = {role : currentUserData.role, host, contractor, createdAt : timestamp, lastMessage : '', lastMessageTimestamp : timestamp, host_deleteMessage_time : "0", contractor_deleteMessage_time : "0"};
          db.collection('chats').add(room).then(res => {
            room.id = res.id;
            resolve(room)
          })
        }
        else{
          resolve(room);
        }
      })
    }
    else if(currentUserData.role === 'freelancer' && currentUserData.coHost === 'yes'){
      if(friendRole === 'employer'){
        const contractor = {id : currentUserData.currentUserId, name: currentUserData.userName, isMessageRead : false};
        const host = {id : friendID, name: name, isMessageRead : false};
        const ref = db.collection('chats');
        ref.where('contractor.id', '==', currentUserData.currentUserId).where('host.id', '==', friendID)
        .get().then(docs => {
          let room = {};
            docs.forEach(snapShot => {
              room = snapShot.data();
              room.id = snapShot.id;
            });
            if(!room.id){
              var timestamp =(Math.round(new Date().getTime()/1000)).toString();
              room = {role : currentUserData.role, host, contractor, createdAt : timestamp, lastMessage : '', lastMessageTimestamp : timestamp, host_deleteMessage_time : "0", contractor_deleteMessage_time : "0"};
                db.collection('chats').add(room).then(res => {
                  room.id = res.id;
                    resolve(room)
                })
            }
            else{
              resolve(room);
            }
        })
      }
      else{
        const host = {id : currentUserData.currentUserId, name: currentUserData.userName, isMessageRead : false};
        const contractor = {id : friendID, name: name, isMessageRead : false};
        const ref = db.collection('chats');
        ref.where('host.id', '==', currentUserData.currentUserId).where('contractor.id', '==', friendID)
        .get().then(docs => {
          let room = {};
            docs.forEach(snapShot => {
              room = snapShot.data();
              room.id = snapShot.id;
            });
            if(!room.id){
              var timestamp =(Math.round(new Date().getTime()/1000)).toString();
              room = {role : currentUserData.role, host, contractor, createdAt : timestamp, lastMessage : '', lastMessageTimestamp : timestamp, host_deleteMessage_time : "0", contractor_deleteMessage_time : "0"};
                db.collection('chats').add(room).then(res => {
                  room.id = res.id;
                    resolve(room)
                })
            }
            else{
              resolve(room);
            }
        })
      }
    }
    else{
      const host = {id : friendID, name: name, isMessageRead : false};
      const contractor = {id : currentUserData.currentUserId, name: currentUserData.userName, isMessageRead : false};
      const ref = db.collection('chats');
        ref.where('contractor.id', '==', currentUserData.currentUserId).where('host.id', '==', friendID)
        .get().then(docs => {
          let room = {};
            docs.forEach(snapShot => {
              room = snapShot.data();
              room.id = snapShot.id;
            })
            if(!room.id){
              var timestamp =(Math.round(new Date().getTime()/1000)).toString();
              room = {role : currentUserData.role, host, contractor, createdAt : timestamp, lastMessage : '', lastMessageTimestamp : timestamp, host_deleteMessage_time : "0", contractor_deleteMessage_time : "0"};
                db.collection('chats').add(room).then(res => {
                  room.id = res.id;
                    resolve(room)
                })
            }
            else{
              resolve(room);
            }
        })
    }
  });
}