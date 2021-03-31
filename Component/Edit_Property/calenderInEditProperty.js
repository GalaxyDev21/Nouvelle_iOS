import React ,{Component} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, ImageBackground, Platform, Linking, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import DropDownField from '../host_profile/dropDown';
import { connect } from 'react-redux';
import ShowBar from '../validations/messageBar' ;
import validator from 'validator';
import axios from 'axios';
import {server} from '../../Redux/server';

class CalenderInEditProperty extends Component{
  constructor(props){
    super(props);
      this.state ={
        rentingWebsiteList : ['airbnb', 'vrbo', 'booking.com', 'tripadvisor'],
        newArray : this.props.propertyCalendarURL,
        processing : false
      }
  }
  componentDidMount() {
    this.createNewArray();
  }
  createNewArray = () => {
    if(!this.state.newArray[0]){
      tempArr = this.state.newArray.slice();
      obj = {
        id : 0,
        name : 'airbnb',
        url : ''
      };
      tempArr.push(obj);
      this.setState({newArray : tempArr});
    } 
  }
  selectRentingWebsite = (selectedwebsite) => {
    this.setState({rentingWebsite : selectedwebsite});
  }
  addAnOtherWebsite = () => {
    if(this.state.newArray.length < 4){
      tempArr = this.state.newArray.slice();
      obj = {
        id: !tempArr[0] ? 0 : (Math.max.apply(Math, tempArr.map(function(o) {return o.id; })))+1,
        name : '',
        url : ''
      }
      tempArr.push(obj);
      this.setState({newArray : tempArr});
    }
    else{
      ShowBar('Maximium 4 items are added' , 'error');
    } 
  }
  deleteURLComponent = (item) => {
    if(this.state.newArray.length > 1){
      tempArrForDeleteComponent = this.state.newArray.slice();
      const Index = tempArrForDeleteComponent.findIndex(checkIndex);
        function checkIndex(component){
          return component.id === item.id ;
        }
          tempArrForDeleteComponent.splice(Index, 1);
           this.setState({newArray : tempArrForDeleteComponent});
    }
    else{
      ShowBar('This item can not deleted' , 'error');
    }
  }
  addDataInNewItem = (obj) => {
    tempArrOfNewArr = this.state.newArray.slice();
    const selectedIndex = tempArrOfNewArr.findIndex(checkIndex);
    function checkIndex(component){
      return component.id === obj.id ;
    }
    tempArrOfNewArr[selectedIndex] = obj;
    this.setState({newArray : tempArrOfNewArr});
  }
  onSaveButton = async() => {
   // console.log(this.state.newArray);
    this.setState({processing : true});
    var calendarArray =  JSON.stringify(this.state.newArray);
    var formData = new FormData();
    formData.append('PropertyID', this.props.propertyId);
    formData.append('calendars_json', calendarArray);
      const res = await axios.post(server+'add_calendar_url', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken,},
      });
      if(res.data.code === 200){
        ShowBar(res.data.data , 'success');
        this.setState({processing : false});
      }
      else{
        ShowBar('Calendar has not Updated' , 'error');
        this.setState({processing : false});
      }
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/add_property_bg.jpg')} style={styles.container}>
            <ScrollView style={{flex : 1}}>
              <View style={{marginHorizontal : wp('3%')}}>
                {
                  <FlatList
                    data={this.state.newArray}          
                    renderItem={({item , index}) => <UrlAndRentingWebsiteComponent 
                      item={item}
                      index = {index} 
                      rentingWebsiteList = {this.state.rentingWebsiteList} 
                      selectRentingWebsite = {this.selectRentingWebsite}
                      deleteURLComponent = {this.deleteURLComponent}
                      addDataInNewItem = {this.addDataInNewItem}
                      newArray = {this.state.newArray}
                      readFromClipboard = {this.readFromClipboard}
                      writeToClipboard = {this.writeToClipboard}
                     // ref={(itemref) => this['itemref'+index] = itemref}
                    />}
                    keyExtractor={(item, index) => ""+item.id}
                  />
                }
                <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', marginBottom : hp('3%')}}>
                  <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={this.addAnOtherWebsite}>
                    <Text style={{ color : '#ffffff' , fontSize : (20)}}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.onSaveButton}>
                    <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                      <Text style={{ color : '#ffffff' , fontSize : (20)}}>Save</Text>
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
  propertyCalendarURL : state.createJob.propertyCalendarURL,
  isPropertyCalendarURLLoaded : state.createJob.isPropertyCalendarURLLoaded
});
export default connect(mapStateToProps)(CalenderInEditProperty);
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

