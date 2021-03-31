import React ,{Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {checkAndCreateRoom} from '../Create_Chat_Room/checkAndCreateRoom';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';
import { connect } from 'react-redux';
import { FalseLoader, GetData} from '../../Redux/createJob/jobAction';
import { FALSE_CO_HOST_LOADER, GET_CO_HOST } from '../../Redux/createJob/actionType';
//import 'firebase/firestore';

 class MessageAndInvite extends Component{
  constructor(props){
    super(props);
    this.state = {
      isStartMessages : false,
      messageButton : false,
      isDialogOpen : false,
      room : {},
      name : this.props.details.display_name,
      contractorId : this.props.details.id,
      processing : false,
      deleteProcessing : false,
      isRemoveDialogOpen : false
    }
  }
  startMessages = () => {
    this.setState({isStartMessages : true, messageButton : true, isDialogOpen : false});
    checkAndCreateRoom(this.state.name, this.state.contractorId, this.props.details.roles, this.props.roleIdUserName).then(res =>{
      this.props.navigation.navigate('ChatScreen', {room : res});
      this.setState({ 
        isStartMessages : false
      });
    });
  }
  closeDialog = () => {
    this.setState({
      isDialogOpen : false
    })
  }
  inviteCohost = async() => {
    this.setState({processing : true});
    var formData = new FormData();
      formData.append('id', this.state.contractorId);
      const res = await axios.post(server+'invite_co_host', formData, {
        headers : {'Authorization': 'Bearer '+ this.props.userToken,},
      });
      if(res.data.code === 200){
        ShowBar(res.data.data.msg, 'success');
        this.setState({isDialogOpen : false});
      }
      else{
        ShowBar('Sorry, Unable to sent invite' , 'error');
        this.setState({processing : false});
      } 
  }
  removeCoHost = async() => {
    this.setState({deleteProcessing : true});
    const res = await axios.post(server+'remove_co_host', {}, {
      headers : {'Authorization': 'Bearer '+ this.props.userToken},
    });
    if(res.data.code === 200){
      this.setState({isRemoveDialogOpen : false});
      ShowBar(res.data.data.msg, 'success');
      this.props.navigation.navigate('HostDashBoard');
    }
    else{
      ShowBar(res.data.message , 'error');
      this.setState({deleteProcessing : false, isRemoveDialogOpen : false});
    }
  }
  // updateCoHost = () => {
  //   var formData = new FormData();
  //   formData.append('offset', 0);
  //   formData.append('limit', 10);
  //   this.props.FalseLoader(FALSE_CO_HOST_LOADER);
  //   this.props.GetData('find_co_host', GET_CO_HOST , this.props.userToken, formData);
  //   this.props.navigation.navigate('FindCoHost');
  // }
  // componentWillUnmount(){
  //   this.setState({isDialogOpen : false, isRemoveDialogOpen : false});
  // }
  render(){
    return(
      <View style={{flexDirection : 'row', alignItems : 'center' , justifyContent : 'space-between',padding:10}}>
        <TouchableOpacity onPress={this.startMessages} style={[styles.messageButton, {backgroundColor : this.state.isStartMessages ? '#0071bc' : '#ffffff', position : 'relative'}]}>
          <Text style={this.state.isStartMessages ? styles.messageButtonTitleAfterPressed : styles.messageButtonTitle}>Message</Text>
          {this.state.isStartMessages &&
            <View style={styles.absoluteView}>
              <ActivityIndicator
                size ='small'
              />
            </View>
          }
        </TouchableOpacity> 
        {this.props.details.current_associated_host !== undefined && 
          <TouchableOpacity onPress={()=> this.setState({isRemoveDialogOpen : true})} style={[styles.messageButton, {backgroundColor : this.state.isDialogOpen ? '#0071bc' : '#ffffff'}]}>
            <Text style={this.state.isDialogOpen ? styles.messageButtonTitleAfterPressed : styles.messageButtonTitle}>Remove Co-Host</Text>
          </TouchableOpacity>
        }
        {this.props.details.current_associated_host === undefined && 
          <TouchableOpacity onPress={()=> this.setState({isDialogOpen : true})} style={[styles.messageButton, {backgroundColor : this.state.isDialogOpen ? '#0071bc' : '#ffffff'}]}>
            <Text style={this.state.isDialogOpen ? styles.messageButtonTitleAfterPressed : styles.messageButtonTitle}>Invite Co-Host</Text>
          </TouchableOpacity>
        }
        <Dialog
          visible={this.state.isDialogOpen}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
        > 
        <View>
          <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
            <Text style={{fontSize: (20) , color : '#ffffff' }}>Send Invite </Text> 
          </View>
          <Text style={{fontSize : 16, marginBottom : hp('4%'), marginHorizontal : wp('3%')}}>You are inviting this co-host for all of your properties</Text>
          <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
            <TouchableOpacity onPress={this.inviteCohost}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
              <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Invite</Text>
              {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({isDialogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
              <Text style={{color : '#ffffff' , fontSize : (18)}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Dialog> 
        <Dialog
            visible={this.state.isRemoveDialogOpen}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingBottom : 0, backgroundColor : '#ffffff'}}
          > 
          <View>
            <View style={{justifyContent : 'center', alignItems : 'center'}}>
              <Image source={require('../../assets/delete_group_icon.png')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
            </View>
            <View style={{alignItems : 'center'}}>
              <View style={{width  :wp('70%')}}>
                <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to Remove this co-host?</Text>
              </View>
              </View>
              <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                <TouchableOpacity onPress = {this.removeCoHost}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'),flexDirection : 'row', alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                  <Text style={{ color : '#ffffff', fontSize : (18)}}>YES</Text>
                  {this.state.deleteProcessing && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({isRemoveDialogOpen : false})} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071BD'}}>
                  <Text style={{color : '#ffffff', fontSize : (18)}}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Dialog> 
      </View>
    );
  } 
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
});
export default connect(mapStateToProps, {FalseLoader, GetData})(MessageAndInvite);
const styles = StyleSheet.create({
  messageButton : {
    height : hp('5%') ,
    width :  wp('40%') ,
    borderRadius : hp('5%') ,
    flexDirection : 'row' , 
    alignItems : 'center' ,
    justifyContent : 'center' , 
    borderColor : '#0071bc',
    borderWidth : 1
  },
  absoluteView : {
    height : hp('5%') ,
    width : '100%',
    borderRadius : hp('5%') , 
    alignItems : 'center' ,
    justifyContent : 'center' , 
    borderColor : '#0071bc',
    borderWidth : 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position : 'absolute'
  },
  messageButtonTitle : {
    color : '#0071bc' ,
    marginRight : 5 ,
  },
   messageButtonTitleAfterPressed : {
       color : '#ffffff' ,
       marginRight : 5 ,
   },
   iconInMessageButton : {
       height : hp('4%') ,
       width : hp('4%') ,
       borderRadius : 50
   },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('40%') ,
   // marginBottom : hp('2%'),
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
})