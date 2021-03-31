import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, TextInput, AsyncStorage, TouchableOpacity, Platform } from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import StatusBar from '../InputFields/statusBar' ;
import 'firebase/firestore';
import {db} from './firebaseConfig';
import { GetMessages } from '../../Redux/chat/action' ;
import { connect } from 'react-redux';

class ChatScreen extends Component {
  state = {
    currentUser : '',
    userName : '',
    typedMessage: '',
    sending: false ,
    messageArr : [] ,
    messageCounter : 0 ,
    role : '',
    room : this.props.navigation.getParam('room', '')
  }
  componentDidMount () {
    this.props.GetMessages(this.state.room.id);
  }
  sendMessage =() => {
    if(this.state.typedMessage !== ''){
      var timestamp = (Math.round(new Date().getTime()/1000)).toString();
      if(this.props.roleIdUserName.currentUserId === this.state.room.host.id){
        const message = {text : this.state.typedMessage, createdAt : timestamp, sender : 'host', userId: this.props.roleIdUserName.currentUserId};
        db.collection('chats').doc(this.state.room.id).collection('messages').add(message);
        db.collection('chats').doc(this.state.room.id).set({
          role : this.props.roleIdUserName.role ,
          host : {id : this.props.roleIdUserName.currentUserId, name : this.props.roleIdUserName.userName, isMessageRead : true},
          contractor : {id : this.state.room.contractor.id, name: this.state.room.contractor.name, isMessageRead : false},
          createdAt: timestamp,
          lastMessage: this.state.typedMessage,
          lastMessageTimestamp : timestamp,
          host_deleteMessage_time : "0", 
          contractor_deleteMessage_time : "0",
          }, { merge: true });
      }
      else{
        const message = {text : this.state.typedMessage, createdAt : timestamp, sender : 'contractor', userId: this.props.roleIdUserName.currentUserId};
        db.collection('chats').doc(this.state.room.id).collection('messages').add(message);
        db.collection('chats').doc(this.state.room.id).set({ 
          role : this.props.roleIdUserName.role ,
          host : {id : this.state.room.host.id, name : this.state.room.host.name, isMessageRead : false},
          contractor : {id : this.props.roleIdUserName.currentUserId, name: this.props.roleIdUserName.userName, isMessageRead : true},
          createdAt: timestamp,
          lastMessage: this.state.typedMessage,
          lastMessageTimestamp : timestamp,
          host_deleteMessage_time : "0", 
          contractor_deleteMessage_time : "0"
        }, { merge: true });
      }
      this.setState({typedMessage : ''})
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar title={this.props.roleIdUserName.currentUserId === this.state.room.host.id ?  this.state.room.contractor.name : this.state.room.host.name} isIconDisplay={true} navigation={this.props.navigation}/>
        <View style={{flex : 1, backgroundColor : '#ffffff', marginHorizontal : wp('3%'), marginTop: hp('3%'), borderTopRightRadius : hp('2%'), borderTopLeftRadius : hp('2%')}}>
          <View style={{flex:1}}>
            <FlatList
              data={this.props.messages}         
              renderItem={({item , index}) => <Message item={item}  currentUser = {this.props.roleIdUserName}/>}
              keyExtractor={(item, index) => ""+ item.id}
              contentContainerStyle={{paddingBottom:hp('4%')}}
              inverted
              ListEmptyComponent = {
                <View style={{flex:1, alignItems:'center',justifyContent:'center',marginTop:hp('30%')}}>
                  <Text>No Chat</Text>
                </View>
              }
            />
          </View>
          <KeyboardAvoidingView enabled style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} behavior={Platform.OS === "ios" && "padding"} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
            <TextInput editable={!this.state.sending} value={this.state.typedMessage} onChangeText = {(txt)=>{ this.setState({typedMessage : txt})}} placeholder='Type a message...' placeholderTextColor= '#292929'  style={{width:wp('70%'),minHeight:hp('6.5%'), maxHeight:hp('20%'), backgroundColor: '#dcf1ff', borderRadius : hp('1%'), padding:wp('2.5%'),color:'black',fontSize:(18), marginRight:wp('1%'), marginBottom : hp('2%')}} multiline/>
              <TouchableOpacity onPress = {this.sendMessage} style={{width:wp('16%'), height:hp('6.5%') ,alignSelf : 'flex-end', backgroundColor:'#0071bc', borderRadius: hp('1%'), justifyContent:'center', alignItems:'center', marginBottom : hp('2%')}}>
                <Text style={{fontSize : (16), fontFamily:'Raleway-SemiBold', color : '#ffffff' }}>SEND</Text>
              </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    )
  }
}
class Message extends Component {
  render() {
    return (
      <View>
        {this.props.item.userId === this.props.currentUser.currentUserId && <MyMessage item={this.props.item} />}
        {this.props.item.userId !== this.props.currentUser.currentUserId  && <OtherMessage item={this.props.item} />}
      </View>
    )
  }
}
class MyMessage extends Component {
  render() {
    const date = (new Date(this.props.item.createdAt*1000));
    return (
      <TouchableOpacity style={{alignItems:'flex-end'}}>
        <View style={{marginBottom:hp('2%'), padding:wp('1%'), backgroundColor:'#dcf1ff', borderBottomLeftRadius : hp('2%'), borderTopLeftRadius : hp('2%')}}>
          <View style={{padding:wp('2%'), maxWidth:wp('60%')}}>
            <Text style={{color:'grey', fontSize:13}}>{moment(date).format('MMM DD, h:mm a')}</Text>
            <Text style={{color:'#292929', fontSize:18}}>{this.props.item.text}</Text>
          </View>
        </View> 
      </TouchableOpacity>
    )
  }
}
class OtherMessage extends Component {
  render() {
    const date = (new Date(this.props.item.createdAt*1000));
    return (
      <TouchableOpacity style={{alignItems:'flex-start'}}>
        <View style={{marginBottom:hp('2%'), padding:wp('1%'), backgroundColor:'#e6ffc5', borderBottomRightRadius : hp('2%'), borderTopRightRadius : hp('2%')}}>
          <View style={{padding:wp('2%'), maxWidth:wp('60%')}}>
             <Text style={{color:'grey', fontSize : 13}}>{moment(date).format('MMM DD, h:mm a')}</Text>
              <Text style={{color:'#292929', fontSize : 18}}>{this.props.item.text}</Text>
            </View>
         </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#F2F2F2',
  },
  SubmitButtonStyle: {
    marginTop:hp('3%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    marginLeft:hp('4%'),
    marginRight:hp('4%'),   
    backgroundColor:'#a8bd5e',
    borderRadius:30,
    borderColor: '#fff',
  },  
  TextStyle:{
      color:'#414141',
      textAlign:'center',
      fontSize: 20
  },
  matchContainerStyle:{
    marginTop:hp('1%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    marginLeft:hp('1%'),
    marginRight:hp('1%'),   
    backgroundColor:'#1D1C24',
    borderRadius:10,
    borderColor: '#fff',   
  },
  imageInStausBar : {
    height : hp('4%'),
    width : hp('4%'),
    resizeMode : 'contain',
    marginRight : wp('3%')
  }    
});
const mapStateToProps = state => ({
messages : state.chating.messages,
roleIdUserName : state.createJob.roleIdUserName,
});
export default connect(mapStateToProps, {GetMessages})(ChatScreen);
  