import React ,{Component} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import { AddNewPropertyInExistngArray } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import TextInputField from '../InputFields/textInputField';
import DropDownField from '../InputFields/dropDown';
import axios from 'axios';
import {server} from '../../Redux/server';

class AddPropertyScreen2 extends Component{
  constructor(props){
    super(props);
    this.state ={
      countries : this.props.countries,
      states : this.props.states,
      specificState : '',
      country : '',
      processing : false,
      street_numberNotification : '',
      unit_numberNotification : '',
      zip_codeNotification : '',
      cityNotification : '',
      specificStateNotification : '',
      countryNotification : ''
    }
  }
  submitPressed = () => {
    // console.log(this.props.navigation.getParam('property_name', '') , this.props.navigation.getParam('bedrooms', ''),  this.props.navigation.getParam('bathrooms', ''), this.props.navigation.getParam('website', ''), this.props.navigation.getParam('calendar_url', ''), this.props.navigation.getParam('describe_property', ''));
    if(this.state.street_numberValid && this.state.unit_numberValid && this.state.cityValid && this.state.specificState && this.state.country){
      this.setState({processing : true});
        this.apiCall(); 
    }
    else{
      if(!this.state.street_number) {
        this.setState({street_numberNotification : 'street_number required'});
      }
      if(!this.state.unit_number) {
        this.setState({unit_numberNotification : 'unit_number required'});
      }
      if(!this.state.zip_code) {
        this.setState({zip_codeNotification : 'zip Code required'});
      }
      if(!this.state.city) {
        this.setState({cityNotification : 'city required'});
      }
      if(!this.state.specificState) {
        this.setState({specificStateNotification : 'State required'});
      }
      if(!this.state.country) {
        this.setState({countryNotification : 'country required'});
      }
        this.setState({
          processing : false
        });
    }
  }
  apiCall = async() => {
    var formData = new FormData();
    formData.append('property_title', this.props.navigation.getParam('property_name', ''));
    formData.append('address_street_number',  this.state.street_number);
    formData.append('address_zipcode', this.state.zip_code);
    formData.append('post_bedrooms', this.props.navigation.getParam('bedrooms', ''));
    formData.append('post_bathrooms', this.props.navigation.getParam('bathrooms', ''));
    formData.append('address_unit_number', this.state.unit_number);
    formData.append('address_city', this.state.city);
    formData.append('address_state', this.state.stateID);
    formData.append('address_country', this.state.countryID);
    formData.append('renting_website', this.props.navigation.getParam('website', ''));
    formData.append('calendar_url', this.props.navigation.getParam('calendar_url', ''));
    formData.append('property_content', this.props.navigation.getParam('describe_property', ''));
    const res = await axios.post(server+'add_property', formData ,{
      headers : {'Authorization': 'Bearer '+ this.props.userToken},
    });
    if(res.data.code === 200){
      var newProperty = {
        ID: res.data.data.property_id,
        post_title : this.props.navigation.getParam('property_name', ''),
        address_street_number : this.state.street_number,
        property_image : ''
      }
      this.props.AddNewPropertyInExistngArray(newProperty);
      this.props.navigation.navigate('MyPropertyList');
    }
  }  
  selectState = (value, id) => {
    this.setState({specificState : value, stateID : id , specificStateNotification : ''})
  }
  selectCountry = (value, id) => {
    this.setState({country : value, countryID : id, countryNotification : ''})
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
  render(){
    return(
      <ImageBackground source={require('../../assets/add_property_bg.jpg')} style={styles.container}>
        <StatusBar title='ADD PROPERTY' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
        <ScrollView>
          <View style={{flex : 1, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginVertical : hp('3%')}}>
            <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
              <Text style={{fontSize : (18), color: '#292929'}}>Street Number</Text>
              <TextInputField
                name = 'street_number'
                keyboardType = 'default'
                placeholder = 'Enter Street Number'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.street_number}
              />
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.street_numberNotification}</Text>
            </View>
            <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
              <Text style={{fontSize : (18), color: '#292929'}}>Unit Number</Text>
              <TextInputField
                name = 'unit_number'
                keyboardType = 'numeric'
                placeholder = 'Enter Unit Number'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.unit_number}
              />
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.unit_numberNotification}</Text>
            </View>
            <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
              <Text style={{fontSize : (18), color: '#292929'}}>City</Text>
              <TextInputField
                name = 'city'
                keyboardType = 'default'
                placeholder = 'Enter City'
                placeholderTextColor='#292929'
                secureTextEntry = {false}
                multiline = {false}
                numberOfLines = {1}
                height = {hp('7%')}
                validations = {{required : true}}
                onChangeValue = {this.onChange}
                validityChange = {this.validityCheck}
                value = {this.state.city}
              />
              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.cityNotification}</Text>
            </View>
              <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>
                <Text style={{ color : '#292929', fontSize : (18)}}>State</Text>      
                <DropDownField
                  listShow = {this.state.states}
                  placeholder = 'Select State'
                  height = {hp('25%')}
                  width = {wp('85%')}
                  selectedValue = {this.selectState}
                  name = 'name'
                  id = 'term_id'
                  isObject = {true}
                />
                <Text style={{ color : 'red', fontSize : 12}}>{this.state.specificStateNotification}</Text>
              </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <Text style={{ color : '#292929', fontSize : (18)}}>Country</Text>      
                <DropDownField
                  listShow = {this.state.countries}
                  placeholder = 'Select country'
                  height = {hp('7%')}
                  width = {wp('85%')}
                  selectedValue = {this.selectCountry}
                  name = 'name'
                  id = 'term_id'
                  isObject = {true}
                />
                <Text style={{ color : 'red', fontSize : (12)}}>{this.state.countryNotification}</Text>
            </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -10}:{}]}>
                <Text style={{fontSize : 18, color: '#292929'}}>Zip Code</Text>
                <TextInputField
                  name = 'zip_code'
                  keyboardType = 'numeric'
                  placeholder = 'Enter Zip Code'
                  placeholderTextColor='#292929'
                  secureTextEntry = {false}
                  multiline = {false}
                  numberOfLines = {1}
                  height = {hp('7%')}
                  validations = {{required : false}}
                  onChangeValue = {this.onChange}
                  validityChange = {this.validityCheck}
                  value = {this.state.zip_code}
                />
                <Text style={{ color : 'red', fontSize : (12)}}>{this.state.zip_codeNotification}</Text>
              </View>   
              <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly'}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
                  <Text style={{ color : '#ffffff' , fontSize : (20)}}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.submitPressed}>
                  <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                    <Text style={{ color : '#ffffff' , fontSize : (20)}}>Submit</Text>
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
  countries : state.createJob.countries,
  states : state.createJob.states,
});
export default connect(mapStateToProps, {AddNewPropertyInExistngArray})(AddPropertyScreen2);
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
});