import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput , KeyboardAvoidingView, ActivityIndicator ,ScrollView , TouchableOpacity , Image, Animated} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements' ;
import axios from 'axios' ;
import ShowBar from '../../validations/messageBar' ;
import {server} from '../../../Redux/server'

class EmailVerification extends Component{
  constructor(props){
    super(props);
    this.state ={
      email : this.props.navigation.getParam('emailAddress', ''),
      role : this.props.navigation.getParam('role', ''),
      userID : this.props.navigation.getParam('userID', ''),
      code : '',
      codeErr : '',
      processing : false,
    } 
  }
  loginAccount = () => {
    this.setState({processing : true});
    this.apiCall();
  }
  apiCall = async () => {
    if(this.state.code && !this.state.codeErr){ 
      var formData = new FormData();
      formData.append('id', this.state.userID);
      formData.append('email', this.state.email);
      formData.append('code', this.state.code);
      try{
        const res = await axios.post(server+'verify_email', formData);
        if(res.data.code === 201) {
          ShowBar('You verification code is invalid' , 'error');
          this.stopProcessing();
        }
        else if(res.data.code === 200){
          if(this.state.role === 'employer'){
            this.props.navigation.navigate(this.props.navigation.getParam('screen', ''));
          }
          else{
            this.props.navigation.navigate(this.props.navigation.getParam('screen', ''));
          }
          ShowBar('Your email address have verified' , 'success');
        }
      }
      catch(error){
        ShowBar('Sorry, Unable to verified email' , 'error');
        this.stopProcessing();
      } 
    } 
    else{
      this.setState({
        codeErr : 'please enter valid code',
        processing : false
      })
    }          
  }
  stopProcessing = () => {
    this.setState({processing : false});
  }
  resendCode = async() => {
    var formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('id', this.state.userID);
    formData.append('name', 'Hello');
    const res = await axios.post(server+'resend_code', formData);
    if(res.data.code === 200){
      ShowBar('The code has been resend' , 'success');
    }
    else if(res.data.code === 201){
      ShowBar('please click Resend again!' , 'error');
    }
  }
  render(){
    return(
      <ImageBackground source={require('../../../assets/Nouvelle_bg.jpg')} style={{flex : 1}}  resizeMode={'stretch'}>
        <ScrollView>
        <TouchableOpacity style={{alignItems : 'flex-start', marginTop : hp('4%'), marginHorizontal : wp('4%')}} onPress={()=>this.props.navigation.goBack()}>
          <Icon name='arrow-back' size={25}  color='#292929'/>
        </TouchableOpacity>
        <View style={styles.textEntrycontainer}>
          <View style={{flex : 0.2 , alignItems : 'center' , justifyContent : 'center' , marginBottom : hp('2%')}}>
            <Image source={require('../../../assets/Nouvelle_Transparent_Logo.png')} style={styles.nouvelleImage}/>
          </View>
          <Text style={{flex : 0.1 , fontSize : (18) ,fontFamily : 'Raleway-SemiBold'  , textAlign : 'center' ,  color : '#292929', marginBottom :hp('2%')}}>Verify your email</Text>
          <View style={styles.specificTextInputFlex}>
            <TextInput  placeholder='code' placeholderTextColor='#292929' style={styles.textInputCon} onChangeText={(text)=> this.setState({code : text})} onFocus={() => this.setState({processing : false, codeErr : ''})}/> 
          </View>
          <View style={{ marginBottom : hp('2%')}}><Text style={{color : 'red'}}>{this.state.codeErr}</Text></View>    
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginBottom : hp('4%')}}>
            <Text style={{fontSize:(15) , fontFamily : 'Raleway-SemiBold'}}>Didn’t receive a code?</Text>
            <TouchableOpacity onPress = {this.resendCode}>
              <Text style={{color : '#0071bc' ,fontSize:(15),}}>{`  Resend`}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.touchCon} onPress={this.loginAccount}>
            <Text style={styles.touchButton}>Verify</Text>
              {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ImageBackground>
    )
  }
}

export default EmailVerification;
// const mapStateToProps = state => ({
//     token_access : state.token.token_access ,
//   });
  
//   const dispatchStateToProps = dispatch => ({
//         changeStateToTokenAccess : () => dispatch(StoreTokenAccess()) ,
//   });
  
//   export default connect(
//    mapStateToProps,
//    dispatchStateToProps
//   )(LoginForm);

const styles = StyleSheet.create({
  container : {
    flex : 1 ,
  },
  textEntrycontainer : {
    flex : 0.8,
    marginTop : hp('4%'),
    marginHorizontal : wp('6%'),
  },
  nouvelleImage : {
    height : hp('8%'),
    width : wp('45%'),
    resizeMode:'contain',    
  } ,
  specificTextInputFlex : {
    marginBottom : hp('6%'),
    height : hp('6%'),
    borderBottomColor:'#121212',
    borderBottomWidth:0.5,
  },
  textInputCon : {
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
  },
  touchButton : {
    fontFamily : 'Raleway-SemiBold' , 
    fontSize : (15) ,
    color : '#ffffff' ,
  },
});