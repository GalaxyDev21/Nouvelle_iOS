import React ,{Component} from 'react';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import { MoreInfoAboutJob, GetData, FalseLoader, FalseDeleteFlag } from '../../Redux/createJob/jobAction' ;
import { FALSE_GET_MATCHES_CONTRACTORS_OF_HOST_JOB_FLAG, GET_MATCHES_CONTRACTORS_OF_HOST_JOB} from '../../Redux/createJob/actionType';
import { connect } from 'react-redux';
import {server} from '../../Redux/server';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
class CreateJob_Screen6 extends Component{
  constructor(props){
    super(props);
    this.state ={
      information : '' ,
      processing : false
    }
  }
  submitJobDetails = async () => {
    await this.props.FalseDeleteFlag();
    this.props.MoreInfoAboutJob(this.state.information);
    this.createJobService();
  }
  createJobService =async () => {
    this.setState({processing : true});
    var timeInJson =  JSON.stringify(this.props.jobDetails.time);
    var formData = new FormData();
    formData.append('post_title', this.props.jobDetails.property.property_name +'-' +this.props.jobDetails.serviceDetails.service_name);
    formData.append('PropertyID', this.props.jobDetails.property.property_id);
    formData.append('Service', this.props.jobDetails.serviceDetails.service_id);
    formData.append('AreaService', this.props.jobDetails.selectedArea);
    formData.append('JobDate', this.props.jobDetails.date);
    formData.append('Timings', timeInJson);
    formData.append('excerpt',  this.state.information !== '' ? this.state.information : '');
    const res = await axios.post(server+'create_job', formData ,{
      headers : {'Authorization': 'Bearer '+ this.props.userToken},
    });
    if(res.data.code === 200){
      this.props.FalseLoader(FALSE_GET_MATCHES_CONTRACTORS_OF_HOST_JOB_FLAG);
      this.props.navigation.navigate('ContractorsScreen', {serviceID : this.props.jobDetails.serviceDetails.service_id});
      var formData = new FormData();
      formData.append('offset', 0);
      formData.append('limit', 10);
      formData.append('service_id', this.props.jobDetails.serviceDetails.service_id);
      this.props.GetData('job_matches', GET_MATCHES_CONTRACTORS_OF_HOST_JOB, this.props.userToken, formData);
      this.setState({processing : false});
      ShowBar('Job Created Successfully', 'success');
    }
    else{
      ShowBar("Please try Again", 'error');
      this.setState({processing : false});
    }  
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
        <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/>
        <ScrollView>
          <View style={{flex : 0.08 , alignItems : 'center' , marginBottom : hp('4%') }}>
            <Text style={styles.titleStyle}>Additional Note</Text>
          </View>
          <Text style={[styles.addtionalDetails, {marginBottom : hp('2%'), fontSize : (15)}]}>Additional details will help the Pros determine best quote for your project.</Text> 
          <View style={{flex : 0.7, backgroundColor : '#ffffff', padding:wp('5%'), borderRadius : hp('1%'), padding : wp('3%'), margin : wp('4%')}}>
            <View style={{height : hp('20%'), marginBottom : hp('2%')}}>
              <TextInput value={this.state.information} onChangeText = {(text) => {this.setState({information : text, infoNotification : ''})}} multiline numberOfLines = {12} placeholder='Text here...' placeholderTextColor="gray" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : hp('2%'), textAlignVertical:'top', height : hp('20%')},Platform.OS === 'ios'?{height:hp('20%')}:{}]}/>
            </View>
            <View style={{marginBottom : hp('3%')}}>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{color : '#292929', fontSize : (13) , textAlign : 'center'}}>{`By clicking Submit you agree to the `}</Text>
                <TouchableOpacity style={{borderBottomColor : '#0071bc' , borderBottomWidth : 1}} onPress={()=> this.props.navigation.navigate('TermsOfUse')}>
                  <Text style={{ color : '#0071bc', fontSize : (13),  textAlign : 'center'}}>Terms of Use</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{color : '#292929', fontSize : (13)}}>{` and `}</Text>
                <TouchableOpacity style={{borderBottomColor : '#0071bc' , borderBottomWidth : 1}} onPress={()=> this.props.navigation.navigate('PrivacyAndPolicy')}>
                  <Text style={{color : '#0071bc', fontSize : (13),  textAlign : 'center'}}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
              <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
                <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.submitJobDetails}>
                <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{ color : '#ffffff' , fontSize : (20), marginRight : wp('2%')}}>Submit</Text>
                    {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                </View>
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
  jobDetails : state.createJob.jobInformation,
});
export default connect(mapStateToProps,{MoreInfoAboutJob, GetData, FalseLoader, FalseDeleteFlag})(CreateJob_Screen6);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  titleStyle : {
    fontFamily : 'Raleway-SemiBold',
    textAlign : 'center' ,
    color : '#292929' ,
    fontSize : (22) ,
    marginHorizontal : wp('10%'),
  },
  addtionalDetails : {
    fontFamily : 'Raleway-SemiBold',
    textAlign : 'center' ,
    color : '#292929' ,
    marginHorizontal : wp('10%'),
      
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
  textInputCon : {
    color : 'black',
    height : hp('7%') ,
    fontSize: (13),
    backgroundColor : '#f4f4f4' ,
    marginBottom : hp('3%') ,
    paddingLeft : wp('3%')  
  },
});