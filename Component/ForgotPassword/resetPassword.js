import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput , ActivityIndicator ,ScrollView , TouchableOpacity , Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios' ;
import { Icon , Avatar} from 'react-native-elements' ;
import passwordValidation from '../validations/passwordValidation' ;
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server'

class ResetPassword extends Component{
  constructor(props){
    super(props);
    this.state ={
      email : this.props.navigation.getParam('emailAddress', ''),
      code : this.props.navigation.getParam('verificationCode', ''),
      password : '' ,
      passwordErr : '' ,
      cnfmPassword : '' ,
      cnfmPasswordErr : '' ,
      processing : false ,
    } 
  }
  ResetPassword = async () => {
    this.setState({processing : true});
    if(this.state.password !== this.state.cnfmPassword){
      this.setState({cnfmPasswordErr : 'Password does not match', processing : false})
    }
    else if(this.state.password && this.state.cnfmPassword){
      var formData = new FormData();
      formData.append('email', this.state.email);
      formData.append('code', this.state.code);
      formData.append('password', this.state.password);
      formData.append('confirm_password', this.state.cnfmPassword);
      try{
        const res = await axios.post(server+'update_forget_password', formData);
        if(res.data.code === 201) {
          ShowBar('Your data is Wrong' , 'error');
        }
        else if(res.data.code === 200){
          if(res.data.data.roles === 'freelancer' && !res.data.data.co_host){
            this.props.navigation.navigate('ContractorLogin');
          }
          else if(res.data.data.roles === 'employer' || res.data.data.co_host){
            this.props.navigation.navigate('HostLogin');
          }
          ShowBar('Your pssword has been reset' , 'success');
        }
      }
      catch(error){
        console.log(error);
      }  
    }
    this.setState({processing : false});
  };
  render(){
    return(
      <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={{flex : 1}}  resizeMode={'stretch'}>
        <ScrollView>
        <View style={styles.iconAndTitle}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()} >
            <Icon name='arrow-back' size={25}  color='#292929'/>
          </TouchableOpacity>
          <View style={{alignItems : 'center' , width : wp('90')}}>
            <Text style={{ fontSize : (25) , color : '#292929'}}>Reset your Password</Text>
          </View>
        </View>           
        <View style={{flex : 0.6 , marginHorizontal : wp('5%')}}>
          <View style={{justifyContent : 'center' , alignItems : 'center'}}>
            <View style={{height : hp('14%'),width: hp('14%'), alignItems : 'center' , justifyContent : 'center', overflow : 'hidden', marginBottom : hp('3%') , borderRadius : 50 , backgroundColor : 'white'}}>
              <Image source={require('../../assets/forgot_password_image.jpg')} resizeMode = 'contain' style={{ height : hp('9%') , width : hp('10%')}}/>
            </View>
          </View>
          <Text style={{marginHorizontal : wp('8%'), fontSize:(15),textAlign : 'center' ,fontFamily : 'Raleway-SemiBold' ,marginBottom : hp('6%')}}>Please enter enter your password</Text>
          <View style={styles.specificTextInputFlex}>
            <TextInput  placeholder='Enter New Passsword' placeholderTextColor='#292929' secureTextEntry={true} style={styles.textInputCon} onChangeText={(text)=> this.setState({password : text, passwordErr : passwordValidation(text)}) } onFocus={() => this.setState({passwordErr : ''})} value={this.state.password}/>
          </View>
          <View style={{marginBottom : hp('2%')}}><Text style={{color : 'red'}}>{this.state.passwordErr}</Text></View>
          <View style={styles.specificTextInputFlex}> 
            <TextInput  placeholder='Confirm New Password' placeholderTextColor='#292929' secureTextEntry={true} style={styles.textInputCon} onChangeText={(text)=>this.setState({cnfmPassword : text})} onFocus={() => this.setState({cnfmPasswordErr : ''})} value={this.state.cnfmPassword}/>
          </View>
        </View>
        <View style={{marginBottom : hp('2%')}}><Text style={{color : 'red'}}>{this.state.cnfmPasswordErr}</Text></View>
        <View style={{flex : 0.2 }}>
          <TouchableOpacity style={styles.touchCon} onPress={this.ResetPassword} >
            <Text style={styles.touchButton}>RESET PASSWORD</Text>
            {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ImageBackground>
    )
  }
}
export default ResetPassword;

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
    fontSize : 15  ,
    width : '100%' ,
    color : 'black'    
  },
  imageInTextInput : {
    marginLeft : wp('3%') ,
    height:20,
    resizeMode:'contain',
    maxWidth:20
  },
  touchCon : {
    height: hp('7%'),
    flexDirection : 'row',
    backgroundColor : '#8cc63f',
    borderRadius : 25,
    alignItems : 'center',
    justifyContent : 'center',
    marginBottom : hp('2%'),
  },
  touchButton : {
    fontFamily : 'Raleway-SemiBold', 
    fontSize : (15),
    color : '#ffffff',
  }
});