import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Linking, TouchableOpacity, ScrollView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import StatusBar from '../InputFields/statusBar' ;
import TextInputField from '../InputFields/textInputField';
import DropDownField from '../InputFields/dropDown';
import TouchButton from '../InputFields/touchButton';
import ActionPerformFunc from '../InputFields/actionPerform';

class AddPropertyScreen1 extends Component{
  constructor(props){
    super(props);
    this.state ={
      radioSelectedValue : 0,
      rentingWebsite : 'airbnb',
      propertyNotification : '',
      calendar_urlNotification : '',
      bathroomsNotification : '',
      bedroomsNotification : '',
        websiteLinks : {
        'airbnb' : 'https://www.airbnb.com/help/article/99/how-do-i-sync-my-airbnb-calendar-with-another-calendar',
        'vrbo' : 'https://help.vrbo.com/articles/How-do-I-import-my-iCal-or-Google-calendar',
        'booking.com' : 'https://partner.booking.com/en-us/help/rates-availability/how-do-i-connect-my-bookingcom-calendar-other-ones',
        'tripadvisor' : 'https://rentalsupport.tripadvisor.com/articles/FAQ/noc-How-does-calendar-sync-work'
      }
    }
  }
  nextPressed = () => {
    if(this.state.propertyValid && this.state.bathroomsValid && this.state.bedroomsValid){
      this.props.navigation.navigate('AddPropertyScreen2', 
      {
        property_name : this.state.property, 
        bedrooms : this.state.bedrooms,
        bathrooms : this.state.bathrooms,
        describe_property : this.state.describe_property,
        website : this.state.rentingWebsite,
        calendar_url : this.state.calendar_url
      }); 
    }
    else{
      if(!this.state.property) {
          this.setState({propertyNotification : 'property Name required'});
      }
      if(!this.state.bathrooms) {
          this.setState({bathroomsNotification : 'Number of Bathrooms required'});
      }
      if(!this.state.bedrooms) {
          this.setState({bedroomsNotification : 'Number of Bedrooms required'});
      }
        this.setState({
          processing : false
        });
      } 
  }
  selectRentingWebsite = (value, selectedwebsite) => {
    console.log(value);
    console.log(selectedwebsite);
    this.setState({radioSelectedValue : value, rentingWebsite : selectedwebsite});
  }
  onChange = (name, value) => {
    this.setState({
      [name]: value,
      [name+'Notification'] : ''
    });
  }
  validityCheck = (name , validity) => {
  this.setState({
    [name+'Valid']: validity,
  });
  }
  openLink = () => {
    Linking.openURL(this.state.websiteLinks[this.state.rentingWebsite]);
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/add_property_bg.jpg')} style={styles.container}>
        <StatusBar title='ADD PROPERTY' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
        <ScrollView>
          <View style={{flex : 1, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginVertical : hp('3%')}}>
            <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
              <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Name your property</Text>
              <TextInputField
                name = 'property'
                keyboardType = 'default'
                placeholder = 'Name your property'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.property}
              />
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.propertyNotification}</Text>
            </View>
            <View style={styles.eachField}>
              <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Bed rooms</Text>
              <TextInputField
                name = 'bedrooms'
                keyboardType = 'numeric'
                placeholder = 'Enter Bed rooms'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.bedrooms}
              />
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.bedroomsNotification}</Text>
            </View>
            <View style={styles.eachField}>
              <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Bathrooms</Text>      
              <TextInputField
                name = 'bathrooms'
                keyboardType = 'numeric'
                placeholder = 'Enter Bathrooms'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.bathrooms}
              />
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.bathroomsNotification}</Text>
            </View>
            <View style={{height : hp('18%'),  marginBottom : hp('3%')}}>      
              <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Property Description</Text>
              <TextInputField
                name = 'describe_property'
                keyboardType = 'default'
                placeholder = 'Describe your property'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {true}
                numberOfLines = {12}
                textAlign = 'top'
                height = {hp('15%')}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.describe_property}
              />
            </View>
            <RadioButtons selectRentingWebsite = {this.selectRentingWebsite} radioSelectedValue = {this.state.radioSelectedValue}/>
            <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>
              <View style={{flexDirection : 'row', alignItems : 'center'}}>      
                <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929' , marginRight : wp('2%')}}>Calendar</Text>
                <TouchableOpacity onPress = {this.openLink}>
                  <Text style={{fontSize : (12), fontFamily : 'Raleway-SemiBold', color: '#8cc63f'}}>How do I find my Calendar URL?</Text>
                </TouchableOpacity>
              </View>
              <TextInputField
                name = 'calendar_url'
                keyboardType = 'default'
                placeholder = 'Enter Calendar URL'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true, url : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.calendar_url}
              /> 
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.calendar_urlNotification}</Text>
            </View>   
            <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
              <TouchButton 
                buttonName = 'Back'
                actionPerform = {ActionPerformFunc}
                move = 'back'
                bgColor = '#0071bc'
                width = {wp('33%')}
                height = {hp('7%')}
                buttonNameSize = {(20)}
                elevation = {0}
                navigation = {this.props.navigation}
              />
              <TouchButton 
                buttonName = 'Next'
                actionPerform = {ActionPerformFunc}
                move = {{doingAction : 'doingAction', action : this.nextPressed}}
                bgColor = '#8cc63f'
                width = {wp('33%')}
                height = {hp('7%')}
                buttonNameSize = {(20)}
                elevation = {0}
                navigation = {this.props.navigation}
              />
            </View>
          </View>
        </ScrollView>       
      </ImageBackground>
    )
  }
}
export default AddPropertyScreen1;
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
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
  textInputCon : {
    color : 'black',
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#f4f4f4' ,
    paddingLeft : wp('2%'),
    borderRadius : 2 
  },
  RadioButtonStyle : {
    flexDirection : 'row' ,
    alignItems : 'center' ,
    flexWrap : 'wrap' ,
    marginBottom : hp('3%') ,
    backgroundColor : '#f4f4f4',
    height : hp('12%'),
    padding : wp('1.2%')
  },
  innerViewInRadioButton  : {
    height:wp('5%'),
    width:wp('5%'),
    backgroundColor:'rgba(0,0,0,0)',
    borderRadius: 100,
    borderWidth :2,
    borderColor:'#0071bc',
    justifyContent:'center',
    alignItems:'center'
  },
  specificRadioButton : {
    flexDirection : 'row' ,
    alignItems : 'center' ,  
    marginBottom : hp('1%')
  },
  innerCircle : {
    height:wp('2.5%'),
    width:wp('2.5%'), 
    backgroundColor:'#0071bc',
    borderRadius: 100
  }
});

