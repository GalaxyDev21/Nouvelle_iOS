import MessageBarManager from 'react-native-message-bar/MessageBarManager';

export default ShowBar = (message, type) =>{
  MessageBarManager.showAlert({
    message: message,
    alertType: type,
    stylesheetSuccess : {backgroundColor: '#8cc63f' , color : 'white'},
    stylesheetInfo : {backgroundColor : '#0071bc' , color : 'white'},
    messageStyle: {fontSize: 15, fontFamily : 'Raleway-SemiBold'},
    position: 'bottom',
    animationType: 'SlideFromBottom'
  });
}