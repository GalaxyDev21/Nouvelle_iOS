import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView,Picker, TextInput,Image ,ImageBackground, TouchableOpacity , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import StatusBar from '../InputFields/statusBar' ;
import { ChooseDate } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';

class CreateJob_Screen3 extends Component{
    constructor(props){
        super(props);
        this.state ={
            radioSelectedValue : '',
            radioSelectForCalender : '',
            dateNotification : ''
        }
      }
      radioChange = (value, selectedDate) => {
         this.setState({radioSelectedValue : value, radioSelectForCalender : value, dateNotification : ''});
         this.props.selectDate(selectedDate);
      }
      lastRadioChange = (value) => {
        this.setState({radioSelectedValue : value, radioSelectForCalender : '', dateNotification : ''});
     }
     checkChooseDate = () => {
       if(this.state.radioSelectForCalender || this.state.radioSelectForCalender === 0 ){
          this.props.navigation.navigate('CreateJob_Screen4')
       }
       else{
         this.setState({dateNotification : 'Choose Date for service'})
       }
     }
    render(){
        return(
            <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
              <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/>
               <View style={{flex : 0.08 , alignItems : 'center' , marginBottom : hp('2%') }}>
                   <Text style={{marginHorizontal:wp('8%') , fontFamily : 'Raleway-SemiBold' , color : '#292929' ,textAlign : 'center', fontSize : (22)}}>Choose Your Date of Service</Text>
               </View>
               <View style={styles.whiteBackGroundCont}>
                   <View style={styles.grayBackGroundCont}>
                        <RadioButtons radioSelectedValue={this.state.radioSelectedValue} radioSelectForCalender={this.state.radioSelectForCalender} radioChange={this.radioChange} lastRadioChange = {this.lastRadioChange}/>
                    <View style={{flexDirection : 'row' , justifyContent : 'space-between'}}>
                        <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
                           <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.checkChooseDate}>
                          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12)}}>{this.state.dateNotification}</Text>
                   </View>
               </View>
           </ImageBackground>
        )
    }
}
const mapStateToProps = state => ({
    jobInformation : state.createJob.jobInformation ,
  });
  const dispatchStateToProps = dispatch => ({
        selectDate : (date) => dispatch(ChooseDate(date)),
  });
  export default connect(
   mapStateToProps,
   dispatchStateToProps
  )(CreateJob_Screen3);

class RadioButtons extends Component {
    render() {
        return (
           <View>
             <View style={styles.specificRadioButton}>
              <TouchableOpacity onPress ={()=>{this.props.radioChange(0, 'recommended')}}  style={{flexDirection : 'row' , alignItems : 'center'}}>
               <View style={styles.innerViewInRadioButton}>
                {this.props.radioSelectedValue === 0 &&
                    <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
                }
               </View>
               <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>As recommended by the pro</Text>
               </TouchableOpacity>
              </View>
              <View style={styles.specificRadioButton}>
              <TouchableOpacity onPress ={()=>{this.props.radioChange(1, (moment(new Date()).add(7, 'days').format('DD-MM-YYYY')))}}  style={{flexDirection : 'row' , alignItems : 'center'}}>
               <View style={styles.innerViewInRadioButton}>
                {this.props.radioSelectedValue === 1 &&
                    <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
                }
               </View>
               <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>In next few week</Text>
               </TouchableOpacity>
              </View>
              <View style={styles.specificRadioButton}>
              <TouchableOpacity onPress ={()=>{this.props.radioChange(2, (moment(new Date()).format('DD-MM-YYYY')))}}  style={{flexDirection : 'row' , alignItems : 'center'}}>
               <View style={styles.innerViewInRadioButton}>
                {this.props.radioSelectedValue === 2 &&
                    <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
                }
               </View>
               <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>Within a week</Text>
               </TouchableOpacity>
              </View>
              <View style={[styles.specificRadioButton, {justifyContent : 'space-between' , flexDirection: 'row' , alignItems : 'center'}]}>
               <View style={{flexDirection : 'row' , alignItems : 'center'}}>
                <TouchableOpacity onPress ={()=>{this.props.lastRadioChange(3)}}  style={{flexDirection : 'row' , alignItems : 'center'}}>
                    <View style={styles.innerViewInRadioButton}>
                        {this.props.radioSelectedValue === 3 &&
                            <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
                        }
                    </View>
                    <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>Choose Date</Text>
                </TouchableOpacity>
                </View>
                {this.props.radioSelectedValue === 3 &&
                <View>
                    <DateTimePickerTester chooseDate = {this.props.radioChange}/>
                </View>
                }
              </View>

            </View>
        );
    }
}


class DateTimePickerTester extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isDateTimePickerVisible: false ,
        selected_Date : ''
      };
    }
    showDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: true });
    };
    hideDateTimePicker = () => {
      this.setState({ isDateTimePickerVisible: false });
    };
    handleDatePicked = date => {
        selectDate = moment(date).format('DD-MM-YYYY')
        this.setState({selected_Date :selectDate});
        this.props.chooseDate(3, selectDate) ;
        this.hideDateTimePicker();
    };
    render() {
      return (
        <View>
        <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between'}}>
           <Text style={{color:'#292929',fontSize: (15),fontFamily :'Raleway-SemiBold'}}>{this.state.selected_Date}</Text>
             <TouchableOpacity onPress={this.showDateTimePicker} style={{marginLeft:wp('2%')}}>
                <Image source={require('../../assets/calendar_icon.png')} style={{ height:hp('3%') , width:hp('3%') , resizeMode : 'contain'}}/>
             </TouchableOpacity>
         </View>
          <DateTimePicker
            minimumDate = {new Date()}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch'
     },
     whiteBackGroundCont : {
        flex : 0.57 ,
        margin : hp('2%') ,
        backgroundColor : '#ffffff' ,
        borderRadius : hp('1%') ,
        padding : hp('2%')
     },
     grayBackGroundCont : {
        flex : 1 ,
        margin : hp('2%') ,
        backgroundColor : '#f4f4f4' ,
        borderRadius : hp('1%') ,
        padding : hp('2%')
     },
     TouchableStyle :{
        height : hp('7%') ,
        width : wp('33%') ,
        marginBottom : hp('2%'),
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center'
     },
     specificRadioButton : {
         justifyContent:'flex-start',
         borderBottomWidth : 0.5 ,
         borderBottomColor : '#d0d0d0' ,
         marginBottom : hp('2%') ,
         paddingBottom : hp('1%')
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

