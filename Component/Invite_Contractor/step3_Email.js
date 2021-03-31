import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, ImageBackground, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ProgressBar from './progressbar' ;
import EmailValidation from '../validations/emailValidation';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import { connect } from 'react-redux';
import {server} from '../../Redux/server';

class Step3_Email extends Component{
  constructor(props){
    super(props);
    this.state = {
      name : '',
      email : '',
      emailErr : '',
      message : 'Hi! I use the Nouvelle app to schedule cleanings and other services for my property. Please accept my invitation to join for free by clicking the Sign Up button below',
      jobIDs : this.props.navigation.getParam('jobIds', ''),
      processing : false
    }
  }
  onSend = async() => {
    if(this.state.email){
      this.setState({processing : true});
      var jobIDsInJson =  JSON.stringify(this.state.jobIDs);
      var formData = new FormData();
      formData.append('channel', 'email');
      formData.append('email', this.state.email);
      formData.append('message', this.state.message);
      formData.append('ids_json', jobIDsInJson);
      const res = await axios.post(server+'invite_contractor_for_job', formData, {
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code === 200){
        this.props.navigation.navigate('HostDashBoard');
        ShowBar(res.data.data, 'success');
      }
      else{
        this.setState({processing : false});
        ShowBar('something wrong', 'error');
      }
    }
    else{
      ShowBar('Please enter email', 'error');
    } 
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/invite_contractor_bg.jpg')} style={styles.container}>
        <StatusBar title='INVITE CONTRACTORS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
        <ProgressBar stepOneColor='#8CC63E' stepTwoColor='#8CC63E' stepThreeColor='#8CC63E'/>
        <ScrollView>
          <View style={{padding : wp('4%'), backgroundColor: 'rgba(244, 244, 244, 0.5)'}}>
            <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (22), marginBottom : hp('3%')}}>Send Invite</Text>
            <View style={{marginBottom : hp('3%')}}>
              <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Name</Text>
              <TextInput placeholder='Name' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({name : text})} value={this.state.name}/>
            </View>
            <View style={{marginBottom : hp('3%'), height : hp('10%')}}>
              <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Email</Text>
              <TextInput placeholder='Email' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({email : text , emailErr : EmailValidation(text)})} value={this.state.email}/>
              <Text style={{color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12)}}>{this.state.emailErr}</Text>
            </View>
            <View style={{marginBottom : hp('3%')}}>
              <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Message</Text>
              <TextInput  multiline numberOfLines = {12} style={[styles.messageCont , Platform.OS === 'ios'?{height:hp('20%')}:{}]} onChangeText={(text)=>this.setState({message : text})} value={this.state.message}/>
            </View>
            <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
              <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={() => this.props.navigation.goBack()}>
                <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]} onPress={this.onSend}>
                <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20), marginRight : wp('2%')}}>Send</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    )
  } 
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  roleIdUserName : state.createJob.roleIdUserName,
});
export default connect(mapStateToProps)(Step3_Email);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center',
  },
  textInputCon : {
    color : 'black',
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#ffffff' ,
    paddingLeft : wp('2%'),
    borderRadius : 2 
  },
  messageCont : {
    color : 'black',
    height : hp('20%') ,
    fontSize: (14),
    backgroundColor : '#ffffff' ,
    paddingLeft : wp('3%'),
    paddingTop : wp('3%'),
    borderRadius : 2,
    textAlignVertical:'top',
  },
});