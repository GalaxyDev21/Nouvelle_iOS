import React ,{Component , createRef } from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput , InteractionManager, ActivityIndicator ,ScrollView , TouchableOpacity , Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios' ;
import { Icon , Avatar} from 'react-native-elements' ;
import CodeInput from 'react-native-confirmation-code-field';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';

class VerificationForPassword extends Component{
  constructor(props){
    super(props);
    this.state ={
      email : this.props.navigation.getParam('emailAddress', ''),
      processing : false ,
      verifyCode : '' ,
      clearField : false,
      focusFlag : true
    } 
  }
  handlerOnFulfill = async () => {
    this.setState({processing : true, focusFlag : false});
    if(this.state.verifyCode){ 
      var formData = new FormData();
      formData.append('email', this.state.email);
      formData.append('code', this.state.verifyCode);
      try{
        const res = await axios.post(server+'verify_forget_code', formData);
        if(res.data.code === 201) {
          ShowBar('Your code is Wrong' , 'error');
          this.setState({focusFlag : true});
          this.clearCode();
          this.focusInputWithKeyboard();
        }
        else if(res.data.code === 200){
          ShowBar('Your code have verified' , 'success');
          this.props.navigation.navigate('ResetPasswordScreen', {emailAddress : this.state.email, verificationCode : this.state.verifyCode});
          this.clearCode();
        }
      }
      catch(error){
        console.log(error);
      } 
    }
    this.setState({processing : false});
  };  
  field = createRef(); 
  clearCode() {
    const { current } = this.field;
    if (current) {
      current.clear();
    }
  }
  resendCode = async() => {
    var formData = new FormData();
    formData.append('email', this.state.email);
    const res = await axios.post(server+'forget_password', formData);
    if(res.data.code === 200){
      ShowBar('code has resend' , 'success');
    }
    else if(res.data.code === 201){
      ShowBar('please click Resend again!' , 'error');
    }
  }
  focusInputWithKeyboard() {
    InteractionManager.runAfterInteractions(() => {
      this.field.current.focus();
    });
  }
  render(){
    return(
          <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={{height : hp('100%') , width:wp('100%')}}  resizeMode={'stretch'}>
            <View style={styles.iconAndTitle}>
              <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                <Icon name='arrow-back' size={25}  color='#292929'/>
              </TouchableOpacity>
                <View style={{alignItems : 'center' , width : wp('90')}}>
                  <Text style={{ fontSize : (25) ,fontFamily : 'Raleway-SemiBold',  color : '#292929'}}>Verification</Text>
                </View>
            </View>  
            <View style={{flex : 0.6 , marginHorizontal : wp('5%')}}>
              <View style={{justifyContent : 'center' , alignItems : 'center'}}>
                <View style={{height : hp('14%'),width: hp('14%'), alignItems : 'center' , justifyContent : 'center', overflow : 'hidden', marginBottom : hp('2%') , borderRadius : 50 , backgroundColor : 'white'}}>
                  <Image source={require('../../assets/resetPassword_image.jpg')} resizeMode = 'contain' style={{ height : hp('10%') , width : hp('10%')}}/>
                </View>
              </View>
              <Text style={{marginHorizontal : wp('8%'),fontSize:(15), color : '#292929', textAlign : 'center' ,fontFamily : 'Raleway-SemiBold' ,marginBottom : hp('6%')}}>Enter the verification code sent to you via email, then click verify</Text>
              <View style={styles.specificTextInputFlex}>
                <CodeInput ref={this.field} onFulfill={(code)=>this.setState({verifyCode : code})} variant='border-b' space={32} autoFocus={this.state.focusFlag} codeLength={4} activeColor= '#8cc63f' inactiveColor = '#292929' />
              </View>
              <View style={{flexDirection : 'row' , justifyContent : 'center' , alignItems : 'center' ,marginBottom : hp('4%')}}>
                <Text style={{fontSize:(15) , fontFamily : 'Raleway-SemiBold'}}>Didn’t receive a code?</Text>
                <TouchableOpacity onPress = {this.resendCode}>
                  <Text style={{color : '#0071bc' ,fontSize:(15),}}>{`  Resend`}</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex : 0.2 }}>
                <TouchableOpacity style={styles.touchCon} onPress={this.handlerOnFulfill}>
                  <Text style={styles.touchButton}>VERIFY</Text>
                    {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
    )
  }
}

export default VerificationForPassword;

const styles = StyleSheet.create({
  container : {
    flex : 1 ,
  },
  iconAndTitle : {
    flex : 0.1 ,
    flexDirection : 'row' ,
    marginTop : hp('4%') ,
    marginBottom : hp('2%') ,
    marginHorizontal : wp('2%') ,
  },
  specificTextInputFlex : {
    marginBottom : hp('10%') ,
    flex : 0.2 ,
    flexDirection : 'row' ,
    justifyContent : 'space-around'
  },
  verificationTextInput : {
    flex : 0.2 ,
    alignItems : 'center' ,
    borderBottomColor:'#121212',
    borderBottomWidth:1 ,
  },  
  textInputCon : {
    marginLeft : wp('5%'),
    fontSize : (15)  ,
    width : '70%' ,
    color : 'black'    
  },
  imageInTextInput : {
    marginLeft : wp('3%') ,
    height:20,
    resizeMode:'contain',
    maxWidth:20
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
  },
  alreadyAccount: {
    flex : 0.2 ,
    flexDirection : 'row' ,
    justifyContent : "center" ,
    marginTop : -hp('3%')
  },
  inputWrapStyle: {
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderColor : 'green'
  },
});