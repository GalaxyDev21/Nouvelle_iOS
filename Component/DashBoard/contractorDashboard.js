import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Linking, StatusBar, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificTask from './specificTaskInEachDash' ;
import CustomStatusBar from '../InputFields/statusBar';
import ShowBar from '../validations/messageBar';
import axios from 'axios';
import {server} from '../../Redux/server';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import { GetProfileDetails, 
  FalseLoader, 
  GetUploadImages, 
  GetPassportImages, 
  GetData, 
  GetAllFindJObsList, 
  GetContractorMyJobs, 
  store_Role_Id_And_Name,
  GetDashboardStats} from '../../Redux/createJob/jobAction' ;
import {FALSE_CONTRACTOR_MY_JOB_LOADER, 
  FALSE_PROFILE_DETAILS_FLAG, 
  FALSE_ALL_FIND_JOBS_LIST_FLAG, 
  GET_ALL_FIND_JOBS_LIST, 
  GET_CONTRACTOR_MY_JOBS, 
  FASLE_GET_PASSPORT_IMAGES_FLAG,
  FALSE_DASHBOARD_STATS_FLAG,
  GET_PENDING_INVITATION,
  FALSE_PENDING_INVITATION_FLAG } from '../../Redux/createJob/actionType';

class ContractorDashBoard extends Component{
  constructor(props){
    super(props);
    this.state = {
      name : ''
    }
  }
  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } 
    else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  navigate = (url) => {
    var vars = {};
    if(url !== null){
      const urlPart = url.split('/')[3];
      url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
      });
      if(Object.keys(vars).length > 0 && vars.id !== undefined){
        this.inviteServiceCall(vars.id);
      }
      else if(Object.keys(vars).length > 0 && vars.code !== undefined){
        this.inviteServiceCall(vars.code);
      }
      else if(urlPart === 'projects'){
        this.getMyJobs('ContractorMyJobsList');
      }
      else{
        return ;
      }
    }
  }
  handleOpenURL(event) {
    const route = event.url.replace(/.*?:\/\//g, '');
  }
  inviteServiceCall = async(id) => {
    var formData = new FormData();
    formData.append('code', id);
    try{
      const res = await axios.post(server+'accept_invitation', formData, {
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      console.log('*********** inviteServiceCall ***********');
      console.log(res.data);
      console.log('*********************');
      if(res.data.code === 200){
        ShowBar(res.data.data.message, 'success');
      }
      else{
        ShowBar('Sorry, Unable to approved invite', 'error');
      }
    }
    catch(error){
      console.log('=========== catch function called ==========');
      console.log(error);
      ShowBar('Sorry, Unable to approved invite', 'error');
    }
  }
  moveToNextScreen = async(screen) => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      this.props.navigation.navigate(screen);
     }
  }
  getProfileDetails = async(screen) => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      this.props.FalseLoader(FALSE_PROFILE_DETAILS_FLAG);
      this.props.GetProfileDetails(this.props.userToken);
      this.props.GetUploadImages(this.props.userToken);
      this.props.navigation.navigate(screen);
    } 
  }
  getMyJobs = async(screen) => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 10);
      this.props.FalseLoader(FALSE_CONTRACTOR_MY_JOB_LOADER);
      this.props.GetData('my_jobs_of_contractor', GET_CONTRACTOR_MY_JOBS, this.props.userToken, formData);
      this.props.navigation.navigate(screen);
    }
  }
  onFindJobs = async(screen) => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 10);
      this.props.FalseLoader(FALSE_ALL_FIND_JOBS_LIST_FLAG);
      this.props.GetData('find_jobs_contractor', GET_ALL_FIND_JOBS_LIST, this.props.userToken, formData);
      this.props.navigation.navigate(screen);
    } 
  }
  getPassportImages = async(screen) => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      this.props.FalseLoader(FASLE_GET_PASSPORT_IMAGES_FLAG);
      this.props.GetPassportImages(this.props.userToken);
      this.props.navigation.navigate(screen);
    }
  }
  _getDashboardStats = async(screen) => {
    this.checkInternetConnection().then(res => {
      if(res){
        this.props.FalseLoader(FALSE_DASHBOARD_STATS_FLAG);
        this.props.navigation.navigate(screen);
        this.props.GetDashboardStats(this.props.userToken);
      } 
    }); 
  }
  _getPendingInvitations = async(screen) => {
    this.checkInternetConnection().then(res => {
      if(res){
        var formData = new FormData();
        formData.append('offset', 0);
        formData.append('limit', 10);
        this.props.FalseLoader(FALSE_PENDING_INVITATION_FLAG);
        this.props.GetData('pending_invitations', GET_PENDING_INVITATION, this.props.userToken, formData);
        this.props.navigation.navigate(screen);
      }
    });  
  }
  checkInternetConnection = async() => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return isConnected;
    }
    else{
      return isConnected;
    }
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/dashboard_bg.jpg')} style={styles.container}>
        <StatusBar backgroundColor="#0071bc" barStyle="light-content" />
        <CustomStatusBar title='DASHBOARD' isIconDisplay={false} navigation={this.props.navigation} marginValue={hp('2%')}/>
        <Text style={{ fontSize: (22) , color : '#292929', marginHorizontal : hp('2%'), marginBottom : hp('2%')}}>{`Welcome ${this.props.roleIdUserName.userName}`}</Text>
        <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%'),}}>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/Dashboard_stats.png')} title = {`Dashboard Stats`} borderColor = '#8cc63f' navigation={this.props.navigation} moveToNextScreen = {this._getDashboardStats} screen={'ContractorStats'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/find_job.png')}  title = {`Find Jobs`} borderColor = '#0071bc' navigation={this.props.navigation} moveToNextScreen = {this.onFindJobs}  screen={'FindJobs'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/my_job.png')} title = 'My Jobs' borderColor = '#ff7e70' navigation={this.props.navigation} moveToNextScreen = {this.getMyJobs} screen={'ContractorMyJobsList'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/payment_info.png')} title = 'Payment Information' borderColor = '#47c7dd' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen={'ContractorPayment'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/invite_host.png')} title = 'Invite Hosts' borderColor = '#f6af29' navigation={this.props.navigation} moveToNextScreen = {this._getPendingInvitations} screen={'InvitationList'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/profile_setting.png')} title = 'Profile Settings' borderColor = '#6869ec' navigation={this.props.navigation} moveToNextScreen = {this.getProfileDetails} screen={'ContractorsProfileDetails'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/account_setting.png')} title = 'Account Settings' borderColor = '#3dc099' navigation={this.props.navigation} moveToNextScreen = {this.getPassportImages} screen={'TabViewOfPasswordAndPassport'}/>
          <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/schedule.png')} title = 'Schedule' borderColor = '#cdcd0f' navigation={this.props.navigation}  moveToNextScreen = {this.moveToNextScreen} screen={'ScheduleCalendarInContractor'}/>
        </View> 
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  userName : state.createJob.userName,
  roleIdUserName : state.createJob.roleIdUserName
});
export default connect(mapStateToProps, {
  GetProfileDetails, 
  GetUploadImages, 
  GetAllFindJObsList,
  FalseLoader,
  GetContractorMyJobs,
  store_Role_Id_And_Name,
  GetData,
  GetPassportImages,
  GetDashboardStats
})(ContractorDashBoard);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch'
  },
  twoTouchInOneView :{
    flex : 0.23 ,
    flexDirection : 'row' ,
    justifyContent : 'space-between',
    marginHorizontal : hp('2%'),
    marginBottom : hp('2%')
  },
  eachTouch : {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
    borderLeftWidth : 5,
    borderRadius : hp('1%'),
  },
  ImageInEachTouch : {
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : '#F4F4F4',
    height : hp('8%'),
    width : hp('8%'),
    borderRadius : 100,
    marginHorizontal : wp('1%')
  },
  imageSize : {
    height : hp('5%'),
    width : hp('5%'),
    resizeMode : 'contain'
  }
});