class RadioButtons extends Component {
  render() {
    return (
      <View style={{height : hp('15%'), marginBottom : hp('3%')}}>
        <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Renting Website</Text>
          <View style={styles.RadioButtonStyle}>
            <TouchableOpacity onPress ={()=>{this.props.selectRentingWebsite(0, 'airbnb')}}  style={[styles.specificRadioButton ,{marginRight : wp('4%')}]}>
              <View style={styles.innerViewInRadioButton}>
                {this.props.radioSelectedValue === 0 &&
                  <View style={styles.innerCircle}/>
                }
              </View>
                <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>AirBnB</Text>
            </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{this.props.selectRentingWebsite(1, 'vrbo')}}  style={[styles.specificRadioButton ,{marginRight : wp('2%')}]}>
            <View style={styles.innerViewInRadioButton}>
              {this.props.radioSelectedValue === 1 &&
                <View style={styles.innerCircle}/>
              }
            </View>
              <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>VRBO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{this.props.selectRentingWebsite(2, 'booking.com')}}  style={[styles.specificRadioButton ,{marginRight : wp('2%')}]}>
            <View style={styles.innerViewInRadioButton}>
              {this.props.radioSelectedValue === 2 &&
                <View style={styles.innerCircle}/>
              }
            </View>
              <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>Booking.com</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress ={()=>{this.props.selectRentingWebsite(3, 'tripadvisor')}} style={[styles.specificRadioButton ,{marginRight : wp('2%')}]}>
            <View style={styles.innerViewInRadioButton}>
              {this.props.radioSelectedValue === 3 &&
                <View style={styles.innerCircle}/>
              }
            </View>
              <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>TripAdvisor</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}