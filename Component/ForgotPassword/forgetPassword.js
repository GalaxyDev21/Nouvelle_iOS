import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput , ActivityIndicator ,ScrollView , TouchableOpacity , Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios' ;
import { Icon , Avatar} from 'react-native-elements' ;
//import EmailValidation from '../validations/emailValidation' ;
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server'

class ForgotPassword extends Component{
  constructor(props){
    super(props);
    this.state ={
      email : '' ,
      emailErr : '' ,
      processing : false ,
    } 
  } 
  sendEmail = async () => {
    this.setState({
        processing : true
      });
    if(this.state.email && !this.state.emailErr){ 
        var formData = new FormData();
          formData.append('email', this.state.email);  
          try{
            const res = await axios.post(server+'forget_password', formData);
            if(res.data.code === 201) {
                ShowBar('The email is not a registered email' , 'error');
            }
            else if(res.data.code === 200){
              this.props.navigation.navigate('VerificationForPasswordScreen', {emailAddress : this.state.email});
              ShowBar('You email address have verified' , 'success');
            }
          }
          catch(error){
            console.log(error);
          } 
          this.setState({processing : false});
    }
    else{
      this.setState({
        emailErr : 'please enter valid email'
      });
    } 
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={{flex : 1}}  resizeMode={'stretch'}>
        <View style={styles.iconAndTitle}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Icon name='arrow-back' size={25}  color='#292929'/>
          </TouchableOpacity>
          <View style={{alignItems : 'center' , width : wp('90')}}>
              <Text style={{ fontSize : (25) ,fontFamily : 'Raleway-SemiBold',  color : '#292929'}}>Forgot Password</Text>
          </View>
        </View>  
        <View style={{flex : 0.6 , marginHorizontal : wp('5%') ,}}>
          <View style={{justifyContent : 'center' , alignItems : 'center'}}>
            <View style={{height : hp('14%'),width: hp('14%'), alignItems : 'center' , justifyContent : 'center', overflow : 'hidden', marginBottom : hp('2%') , borderRadius : 50 , backgroundColor : 'white'}}>
                <Image source={require('../../assets/forgot_password_image.jpg')} resizeMode = 'contain' style={{ height : hp('10%') , width : hp('10%')}}/>
            </View>
          </View>
          <Text style={{marginHorizontal : wp('5%'),fontSize:(15), textAlign : 'center' ,fontFamily : 'Raleway-SemiBold' ,marginBottom : hp('6%')}}>Please enter the email address associated with your account. We will send you a code to reset your password</Text>
          <View style={styles.specificTextInputFlex}> 
            <TextInput  placeholder='Enter your Email Address' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=>this.setState({email : text , emailErr : ''})} onFocus={() => this.setState({processing : false})} value={this.state.email}/>
          </View>
          <View style={{marginBottom : hp('5%')}}><Text style={{color : 'red'}}>{this.state.emailErr}</Text></View>
          <View style={{flex : 0.2 }}>
              <TouchableOpacity style={styles.touchCon} onPress={this.sendEmail}>
                  <Text style={styles.touchButton}>SEND</Text>
                  {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }
}
export default ForgotPassword;

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
    height : hp('6%') ,
    borderBottomColor : '#121212',
    borderBottomWidth : 0.5 ,
  },
  textInputCon : {
    height : hp('6%') ,
    fontSize : (15)  ,
    width : '80%' ,
    color : 'black'    
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
      fontSize : (15) ,
      color : '#ffffff' ,
  }
});