class UrlAndRentingWebsiteComponent extends Component{
  constructor(props){
    super(props);
      this.state = {
        calenderURL : this.props.item.url,
        website : this.props.item.name,
        error : '',
        websiteLinks : {
          'airbnb' : 'https://www.airbnb.com/help/article/99/how-do-i-sync-my-airbnb-calendar-with-another-calendar',
          'vrbo' : 'https://help.vrbo.com/articles/How-do-I-import-my-iCal-or-Google-calendar',
          'booking.com' : 'https://partner.booking.com/en-us/help/rates-availability/how-do-i-connect-my-bookingcom-calendar-other-ones',
          'tripadvisor' : 'https://rentalsupport.tripadvisor.com/articles/FAQ/noc-How-does-calendar-sync-work'
        }
      }
  }
  mentionUrlAndWebsite = (value) => {
    var flag = true ;
    flag = checkElement(this.props.newArray);
      function checkElement(elementArr) {
        for(var i = 0; i < elementArr.length; i++){
          if(elementArr[i].name === value) {
            return false;
          }
        }
      }
      if(flag !== false){
        this.setState({website : value});
        obj = {
          id: this.props.item.id,
          name : value,
          url : this.state.calenderURL
        }
        this.props.addDataInNewItem(obj);
      }
      else{
        ShowBar('One Website is not repeated', 'error');
      }
  }
  validateURL = (text) =>{
    if(!validator.isURL(text)){
      return 'Please enter a valid URL';
    }
    else{
      return '';
    }
  }
  setData = () => {
    if(this.state.website){
      obj = {
        id: this.props.item.id,
        name : this.state.website,
        url : this.state.calenderURL
      }
      this.props.addDataInNewItem(obj);
    }
  }
  openLink = () => {
    Linking.openURL(this.state.websiteLinks[this.state.website]);
  }
  render(){
    return(
      <View style={{elevation : 2, height : hp('35%'), backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginVertical : hp('1.5%')}}>
        <View style={styles.eachField}>
          <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between', width : wp('85%'), marginBottom : wp('1%')}}>
            <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Integration Platform</Text>      
              <TouchableOpacity style={{justifyContent : 'center', alignItems : 'flex-end'}} onPress = {()=>this.props.deleteURLComponent(this.props.item)}>
                <Image source={require('../../assets/removeIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
              </TouchableOpacity>
          </View>
          <DropDownField
            listShow = {this.props.rentingWebsiteList}
            placeholder = {this.state.website ? this.state.website : 'Select website'}
            selectedValue = {this.mentionUrlAndWebsite}
          />
        </View>
        <View style={[{height : hp('10%'), marginTop : hp('2%'),  marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
          <View style={{flexDirection : 'row', alignItems : 'center'}}>      
            <Text style={{fontSize : (18), color: '#292929' , marginRight : wp('2%')}}>Calendar</Text>
              <TouchableOpacity onPress = {this.openLink}>
                <Text style={{fontSize : (12), color: '#8cc63f'}}>How do I find my Calendar URL?</Text>
              </TouchableOpacity>
          </View>
            <TextInput onEndEditing ={this.setData} keyboardType = 'default' multiline={true} value={this.state.calenderURL} onChangeText = {(text) => {this.setState({calenderURL : text , error : this.validateURL(text)})}} placeholder='Calendar URL' placeholderTextColor="#292929" style={{color:'#292929', height : hp('7%'), justifyContent : 'center', fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderRadius : 2}}/>
              <Text style={{fontSize : (12), color: 'red'}}>{this.state.error}</Text>
        </View>
      </View> 
    )
  }
}