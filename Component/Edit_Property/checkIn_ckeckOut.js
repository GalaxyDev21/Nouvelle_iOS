import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ShowBar from '../validations/messageBar';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import DateTimePicker from "react-native-modal-datetime-picker";
import {server} from '../../Redux/server';
import axios from 'axios';

class CheckIn_CheckOut extends Component{
  constructor(props){
    super(props);
    this.state ={
      checkInTime : this.props.specificPropertyDetail.check_in_time === undefined ? '' : this.props.specificPropertyDetail.check_in_time,
      checkOutTime : this.props.specificPropertyDetail.check_out_time === undefined ? '' : this.props.specificPropertyDetail.check_out_time,
      checkInTimeNotification : '',
      checkOutTimeNotification : '',
      radioSelectedValue : this.props.specificPropertyDetail.allow_service_provider !== undefined ? this.props.specificPropertyDetail.allow_service_provider === 'allow_both' ? 0 : this.props.specificPropertyDetail.allow_service_provider === 'all_contractors_only' ? 1 : 2 : '',
      radioSelected : this.props.specificPropertyDetail.scheduled_after_check_out !== undefined ? this.props.specificPropertyDetail.scheduled_after_check_out === '1' ? 0 : 1 : '',
      timeFlag : '',
      scheduleFlag : '',
      processing : false
    }
  }
  checkIn_checkOut_action = async() => {
    if(this.state.checkInTime !== '' &&  this.state.checkOutTime !== ''){
      if(this.state.radioSelectedValue === '' &&  this.state.radioSelected === '') {ShowBar('Please select contractor settings and schedule cleaning service' , 'error'); return ;}
      this.setState({processing : true});
      var formData = new FormData();
      formData.append('ID', this.props.propertyId);
      formData.append('check_in_time', this.state.checkInTime);
      formData.append('check_out_time', this.state.checkOutTime);
      formData.append('allow_service_provider', this.state.timeFlag);
      formData.append('scheduled_after_check_out', this.state.scheduleFlag);
      console.log(formData);
      const res = await axios.post(server+'check_property', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code == 200){
        ShowBar('Edit Successfully' , 'success');
        this.props.navigation.goBack();
      }
      else{
        ShowBar('Sorry, Unable to edit check-in and check-out time' , 'error');
        this.setState({processing : false});
      }
    }
    else{
      ShowBar('Please add check-in and check-out time' , 'error');
    } 
  }
  chooseContractorSetting = (value , data) => {
    this.setState({radioSelectedValue : value, timeFlag : data})
  }
  chooseScheduleCleaning = (value , data) => {
    this.setState({radioSelected : value, scheduleFlag : data})
  }
  set_CheckIn_Time = (time) => {
  this.setState({checkInTime : time});
  }
  set_CheckOut_Time = (time) => {
  this.setState({checkOutTime : time});
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/add_property_bg.jpg')} style={styles.container}>
        <KeyboardAvoidingView style={{flex : 1}} behavior="padding" enabled keyboardVerticalOffset={5}>
          <ScrollView>
            <View style={{flex : 0.85,  backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), margin : wp('4%')}}>
              <View style={styles.eachField}>
                <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Check-in-Time</Text>
                <TimePicker time = {this.state.checkInTime} setTime = {this.set_CheckIn_Time}/>
              </View>
              <View style={styles.eachField}>
                <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Check-Out-Time</Text>
                <TimePicker time = {this.state.checkOutTime} setTime = {this.set_CheckOut_Time}/>
              </View>
              <RadioButtonsForContractorSetting chooseContractorSetting = {this.chooseContractorSetting} radioSelectedValue={this.state.radioSelectedValue}/>
              <RadioButtonsForScheduleCleaning radioChange = {this.chooseScheduleCleaning} radioSelected = {this.state.radioSelected}/>
              <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.checkIn_checkOut_action}>
                <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{ color : '#ffffff' , fontSize : 16, marginRight : wp('2%')}}>Save check-in/check-out Settings</Text>
                    {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>   
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  specificPropertyDetail : state.createJob.specificPropertyDetail,
});
export default connect(mapStateToProps)(CheckIn_CheckOut);
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
    marginHorizontal : wp('8%'),
  },
  eachField : {
    marginBottom : hp('3%'),
    height : hp('10%')
  },
  TouchableStyle :{
    height : hp('7%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
  textInputCon : {
    justifyContent : 'center',
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#f4f4f4' ,
    paddingLeft : wp('2%'),
    borderRadius : 2 
  },
  TextInputField : {
    height : hp('7%') ,
    alignItems : 'flex-start' ,
    justifyContent : 'center' ,
    marginBottom : hp('3%') ,
    backgroundColor : '#f4f4f4'
  },
  innerViewInRadioButton  : {
    height:wp('6%'),
    width:wp('6%'),
    backgroundColor:'rgba(0,0,0,0)',
    borderRadius: 100,
    borderWidth:2.,
    borderColor:'#0071bc',
    justifyContent:'center',
    alignItems:'center'
  }
});

