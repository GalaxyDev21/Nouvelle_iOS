import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput ,ScrollView , AsyncStorage, TouchableOpacity, Image, Platform, KeyboardAvoidingView , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements' ;
import EmailValidation from '../validations/emailValidation' ;
import nameValidation from '../validations/nameValidation';
import passwordValidation from '../validations/passwordValidation' ;
import ZipCodeValidation from '../validations/zipCodeValidation';
import axios from 'axios' ;
import moment from 'moment';
import DropDownField from './dropDown';
import MessageBarManager from 'react-native-message-bar/MessageBarManager';
import ShowBar from '../validations/messageBar' ;
import { connect } from 'react-redux';
import {server} from '../../Redux/server';

class ContractorRegistrationForm extends Component{
  constructor(props){
    super(props);
      this.state ={
          lastName : '' ,
          firstName : '',
          username : '',
          companyName : '',
          proTitle : '' ,
          email : '' ,
          password : '' ,
          cnfmPassword : '' ,
          emailErr : '' ,
          lastNameErr : '' ,
          firstNameErr : '' ,
          usernameErr : '',
          proTitleErr : '' ,
          passwordErr : '',
          cnfmPasswordErr : '' ,
          processing : false ,
          checked : false,
          states : this.props.states,
          zipCode : '',
          zipCodeErr : '',
          location  : '',
          locationErr : '',
          locationID : ''
      }
  }
  createAccount = async () => {
    this.setState({processing : true});
    if(this.state.password !== this.state.cnfmPassword){
      var isPasswordMatch = 'Password does not match';
    }
    if(!this.state.firstName || this.state.firstNameErr) {
      var isFirstNameEmpty = 'Please enter valid firstname';
    }
    if(!this.state.lastName) {
      var  isLastNameEmpty = 'Please enter valid lastname';
    }
    if(!this.state.email || this.state.emailErr) {
      var isEmailEmpty = 'Please enter valid email';
    }
    if(!this.state.proTitle) {
      var isProTitleEmpty = 'Please add Professional Title';
    }
    if(!this.state.password || this.state.passwordErr) {
      var isPasswordEmpty = 'Please enter valid password';
    }
    if(!this.state.cnfmPassword || this.state.cnfmPasswordErr) {
      var isPasswordMatch = 'Please enter confirm password';
    }
    if(!this.state.zipCode || this.state.zipCodeErr) {
      var isZipCodeEmpty = 'Please enter Zip Code';
    }
    if(!this.state.location || this.state.locationErr) {
      var isLocationEmpty = 'Please select a location';
    }
      else if((this.state.firstName && !isFirstNameEmpty) && (this.state.lastName && !isLastNameEmpty) && (this.state.email && !isEmailEmpty) && (this.state.proTitle && !isProTitleEmpty) && (this.state.password && !isPasswordEmpty) && (this.state.cnfmPassword && !isPasswordMatch)){ 
        const username = this.state.firstName.toLowerCase() + moment(new Date()).format('h-mm-ss-a'); 
        var formData = new FormData();
        formData.append('roles', 'freelancer');
        formData.append('first_name', this.state.firstName);
        formData.append('last_name', this.state.lastName);
        formData.append('username', username);
        formData.append('email', this.state.email);
        formData.append('professional_title', this.state.proTitle);
        formData.append('company_name', this.state.companyName);
        formData.append('password', this.state.password);
        formData.append('confirm_password', this.state.cnfmPassword);
        formData.append('host_type', '');
        formData.append('et_zipcode', this.state.zipCode);
        formData.append('state', this.state.locationID);
        console.log(server+'register');
        try{
          const res = await axios.post(server+'register', formData);
          if(res.data.code === 201) {
            this.setState({processing : false});
            ShowBar(res.data.message , 'error');
          }
          else if(res.data.code === 200){
            ShowBar('You have registered successfully' , 'success');
            AsyncStorage.setItem('currentUserId', res.data.id.toString());
            this.props.navigation.navigate('EmailVerification' , {emailAddress : this.state.email, role : 'freelancer', screen : 'ContractorLogin', userID : res.data.id});
          }
        }
        catch(error){
          this.setState({processing : false});
          console.log('Catch Method Called');
          console.log(error);
        } 
      }
      this.setState({
        cnfmPasswordErr : isPasswordMatch,
        firstNameErr : isFirstNameEmpty,
        lastNameErr : isLastNameEmpty,
        emailErr : isEmailEmpty,
        passwordErr : isPasswordEmpty,
        cnfmPasswordErr : isPasswordMatch,
        proTitleErr : isProTitleEmpty,
        zipCodeErr : isZipCodeEmpty,
        locationErr : isLocationEmpty,
        processing : false
      });      
  }
  selectState = (value, id) => {
      this.setState({
        location : value,
        locationID : id
      })
  }
  render(){
    return(
        <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={styles.backGroundImage}>
          <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={10}>
          <ScrollView>
            <View style={styles.textEntrycontainer}>
              <View style={{flex : 0.1 , alignItems : 'flex-start' , marginTop : hp('2%')}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=>this.props.navigation.goBack()}><Icon name='arrow-back' size={25}  color='#292929'/></TouchableOpacity>
              </View>
              <View style={{flex : 0.2 , alignItems : 'center' , justifyContent : 'center' , marginVertical : hp('2%')}}>
                <Image source={require('../../assets/Nouvelle_Transparent_Logo.png')} style={styles.nouvelleImage}/>
              </View>
              <Text style={{fontSize : (25), textAlign : 'center' ,  color : '#292929' , marginBottom :hp('1.5%')}}>SIGN UP</Text>
              <Text style={{fontSize : (20), textAlign : 'center' ,  color : '#0071bc' , marginBottom :hp('3%')}}>Contractor</Text> 
              <View style={styles.specificTextInputFlex}>  
                <TextInput placeholder='First Name' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=>this.setState({firstName : text, firstNameErr : nameValidation(text)})} onFocus={() => this.setState({processing : false, firstNameErr : ''})} value={this.state.firstName}/>
              </View>
              <View><Text style={{color : 'red'}}>{this.state.firstNameErr}</Text></View>
              <View style={styles.specificTextInputFlex}> 
                <TextInput  placeholder='Last Name' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=>this.setState({lastName : text , lastNameErr : nameValidation(text), processing : false,})} value={this.state.lastName}/>
              </View>
              <View><Text style={{color : 'red'}}>{this.state.lastNameErr}</Text></View>
              <View style={[styles.specificTextInputFlex, {marginBottom : hp('2.5%')}]}> 
                <TextInput  placeholder='Company Name (Optional)' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=>this.setState({companyName : text})} value={this.state.companyName}/>  
              </View>
              <View style={styles.specificTextInputFlex}> 
                <TextInput  placeholder='Professional Title' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=>this.setState({proTitle : text , proTitleErr : ''})} value={this.state.proTitle}/>
              </View>
              <View><Text style={{color : 'red'}}>{this.state.proTitleErr}</Text></View>
              <View style={styles.specificTextInputFlex}> 
                <TextInput  placeholder='Email' placeholderTextColor='#292929' autoCapitalize = 'none' keyboardType='email-address' style={styles.textInputCon} onChangeText={(text)=>this.setState({email : text , emailErr : EmailValidation(text)})} onFocus={() => this.setState({processing : false, emailErr : ''})} value={this.state.email}/>
              </View>
              <View><Text style={{color : 'red'}}>{this.state.emailErr}</Text></View>
              <View style={styles.specificTextInputFlex}> 
                <TextInput placeholder='Password (Minimum of 6 characters)' placeholderTextColor='#292929' autoCapitalize='none' secureTextEntry={true}  style={styles.textInputCon} onChangeText={(text)=> this.setState({password : text, passwordErr : passwordValidation(text)})}  onFocus={() => this.setState({processing : false, passwordErr : ''})}/>
              </View>
              <View><Text style={{color : 'red'}}>{this.state.passwordErr}</Text></View>
              <View style={styles.specificTextInputFlex}>
                <TextInput  placeholder='Password Confirmation' placeholderTextColor='#292929' autoCapitalize='none' secureTextEntry={true} style={styles.textInputCon} onChangeText={(text)=>this.setState({cnfmPassword : text, processing : false, cnfmPasswordErr : ''})}/>
              </View>
              <View style={{ marginBottom : hp('1%')}}><Text style={{color : 'red'}}>{this.state.cnfmPasswordErr}</Text></View>
              <View style={{height : hp('6%'), marginBottom : hp('1%')}}>
                <DropDownField
                  listShow = {this.state.states}
                  placeholder = 'Location'
                  viewheight = {hp('6%')}
                  height = {hp('24%')}
                  width = {('100%')}
                  selectedValue = {this.selectState}
                  fontSize = {(15)}
                  color = {'white'}
                  border = {1}
                  name = 'name'
                  id = 'term_id'
                  isObject = {true}
                />
                <Text style={{color : 'red'}}>{this.state.locationErr}</Text>
              </View>
              <View style={[styles.specificTextInputFlex, Platform.OS === 'ios'?{zIndex : -1}:{}]}> 
                <TextInput keyboardType = 'numeric' placeholder='Enter Zip Code' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=>this.setState({zipCode : text, zipCodeErr : ZipCodeValidation(text)})}  onFocus={() => this.setState({processing : false, zipCodeErr : ''})}/>
              </View>
              <View style={[{ marginBottom : hp('4%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}><Text style={{color : 'red'}}>{this.state.zipCodeErr}</Text></View>
              <TouchableOpacity activeOpacity={0.5} style={[styles.touchCon, Platform.OS === 'ios'?{zIndex : -1}:{}]} onPress={this.createAccount}>
                <Text style={styles.touchButton}>CREATE ACCOUNT</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity> 
            </View>
            <View style={[styles.alreadyAccount, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
              <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.props.navigation.navigate('ContractorLogin')}}>
                <Text style={{color : '#0071bc' , fontFamily : 'Raleway-SemiBold'}} >Already have an account?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  states : state.createJob.states,
});
export default connect(mapStateToProps,)(ContractorRegistrationForm);
const styles = StyleSheet.create({
  container : {
      flex : 1 ,
  },
  backGroundImage : {
    height : hp('100%'),
    width : wp('100%') ,
    resizeMode : 'stretch'  
  },
  textEntrycontainer : {
    flex : 0.9 ,
    marginHorizontal : wp('6%'),
  },
  nouvelleImage : {
    height : hp('7%') ,
    width : wp('45%') ,
    resizeMode:'contain',    
  } ,
  specificTextInputFlex : {
    height : hp('6%'),
    borderBottomColor : '#121212',
    borderBottomWidth : 0.5 ,
  },
  textInputCon : {
    height : hp('6%'),
    fontSize : (15) ,
    width : '100%' ,
    color : 'black' ,
    paddingBottom : -hp('1.5%')           
  },
  touchCon : {
    height : hp('7%'),
    flexDirection : 'row' ,
    marginBottom : hp('3%') ,
    backgroundColor : '#8cc63f' ,
    borderRadius : wp('10%') ,
    alignItems : 'center' ,
    justifyContent : 'center' ,
  },
  touchButton : {
    fontFamily : 'Raleway-SemiBold' , 
    fontSize : (15) ,
    color : '#ffffff' ,
  },
  alreadyAccount: {
    marginBottom : hp('10%'),
    alignItems : 'center' ,
    justifyContent : "center"
  },
});
