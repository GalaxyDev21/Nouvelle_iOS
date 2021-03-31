import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, CameraRoll, ImageBackground,  TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import EmailValidation from '../validations/emailValidation' ;
import nameValidation from '../validations/nameValidation';
import CustomStatusBar from '../InputFields/statusBar';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import DropDown from './dropDown';
import {server} from '../../Redux/server';
import { FalseLoader, GetProfileDetails } from '../../Redux/createJob/jobAction';
import { FALSE_PROFILE_DETAILS_FLAG } from '../../Redux/createJob/actionType';

class HostProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploadImage : false,
      firstName : '',
      firstNameErr : '',
      lastName : '',
      email : '',
      states : '',
      selectedState : '',
      slectedStateID : '',
      emailErr : '',
      zipCode : '',
      zipCodeErr : '',
      phoneNum : '',
      phoneNumErr : '',
      isDailogOpen : false,
      summary : '',
      isVerifyDailogOpen : false,
      code : '',
      isCodeSend : false,
      sendProcessing : false,
      blob : {},
      prevState : {first_name : ''}
    }
  }
  componentDidMount() {
    this.getPermissionAsync();
  }
  static getDerivedStateFromProps(props, state){
    if(state.prevState.first_name !== props.profileDetails.first_name){
      const text = Object.keys(props.profileDetails).length === 0 ? '' : props.profileDetails.description.replace(/(<([^>]+)>)/g, "");
      state.firstName = props.profileDetails.first_name;
      state.lastName = props.profileDetails.last_name;
      state.email = props.profileDetails.email;
      state.zipCode = props.profileDetails.et_zipcode;
      state.selectedState = props.profileDetails.state ? props.profileDetails.state.name : '';
      state.slectedStateID = props.profileDetails.state ? props.profileDetails.state.term_id : '';
      state.image= props.profileDetails.profile_image !== '' ? props.profileDetails.profile_image : null;
      state.phoneNum = props.profileDetails.phone;
      state.summary = text;
      state.prevState.first_name = props.profileDetails.first_name;
    }
    return state;
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
      base64 : true
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
      uploadImage : false
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
      formData.append('description', this.state.summary);
      this.state.uploadImage && formData.append('image', this.state.blob);
      console.log(formData);
      const res = await axios.post(server+'update_profile_details', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code === 200){
        ShowBar('Your profile has Updated successfully' , 'success');
        if(res.data.data.email_updated){
          this.setState({isDailogOpen : true});
        }
        else{
          this.props.navigation.navigate('HostDashBoard');
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
        this.setState({isCodeSend : true});
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
  // const file = {
  //   uri : this.state.image,
  //   name : 'contractor_profile',
  //   type : 'image/jpg',
  // }
  render() {
    return(
      <ImageBackground source={require('../../assets/contractor_profle_bg.jpg')} style={{flex: 1, resizeMode : 'stretch'}}>
        <CustomStatusBar title='PROFILE' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('4%')}/>
        {this.props.isProfileDetailsLoaded && 
          <ScrollView>
            <View style={{padding : hp('3%')}}>
              <View style={{marginBottom : hp('3%'), height : hp('9%')}}>
                <Text style={{ color : '#292929', fontSize : 18}}>First Name</Text>
                <TextInput placeholder='First Name' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({firstName : text, firstNameErr : nameValidation(text)})} value={this.state.firstName}/>
                <Text style={{color : 'red', fontSize : 12}}>{this.state.firstNameErr}</Text>
              </View>
              <View style={{marginBottom : hp('3%')}}>
                <Text style={{ color : '#292929', fontSize : 18}}>Last Name</Text>
                <TextInput placeholder='Last Name' selectTextOnFocus={true} placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({lastName : text})} value={this.state.lastName}/>
              </View>
              <View style={{marginBottom : hp('3%')}}>
                <Text style={{ color : '#292929', fontSize : 18}}>Profile Picture</Text>
                {!this.state.image && 
                  <View style={{justifyContent : 'center', alignItems : 'center', height : hp('30%'), borderWidth : 1, borderColor : '#DBDBDB', backgroundColor : '#f4f4f4'}}>
                    <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',height : hp('7%'), width : wp('7%')}} onPress={this.pickImage}>
                      <Image source={require('../../assets/image_upload_icon.png')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
                    </TouchableOpacity>
                  </View>
                } 
                {this.state.image && 
                  <TouchableOpacity onPress={this.pickImage} style={{ position : 'relative', height : hp('30%'), borderWidth : 1, borderColor : '#DBDBDB',}}> 
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
              {this.props.profileDetails.email_pending && <Text style={{color : '#292929', fontSize : (12), marginBottom : hp('2%')}}>There is a pending change of the email to: <Text style={{color : 'red', fontSize : 12}}>{this.props.profileDetails.new_email_pending}</Text></Text>}
              <View style={{marginBottom : hp('4%'), height : hp('9%')}}>
                <Text style={{ color : '#292929', fontSize : 18}}>Zip Code</Text>
                <TextInput keyboardType='number-pad' placeholder="ZIP code" placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({zipCode : text, zipCodeErr : ZipCodeValidation(text)})} value={this.state.zipCode}/>
                <Text style={{ color : 'red', fontSize : 12}}>{this.state.zipCodeErr}</Text>
              </View>
              <View style={{height : hp('10%'), marginBottom : hp('3%')}}>
                <Text style={{ color : '#292929', fontSize : 18}}>State</Text>      
                <DropDown
                  listShow = {this.props.states}
                  placeholder = {this.state.selectedState ? this.state.selectedState : 'select state'}
                  selectedValue = {this.selectState}
                  name = 'name'
                  id = 'term_id'
                  isObject = {true}
                />
                <Text style={[{ color : 'red', fontSize : 12}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>{this.state.countryNotification}</Text>
              </View>
              <View style={[{marginBottom : hp('3%'), height : hp('12%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <Text style={{ color : '#292929', fontSize : 18}}>Phone Number</Text>
                <TextInput placeholder='Phone Number' keyboardType='phone-pad' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({phoneNum: text, phoneNumErr : this.phoneValidation(text)})} value={this.state.phoneNum}/>
                  {this.props.profileDetails.phone_verify_status !== '1' &&
                    <TouchableOpacity onPress={()=>{this.setState({isVerifyDailogOpen : true}), this.onVerifyNumber()}}>
                      <Text style={[{fontSize : 13, color : '#8CC63E'}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>Verify Phone</Text>
                    </TouchableOpacity>
                  }
                  <Text style={[{color : 'red', fontSize : 12,}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>{this.state.phoneNumErr}</Text>
              </View>
              <View style={[{height : hp('18%'), marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <Text style={{ color : '#292929', fontSize : (18)}}>Description</Text>
                <TextInput value={this.state.summary} onChangeText = {(text) => {this.setState({summary : text})}} multiline numberOfLines = {12} placeholder='Description' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, textAlignVertical:'top', height : hp('18%')},Platform.OS === 'ios'?{height:hp('18%')}:{}]}/>
              </View>
              <TouchableOpacity onPress={this.SubmitPressed} activeOpacity = {0.5} style={[{ backgroundColor : '#8CC63E', flexDirection : 'row', alignItems: 'center', justifyContent : 'center', height : hp('7%'), borderRadius : hp('5%'), marginTop : hp('2%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <Text style={{ color : '#ffffff', fontSize : 18, marginRight : wp('2%')}}>Submit</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        }
        {!this.props.isProfileDetailsLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator
              size='large'
            />
          </View>
        }
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
              <TouchableOpacity onPress = {()=>{this.setState({isDailogOpen : false}), this.props.navigation.navigate('EmailVerification' , {emailAddress : this.state.email, role : 'employer', screen : 'HostDashBoard', userID : this.props.roleIdUserName.currentUserId})}}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                <Text style={{ color : '#ffffff', fontSize : (18)}}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>
        <Dialog
          visible={this.state.isVerifyDailogOpen}
          onTouchOutside={() => this.setState({isVerifyDailogOpen: false})}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
        > 
          <View style={{height : hp('34%')}}>
            <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
              <Text style={{fontSize: (18) , color : '#ffffff' }}>Verification</Text> 
            </View>
            {this.state.isCodeSend && 
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
                  <TouchableOpacity onPress={() => this.setState({isVerifyDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
                    <Text style={{color : '#ffffff' , fontSize : (18)}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            {!this.state.isCodeSend && 
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
  roleIdUserName : state.createJob.roleIdUserName,
  states : state.createJob.states,
  isProfileDetailsLoaded : state.createJob.isProfileDetailsLoaded ,
  profileDetails : state.createJob.profileDetails,
});
export default connect(mapStateToProps, {FalseLoader, GetProfileDetails})(HostProfile);
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
 eachField : {
  marginBottom : hp('3%'),
  height : hp('10%'),
  position : 'relative'
},
touchForDropDown : {
    alignItems : 'flex-start', 
    justifyContent : 'center',  
    padding : wp('1.2%'),
    position : 'relative', 
    borderColor :'#f4f4f4', 
    borderRadius : 2
},
TouchableStyle :{
  height : hp('7%') ,
  width : wp('40%') ,
  borderRadius : hp('5%') ,
  justifyContent : 'center' ,
  alignItems : 'center'
},
});


  // setTimeout(() => {
  //   this.getValue();
  // }, 2500);
  // getValue = () => {
  //   // console.log('************ this.props.profileDetails **********');
  //   // console.log(this.props.profileDetails);
  //   // console.log('*************************');
  //   var text = Object.keys(this.props.profileDetails).length === 0 ? '' : this.props.profileDetails.description.replace(/(<([^>]+)>)/g, "");
  //   this.setState({
  //     firstName: this.props.profileDetails.first_name,
  //     lastName: this.props.profileDetails.last_name,
  //     email: this.props.profileDetails.email,
  //     zipCode: this.props.profileDetails.et_zipcode,
  //     selectedState : this.props.profileDetails.state ? this.props.profileDetails.state.name : '',
  //     slectedStateID : this.props.profileDetails.state ? this.props.profileDetails.state.term_id : '',
  //     image: this.props.profileDetails.profile_image !== '' ? this.props.profileDetails.profile_image : null,
  //     phoneNum : this.props.profileDetails.phone,
  //     summary : text
  //   });
  // }