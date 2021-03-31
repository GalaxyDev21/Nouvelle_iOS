import React, { Component } from 'react';
import {View, Text, StyleSheet, ImageBackground, AsyncStorage, ActivityIndicator, Platform} from 'react-native';
import {connect} from 'react-redux';
import {getUserDetails, GetCountriesAndStates, GetJobService, store_Role_Id_And_Name} from '../../Redux/createJob/jobAction' ;
import MessageBarAlert  from 'react-native-message-bar/MessageBar';
import ShowBar from '../validations/messageBar' ;
import * as Progress from 'react-native-progress';
import NetInfo from "@react-native-community/netinfo";

class FirstTimeAppRun extends Component {
  constructor(props){
    super(props)
    this.state = {
      loginAttempt: 0,
      isDailogOPen : false,
      hostId : '',
      token : ''
    }
  }
  componentDidMount(){
    this.attemptLogin();
    this.getRole(); 
  }
  getRole = async() => {
    const role = await AsyncStorage.getItem('role');
    const coHost = await AsyncStorage.getItem('coHost');
    const email = await AsyncStorage.getItem('email');
    const userName = await AsyncStorage.getItem('UserName');
    const currentUserId = await AsyncStorage.getItem('currentUserId');
    const host_associate = await AsyncStorage.getItem('host_associate');
    if(host_associate !== null){
      obj = {
        role,
        coHost,
        email,
        userName,
        host_associate,
        currentUserId,
      };
      this.props.store_Role_Id_And_Name(obj);
    }
    else{
      obj = {
        role,
        coHost,
        email,
        userName,
        currentUserId,
      };
      this.props.store_Role_Id_And_Name(obj);
    }
  }
  componentDidUpdate(){
    //if(Object.keys(this.props.userDetail).length !== 0)
    this.checkLoggedIn();  
  }
  attemptLogin = async() => { 
    const token = await AsyncStorage.getItem('Token');
    //this.setState({token});
    try {
      this.props.getUserDetails(token);
      this.props.GetCountriesAndStates();
      this.props.GetJobService();
    } catch (error) {
      this.props.navigation.navigate('RegistrationAndLoginScreens');
    }
  }   
  checkLoggedIn = async() => {
    const netInfo = await NetInfo.fetch();
    //console.log(netInfo);
    const isConnected = netInfo.isInternetReachable;
    // console.log('Check connection');
    // console.log(isConnected);
    if(!isConnected && !netInfo.isConnected){
      ShowBar('Please check your internet connection!' , 'warning');
      return;
    }   
    try{  
      if(this.props.userDetail.data.roles === 'employer' || this.props.userDetail.data.co_host){
        this.props.navigation.navigate('HostDashBoard');
      }
      else if(this.props.userDetail.data.roles === 'freelancer' && !this.props.userDetail.data.co_host){
        this.props.navigation.navigate('ContractorDashBoard');
      }
      else{ 
        this.props.navigation.navigate('RegistrationAndLoginScreens');
      }
    }
    catch{
      this.props.navigation.navigate('RegistrationAndLoginScreens');          
    }          
  }
  render() {
    return (
      <ImageBackground source={require('../../assets/Nouvelle_Splash.png')} style={styles.containerBg}>
        <View style={{alignItems : 'center'}}>
          <Progress.Bar progress={1} width={320} height={25}  indeterminate={true} indeterminateAnimationDuration={2000} borderRadius={15}/>
          <Text style={{fontSize : 15, color : '#0071bc'}}>Loading...</Text>
          <MessageBarAlert ref="alert" /> 
        </View>   
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({
  containerBg : {
    flex : 1,
    resizeMode : 'stretch',
    justifyContent : 'flex-end',
    alignItems : 'center',
    paddingBottom : '15%'
  },
});
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken ,
  userDetail : state.createJob.user ,
});
export default connect(mapStateToProps, {getUserDetails, GetCountriesAndStates, GetJobService, store_Role_Id_And_Name})(FirstTimeAppRun);