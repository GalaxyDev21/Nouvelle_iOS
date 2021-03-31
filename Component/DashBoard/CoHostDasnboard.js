import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView, Image ,ImageBackground, AsyncStorage} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar';
import SpecificTask from './specificTaskInEachDash' ;
import { GetExistingProperty, FalseLoader, GetProfileDetails,GetData,  GetMyJobs, GetHostTeam, store_Role_Id_And_Name } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { FALSE_PROPERTY_LIST_FLAG,
  FALSE_MY_JOBS_FLAG,
  FALSE_PROFILE_DETAILS_FLAG,
  FALSE_HOST_TEAM_LOADER, 
  GET_HOST_TEAM,
  FALSE_HOST_CHECKLISTS_FLAG,
  GET_HOST_CHECKLISTS,
  GET_HOST_SAMPLE_CHECKLISTS,
  GET_MY_JOBS,
  EXISTING_PROPERTY } from '../../Redux/createJob/actionType';

class CoHostDashBoard extends Component{
  constructor(props){
    super(props);
      this.state ={
        name : ''
      }
      this.getUserName();
  }
  getUserName = async () => {
    const userName = await AsyncStorage.getItem('UserName');
    this.storeName(userName);
  }
  storeName = (userName) => {
    this.setState({name : userName})
  }
  componentDidMount(){
    this.getRole();
  }
  getRole = async() => {
    const role = await AsyncStorage.getItem('role');
    const coHost = await AsyncStorage.getItem('coHost');
    const email = await AsyncStorage.getItem('email');
    //const userName = await AsyncStorage.getItem('UserName');
    const currentUserId = await AsyncStorage.getItem('currentUserId');
    if(role){
      obj = {
        role,
        coHost,
        email,
        userName : this.state.name,
        currentUserId,
      };
      this.props.store_Role_Id_And_Name(obj);
    }
  }
  moveToNextScreen = (screen) => {
      this.props.navigation.navigate(screen);
  }
  getExistingProperties = (screen) => {
    var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 10);
      this.props.FalseLoader(FALSE_PROPERTY_LIST_FLAG);
      this.props.GetData('existing_property', EXISTING_PROPERTY, this.props.userToken, formData);
      this.props.navigation.navigate(screen);
  }
  getProfileDetails = (screen) => {
    this.props.FalseLoader(FALSE_PROFILE_DETAILS_FLAG);
    this.props.GetProfileDetails(this.props.userToken);
    this.props.navigation.navigate(screen);
  }
  getMyJobs = (screen) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_MY_JOBS_FLAG);
    this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
    this.props.navigation.navigate(screen);
  }
  getTeam = (screen) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_HOST_TEAM_LOADER);
    this.props.GetData('my_team', GET_HOST_TEAM , this.props.userToken, formData);
    this.props.navigation.navigate(screen);
  }
  getScheduleEvents = (screen) => {
    this.existingPropertyList();
    this.props.navigation.navigate(screen);
  }
  existingPropertyList = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 100);
    this.props.GetData('existing_property', EXISTING_PROPERTY, this.props.userToken, formData);
  }
  getChecklists = (screen) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_HOST_CHECKLISTS_FLAG);
    this.props.GetData('get_all_check_lists', GET_HOST_CHECKLISTS , this.props.userToken, formData);
    this.props.GetData('get_all_sample_check_lists', GET_HOST_SAMPLE_CHECKLISTS , this.props.userToken, formData);
    this.existingPropertyList();
    this.props.navigation.navigate(screen);
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/dashboard_bg.jpg')} style={styles.container}>
        <StatusBar title='DASHBOARD' isIconDisplay={false} navigation={this.props.navigation} marginValue={hp('2%')}/>
          <Text style={{fontFamily : 'Raleway-SemiBold', fontSize: (22) , color : '#292929', marginHorizontal : hp('2%'), marginBottom : hp('2%')}}>{`Welcome ${this.state.name}`}</Text>
            <ScrollView>
              <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%'),}}>
                <SpecificTask imageUrl = {require('../../assets/co-host.png')} title = {'Find Local Contractors'} borderColor = '#8cc63f' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'CreateJob_Screen1'}/>
                <SpecificTask imageUrl = {require('../../assets/My_job.png')} title = {'My Jobs'} borderColor = '#0071bc' navigation={this.props.navigation} moveToNextScreen = {this.getMyJobs} screen = {'HostMyJobsList'}/>
                <SpecificTask imageUrl = {require('../../assets/properties.png')} title = 'Properties' borderColor = '#ff7e70' navigation={this.props.navigation} moveToNextScreen = {this.getExistingProperties} screen = {'MyPropertyList'}/>
                <SpecificTask imageUrl = {require('../../assets/schedule.png')} title = 'Schedule' borderColor = '#47c7dd' navigation={this.props.navigation} moveToNextScreen = {this.getScheduleEvents} screen = {'ScheduleCalendar'} />
                <SpecificTask imageUrl1 = {require('../../assets/co-host.png')} imageUrl2 = {require('../../assets/My-contractors_2.png')} title = 'Team' borderColor = '#6869ec' navigation={this.props.navigation} moveToNextScreen = {this.getTeam} screen = {'Teams'}/>
                <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/profile_setting.png')} title = 'Profile Settings' borderColor = '#b768ec' navigation={this.props.navigation} moveToNextScreen = {this.getProfileDetails} screen={'HostProfile'}/>
                <SpecificTask imageUrl = {require('../../assets/contractor_dashboard_img/account_setting.png')} title = 'Account Settings' borderColor = '#3dc099' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen={'ResetPasswordInContractorProfile'}/>
                <SpecificTask imageUrl = {require('../../assets/checklists.png')} title = 'Checklists' borderColor = '#cdcd0f' navigation={this.props.navigation}  moveToNextScreen = {this.getChecklists} screen = {'TabViewOfChecklist'}/>
              </View>
            </ScrollView>
      </ImageBackground>  
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  userName : state.createJob.userName
});
export default connect(mapStateToProps,{
  GetExistingProperty,  
  GetProfileDetails, 
  GetMyJobs, 
  FalseLoader,
  store_Role_Id_And_Name,
  GetHostTeam, 
  GetData})(CoHostDashBoard);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch'
  },
});


{/* <SpecificTask imageUrl = {require('../../assets/pay_my_contractor.png')} title = 'Pay My Contractors' borderColor = '#f6af29' navigation={this.props.navigation} moveToNextScreen = {this.moveToNextScreen} screen = {'ManualPayment'}/> */}