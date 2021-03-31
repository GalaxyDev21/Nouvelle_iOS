import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , TextInput , KeyboardAvoidingView, ActivityIndicator ,ScrollView , TouchableOpacity , Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios' ;
import passwordValidation from '../validations/passwordValidation' ;
import ShowBar from '../validations/messageBar' ;
import StatusBar from '../InputFields/statusBar';
import { connect } from 'react-redux';
import {server} from '../../Redux/server';

class ResetPasswordInContractorProfile extends Component{
  constructor(props){
    super(props);
      this.state ={
        currentPassword : '' ,
        currentPasswordErr : '' ,
        newPassword : '',
        newPasswordErr : '',
        cnfmPassword : '' ,
        cnfmPasswordErr : '' ,
        processing : false ,
      } 
  }

  ResetPassword = async () => {
    this.setState({
      processing : true
    });
    if(this.state.newPassword !== this.state.cnfmPassword){
      this.setState({cnfmPasswordErr : 'Password does not match', processing : false})
    }
    else if(this.state.newPassword && this.state.cnfmPassword){
      var formData = new FormData();
      formData.append('current_password', this.state.currentPassword);
      formData.append('new_password', this.state.newPassword);
      formData.append('confirm_password', this.state.cnfmPassword);
      try{
        const res = await axios.post(server+'reset_password', formData ,{
            headers : {'Authorization': 'Bearer '+ this.props.userToken,},
        }); 
        if(res.data.code === 201) {
          ShowBar('current password is not correct' , 'error');
        }
        else if(res.data.code === 200){
          this.props.navigation.navigate('ContractorDashBoard');
          ShowBar('Your password has changed Successfully' , 'success');
        }
      }
      catch(error){
        console.log(error);
      }  
    }
    this.setState({
      processing : false
    });
  };
  render(){
    return(
      <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={{flex : 1}}  resizeMode={'stretch'}>
        <StatusBar title='ACCOUNT SETTINGS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={5}>
        <ScrollView>
          <View style={{alignItems : 'center' , marginTop : hp('10%'), marginBottom : hp('4%')}}>
            <Text style={{ fontSize : 22,  color : '#292929'}}>UPDATE PASSWORD</Text>
          </View>  
          <View style={{flex : 0.6 , marginHorizontal : wp('5%')}}>
            <View style={styles.specificTextInputFlex}>
              <View style={styles.iconAndText}> 
                <TextInput placeholder='Enter Current Passsword' placeholderTextColor='#292929' secureTextEntry={true} style={styles.textInputCon} onChangeText={(text)=>this.setState({currentPassword : text, currentPasswordErr : ''})} value={this.state.currentPassword}/>
              </View>
            </View>
            <View style={{ marginBottom : hp('1%') ,}}><Text style={{color : 'red'}}>{this.state.currentPasswordErr}</Text></View>
            <View style={styles.specificTextInputFlex}>
              <View style={styles.iconAndText}> 
                <TextInput  placeholder='Enter New Passsword' placeholderTextColor='#292929' secureTextEntry={true} style={styles.textInputCon} onChangeText={(text)=>this.setState({newPassword : text,  newPasswordErr : passwordValidation(text)})} onFocus={() => this.setState({newPasswordErr : ''})} value={this.state.newPassword}/>
              </View>
            </View>
            <View style={{ marginBottom : hp('1%') ,}}><Text style={{color : 'red'}}>{this.state.newPasswordErr}</Text></View>
            <View style={styles.specificTextInputFlex}>
              <View style={styles.iconAndText}> 
                <TextInput  placeholder='Enter Confirm Passsword' placeholderTextColor='#292929' secureTextEntry={true} style={styles.textInputCon} onChangeText={(text)=>this.setState({cnfmPassword : text,  cnfmPasswordErr : passwordValidation(text)})} onFocus={() => this.setState({cnfmPasswordErr : ''})} value={this.state.cnfmPassword}/>
              </View>
            </View>
            <View style={{ marginBottom : hp('1%') ,}}><Text style={{color : 'red'}}>{this.state.cnfmPasswordErr}</Text></View>
            <View style={{flex : 0.2 }}>
              <TouchableOpacity style={styles.touchCon} onPress={this.ResetPassword} >
                <Text style={styles.touchButton}>Update Password</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
          </KeyboardAvoidingView>
      </ImageBackground> 
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
});
export default connect(mapStateToProps)(ResetPasswordInContractorProfile);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
  },
  iconAndTitle : {
    flex : 0.1 ,
    flexDirection : 'row' ,
    marginTop : hp('5%') ,
    marginBottom : hp('2%') ,
    marginHorizontal : wp('2%') ,
  },
  textInputCon : {
    marginLeft : wp('2%'),
    paddingTop : hp('1.5%'),
    fontSize : 13  ,
    width : '70%' ,
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
    fontFamily : 'Raleway-SemiBold' , 
    fontSize : (18) ,
    color : '#ffffff' ,
  },
  specificTextInputFlex : {
    height : hp('7%') ,
    backgroundColor : '#ffffff',
    borderWidth : 1 ,
    borderColor : '#f4f4f4'
  },      
  iconAndText : {
    alignItems : 'flex-start',
    justifyContent : 'center' ,
  }, 
})