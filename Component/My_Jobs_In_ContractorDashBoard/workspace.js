import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView,Picker, TextInput,Image ,ImageBackground, TouchableOpacity , Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {checkAndCreateRoom} from '../Create_Chat_Room/checkAndCreateRoom';
 import { connect } from 'react-redux';
 import moment from 'moment';
 import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
 import {server} from '../../Redux/server';
 import axios from 'axios';

class WorkSpace extends Component{
  constructor(props){
    super(props);
      this.state ={
        isDiscontinueDailogOpen : false,
        commentErr : '',
        comment : '',
        processing : false
      }
  }
  contactContractor = () => {
    this.setState({isStartMessages : true});
    checkAndCreateRoom(this.props.contractorWorkSpace.host_profile.display_name, this.props.contractorWorkSpace.host_profile.id, this.props.contractorWorkSpace.host_profile.roles, this.props.roleIdUserName).then(res =>{
      this.props.navigation.navigate('ChatScreen', {room : res});
      this.setState({ isStartMessages : false});
    });
  }
  onDiscontinue = async() => {
    if(this.state.comment){
      this.setState({processing : true});
      var formData = new FormData();
      formData.append('id', this.props.JobDetails.ID);
      formData.append('comment', this.state.comment);
      const res = await axios.post(server+'discontinue_job', formData,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code === 200){
        ShowBar(res.data.data, 'success');
        this.setState({isCloseDailogOpen : false, processing : false});
        this.props.navigation.navigate('ContractorDashBoard');
      }
      else{
        ShowBar("Sorry, Unable to discontinue", 'error');
        this.setState({isCloseDailogOpen : false, processing : false});
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
                  <Text style={{color : '#0071bc', fontSize : 13}}>{this.props.JobDetails.post_status === 'publish' ? 'Active' : this.props.JobDetails.post_status === 'complete'  ? 'Completed' : this.props.JobDetails.post_status === 'close' ? 'Processing' : this.props.JobDetails.post_status === 'disputed' ? 'Resolved' : this.props.JobDetails.post_status === 'draft' ? 'Draft'  : 'Disputing'}</Text>
                </View>
              </View>
              {
                (this.props.JobDetails.post_status !== 'publish' && this.props.contractorWorkSpace !== 'No Bidder Found') &&
                  <View>
                    <View style={{marginBottom : hp('3%')}}>
                      <Detail heading = 'Host' value = {this.props.contractorWorkSpace.host_profile.display_name}/>
                      <Detail heading = 'Winning Bid' value = {`$${this.props.contractorWorkSpace.bid_budget}`}/>
                      <Detail heading = 'Deadline' value = {moment(this.props.JobDetails.project_deadline).format('MMM DD, YYYY')}/>
                    </View>
                    <TouchableOpacity onPress = {this.contactContractor} style={{flexDirection : 'row', alignItems : 'center', backgroundColor : '#8cc63f',  height : hp('7%'), width : '100%', marginBottom : hp('2%'), borderRadius : hp('5%'), justifyContent : 'center', alignItems : 'center'}}>
                      <Text style={{color : '#ffffff' , fontSize : 20, marginRight : wp('3%')}}>Contact Host</Text>
                      {this.state.isStartMessages && <ActivityIndicator size ='small' color="#414141"/>}
                    </TouchableOpacity>
                  </View>
              }
          </View>
        </View>
        {this.props.JobDetails.post_status === 'close' &&
          <View style={{alignItems : 'center', margin : hp('2%')}}>
            <TouchableOpacity onPress = {()=> this.setState({isDiscontinueDailogOpen : true})} style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]}>
              <Text style={{color : '#ffffff' , fontSize : (20)}}>Discontinue</Text>
            </TouchableOpacity>
          </View>
        }
        <Dialog
          visible={this.state.isDiscontinueDailogOpen}
          onTouchOutside={() => this.setState({isDiscontinueDailogOpen: false})}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
        > 
          <View>
            <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
              <Text style={{fontSize: (20) , color : '#ffffff' }}>Discontinue job</Text> 
            </View>
            <Text style={{color : '#292929', textAlign : 'center', fontSize : (16), marginBottom : hp('2%')}}>This job will be marked as disputed and your case will have resulted soon by admin. Please provide as many as proofs and statement explaining why you quit the job</Text>
            <Text style={{color : '#292929', textAlign : 'center', fontSize : (16), marginBottom : hp('2%')}}>Workspace is still available for you to access in case of necessary</Text>
            <View style={{height : hp('15%'), marginBottom : hp('3%'), marginHorizontal : wp('3%')}}>
              <Text style={{ color : '#292929', fontSize : (18)}}>Provide us the reason why you quit:</Text>
              <TextInput value={this.state.comment} onChangeText = {(text) => {this.setState({comment : text, commentErr : ''})}} multiline numberOfLines = {12} placeholder='Comment here...' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, textAlignVertical:'top', height : hp('12%')},Platform.OS === 'ios'?{height:hp('12%')}:{}]}/>
              <Text style={{color : 'red', fontSize : 12}}>{this.state.commentErr}</Text>
            </View> 
            <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
              <TouchableOpacity onPress={this.onDiscontinue}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                <Text style={{color : '#ffffff' , fontSize : (20), marginRight : wp('3%')}}>Discontinue</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({isDiscontinueDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
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
  contractorWorkSpace : state.createJob.contractorWorkSpace,
  roleIdUserName : state.createJob.roleIdUserName,
  userToken : state.createJob.userLoginToken
});
export default connect(mapStateToProps)(WorkSpace);

const styles = StyleSheet.create({
  container : {
      flex : 1 ,
      resizeMode : 'stretch'
    },
    whiteBackGroundCont : {
      // flex : 0.6 ,
      margin : hp('2%') ,
      marginTop : hp('4%'),
      backgroundColor : '#ffffff' ,
      borderRadius : hp('1%') ,
      padding : hp('2%')
    },
    grayBackGroundCont : {
    //  flex : 1 ,
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