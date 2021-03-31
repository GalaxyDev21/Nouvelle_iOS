import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TextInput, Image, ImageBackground, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import EmailValidation from '../validations/emailValidation' ;
import nameValidation from '../validations/nameValidation';
import DropDownField from '../host_profile/dropDown';
import { connect } from 'react-redux';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import {server} from '../../Redux/server';
import { FalseLoader, GetProfileDetails } from '../../Redux/createJob/jobAction';
import { FALSE_PROFILE_DETAILS_FLAG } from '../../Redux/createJob/actionType';

class ContractorProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      image: this.props.profileDetails.profile_image !== '' ? this.props.profileDetails.profile_image : null,
      uploadImage : false,
      firstName : this.props.profileDetails.first_name,
      firstNameErr : '',
      lastName : this.props.profileDetails.last_name,
      profTitle : this.props.profileDetails.et_professional_title,
      email : this.props.profileDetails.email,
      states : this.props.states,
      selectedState : this.props.profileDetails.state ? this.props.profileDetails.state.name : '',
      slectedStateID : this.props.profileDetails.state ? this.props.profileDetails.state.term_id : '',
      emailErr : '',
      zipCode : this.props.profileDetails.et_zipcode,
      zipCodeErr : '',
      phoneNum : this.props.profileDetails.phone,
      phoneNumErr : '',
      processing : false,
      isDailogOpen : false,
      isSwitchOn : this.props.profileDetails.user_available === 'on' ? true : false,
      summary : this.props.profileDetails.description.replace(/(<([^>]+)>)/g, ""),
      isCodeSend : false,
      isVerifyDailogOpen : false,
      sendProcessing : false,
      blob : {},
      response : ''
    };
  }
  componentDidMount() {
    console.log('***** profile details *****');
    console.log(this.props.profileDetails.et_zipcode);
    console.log(this.props.profileDetails.description.replace(/(<([^>]+)>)/g, ""));
    console.log(this.props.profileDetails.user_available);
    console.log('***************************');
    this.getPermissionAsync();
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const blobData = blob._data;
      delete blobData.__collector;
      this.setState({
        image: result.uri,
        uploadImage : true,
        blob : {uri : result.uri, ...blobData}
      });
    }
  };
  removeImage = () => {
    this.setState({
      uploadImage : false,
      image : null
    });
  }
  selectState = (value, id) => {
    this.setState({
      selectedState : value,
      slectedStateID : id
    })
  }
  SubmitPressed =async () => {
    this.setState({processing : true});
    if(this.state.email && this.state.zipCode && this.state.selectedState && this.state.phoneNum){
      var formData = new FormData();
        formData.append('first_name', this.state.firstName);
        formData.append('last_name',  this.state.lastName);
        formData.append('email', this.state.email);
        formData.append('et_zipcode', this.state.zipCode);
        formData.append('state', this.state.slectedStateID);
        formData.append('phone_number', this.state.phoneNum);
        formData.append('user_available', this.state.isSwitchOn ? 'on' : 'off');
        formData.append('description', this.state.summary);
        console.log(formData);
        this.state.uploadImage && formData.append('image', this.state.blob);
        const res = await axios.post(server+'update_profile_details', formData,{
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        if(res.data.code === 200){
          ShowBar('Your profile has Updated successfully' , 'success');
          if(res.data.data.email_updated){
            this.setState({
              isDailogOpen : true
            })
          }
        }
        else{
          ShowBar('Sorry, Unable to update profile' , 'error');
        }
    }
    else{
      ShowBar('please fill all fields' , 'error');
    }
    this.setState({processing : false});
  }
  onVerifyNumber = async() => {
    await fetch(server+'sendPhoneVerificationCode',{
       method : 'post',
       headers : {'Authorization': 'Bearer '+ this.props.userToken},
     })
     .then(response => response.json())
     .then(res=>{
       if(res.code === 200){
         this.setState({isCodeSend : true, response : res.data});
       }
       else{
         ShowBar('Sorry,Unable to send code' , 'error');
         this.setState({isVerifyDailogOpen : false});
       }
     })
     .catch(error=>{
       console.log(error);
     });
  }
  onSend = async() => {
    var formData = new FormData();
    formData.append('code', this.state.code);
    const res = await axios.post(server+'verifyPhoneCode', formData, {
      headers : {'Authorization': 'Bearer '+ this.props.userToken},
    });
    if(res.data.code === 200){
      ShowBar('your phone number has successfully verified' , 'success');
      this.setState({sendProcessing : false, isVerifyDailogOpen : false});
      this.props.FalseLoader(FALSE_PROFILE_DETAILS_FLAG);
      this.props.GetProfileDetails(this.props.userToken);
    }
    else{
      ShowBar('Sorry,Unable to verify number' , 'error');
      this.setState({sendProcessing : false, isVerifyDailogOpen : false});
    }
  }
  phoneValidation = (inputtxt) => {
    var phoneno = /(\+[0-9]{7,})/;
    if(inputtxt.length > 0){
      if(inputtxt.match(phoneno)) {
        return '';
      }  
      else {
        return 'invalid phone number';
      }
    }
    else{
      return '';
    }  
  }
  render() {  
    return(
      <ImageBackground source={require('../../assets/contractor_profle_bg.jpg')} style={{flex: 1, padding : hp('3%'), resizeMode : 'stretch'}}>
        <ScrollView>
          <View style={{marginBottom : hp('3%'), height : hp('9%')}}>
            <Text style={{ color : '#292929', fontSize : (18)}}>First Name</Text>
            <TextInput placeholder='First Name' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({firstName : text, firstNameErr : nameValidation(text)})} value={this.state.firstName}/>
            <Text style={{color : 'red', fontSize : (12)}}>{this.state.firstNameErr}</Text>
          </View>
          <View style={{marginBottom : hp('3%')}}>
            <Text style={{ color : '#292929', fontSize : (18)}}>Last Name</Text>
            <TextInput placeholder='Last Name' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({lastName : text})} value={this.state.lastName}/>
          </View>
          <View style={{marginBottom : hp('3%'), height : hp('9%')}}>
            <Text style={{ color : '#292929', fontSize : (18)}}>Professional Title</Text>
            <TextInput placeholder='Profesional Title' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({profTitle : text})} value={this.state.profTitle}/>
          </View>
          <View style={{marginBottom : hp('3%')}}>
            <Text style={{ color : '#292929', fontSize : (18)}}>Profile Picture</Text>
            {this.props.profileDetails.profile_image === '' && 
              <View style={{justifyContent : 'center', alignItems : 'center', height : hp('30%'), borderWidth : 1, borderColor : '#DBDBDB', backgroundColor : '#f4f4f4'}}>
                <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',height : hp('7%'), width : wp('7%')}} onPress={this.pickImage}>
                  <Image source={require('../../assets/image_upload_icon.png')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
                </TouchableOpacity>
                <Text style={{ color : '#292929', fontSize : (14)}}>Drag and drop picture here or press above icon</Text>
              </View>
            } 
            {this.props.profileDetails.profile_image !== '' && 
              <TouchableOpacity onPress={this.pickImage} style={{ position : 'relative', height : hp('30%'), borderWidth : 1, borderColor : '#DBDBDB'}}> 
                <Image source={{ uri: this.state.image }} style={{height: hp('30%')}}/> 
                {this.state.uploadImage && <TouchableOpacity style={{alignItems: 'flex-end', justifyContent: 'center', height : hp('4%'), width : wp('4%'), position : 'absolute', right : 0}} onPress={this.removeImage}>
                  <Image source={require('../../assets/cross.png')} style={{height : hp('4%'), width : hp('4%'), resizeMode : 'contain'}}/>
                </TouchableOpacity>}
              </TouchableOpacity>
            } 
          </View>
          <View style={{marginBottom : this.state.emailErr === '' && this.props.profileDetails.email_pending ? hp('1.5%') :  hp('4%'), height : hp('9%')}}>
            <Text style={{ color : '#292929', fontSize : (18)}}>Email</Text>
            <TextInput placeholder='Email' placeholderTextColor='#292929' keyboardType='email-address' style={styles.textInputCon} onChangeText={(text)=>this.setState({email : text , emailErr : EmailValidation(text)})} value={this.state.email}/>
            <Text style={{color : 'red', fontSize : (12)}}>{this.state.emailErr}</Text>
          </View>
          {this.props.profileDetails.email_pending && <Text style={{color : '#292929', fontSize : (12),  marginBottom : hp('2%')}}>There is a pending change of the email to <Text style={{color : 'red', fontSize : 12}}>{this.props.profileDetails.new_email_pending}</Text></Text>}
          <View style={{marginBottom : hp('3%'), height : hp('9%')}}>
            <Text style={{ color : '#292929', fontSize : 18}}>Zip Code</Text>
            <TextInput keyboardType='number-pad' placeholder="ZIP code" placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({zipCode : text, zipCodeErr : ZipCodeValidation(text)})} value={this.state.zipCode}/>
            <Text style={{ color : 'red', fontSize : 12}}>{this.state.zipCodeErr}</Text>
          </View>
          <View style={{marginBottom : hp('3%'), height : hp('10%')}}>
            <Text style={{ color : '#292929', fontSize : 18}}>State</Text>      
            <DropDownField
              listShow = {this.state.states}
              placeholder =  {this.state.selectedState ? this.state.selectedState : 'select state'}
              selectedValue = {this.selectState}
              name = 'name'
              id = 'term_id'
              isObject = {true}
            />
            <Text style={{ color : 'red', fontSize : 12}}>{this.state.countryNotification}</Text>
          </View>
          <View style={[{marginBottom : hp('3%'), height : hp('12%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
            <Text style={{ color : '#292929', fontSize : 18}}>Phone Number</Text>
            <TextInput placeholder='Phone Number' keyboardType='phone-pad' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({phoneNum: text, phoneNumErr : this.phoneValidation(text)})} value={this.state.phoneNum}/>
            {this.props.profileDetails.phone !== '' && this.props.profileDetails.phone_verify_status !== '1' &&
              <TouchableOpacity onPress={()=>{this.setState({isVerifyDailogOpen : true}), this.onVerifyNumber()}}>
                <Text style={{fontSize : 13, color : '#8CC63E'}}>Verify Phone</Text>
              </TouchableOpacity>
            }
            <Text style={{color : 'red', fontSize : 12}}>{this.state.phoneNumErr}</Text>
          </View>
          <View style={[{marginBottom : hp('5%'), height : hp('18%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
            <Text style={{ color : '#292929', fontSize : (18)}}>Description</Text>
            <TextInput value={this.state.summary} onChangeText = {(text) => {this.setState({summary : text})}} multiline numberOfLines = {12} placeholder='Description' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, textAlignVertical:'top', height : hp('18%')},Platform.OS === 'ios'?{height:hp('18%')}:{}]}/>
          </View>
          <View style={[{marginBottom : hp('3%'), alignItems : 'flex-start'}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
            <Text style={{ color : '#292929', fontSize : (18)}}>Available for hire</Text>
            <Switch
              onValueChange = {() => this.setState({isSwitchOn : !this.state.isSwitchOn})}
              value = {this.state.isSwitchOn}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] , marginLeft : wp('5%'), marginVertical : hp('1.5%')}}
              trackColor = '#292929'
              thumbColor = '#0071bc'
            />
            {/* <Text style={{ color : '#292929', fontSize : 12 }}>Turn on to display an “Invite me” button on your profile, allowing potential host to suggest jobs for you</Text> */}
          </View>
          <TouchableOpacity onPress={this.SubmitPressed} activeOpacity = {0.5} style={[{flexDirection : 'row', backgroundColor : '#8CC63E', alignItems: 'center', justifyContent : 'center', height : hp('7%'), borderRadius : hp('5%'), marginTop : hp('2%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
            <Text style={{ color : '#ffffff', fontSize : 18, marginRight : wp('2%')}}>Submit</Text>
            {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
          </TouchableOpacity>
        </ScrollView>
        <Dialog
          visible={this.state.isDailogOpen}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingBottom : 0, backgroundColor : '#ffffff'}}
        > 
        <View>
          <View style={{alignItems : 'center'}}>
            <View style={{width  :wp('70%')}}>
              <Text style={{color : '#292929', textAlign : 'center', fontSize : 16, marginLeft :wp('6%'), marginBottom : hp('2%')}}>You must verify your email address</Text>
            </View>
          </View>
          <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'center' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('1%')}}>
            <TouchableOpacity onPress = {()=>{this.setState({isDailogOpen : false}), this.props.navigation.navigate('EmailVerification' , {emailAddress : this.state.email, role : 'freelancer', screen : 'ContractorsProfileDetails', userID : this.props.roleIdUserName.currentUserId})}}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
              <Text style={{ color : '#ffffff', fontSize : (18)}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
       </Dialog>
        <Dialog
          visible={this.state.isVerifyDailogOpen}
          onTouchOutside={() => this.setState({isVerifyDailogOpen: false, isCodeSend : false})}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
        > 
        <View style={{height : hp('34%')}}>
          <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
            <Text style={{fontSize: (18) , color : '#ffffff' }}>Verification</Text> 
          </View>
          {
            this.state.isCodeSend && 
              <View>
                {
                  this.state.response === 'Phone Already Verified' && 
                  <View>
                      <Text style={{color : '#292929', textAlign : 'center', marginVertical : hp('2%'), fontSize : 16}}>{this.state.response}</Text>
                    <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'center', marginTop : hp('3%')}}>
                      <TouchableOpacity onPress = {()=>{this.setState({isVerifyDailogOpen : false, isCodeSend : false})}}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                        <Text style={{ color : '#ffffff', fontSize : (18)}}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
                {
                  this.state.response !== 'Phone Already Verified' && 
                  <View>
                    <View style={{height : hp('10%'), marginBottom : hp('2%'), marginHorizontal : wp('3%')}}>
                      <Text style={{ color : '#292929', fontSize : (18)}}>Verification Code</Text>
                        <TextInput value={this.state.code} onChangeText = {(text) => {this.setState({code : text})}} placeholder='Enter Code' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, height : hp('6%')},Platform.OS === 'ios'?{height:hp('6%')}:{}]}/>
                    </View>
                    <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                      <TouchableOpacity onPress={()=> {this.setState({sendProcessing : true}), this.onSend()}}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                        <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Send</Text>
                        {this.state.sendProcessing && <ActivityIndicator size ='small' color="#414141"/>}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.setState({isVerifyDailogOpen : false, isCodeSend : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
                        <Text style={{color : '#ffffff' , fontSize : (18)}}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
              </View>
          }
          {
            !this.state.isCodeSend && 
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator size='large' />
            </View>
          }
        </View>
        </Dialog>
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  states : state.createJob.states,
  roleIdUserName : state.createJob.roleIdUserName,
  profileDetails : state.createJob.profileDetails,
});
export default connect(mapStateToProps, {FalseLoader, GetProfileDetails})(ContractorProfile);
const styles = StyleSheet.create({
  textInputCon : {
    color : 'black',
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#f4f4f4' ,
    paddingLeft : wp('2%'),
    borderWidth : 1 ,
    borderColor : '#DBDBDB' ,
    borderRadius : 2 
 },
 TouchableStyle :{
  height : hp('7%') ,
  width : wp('40%') ,
 // marginBottom : hp('2%'),
  borderRadius : hp('5%') ,
  justifyContent : 'center' ,
  alignItems : 'center'
},
})