class RadioButtonsForContractorSetting extends Component {
  render() {
    return (
      <View style={{marginBottom : hp('2%')}}>
        <Text style={{fontSize : (20), fontFamily : 'Raleway-SemiBold', color: '#292929' , marginBottom : hp('2%')}}>Contractor Settings</Text>
        <TouchableOpacity onPress ={()=>{this.props.chooseContractorSetting(0 , 'allow_both')}}  style={{flexDirection : 'row' , alignItems : 'center' , marginBottom : hp('1%')}}>
          <View style={styles.innerViewInRadioButton}>
            {
              this.props.radioSelectedValue === 0 &&
                <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
            }
          </View>
            <Text style={{color : '#292929' , flexWrap : 'wrap', width : wp('77%'), fontSize : (14), marginLeft : wp('4%')}}>Check this box to allow only Contractors and Co-Hosts to see next check-in-time and date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress ={()=>{this.props.chooseContractorSetting(1, 'all_contractors_only')}}  style={{flexDirection : 'row' , alignItems : 'center' , marginBottom : hp('1%')}}>
          <View style={styles.innerViewInRadioButton}>
            {
              this.props.radioSelectedValue === 1 &&
                <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
            }
          </View>
            <Text style={{color : '#292929' , flexWrap : 'wrap', width : wp('77%'), fontSize : (14), marginLeft : wp('4%')}}>Check this box to allow All Contractor to see next check-in-time and date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress ={()=>{this.props.chooseContractorSetting(2, 'not_allow')}}  style={{flexDirection : 'row' , alignItems : 'center' , marginBottom : hp('1%')}}>
          <View style={styles.innerViewInRadioButton}>
            {
              this.props.radioSelectedValue === 2 &&
                <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
            }
          </View>
            <Text style={{color : '#292929' , flexWrap : 'wrap', width : wp('77%'), fontSize : (14), marginLeft : wp('4%')}}>Do not allow Contractors and Co-Hosts to see next check-in-time and date</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
class RadioButtonsForScheduleCleaning extends Component {
  render() {
    return (
      <View style={{marginBottom : hp('3%')}}>
        <Text style={{fontSize : (20), color: '#292929', marginBottom : hp('2%')}}>Automatically Schedule Cleaning Service</Text>
          <TouchableOpacity onPress ={()=>{this.props.radioChange(0, 'out')}}  style={{flexDirection : 'row' , alignItems : 'center' , marginBottom : hp('1%')}}>
            <View style={styles.innerViewInRadioButton}>
            {this.props.radioSelected === 0 &&
                <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
            }
            </View>
            <View style={{flexDirection : 'row', alignItems : 'center', width : wp('77%'), marginLeft : wp('4%'), flexWrap : 'wrap'}}>
              <Text style={{color:'#292929',fontSize: (14)}}>Automatically schedule cleanings to begin 1 hour
                <Text style={{color:'#292929',fontSize: (14), textDecorationLine: 'underline'}}> after </Text>a guest check-out</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{this.props.radioChange(1, 'in')}}  style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('1%')}}>
            <View style={styles.innerViewInRadioButton}>
            {this.props.radioSelected === 1 &&
              <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
            }
            </View>
            <View style={{flexDirection : 'row', alignItems : 'center', width : wp('77%'), marginLeft : wp('4%'), flexWrap : 'wrap'}}>
              <Text style={{color:'#292929',fontSize: (14),fontFamily :'Raleway-SemiBold'}}>Automatically schedule cleanings to end 1 hour
                <Text style={{color:'#292929',fontSize: (14),fontFamily :'Raleway-SemiBold', textDecorationLine: 'underline',}}> before </Text>a guest check-in</Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  } 
}
class TimePicker extends Component {
  state = {  
    isTimePickerVisible : false,
    selectedTime : this.props.time
  }
  showDateTimePicker = () => {
    this.setState({ isTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };
  handleDatePicked = time => {
    time = moment(time).format("H:mm")
    this.setState({selectedTime : time});
    this.props.setTime(time.toString());
    this.hideDateTimePicker();
  };
  render() {
    return (
      <View>
        <TouchableOpacity style={styles.textInputCon} onPress={this.showDateTimePicker}> 
          <Text style={{fontSize : (15), color : '#292929'}}>{this.state.selectedTime}</Text>
        </TouchableOpacity>
        <DateTimePicker
          mode = 'time'
          isVisible={this.state.isTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          is24Hour = {true}
        />
      </View>
    );
  }
}