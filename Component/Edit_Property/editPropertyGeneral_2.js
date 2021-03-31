import React ,{Component} from 'react';
import { StyleSheet, Text, View, FlatList, Platform, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { EditPropertyDetail, ChangeDetailsInExistingPropertyList } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import TextInputField from '../InputFields/textInputField';
import DropDown from '../host_profile/dropDown';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';

class EditPropertyGeneralScreen_2 extends Component{
  constructor(props){
    super(props);
    this.state = {
      street_number : this.props.specificPropertyDetail.address_street_number,
      unit_number : this.props.specificPropertyDetail.address_unit_number,
      city : this.props.specificPropertyDetail.address_city,
      specificState : this.props.specificPropertyDetail.state.length > 0 ? this.props.specificPropertyDetail.state[0].name : '',
      country : this.props.specificPropertyDetail.country.length > 0 ? this.props.specificPropertyDetail.country[0].name : '',
      zip_code : this.props.specificPropertyDetail.address_zipcode === "undefined" ? '' : this.props.specificPropertyDetail.address_zipcode,
      stateID : this.props.specificPropertyDetail.state.length > 0 ? this.props.specificPropertyDetail.state[0].term_id : '',
      countryID : this.props.specificPropertyDetail.country.length > 0 ?  this.props.specificPropertyDetail.country[0].term_id : '',
      cityNotification : '',
      unit_numberNotification : '',
      specificStateNotification : '',
      countryNotification : ''
    }
  }
  selectState = (value, id) => {
    this.setState({specificState : value, stateID : id , specificStateNotification : ''})
  }
  selectCountry = (value, id) => {
    this.setState({country : value, countryID  :id , countryNotification : ''})
  }
  goToBackScreen = () => {
    this.props.switchScreen();
  }
  pressUpdate = () => {
    if(this.state.specificState && this.state.city && this.state.country){
      this.setState({processing : true});
        this.apiCall();
        const screen2Data = {
          street_number : this.state.street_number,
          zip_code : this.state.zip_code,
          city : this.state.city,
          specificState : this.state.specificState,
          stateID : this.state.stateID,
          country : this.state.country,
          countryID  :this.state.countryID,
          unit_number : this.state.unit_number
        };
        const allDetails = {...this.props.editPropertyDetails, ...screen2Data};
        this.props.EditPropertyDetail(allDetails);
    }
    else{
      if(!this.state.unit_number) {
        this.setState({unit_numberNotification : 'unit_number required'});
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
    }
  }
  apiCall = async() => {
    // file= {
    //   uri: this.props.editPropertyDetails.image,
    //   name: 'image',
    //   type: 'image/jpg',
    // }
    var formData = new FormData();
    formData.append('ID', this.props.specificPropertyDetail.ID);
    formData.append('property_title', this.props.editPropertyDetails.property_title);
    formData.append('post_bedrooms', this.props.editPropertyDetails.bedrooms);
    formData.append('post_bathrooms', this.props.editPropertyDetails.bathrooms);
    formData.append('address_street_number', this.state.street_number);
    formData.append('address_zipcode', this.state.zip_code);
    formData.append('address_unit_number', this.state.unit_number);
    formData.append('address_city',  this.state.city);
    formData.append('address_state',  this.state.stateID);
    formData.append('address_country',  this.state.countryID);
    formData.append('property_content',  this.props.editPropertyDetails.describe_property);
    Object.keys(this.props.editPropertyDetails.image).length  !== 0 && formData.append('property_image',  this.props.editPropertyDetails.image);
    try{
      const res = await axios.post(server+'edit_property', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
        if(res.data.code === 200){
        const tempObj = {
          'ID': this.props.specificPropertyDetail.ID,
          'post_title': this.props.editPropertyDetails.property_title,
          'post_bedrooms': this.props.editPropertyDetails.bedrooms,
          'post_bathrooms': this.props.editPropertyDetails.bathrooms,
          'address_street_number': this.state.street_number,
          'address_zipcode': this.state.zip_code,
          'address_unit_number': this.state.unit_number,
          'address_city' : this.state.city,
          'address_state': this.state.stateID,
          'address_country' : this.state.countryID,
          'property_content': this.props.editPropertyDetails.describe_property,
          'property_image' : this.props.editPropertyDetails.img
        }
        
        this.props.ChangeDetailsInExistingPropertyList(tempObj);
        this.stopProcesing('Property has Edit Successfully', 'success');
      }
    }
    catch(error){
      console.log(error);
      this.stopProcesing('Sorry, Unable to edit property', 'error');
    } 
  } 
  stopProcesing =(message, type)=> {
    ShowBar(message, type );
    this.setState({processing : false});
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
          <ScrollView>
            <View style={{flex : 1, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginHorizontal : wp('4%'), marginVertical : hp('2%')}}>
              <ScrollView nestedScrollEnabled = {true}>
                <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
                  <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Street Number</Text>
                    <TextInputField
                      name = 'street_number'
                      keyboardType = 'default'
                      placeholder = 'Enter Street #'
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
                </View>
                <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
                  <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Unit Number</Text>
                    <TextInputField
                      name = 'unit_number'
                      keyboardType = 'numeric'
                      placeholder = 'Enter Unit #'
                      placeholderTextColor='#292929'
                      secureTextEntry = {false}
                      multiline = {true}
                      numberOfLines = {12}
                      height = {hp('7%')}
                      validations = {{required : true}}
                      onChangeValue = {this.onChange}
                      validityChange = {this.validityCheck}
                      value = {this.state.unit_number}
                    />
                    <Text style={{ color : 'red', fontSize : (12)}}>{this.state.unit_numberNotification}</Text>
                </View>
                <View style={styles.eachField}>
                    <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>City</Text>
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
                <View style={styles.eachField}>
                    <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>State</Text>      
                      <DropDown
                        listShow = {this.props.states}
                        placeholder = {this.state.specificState ? this.state.specificState : 'select state'}
                        height = {hp('25%')}
                        width = {wp('85%')}
                        selectedValue = {this.selectState}
                        name = 'name'
                        id = 'term_id'
                        isObject = {true}
                      />
                      <Text style={{ color : 'red', fontSize : (12)}}>{this.state.specificStateNotification}</Text>
                </View>
                  <View style={[styles.eachField, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                    <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Country</Text>      
                      <DropDown
                        listShow = {this.props.countries}
                        placeholder = {this.state.country ? this.state.country : 'Select country'}
                        height = {hp('7%')}
                        width = {wp('85%')}
                        selectedValue = {this.selectCountry}
                        name = 'name'
                        id = 'term_id'
                        isObject = {true}
                      />
                      <Text style={{ color : 'red', fontSize : (12)}}>{this.state.countryNotification}</Text>
                </View>
                <View style={[{height : hp('10%'),  marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>      
                  <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Zip Code</Text>
                    <TextInputField
                      name = 'zip_code'
                      keyboardType = 'numeric'
                      placeholder = 'Enter Zip Code'
                      placeholderTextColor='#292929'
                      secureTextEntry = {false}
                      multiline = {true}
                      numberOfLines = {12}
                      height = {hp('7%')}
                      validations = {{required : true}}
                      onChangeValue = {this.onChange}
                      validityChange = {this.validityCheck}
                      value = {this.state.zip_code}
                    />
                </View> 
                  <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly'}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                  <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.switchScreen()}>
                    <Text style={{ color : '#ffffff' , fontSize : (20)}}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.pressUpdate}>
                    <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                      <Text style={{ color : '#ffffff' , fontSize : (20)}}>Update</Text>
                        {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                      </View>
                  </TouchableOpacity>
                  </View>
                </ScrollView>
            </View>
          </ScrollView>       
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  specificPropertyDetail : state.createJob.specificPropertyDetail,
  countries : state.createJob.countries,
  states : state.createJob.states,
  editPropertyDetails : state.createJob.editPropertyDetails
});
export default connect(mapStateToProps, {EditPropertyDetail, ChangeDetailsInExistingPropertyList})(EditPropertyGeneralScreen_2);
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
});