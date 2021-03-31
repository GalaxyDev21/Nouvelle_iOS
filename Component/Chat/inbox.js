import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, Dialog, AsyncStorage, TouchableOpacity,FlatList, ActivityIndicator,Animated} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import {data} from './notificationData';
import 'firebase/firestore';
import {db} from './firebaseConfig';
import moment from 'moment';
import { getAllDocuments } from '../../Redux/chat/action';
import { connect } from 'react-redux';
 class Inbox extends Component {
  constructor(props){
    super(props);
      this.state = {
        searchByName : '',
        data : data.content,
        alreadyContactPerson : [],
        currentUserName : '',
        processing : true,
        role : '',
        searchNames : [],
        isListOpen : false,
        selectedChatRoom : [],
        isSelected : false
      }
  }
  componentDidMount () {
    this.props.getAllDocuments(this.props.roleIdUserName);
  }
  openChatRoom = (item) => {
    if(this.props.roleIdUserName.currentUserId === item.host.id){
      db.collection('chats').doc(item.id).set({
        role : this.props.roleIdUserName.role ,
        host : {id : this.props.roleIdUserName.currentUserId, name : this.props.roleIdUserName.userName, isMessageRead : true},
        contractor : {id : item.contractor.id, name: item.contractor.name, isMessageRead : true},
        createdAt: item.createdAt,
        lastMessage: item.lastMessage,
        lastMessageTimestamp : item.lastMessageTimestamp,
        host_deleteMessage_time : "0", 
        contractor_deleteMessage_time : "0",
        }, { merge: true });
    }
    else{
      db.collection('chats').doc(item.id).set({ 
        role : this.props.roleIdUserName.role ,
        host : {id : item.host.id, name : item.host.name, isMessageRead : true},
        contractor : {id : this.props.roleIdUserName.currentUserId, name: this.props.roleIdUserName.userName, isMessageRead : true},
        createdAt: item.createdAt,
        lastMessage: item.lastMessage,
        lastMessageTimestamp : item.lastMessageTimestamp,
        host_deleteMessage_time : "0", 
        contractor_deleteMessage_time : "0"
      }, { merge: true });
    }
    this.props.navigation.navigate('ChatScreen', {room : item})
  }
  searchChatRoom = (text) => {
    let temp=[];
    let contactedNames = this.props.chatRooms.map((item) => this.props.roleIdUserName.currentUserId === item.host.id ? {...item.contractor, ID : item.id} : {...item.host, ID : item.id});
    this.setState({searchByName : text}, function(){
      if(text.length > 0){
        const regex = new RegExp(`^${text}`,'i');
        temp = contactedNames.sort().filter((x)=>regex.test(x.name));
        temp = temp.length === 0 ? ['No results found'] : temp;
        this.setState({isListOpen : true, searchNames : temp});
      }
      else{
        this.setState({isListOpen : false, isSelected : false});
      }
    });
  }
  onselect = (item) => {
    if(item === 'No results found'){this.setState({isListOpen : false, searchByName : ''}); return;}
    const index = this.props.chatRooms.findIndex(checkIndex);
    function checkIndex(obj){
      return obj.id === item.ID;
    }
    this.setState({isSelected : true, isListOpen : false, selectedChatRoom : [this.props.chatRooms[index]]})
  }
  firstCharacter = (nameItem) => {
    return nameItem.name.charAt(0).toUpperCase(); 
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={{flex : 1, resizeMode : 'stretch'}}>
        <StatusBar title='INBOX' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
        {this.props.isChatRoomLoaded &&
          <View style={{marginHorizontal : wp('2%')}}> 
            <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between' , borderWidth : 2, borderColor :'#dbdbdb', backgroundColor : '#ffffff', borderRadius : 4, paddingHorizontal : wp('2%'), marginVertical : hp('2%')}}> 
              <TextInput 
                placeholder='Search' 
                placeholderTextColor='#292929' 
                autoCapitalize = 'none' 
                keyboardType='default' 
                style={{fontSize : (16), color : 'black', height: hp('7%'), width : wp('85%'), padding : wp('1%')}}  
                onChangeText={(text)=>this.searchChatRoom(text)} 
                value={this.state.searchByName}
              />
              {/* <TouchableOpacity onPress={this.onSearch} style={{height : hp('7%'), width : hp('7%'), justifyContent : 'center', alignItems : 'center'}}> */}
                <Image source={require('../../assets/search_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
              {/* </TouchableOpacity> */}
            </View>
            {this.state.isListOpen && 
              <ScrollView style={{elevation : 2, width : ('100%'), height : this.state.searchNames.length === 1 ? hp('7%') : this.state.searchNames.length === 2 ? hp('14%') : this.props.height, position : 'absolute', top : hp('9%'), backgroundColor: '#ffffff', zIndex : 9999}}  contentContainerStyle={{borderWidth:1, borderRadius:3, borderColor:'#D0D0D0'}}>
                <FlatList
                  data={this.state.searchNames}
                  keyExtractor={(item, index) => ""+ index}          
                  renderItem={({item , index}) =>  
                    <TouchableOpacity onPress={()=>this.onselect(item)} style={{height:hp('7%') , borderBottomWidth : 0.5 , borderBottomColor : '#D0D0D0', flexDirection : 'row' , alignItems : 'center', paddingHorizontal : wp('2%')}}>
                      {item.name !== undefined ? 
                        <View style={{flexDirection : 'row', alignItems : 'center'}}> 
                          <View style={{alignItems : 'center', justifyContent : 'center', height : hp('4%'), width : hp('4%'), borderRadius : 100, backgroundColor : '#D0D0D0', marginRight : wp('2%')}}>
                            <Text>{this.firstCharacter(item)}</Text>
                          </View>
                          <Text style={{ color : '#292929', fontSize : (14), padding : wp('2%')}}>{item.name}</Text>
                        </View>
                      : <Text style={{ color : '#292929', fontSize : (14), padding : wp('2%')}}>{item}</Text>}
                    </TouchableOpacity>}
                />
              </ScrollView>
            }
            {this.props.chatRooms.length > 0 && 
              <ScrollView style={{height : hp('78%'), marginBottom : hp('2%')}}>
                <FlatList
                  data={this.state.isSelected ? this.state.selectedChatRoom : this.props.chatRooms}
                  renderItem={(item)=><EachNotification 
                    item={item}
                    ref={(itemref) => this['itemref'+item.id]=itemref}
                    itemsArray = {this.props.chatRooms}
                    length = {this.props.chatRooms.length}
                    navigation = {this.props.navigation}
                    roleIdUserName = {this.props.roleIdUserName}
                    openChatRoom = {this.openChatRoom}
                  />
                  }
                  extraData = {this.state.listChangeNumber}
                  keyExtractor = {(item , index) => item.id}
                />
              </ScrollView>
            }
            {this.props.chatRooms.length === 0 && 
              <View style={{height : hp('60%'), alignItems:'center', justifyContent : 'center'}}>
                <Text style={{fontSize : 18}}>Inbox Empty</Text>
              </View>
            }
          </View> 
        }
        {!this.props.isChatRoomLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator
              size='large'
            />
        </View>
        }  
      </ImageBackground>
    )    
  }
}
const mapStateToProps = state => ({
  roleIdUserName : state.createJob.roleIdUserName,
  chatRooms : state.chating.chatRooms,
  isChatRoomLoaded : state.chating.isChatRoomLoaded,
});
export default connect(mapStateToProps, {getAllDocuments})(Inbox);
const styles = StyleSheet.create({
  iconAndText : {
    height : hp('7%'),
    flexDirection : 'row',
    alignItems : 'center',
    backgroundColor : '#ffffff',
    borderRadius : wp('1%'),
    paddingHorizontal : wp('2%')
  },
  textInputCon : {
    fontSize : (15) ,
    width : '83%' ,
    color : '#292929',
    marginRight : wp('2%')      
  },
  container : {
    height : hp('15%') ,
    backgroundColor : '#f4f4f4' ,
    marginBottom : hp('2%') ,
    flexDirection : 'row' ,
    borderRadius : 2
 },
});

class EachNotification extends Component{
  render(){
    const { index, item} = this.props.item;
    const date = (new Date(item.createdAt*1000));
    return(
      <TouchableOpacity style={styles.container} onPress={()=>this.props.openChatRoom(item)}>
        <View style={{marginHorizontal : wp('2%'), height : hp('15%'),  justifyContent : 'center' , alignItems : 'center'}}>
          <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('10%') , width : hp('10%') , borderRadius : 100 , marginBottom : hp('2%'), backgroundColor : '#ffffff'}}>
            <Image source={require('../../assets/user_icon.png')} resizeMode = 'contain' style={{ height : hp('6%') , width : hp('6%')}}/>
          </View>
        </View>
        <View style={{flex : 1 ,  paddingVertical : hp('2%') ,paddingHorizontal : hp('1%'),}}>
          <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
            <Text style={{color : '#0071bc', fontSize : 16, marginBottom : wp('1%')}}>{this.props.roleIdUserName.currentUserId === item.host.id ? item.contractor.name : item.host.name }</Text>
            <Text style={{color : '#292929', fontSize:12, marginBottom : wp('1%')}}>{moment(date).format('MMM DD, h:mm a')}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}> 
            <Text style={{color : '#292929' , fontSize:13, marginBottom : wp('1%')}}>{item.lastMessage}</Text>     
            {this.props.roleIdUserName.currentUserId === item.host.id && !item.host.isMessageRead && <View style={{height : hp('2%'), width : hp('2%'), borderRadius : 50, backgroundColor : '#8cc63f'}}></View>}
            {this.props.roleIdUserName.currentUserId !== item.host.id && !item.contractor.isMessageRead && <View style={{height : hp('2%'), width : hp('2%'), borderRadius : 50, backgroundColor : '#8cc63f'}}></View>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}