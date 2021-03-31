import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground, Image, TextInput, TouchableOpacity , Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
// import StatusBar from '../InputFields/statusBar' ;
 import { hostJobClose } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import {checkAndCreateRoom} from '../Create_Chat_Room/checkAndCreateRoom';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';

class WorkSpace extends Component{
  constructor(props){
    super(props);
    this.state = {
      isStartMessages : false,
      isCloseDailogOpen : false,
      comment : '',
      commentErr : '',
      closeProcessing : false
    }
  }
  contactContractor = () => {
    this.setState({isStartMessages : true});
    checkAndCreateRoom(this.props.hostWorkSpace.bidder_profile.display_name, this.props.hostWorkSpace.bidder_profile.id, this.props.hostWorkSpace.bidder_profile.roles, this.props.roleIdUserName).then(res =>{
      this.props.navigation.navigate('ChatScreen', {room : res});
      this.setState({ 
        isStartMessages : false
      });
    });
  }
  onClose = async() => {
    if(this.state.comment){
      this.setState({closeProcessing : true});
      var formData = new FormData();
      formData.append('id', this.props.JobDetails.ID);
      formData.append('comment', this.state.comment);
      const res = await axios.post(server+'project_close', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code === 200){
        ShowBar('Job close successfully', 'success');
        this.setState({isCloseDailogOpen : false, closeProcessing : false});
        this.props.navigation.navigate('HostDashBoard');
      }
      else{
        ShowBar("Sorry, Unable to close job", 'error');
        this.setState({isCloseDailogOpen : false, closeProcessing : false});
      }
    }
    else{
      this.setState({commentErr : 'comment is required'});
    }
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/workspace_bg.png')} style={styles.container}> 
        <View style={styles.whiteBackGroundCont}>
          <View style={styles.grayBackGroundCont}>
            <Text style={{fontSize : 20, color : '#0071bc', marginBottom : hp('1%')}}>{this.props.JobDetails.post_title}</Text>
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('3%')}}>
              <View style={{flexDirection : 'row', alignItems : 'center'}}>
                <Text style={{color : '#666666', fontSize : 17, marginRight : wp('3%')}}>Posted on</Text>
                <Text style={{color : '#292929', fontSize : 15}}>{moment(this.props.JobDetails.post_date).format('MMM DD, YYYY')}</Text>
              </View>
              <View>
                <Text style={{color : '#0071bc', fontSize : 13}}>{this.props.JobDetails.post_status === 'publish' ? 'Active' : this.props.JobDetails.post_status === 'complete'  ? 'Completed' : this.props.JobDetails.post_status === 'close' ? 'Processing' : this.props.JobDetails.post_status === 'disputed' ? 'Resolved' : this.props.JobDetails.post_status === 'draft' ? 'Draft' : 'Disputed'}</Text>
              </View>
            </View>
            {(this.props.JobDetails.post_status !== 'publish' && this.props.hostWorkSpace !== 'No Bidder Found') &&
              <View>
                <View style={{marginBottom : hp('3%')}}>
                  <Detail heading = 'Contractor' value = {this.props.hostWorkSpace.bidder_profile.display_name}/>
                  <Detail heading = 'Winning Bid' value = {`$${this.props.hostWorkSpace.bid_budget}`}/>
                  <Detail heading = 'Deadline' value = {moment(this.props.JobDetails.project_deadline).format('MMM DD, YYYY')}/>
                </View>
                <TouchableOpacity onPress = {this.contactContractor} style={{flexDirection : 'row', backgroundColor : '#8cc63f',  height : hp('7%'), width : '100%', marginBottom : hp('2%'), borderRadius : hp('5%'), justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{color : '#ffffff' , fontSize : 20, marginRight : wp('3%')}}>Contact Contractor</Text>
                  {this.state.isStartMessages && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
              </View> 
            }
          </View>
        </View>
        {this.props.JobDetails.post_status === 'close' &&
          <View style={{flexDirection : 'row', justifyContent : 'space-evenly', alignItems : 'center', margin : hp('2%')}}>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ReviewContractor', {name : this.props.hostWorkSpace.bidder_profile.display_name, image : this.props.hostWorkSpace.bidder_profile.profile_image, jobID : this.props.JobDetails.ID, userToken : this.props.userToken})}} style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]}>
              <Text style={{color : '#ffffff' , fontSize : (20)}}>Finish</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({isCloseDailogOpen : true})}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]}>
              <Text style={{color : '#ffffff' , fontSize : (20)}}>Close</Text>
            </TouchableOpacity>
          </View>
        }
          <Dialog
            visible={this.state.isCloseDailogOpen}
            onTouchOutside={() => this.setState({isCloseDailogOpen: false})}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
          > 
            <View>
              <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
                <Text style={{fontSize: (18) , color : '#ffffff' }}>Close Job</Text> 
              </View>
              <View style={{justifyContent : 'center', alignItems : 'center'}}>
                <Image source={require('../../assets/new_group_icon.png')} style={{height : hp('10%'), width : hp('13%'), resizeMode : 'contain'}}/>
              </View>
              <View style={{height : hp('15%'), marginBottom : hp('3%'), marginHorizontal : wp('3%')}}>
                <Text style={{ color : '#292929', fontSize : (18)}}>Comment</Text>
                <TextInput value={this.state.comment} onChangeText = {(text) => {this.setState({comment : text, commentErr : ''})}} multiline numberOfLines = {12} placeholder='Comment here...' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, textAlignVertical:'top', height : hp('12%')},Platform.OS === 'ios'?{height:hp('12%')}:{}]}/>
                <Text style={{color : 'red', fontSize : 12}}>{this.state.commentErr}</Text>
              </View> 
              <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                <TouchableOpacity onPress={this.onClose}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                  <Text style={{color : '#ffffff' , fontSize : (20), marginRight : wp('2%')}}>close</Text>
                  {this.state.closeProcessing && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({isCloseDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
                  <Text style={{color : '#ffffff' , fontSize : (20)}}>Cancel</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Dialog>
      </ImageBackground>
     )
  }
}

const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  hostWorkSpace : state.createJob.hostWorkSpace,
  roleIdUserName : state.createJob.roleIdUserName
});
export default connect(mapStateToProps, {hostJobClose})(WorkSpace);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch'
  },
  whiteBackGroundCont : {
    //flex : 0.6 ,
    margin : hp('2%') ,
    marginTop : hp('4%'),
    backgroundColor : '#ffffff' ,
    borderRadius : hp('1%') ,
    padding : hp('2%')
  },
  grayBackGroundCont : {
   // flex : 1 ,
    backgroundColor : '#f4f4f4' ,
    borderRadius : hp('1%') ,
    padding : hp('2%')
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('40%') ,
    marginBottom : hp('2%'),
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});

function Detail (props) {
  return(
    <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}>
      <Text style={{color : '#666666', fontSize : 17, width : '40%'}}>{props.heading}</Text>
      <Text style={{color : '#292929', fontSize : 15}}>{`${props.value}`}</Text>
    </View>
  )
}
