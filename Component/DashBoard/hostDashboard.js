import React, { Component } from 'react';
import { StyleSheet, Text, View ,ScrollView, StatusBar, Linking, Platform, ImageBackground } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import NetInfo from "@react-native-community/netinfo";
import CustomStatusBar from '../InputFields/statusBar';
import SpecificTask from './specificTaskInEachDash' ;
import ShowBar from '../validations/messageBar' ;
import axios from 'axios';
import {server} from '../../Redux/server';
import AcceptInviteDialog from '../accept_Invitation/cohostAccept';
import { connect } from 'react-redux';
import { GetExistingProperty, FalseLoader, GetPassportImages, GetProfileDetails,GetData, GetDashboardStats, GetMyJobs, GetHostTeam, store_Role_Id_And_Name } from '../../Redux/createJob/jobAction';
import { FALSE_PROPERTY_LIST_FLAG, FALSE_MY_JOBS_FLAG, FALSE_PROFILE_DETAILS_FLAG, FALSE_HOST_TEAM_LOADER, GET_HOST_TEAM,FALSE_HOST_CHECKLISTS_FLAG, GET_HOST_CHECKLISTS, 
         GET_HOST_SAMPLE_CHECKLISTS, GET_MY_JOBS, EXISTING_PROPERTY, FALSE_CO_HOST_LOADER, GET_CO_HOST, FALSE_MY_CO_HOST_LOADER, GET_MY_CO_HOST, FASLE_GET_PASSPORT_IMAGES_FLAG, FALSE_DASHBOARD_STATS_FLAG, FALSE_CLEANERS_LIST_FLAG, GET_CLEANERS_LIST } from '../../Redux/createJob/actionType';

class HostDashBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      name : '',
      coHost_accepted : 'no',
      isDailogOPen : false,
      hostId : ''
    }
  }
  async componentDidMount() {
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
      if(Object.keys(vars).length > 0 && vars.type === 'asscoiate_cohost' && this.props.roleIdUserName.host_associate === 'no'){
        if(vars.uid === this.props.roleIdUserName.currentUserId){
          this.setState({isDailogOPen : true, hostId : vars.host});
        }
      }
      else if(Object.keys(vars).length > 0 && vars.id !== undefined){
        this.inviteServiceCall(vars.id);
      }
      else if(Object.keys(vars).length > 0 && vars.code !== undefined){
        this.inviteServiceCall(vars.code);
      }
      else if(urlPart === 'projects'){
        this.getMyJobs('HostMyJobsList');
      }
      else{
        return ;
      }
    }
  }
  handleOpenURL = (event) => {
    console.log('#########URLLL########');
    console.log(event.url);
    //const route = event.url.replace(/.*?:\/\//g, '');
    this.navigate(event.url);
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
  moveToNextScreen = (screen) => {
    this.props.navigation.navigate(screen);
  }
  getExistingProperties = async(screen) => {
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
      this.props.FalseLoader(FALSE_PROPERTY_LIST_FLAG);
      this.props.GetData('existing_property', EXISTING_PROPERTY, this.props.userToken, formData);
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
      console.log(formData);
      this.props.FalseLoader(FALSE_MY_JOBS_FLAG);
      this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
      this.props.navigation.navigate(screen, {title : 'no stats'});
    }
  }
  getTeam = async(screen) => {
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
      this.props.FalseLoader(FALSE_HOST_TEAM_LOADER);
      this.props.GetData('my_team', GET_HOST_TEAM , this.props.userToken, formData);
      this.props.navigation.navigate(screen);
    }
  }
  getChecklists = async(screen) => {
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
      this.props.FalseLoader(FALSE_HOST_CHECKLISTS_FLAG);
      this.props.GetData('get_all_check_lists', GET_HOST_CHECKLISTS , this.props.userToken, formData);
      this.props.GetData('get_all_sample_check_lists', GET_HOST_SAMPLE_CHECKLISTS , this.props.userToken, formData);
      this.existingPropertyList();
      this.props.navigation.navigate(screen);
    }  
  }
  existingPropertyList = async () => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 100);
      this.props.GetData('existing_property', EXISTING_PROPERTY, this.props.userToken, formData);
    }
  }
  getCoHost = async(screen) => {
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
      this.props.FalseLoader(FALSE_CO_HOST_LOADER);
      this.props.GetData('find_co_host', GET_CO_HOST , this.props.userToken, formData);
      this.props.navigation.navigate(screen);
    }  
  }
  getMyCoHost = async(screen) => {
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
      this.props.FalseLoader(FALSE_MY_CO_HOST_LOADER);
      this.props.GetData('co_host_list_all', GET_MY_CO_HOST , this.props.userToken, formData);
      this.props.navigation.navigate(screen); 
    }
  }
  getMyHost = async(screen) => {
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
      this.props.FalseLoader(FALSE_MY_CO_HOST_LOADER);
      this.props.GetData('host_list_all', GET_MY_CO_HOST , this.props.userToken, formData);
      this.props.navigation.navigate(screen);
    }
  }
  getScheduleEvents = (screen) => {
    this.existingPropertyList();
    this.props.navigation.navigate(screen);
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
  closeDailog = (value) => {
    this.setState({isDailogOPen : false, coHost_accepted : value}); 
  }
  _getDashboardStats = async(screen) => {
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      this.props.FalseLoader(FALSE_DASHBOARD_STATS_FLAG);
      this.props.navigation.navigate(screen);
      this.props.GetDashboardStats(this.props.userToken);
    } 
  }
  getCleaners = async(screen) => {
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
      this.props.FalseLoader(FALSE_CLEANERS_LIST_FLAG);
      this.props.GetData('get_cleaner', GET_CLEANERS_LIST , this.props.userToken, formData);
      this.props.navigation.navigate(screen);
    }
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/dashboard_bg.jpg')} style={styles.container}>
        <AcceptInviteDialog isDailogOPen = {this.state.isDailogOPen} closeDailog = {this.closeDailog} hostId = {this.state.hostId}/>
        <StatusBar backgroundColor="#0071bc" barStyle="light-content" />
        <CustomStatusBar title='DASHBOARD' isIconDisplay={false} navigation={this.props.navigation} marginValue={hp('2%')}/>
        <Text style={{fontSize: (22) , color : '#292929', marginHorizontal : hp('2%'), marginBottom : hp('2%')}}>{`Welcome ${this.props.roleIdUserName.userName}`}</Text>
        <ScrollView>
          {this.props.roleIdUserName.host_associate === undefined &&  
            <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%'), marginBottom : hp('2%')}}>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/Dashboard_stats.png')} title = {`Dashboard Stats`} borderColor = '#8cc63f' navigation={this.props.navigation} moveToNextScreen = {this._getDashboardStats} screen={'HostStats'}/>
              <SpecificTask imageUrl1 ={require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = 'Cleaners' borderColor = '#b08558' navigation={this.props.navigation} moveToNextScreen = {this.getCleaners} screen = {'Cleaners'}/>
              <SpecificTask imageUrl = {require('../../assets/co-host.png')} title = {'Find Local Contractors'} borderColor = '#a36d6d' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'CreateJob_Screen1'}/>
              <SpecificTask imageUrl = {require('../../assets/co-host.png')} title = {'Find Co Hosts'} borderColor = '#f6af29' navigation={this.props.navigation} moveToNextScreen = {this.getCoHost} screen = {'FindCoHost'}/>
              <SpecificTask imageUrl1 ={require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = 'My Contractors' borderColor = '#b08558' navigation={this.props.navigation} moveToNextScreen = {this.getTeam} screen = {'Teams'}/>
              <SpecificTask imageUrl1 ={require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = {'My Co Hosts'} borderColor = '#FFB5B5' navigation={this.props.navigation} moveToNextScreen = {this.getMyCoHost} screen = {'MyCoHost'}/>
              <SpecificTask imageUrl = {require('../../assets/My_job.png')} title = {'My Jobs'} borderColor = '#207561' navigation={this.props.navigation} moveToNextScreen = {this.getMyJobs} screen = {'HostMyJobsList'}/>
              <SpecificTask imageUrl = {require('../../assets/properties.png')} title = 'Properties' borderColor = '#ff7e70' navigation={this.props.navigation} moveToNextScreen = {this.getExistingProperties} screen = {'MyPropertyList'}/>
              <SpecificTask imageUrl = {require('../../assets/pay_my_contractor.png')} title = 'Pay My Contractors' borderColor = '#0071bc' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'ManualPayment'}/>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/profile_setting.png')} title = 'Profile Settings' borderColor = '#47c7dd' navigation={this.props.navigation} moveToNextScreen = {this.getProfileDetails} screen={'HostProfile'}/>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/account_setting.png')} title = 'Account Settings' borderColor = '#3dc099' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen={'ResetPasswordInContractorProfile'}/>
              <SpecificTask imageUrl = {require('../../assets/schedule.png')} title = 'Schedule' borderColor = '#b768ec' navigation={this.props.navigation} moveToNextScreen = {this.getScheduleEvents} screen = {'ScheduleCalendar'} />
              <SpecificTask imageUrl = {require('../../assets/checklists.png')} title = 'Checklists' borderColor = '#cdcd0f' navigation={this.props.navigation}  moveToNextScreen = {this.getChecklists} screen = {'TabViewOfChecklist'}/>
            </View>
          }
          {(this.props.roleIdUserName.host_associate === 'yes' || this.state.coHost_accepted === 'yes') &&
            <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%'), marginBottom : hp('2%')}}>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/Dashboard_stats.png')} title = {`Dashboard Stats`} borderColor = '#8cc63f' navigation={this.props.navigation} moveToNextScreen = {this._getDashboardStats} screen={'HostStats'}/>
              <SpecificTask imageUrl1 ={require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = 'Cleaners' borderColor = '#b08558' navigation={this.props.navigation} moveToNextScreen = {this.getCleaners} screen = {'Cleaners'}/>
              <SpecificTask imageUrl = {require('../../assets/co-host.png')} title = {'Find Local Contractors'} borderColor = '#8cc63f' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'CreateJob_Screen1'}/>
              <SpecificTask imageUrl1 ={require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = {'My Hosts'} borderColor = '#6915CF' navigation={this.props.navigation} moveToNextScreen = {this.getMyHost} screen = {'MyHost'}/>
              <SpecificTask imageUrl1 ={require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = 'My Contractors' borderColor = '#F0DECB' navigation={this.props.navigation} moveToNextScreen = {this.getTeam} screen = {'Teams'}/>
              <SpecificTask imageUrl = {require('../../assets/My_job.png')} title = {'My Jobs'} borderColor = '#f6af29' navigation={this.props.navigation} moveToNextScreen = {this.getMyJobs} screen = {'HostMyJobsList'}/>
              <SpecificTask imageUrl = {require('../../assets/properties.png')} title = 'Properties' borderColor = '#ff7e70' navigation={this.props.navigation} moveToNextScreen = {this.getExistingProperties} screen = {'MyPropertyList'}/>
              <SpecificTask imageUrl = {require('../../assets/pay_my_contractor.png')} title = 'Pay My Contractors' borderColor = '#0071bc' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'ManualPayment'}/>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/profile_setting.png')} title = 'Profile Settings' borderColor = '#47c7dd' navigation={this.props.navigation} moveToNextScreen = {this.getProfileDetails} screen={'HostProfile'}/>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/account_setting.png')} title = 'Account Settings' borderColor = '#3dc099' navigation={this.props.navigation} moveToNextScreen = {this.getPassportImages} screen={'TabViewOfPasswordAndPassport'}/>
              <SpecificTask imageUrl = {require('../../assets/schedule.png')} title = 'Schedule' borderColor = '#b768ec' navigation={this.props.navigation} moveToNextScreen = {this.getScheduleEvents} screen = {'ScheduleCalendar'} />
              <SpecificTask imageUrl = {require('../../assets/checklists.png')} title = 'Checklists' borderColor = '#cdcd0f' navigation={this.props.navigation}  moveToNextScreen = {this.getChecklists} screen = {'TabViewOfChecklist'}/>
            </View>
          }
          {(this.props.roleIdUserName.host_associate === 'no' && this.state.coHost_accepted === 'no') && 
            <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%')}}>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/Dashboard_stats.png')} title = {`Dashboard Stats`} borderColor = '#8cc63f' navigation={this.props.navigation} moveToNextScreen = {this._getDashboardStats} screen={'ContractorStats'}/>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/profile_setting.png')} title = 'Profile Settings' borderColor = '#47c7dd' navigation={this.props.navigation} moveToNextScreen = {this.getProfileDetails} screen={'HostProfile'}/>
              <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/account_setting.png')} title = 'Account Settings' borderColor = '#3dc099' navigation={this.props.navigation} moveToNextScreen = {this.getPassportImages} screen={'TabViewOfPasswordAndPassport'}/>
              <SpecificTask imageUrl = {require('../../assets/pay_my_contractor.png')} title = 'Payment' borderColor = '#0071bc' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'ManualPayment'}/>
            </View>
          } 
        </ScrollView>
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  userName : state.createJob.userName,
  roleIdUserName : state.createJob.roleIdUserName
});
export default connect(mapStateToProps,{
  GetExistingProperty,  
  GetProfileDetails, 
  GetMyJobs, 
  FalseLoader,
  store_Role_Id_And_Name,
  GetHostTeam, 
  GetData,
  GetPassportImages,
  GetDashboardStats})(HostDashBoard);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch'
  },
});