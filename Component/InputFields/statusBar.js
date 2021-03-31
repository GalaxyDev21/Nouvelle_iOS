import React ,{Component} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Image, AsyncStorage, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements' ;
import {FalseLoader, GetData} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { FALSE_MY_JOBS_FLAG, GET_MY_JOBS, FALSE_HOST_CHECKLISTS_FLAG, GET_HOST_CHECKLISTS, GET_HOST_SAMPLE_CHECKLISTS} from '../../Redux/createJob/actionType';
import { StackActions, NavigationActions } from 'react-navigation';
import {messaging} from 'react-native-firebase';

class StatusBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      isDialogOpen : false,
      isDropDownOpen : false
    }
  }
  logOut = async() => {
    try{
      AsyncStorage.removeItem('Token');
      AsyncStorage.removeItem('UserName');
      AsyncStorage.removeItem('role');
      AsyncStorage.removeItem('coHost');
      AsyncStorage.removeItem('email');
      AsyncStorage.removeItem('host_associate');
      const currentUserId = await AsyncStorage.getItem('currentUserId');
      this._unsubscribeFromTopic(currentUserId);
      this.props.navigation.navigate('RegistrationAndLoginScreens');
    }
    catch(error){
      console.log(error);
    }
  }
  _unsubscribeFromTopic = (id) => {
    messaging().unsubscribeFromTopic(id);
  }
  signOut = async() =>{
    this.setState({isDropDownOpen : !this.state.isDropDownOpen ? true : false});
  }
  selectProperty = (value) => {
    if(value === 'logout'){
      this.logOut();
    }
    else{
      this.props.navigation.navigate('Inbox');
    }
    this.setState({isDropDownOpen : false});
  }
  myJobs = async() => {
    if(this.props.backToScreen === 'TabViewOfChecklist'){
      var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 10);
      this.props.FalseLoader(FALSE_HOST_CHECKLISTS_FLAG);
      this.props.GetData('get_all_check_lists', GET_HOST_CHECKLISTS , this.props.userToken, formData);
      this.props.GetData('get_all_sample_check_lists', GET_HOST_SAMPLE_CHECKLISTS , this.props.userToken, formData);
      this.props.navigation.navigate(this.props.backToScreen);
    }
    else{
      var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 10);
      this.props.FalseLoader(FALSE_MY_JOBS_FLAG);
      this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'HostDashBoard' }),
          NavigationActions.navigate({ routeName: 'HostMyJobsList' }), 
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }
  }
  render(){
    return(
      <View style={Platform.OS === 'ios'?{zIndex : 9}:{}}>
        {this.props.isIconDisplay && 
          <View style={{ height:Platform.OS === 'ios' ? hp('11%') : hp('8%'), width:wp('100%'), backgroundColor : '#0071bc' , flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between', marginBottom : this.props.marginValue, paddingHorizontal : wp('2%')}}>
              <TouchableOpacity onPress={this.props.backToScreen !== undefined ? ()=>this.myJobs() : ()=>this.props.navigation.goBack()} style={{ height : hp('4%'), width : hp('4%'), marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}}>
              <Icon name='arrow-back' size={25}  color='#ffffff'/>
            </TouchableOpacity>
            <Text style={{fontSize: 21 , color : '#ffffff' , marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}}>{this.props.title}</Text>
            {/* <View style = {{width : wp('17%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}> */}
              
              <TouchableOpacity style={{height : hp('4%'), width : hp('3%'), marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}} onPress={this.signOut}>
                <Image source={require('../../assets/menu_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
              </TouchableOpacity>
            {/* </View> */}
          </View>
        }
        {!this.props.isIconDisplay && 
          <View style={{ height:Platform.OS === 'ios' ? hp('11%') : hp('8%'), width:wp('100%'), backgroundColor : '#0071bc',flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', paddingHorizontal : wp('2%'), marginBottom : this.props.marginValue, paddingTop : hp('1%')}}>
            <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}}>
              <Text style={{ fontSize: (24) , color : '#ffffff', marginLeft : wp('10%')}}>{this.props.title}</Text>
            </View>
            {/* <View style = {{width : wp('17%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}> */}
             
              <TouchableOpacity style={{height : hp('4%'), width : hp('3%'), marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}} onPress={this.signOut}>
                <Image source={require('../../assets/menu_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
              </TouchableOpacity>
              {/* <View> */}
            </View>
          
        } 
        {this.state.isDropDownOpen && 
          <DropDownInStatusBar selectProperty = {this.selectProperty}/>
        }
      </View> 
    )
  }    
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  // isChatRoomLoaded : state.chating.isChatRoomLoaded,
  // userRole : state.chating.userRole
});
export default connect(mapStateToProps, {FalseLoader, GetData})(StatusBar);

class DropDownInStatusBar extends Component {
  render(){
    return(
      <View style={{elevation : 5, width : wp('35%'), height : hp('13%'), position : 'absolute', top : Platform.OS === 'ios'? hp('11%') : hp('8%'), right : wp('2%'), zIndex : 9999, backgroundColor: '#ffffff', borderRadius : wp('2%'), borderWidth : 1, borderColor : '#dfdfdf'}}>
        <TouchableOpacity onPress={() => this.props.selectProperty('inbox')} style={{height:hp('6.5%') , flexDirection : 'row', alignItems : 'center', borderBottomWidth : 1, borderBottomColor : '#dfdfdf', paddingHorizontal : wp('3%')}}>
          <Image source={require('../../assets/envelope.png')}  style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/> 
            <Text style={{ color : '#292929' , fontSize : (18), padding : wp('2%'), marginLeft : wp('3%')}}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.selectProperty('logout')} style={{height:hp('6.5%') , flexDirection : 'row', alignItems : 'center', borderBottomWidth : 1, borderBottomColor : '#dfdfdf', paddingHorizontal : wp('3%')}}>
          <Image source={require('../../assets/logout2_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/> 
            <Text style={{ color : '#292929' , fontSize : (18), padding : wp('2%'), marginLeft : wp('3%')}}>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

{/* <TouchableOpacity style={{height : hp('4%'), width : hp('3%'), position : 'relative'}}>
                <Image source={require('../../assets/bell_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
                <View style={{backgroundColor : '#03436d', width : hp('2.5%'), height : hp('2.5%'), borderRadius : 50, alignItems : 'center', justifyContent : 'center', position : 'absolute',right : -10, top : -5}}>
                  <Text style={{fontSize : (10), color : '#ffffff'}}>5</Text>
                </View>
              </TouchableOpacity> */}
            //   <TouchableOpacity style={{height : hp('4%'), width : hp('3%'), position : 'relative'}}>
            //   <Image source={require('../../assets/bell_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
            //   <View style={{backgroundColor : '#03436d', width : hp('2.5%'), height : hp('2.5%'), borderRadius : 50, alignItems : 'center', justifyContent : 'center', position : 'absolute', right : -10, top : -5}}>
            //     <Text style={{fontSize : 10, color : '#ffffff'}}>5</Text>
            //   </View>
            // </TouchableOpacity>