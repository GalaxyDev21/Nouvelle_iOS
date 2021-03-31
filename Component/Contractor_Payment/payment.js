import React ,{Component} from 'react';
import { StyleSheet, Text, View, Image,  AsyncStorage, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import {messaging} from 'react-native-firebase';
var WEBVIEW_REF = 'webview';

class ContractorPayment extends Component{
  constructor(props){
    super(props);
      this.state = {
        loading : true,
        isDropDownOpen : false,
        currentUrl : 'http://104.238.102.6/~yildirim/nouvelle/mobile-login/?email='+this.props.roleIdUserName.email
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
  signOut = () => {
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
  goBack = () => {
    if(this.state.currentUrl === 'https://nouvellespaces.com/mobile-login/?email='+this.props.roleIdUserName.email){
      this.props.navigation.goBack();
    }
    else if(this.state.currentUrl === 'https://nouvellespaces.com/mobile-payment/'){
      this.props.navigation.goBack();
    }
    else{
      this.refs[WEBVIEW_REF].goBack();
    } 
  };
  displaySpinner() {
    return (
      <View style={{flex : 1, paddingBottom : hp('30%'), alignItems : 'center', justifyContent : 'center'}}>
        <ActivityIndicator size='large'/>
      </View>
    );
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={{ height:Platform.OS === 'ios' ? hp('11%') : hp('8%'), width:wp('100%'), backgroundColor : '#0071bc' , flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between', paddingHorizontal : wp('2%'), zIndex : 9}}>
          <TouchableOpacity onPress={this.goBack} style={{ height : hp('4%'), width : hp('4%'), marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}}>
            <Icon name='arrow-back' size={25}  color='#ffffff'/>
          </TouchableOpacity>
            <Text style={{fontSize: 21 , color : '#ffffff', marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%') }}>PAYMENT</Text>
          {/* <View style = {{width : wp('17%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
            <TouchableOpacity style={{height : hp('4%'), width : hp('3%'), position : 'relative'}}>
              <Image source={require('../../assets/bell_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
              <View style={{backgroundColor : '#03436d', width : hp('2.5%'), height : hp('2.5%'), borderRadius : 50, alignItems : 'center', justifyContent : 'center', position : 'absolute',right : -10, top : -5}}>
                <Text style={{fontSize : (10), color : '#ffffff'}}>5</Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity style={{ height : hp('4%'), width : hp('3%'), marginTop : Platform.OS === 'ios'? hp('5%') : hp('0%')}} onPress={this.signOut}>
              <Image source={require('../../assets/menu_icon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
            </TouchableOpacity>
          {/* </View> */}
        </View>
        {this.state.isDropDownOpen && 
          <DropDownInStatusBar selectProperty = {this.selectProperty}/>
        }
        <View style={{flex : 1}}>
          <WebView 
            ref = {WEBVIEW_REF}
            javaScriptEnabled={true}
            // domStorageEnabled={true}
            startInLoadingState={true}
            //incognito={true}
            renderLoading={() => {
              return this.displaySpinner();
            }}
            useWebKit = {true} 
            source = {{ uri : 'https://nouvellespaces.com/mobile-login/?email='+this.props.roleIdUserName.email}}
            onNavigationStateChange={(event) => {
              this.setState({currentUrl : event.url})
            }}
          />
        </View>   
      </View>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  roleIdUserName : state.createJob.roleIdUserName
});
export default connect(mapStateToProps)(ContractorPayment);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
  },
});

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

