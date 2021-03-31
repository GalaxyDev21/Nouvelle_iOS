import React ,{Component} from 'react';
import { StyleSheet, Text, View,  ImageBackground, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import { storeServiceForCreateJob, AddProperty , GetPropertyDetails} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import DropDownField from '../InputFields/dropDown';
// import axios from 'axios';
// import ShowBar from '../validations/messageBar' ;

class ExistingPropertyScreen extends Component{
  constructor(props){
    super(props);
    this.state ={
      heading : 'Select Property',
      property : '' ,
      propertyNotification : '',
      isOpenList : false,
      selectedProperties : '',
      propertyId : '',
      properties : [{ID: 1, "post_title": "No Properties Available"}],
    }
  }
  selectOneProperty = (value , id) => {
    this.setState({property : value , propertyId : id, propertyNotification : ''});
  }
  chooseProperty = () => {
    if(this.state.property !== '' && this.state.property !== 'No Properties Available'){
      const propertyDetail = {
        property_name : this.state.property,
        property_id : this.state.propertyId
      }
      var formData = new FormData();
      formData.append('PropertyID', this.state.propertyId);
      this.props.GetPropertyDetails(this.props.userToken, formData);
      this.props.AddProperty(propertyDetail);
      this.props.navigation.navigate('CreateJob_Screen2');
    } 
    else{
      this.setState({propertyNotification : this.state.property === 'No Properties Available' ? 'please create property'  : 'please select property'})
    } 
  }
  render(){
    const properties = this.props.existingProperty.length > 0 ? this.props.existingProperty : this.state.properties;
    return(
      <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
        <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/>
        <View style={{flex : 0.08 , alignItems : 'center'}}>
          <Text style={styles.titleStyle}>Property Detail</Text>
        </View>
        <View style={[{flex : 0.44, backgroundColor : '#ffffff', borderRadius : hp('1%'), paddingHorizontal : wp('3%'), paddingVertical : hp('4%'), margin : wp('4%')}, Platform.OS === 'ios'?{zIndex : 9999}:{}]}>
          <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18), marginBottom : hp('2%')}}>Properties</Text>     
          <DropDownField
            title = 'Select Property'
            listShow = {properties}
            placeholder = 'Select Property'
            width = {wp('85%')}
            selectedValue = {this.selectOneProperty}
            name = 'post_title'
            id = 'ID'
            isObject = {true}
          />
          <Text  style={[{ color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12)}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>{this.state.propertyNotification}</Text>
          <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly', marginTop : hp('1%'), marginBottom : hp('2%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
            <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
              <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.chooseProperty}>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{ color : '#ffffff' , fontSize : (20), marginRight : wp('2%')}}>Next</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </View>
            </TouchableOpacity>
          </View>
        </View>    
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  existingProperty : state.createJob.existingProperty ,
});
export default connect(mapStateToProps,{AddProperty, storeServiceForCreateJob, GetPropertyDetails})(ExistingPropertyScreen);

const styles = StyleSheet.create({
  container : {
    flex : 1,
    resizeMode : 'stretch',
  },
  titleStyle : {
    fontFamily : 'Raleway-SemiBold',
    textAlign : 'center',
    color : '#292929',
    fontSize : (22),
    marginHorizontal : wp('8%'),
  },
  TouchableStyle :{
    height : hp('7%'),
    width : wp('33%'),
    borderRadius : hp('5%'),
    justifyContent : 'center',
    alignItems : 'center'
  },
  textInputCon : {
    color : 'black',
    height : hp('7%'),
    fontSize: (13),
    backgroundColor : '#f4f4f4',
    marginBottom : hp('3%'),
    paddingLeft : wp('3%')  
  },
  TextInputField : {
    height : hp('7%') ,
    alignItems : 'flex-start' ,
    justifyContent : 'center' ,
    marginBottom : hp('3%') ,
    backgroundColor : '#f4f4f4'
  },
});