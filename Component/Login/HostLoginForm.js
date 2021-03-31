import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput , ActivityIndicator ,ScrollView , TouchableOpacity , AsyncStorage, Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios' ;
import { Icon } from 'react-native-elements' ;
import ShowBar from '../validations/messageBar' ;
import { connect } from 'react-redux';
import {StoreTokenNumber, StoreUserName, GetExistingProperty, store_Role_Id_And_Name} from '../../Redux/createJob/jobAction' ;
import {server} from '../../Redux/server';
import {messaging} from 'react-native-firebase';
import * as firebase from 'firebase';

class HostLoginForm extends Component{
  constructor(props){
    super(props);
      this.state ={
        email : '' ,
        password : '' ,
        emailErr : '' ,
        passwordErr : '' ,
        processing : false ,
        checked : false
      } 
  }
  loginAccount = () => {
    this.setState({ processing : true});
    if((this.state.email && !this.state.emailErr) && (this.state.password && !this.state.passwordErr)){ 
      var formData = new FormData();
      formData.append('username', this.state.email);
      formData.append('password', this.state.password);
      this.apiCall(formData);
    }
    else{
      if(!this.state.email){
        this.setState({
          emailErr : 'Please enter valid email',
          processing : false
        });
      }
      if(!this.state.password){
        this.setState({
          passwordErr : 'Please enter a password',
          processing : false
        });
      }   
    }           
  }
  apiCall = async(formData) => {
    const userID = await AsyncStorage.getItem('currentUserId');
    try{
     const res = await axios.post(server+'login', formData);
      if(res.data.code === 201) {
        ShowBar('Username or Password is Invalid' , 'error');
        this.stopProcessing();
      }
      else if(res.data.code === 200){
        this.getPermissions(res.data.data.id);
        if(res.data.data.active){
          if(res.data.data.host_associate !== undefined){
            this.storeUserData(res.data.data.display_name, res.data.data.id, res.data.data.roles, res.data.data.co_host, res.data.data.email, res.data.data.host_associate);
            AsyncStorage.setItem('host_associate', res.data.data.host_associate ? 'yes' : 'no');
          }
          else{
            this.storeUserData(res.data.data.display_name, res.data.data.id, res.data.data.roles, res.data.data.co_host, res.data.data.email);
          }
          AsyncStorage.setItem('UserName', res.data.data.display_name);
          AsyncStorage.setItem('currentUserId', res.data.data.id.toString());
          AsyncStorage.setItem('role', res.data.data.roles);
          AsyncStorage.setItem('coHost', res.data.data.co_host ? 'yes' : 'no');
          AsyncStorage.setItem('email', res.data.data.email);
          this.moveToDashBoard(res.data.data.roles, res.data.data.co_host, res.data.data.token);
        }
        else{
          this.props.navigation.navigate('EmailVerification' , {emailAddress : this.state.email, role : 'employer',screen : 'HostLogin', userID : userID});
          this.stopProcessing();
        }       
      }
    }
    catch(error){
      console.log(error);
    }
  }
  getPermissions = async(id) =>{
    const enabled = await messaging().hasPermission();
    if (enabled) {
      messaging().subscribeToTopic(id.toString());
    } 
    else {
      await messaging().requestPermission();
    }
  }
  storeUserData = (userName, currentUserId, role, coHost, email, host_associate) => {
    if(host_associate !== undefined){
      obj = {
        role,
        coHost : coHost ? 'yes' : 'no',
        email,
        userName,
        host_associate : host_associate ? 'yes' : 'no',
        currentUserId : currentUserId.toString(),
      };
      this.props.store_Role_Id_And_Name(obj);
    }
    else{
      obj = {
        role,
        coHost : coHost ? 'yes' : 'no',
        email,
        userName, 
        currentUserId : currentUserId.toString(),
      };
      this.props.store_Role_Id_And_Name(obj);
    }
  }
  stopProcessing = () => {
    this.setState({
      processing : false
    })
  }
  moveToDashBoard = (role, isCohostValid, token) => {
    if(role === 'employer' || (role === 'freelancer' && isCohostValid)){
      this.signIn(token);
      this.props.navigation.navigate('HostDashBoard', {type : this.props.navigation.getParam('type' , ''), hostId : this.props.navigation.getParam('hostId' , '')});
      ShowBar('Welcome to DashBoard' , 'success');      
    }
    else{
      ShowBar('Please Enter Valid User' , 'error');
      this.setState({processing:false});
    }
  }
  signIn = async(token) => {
    try{
      if(this.state.checked) {
        await AsyncStorage.setItem('Token', token);
      }
      this.props.StoreTokenNumber(token);
    }
    catch(error){
      console.log(error);
    }
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={{flex : 1}} resizeMode={'stretch'}>
        <ScrollView>
          <View style={styles.textEntrycontainer}>
            <View style={{flex : 0.1 , alignItems : 'flex-start'}}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()}><Icon name='arrow-back' size={25}  color='#292929'/></TouchableOpacity>
            </View>
            <View style={{flex : 0.2 , alignItems : 'center' , justifyContent : 'center' , marginBottom : hp('2%')}}>
              <Image source={require('../../assets/Nouvelle_Transparent_Logo.png')} style={styles.nouvelleImage}/>
            </View>
            <Text style={{fontSize : 25,fontFamily : 'Raleway-SemiBold'  , textAlign : 'center' ,  color : '#292929', marginBottom :hp('2%')}}>SIGN IN</Text>
            <Text style={{fontSize : 20, fontFamily : 'Raleway-SemiBold' , textAlign : 'center' ,  color : '#0071bc' , marginBottom :hp('4%')}}>Host/Co-Host</Text>    
            <View style={styles.specificTextInputFlex}> 
              <TextInput  placeholder='Email Address' placeholderTextColor='#292929' autoCapitalize = 'none' keyboardType='email-address' style={styles.textInputCon} onChangeText={(text)=>this.setState({email : text})} onFocus={() => this.setState({processing : false, emailErr : ''})} value={this.state.email}/>
            </View>
            <View ><Text style={{color : 'red'}}>{this.state.emailErr}</Text></View>
            <View style={styles.specificTextInputFlex}> 
              <TextInput  placeholder='Password' placeholderTextColor='#292929' autoCapitalize='none' secureTextEntry={true}  style={styles.textInputCon} onChangeText={(text)=> this.setState({password : text, passwordErr : ''})}  onFocus={() => this.setState({processing : false})}/>
            </View>
            <View><Text style={{color : 'red'}}>{this.state.passwordErr}</Text></View>
            <View style = {styles.rememberMeCheckBox}>
              <TouchableOpacity onPress = {() => this.setState({checked : !this.state.checked ? true : false})} style={{flexDirection : 'row' , alignItems : 'center'}}>
                <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3%'), width : hp('3%'), borderWidth : 1.5 , borderColor : '#292929', borderRadius : hp('0.5%')}}>
                  {this.state.checked &&  
                    <View style={{height : hp('3%'), width : hp('3%'), justifyContent : 'center', alignItems : 'center', backgroundColor : '#8cc63f', borderWidth : 1.5 , borderColor : '#8cc63f', borderRadius : hp('0.5%')}}>
                      <Icon name = 'check' size = {15} color = 'white'/>
                    </View>
                  }
                </View>
                <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (15), marginLeft : wp('4%')}}>Keep me logged-in</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('ForgotPasswordScreen')}>
                <Text style={{color : '#0071bc' , fontSize:(15)}}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.touchCon} onPress={ this.loginAccount} >
              <Text style={styles.touchButton}>Login</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
            </TouchableOpacity>
          </View>
          <View style={styles.alreadyAccount}>
            <Text style={{color : '#292929' , fontSize : (15)}}>Don't have an account?</Text>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('HostReg')}>
              <Text style={{color : '#0071bc' ,fontSize : (15)}}>{` Sign Up!`}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground> 
    )
  }
}
const mapStateToProps = state => ({
  // token_access : state.token.token_access ,
});
export default connect(mapStateToProps, {StoreTokenNumber, StoreUserName, GetExistingProperty, store_Role_Id_And_Name})(HostLoginForm);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
  },
  textEntrycontainer : {
    flex : 0.8 ,
    marginTop : hp('4%') ,
    marginHorizontal : wp('4%') ,
  },
  nouvelleImage : {
    height : hp('7%') ,
    width : wp('45%') ,
    resizeMode:'contain',    
  } ,
  specificTextInputFlex : {
    height : hp('6%') ,
    borderBottomColor : '#121212',
    borderBottomWidth : 0.5 ,
  },
  rememberMeCheckBox : {
    flexDirection: 'row',
    marginTop : hp('1%'),
    marginBottom : hp('3%') ,
    flex : 0.15 ,
    alignItems : 'center' ,
    justifyContent : 'space-between',
  },
  textInputCon : {
    height : hp('6%'),
    fontSize : (15) ,
    width : '100%' ,
    color : 'black', 
    paddingBottom : -hp('1.5%')           
 },
  touchCon : {
    height: hp('7%') ,
    flexDirection : 'row' ,
    backgroundColor : '#8cc63f' ,
    borderRadius : 25 ,
    alignItems : 'center' ,
    justifyContent : 'center' ,
    marginBottom : hp('2%') ,
  },
  touchButton : {
    fontFamily : 'Raleway-SemiBold' , 
    fontSize : (15) ,
    color : '#ffffff' ,
    marginRight : wp('2%')
  },
  alreadyAccount: {
    flex : 0.2 ,
    flexDirection : 'row' ,
    justifyContent : "center" ,
    marginTop : hp('7%')
  }
});