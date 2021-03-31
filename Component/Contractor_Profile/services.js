import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Image, ImageBackground, TouchableOpacity, FlatList, Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import TextInputField from '../InputFields/textInputField';
import moment from 'moment-timezone';
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from 'react-redux';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';

class ContractorsServices extends Component{
  constructor(props){
    super(props);
    this.state = {
      services : this.props.profileDetails.project_category.length > 0 ? this.props.profileDetails.project_category : [],
      mainScroll : true,
      businessHours : [],
      processing : false,
      p_category : this.props.profileDetails.project_category,
      b_hours : this.props.profileDetails.work_experience,
      cost : this.props.profileDetails.hour_rate,
      experience : this.props.profileDetails.et_experience,
      isSwitchOn : this.props.profileDetails.user_24_available === 'on' ? true : false,
      disableDropDownTouch : false
    }
  }
  componentDidMount(){
    const {p_category} = this.state ;
    let arrFilter = [];
    if(p_category){
      arrFilter = p_category.map(el => el.term_id);
    }
    this.setState({p_category : arrFilter}); 
  }
  onChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }
  validityCheck = (name , validity) => {
    this.setState({
      [name+'Valid']: validity,
    });
  }
  saveButtonPressed = async() => {
    this.setState({processing : true});
    if(this.state.cost && this.state.experience){
      var selectedServices =  JSON.stringify(this.state.p_category);
      var businessHoursInJSON =  JSON.stringify(this.state.businessHours);
      var formData = new FormData();
      formData.append('p_category', selectedServices);
      formData.append('w_experience', businessHoursInJSON);
      formData.append('estimated_cost', this.state.cost);
      formData.append('experience', this.state.experience);
        const res = await axios.post(server+'update_services', formData, {
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
          });
          if(res.data.code === 200){
            ShowBar('Services Updated Successfully', 'success');
          }
          else{
            ShowBar('Sorry, Unable to update services', 'error');
          }
          this.setState({processing : false});
    }
    else{
      ShowBar('please fill all fields' , 'error');
      this.setState({processing : false});
    }  
  }
  selectServices = (value) => {
    var flag = true ;
    flag = checkElement(this.state.services);
    function checkElement(elementArr) {
      for(var i = 0; i < elementArr.length; i++){
        if(elementArr[i].term_id === value.term_id) {
          return false ;
        }
      }
    }
    if(flag !== false){
      const tempArr = this.state.services.slice();
      let p_categoryTempArr = this.state.p_category.slice();
      tempArr.push(value);
      p_categoryTempArr.push(value.term_id);
      this.setState({services : tempArr, p_category : p_categoryTempArr},() => {
        if(this.state.services.length === 5){
          this.setState({disableDropDownTouch : true})
        }
      });
    }
    else{
      ShowBar('please select unique service', 'error');
    } 
  }
  deleteItem = (item) => {
    const tempArrForDeleteService = this.state.services.slice();
    p_categoryArr = this.state.p_category.slice();
    const Index = tempArrForDeleteService.findIndex(checkIndex);
    function checkIndex(service){
      return service.term_id === item.term_id ;
    }
    tempArrForDeleteService.splice(Index, 1);
    p_categoryArr.splice(Index, 1);
    this.setState({services : tempArrForDeleteService, p_category : p_categoryArr});
  }
  setBusinessHours = (value) => {
    let tempArr = this.state.businessHours;
    const index2 = tempArr.findIndex(checkIndex2);
    function checkIndex2(obj){
      return obj.title === value.title ;
    }
    if(index2 < 0){
      tempArr.push(value);
    }
    else{
      tempArr[index2] = value;
    }
    this.setState({
      businessHours : tempArr
    });
  }
  onAvailable = () => {
    this.setState({isSwitchOn : !this.state.isSwitchOn}, async function(){
      var formData = new FormData(); 
      formData.append('user_24_available', this.state.isSwitchOn ? 'on' : 'off');
      const res = await axios.post(server+'update_247_business_hours_services', formData, {
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code === 200){
        ShowBar('Updated Successfully', 'success');
      }
      else{
        ShowBar('Sorry, Unable to updated', 'error');
      }
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/contractor_profle_bg.jpg')} style={styles.container}>
          <ScrollView>
            <View style={{flex : 0.085 , alignItems : 'center' , marginBottom : hp('3%'), marginTop: hp('3%') }}>
              <Text style={{color : '#292929' , fontSize : (22)}}>Services</Text>
            </View>
            <View style={{backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginVertical : hp('4%')}}>
            {this.state.services.length > 0 && 
              <View style={{flexDirection : 'row', alignItems : 'center', flexWrap : 'wrap'}}>
                {this.state.services.map((item , index) => (
                  <View key={index} style={{height:hp('5%'), backgroundColor : '#f1fee0', flexDirection : 'row', alignItems : 'center' , borderRadius : hp('2%'), paddingHorizontal : wp('1%'), marginBottom : wp('0.5%') , marginRight : wp('2%')}}>
                    <Text style={{ color : '#8cc63f', fontSize : (16), marginRight : wp('3%')}}>{item.name}</Text>
                      <TouchableOpacity onPress={()=>this.deleteItem(item)}>
                        <Image source={require('../../assets/delete_prop_from_group_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
                      </TouchableOpacity>
                  </View>  
                  ))
                }
              </View>
            }
              <View style={{marginBottom : hp('2%')}}>
                <DropDownForNewGroup
                  listShow = {this.props.availableServiceWithId}
                  placeholder = 'Choose Services'
                  height = {hp('19.5%')}
                  selectedValue = {this.selectServices}
                  disableDropDownTouch = {this.state.disableDropDownTouch}
                />
              </View>
              <UpdateTime setBusinessHours = {this.setBusinessHours} b_hours = {this.state.b_hours} isSwitchOn={this.state.isSwitchOn}/>
              <View style={[{marginBottom : hp('3%'), alignItems : 'flex-start'}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <Text style={{ color : '#292929', fontSize : (18)}}>Available 24/7</Text>
                <Switch
                  onValueChange = {this.onAvailable}
                  value = {this.state.isSwitchOn}
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] , marginLeft : wp('5%'), marginVertical : hp('1.5%')}}
                  trackColor = '#292929'
                  thumbColor = '#0071bc'
                />
              </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>      
                <Text style={{fontSize : 18, color: '#292929'}}>Estimated Cost</Text>
                <TextInputField
                  name = 'cost'
                  keyboardType = 'numeric'
                  placeholder = 'Estimated Cost'
                  placeholderTextColor='#292929'
                  secureTextEntry = {false}
                  multiline = {false}
                  numberOfLines = {1}
                  height = {hp('7%')}
                  validations = {{required : true}}
                  onChangeValue = {this.onChange}
                  validityChange = {this.validityCheck}
                  value = {this.state.cost}
                />
              </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>      
                <Text style={{fontSize : 18, color : '#292929'}}>Experience</Text>
                <TextInputField
                  name = 'experience'
                  keyboardType = 'numeric'
                  placeholder = 'experience in years'
                  placeholderTextColor='#292929'
                  secureTextEntry = {false}
                  multiline = {false}
                  numberOfLines = {1}
                  height = {hp('7%')}
                  validations = {{required : true}}
                  onChangeValue = {this.onChange}
                  validityChange = {this.validityCheck}
                  value = {this.state.experience}
                />
              </View>
              <TouchableOpacity onPress = {this.saveButtonPressed} activeOpacity = {0.5} style={{alignItems: 'center', justifyContent: 'center', backgroundColor : '#8CC63E', height : hp('7%'), width : '100%', marginBottom : hp('3%'), borderRadius : hp('5%')}}>
                <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{color : '#ffffff', fontSize : 18, marginRight : wp('3%')}}>Save</Text>
                  {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  profileDetails : state.createJob.profileDetails,
  availableServiceWithId : state.createJob.servicesForCreateJobWithId ,
});
export default connect(mapStateToProps)(ContractorsServices);  
const styles = StyleSheet.create({
    container : {
      flex : 1 ,
      resizeMode : 'stretch',
     },
     TextInputField : {
      height : hp('7%') ,
      alignItems : 'flex-start' ,
      justifyContent : 'center' ,
      marginBottom : hp('1%') ,
      backgroundColor : '#f4f4f4'
     },
     updateTimeField : {
      flexDirection : 'row', 
      alignItems : 'center', 
      justifyContent : 'space-between', 
      paddingHorizontal : wp('2%'), 
      backgroundColor : '#f4f4f4', 
      width : wp('40%'), 
      height : hp('7%')
     },
     touchForDropDown : {
      height:hp('7%'), 
      alignItems : 'flex-start', 
      justifyContent : 'center', 
      backgroundColor : '#f4f4f4' , 
      padding : wp('1.2%'),
      position : 'relative', 
      borderWidth : 1,
      borderColor :'#f4f4f4', 
      borderRadius : 2
    },
});

class UpdateTime extends Component{
  constructor(props){
    super(props);
    this.state = {
      isTimeViewDisplay : false
    }
  }
  weeklyTimes = (title, timeFrom, timeTo) => {
    const tempArr = {
      title : title,
      m_from : timeFrom,
      m_to : timeTo
    };
    this.props.setBusinessHours(tempArr);
  }
  getTimeObject = (title) => {
    for(let i = 0; i < this.props.b_hours[0].length; i++){
      if(title === this.props.b_hours[0][i].title){
        return this.props.b_hours[0][i];
      }
    }
    return '';
  }
  render(){
    return(
      <View style={[{marginBottom : hp('3%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
        <View style={{flexDirection : 'row', alignItems : 'center'}}>
          <Text style={{fontSize : (20), color : '#292929', marginBottom : hp('1%'), marginRight : wp('4%')}}>Business Hours</Text>
          <TouchableOpacity onPress={()=>this.setState({isTimeViewDisplay : !this.state.isTimeViewDisplay})} style={{width:wp('4%') , height:hp('4%')}}>
            <Image source={require('../../assets/increase_time.png')} style={{width:wp('4%') , height:hp('4%') , resizeMode :'contain', transform: [{ rotate: !this.state.isTimeViewDisplay ? '180deg' : '0deg'}]}}/>
          </TouchableOpacity>
        </View>
        { this.state.isTimeViewDisplay &&
          <View>
            <SpecificTimeUpdate title='Monday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Monday')}  b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
            <SpecificTimeUpdate title='Tuesday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Tuesday')}  b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
            <SpecificTimeUpdate title='Wednesday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Wednesday')}   b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
            <SpecificTimeUpdate title='Thursday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Thursday')} b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
            <SpecificTimeUpdate title='Friday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Friday')}  b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
            <SpecificTimeUpdate title='Saturday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Saturday')} b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
            <SpecificTimeUpdate title='Sunday' getTimes = {this.weeklyTimes} timeObject = {this.getTimeObject('Sunday')} b_hours = {this.props.b_hours} isSwitchOn={this.props.isSwitchOn}/>
          </View>
        }
      </View>
    )
  }
}

class SpecificTimeUpdate extends Component{
  constructor(props){
    super(props);
    this.state = {
      timeFrom : this.props.timeObject !== '' ? this.props.timeObject.m_from : '',
      timeTo : this.props.timeObject !== '' ? this.props.timeObject.m_to : '',
    }
  }
  setTimeFrom = (time) => {
    this.setState({
      timeFrom : time
    },function(){
      if(this.state.timeFrom !== '' && this.state.timeTo !== ''){
        this.props.getTimes(this.props.title, this.state.timeFrom, this.state.timeTo);
      }
    });  
  }
  setTimeTo = (time) => {
    this.setState({
      timeTo  : time
    },function(){
      if(this.state.timeFrom !== '' && this.state.timeTo !== ''){
        this.props.getTimes(this.props.title, this.state.timeFrom, this.state.timeTo);
      }
    });
  }
  render(){
    return(
      <View style={{marginBottom : hp('2%')}}>
        <Text style={{fontSize : (18), color : '#0071bc'}}>{this.props.title}</Text>
        <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between'}}>
          <TimePicker setTime = {this.setTimeFrom} time = {this.state.timeFrom} isSwitchOn={this.props.isSwitchOn}/>
          <TimePicker setTime = {this.setTimeTo} time = {this.state.timeTo} isSwitchOn={this.props.isSwitchOn}/>
        </View>
      </View>
    )
  }
}

class TimePicker extends Component {
  state = {
    isTimePickerVisible : false,
    selectedTime : this.props.time
  }
  componentDidMount(){
    if(this.state.selectedTime){
      this.props.setTime(this.state.selectedTime);
    }
  }
  showDateTimePicker = () => {
    this.setState({ isTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };
  handleDatePicked = time => {
    time = moment(time).format("H:mm")
    this.setState({selectedTime : time},function(){this.props.setTime(this.state.selectedTime)});
    this.hideDateTimePicker();
  };
  render() {
    return (
      <View>
       <TouchableOpacity onPress={this.showDateTimePicker} style={styles.updateTimeField} disabled={this.props.isSwitchOn}> 
        <Text style={{fontSize : (15), color : '#292929'}}>{this.state.selectedTime}</Text>
        <View>
          <View>
            <Image source={require('../../assets/increase_time.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain'}}></Image>
          </View>
          <View onPress={this.showDateTimePicker}>
            <Image source={require('../../assets/decrease_time.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain'}}></Image>
          </View>
        </View>
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

class DropDownForNewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder : this.props.placeholder,
      isOpen : false,
      dropDownNotification : '',
    }
  }
  render(){
    return(
      <View>
        <TouchableOpacity disabled = {this.props.disableDropDownTouch} onPress={() => {this.setState({isOpen : !this.state.isOpen ? true : false})}} style={[styles.touchForDropDown]}>
          <Text style={{fontSize : (16), color : '#292929'}}>Select Service (max is 5)</Text>
          <View style={{width:hp('5%') , height:hp('5%'), justifyContent : 'center', alignItems : 'center', position : 'absolute', right : 5 ,top : 7}}>
            <Image source={require('../../assets/dropDown_Icon.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain' }}></Image>
          </View>
        </TouchableOpacity>
          {this.state.isOpen && 
            <ScrollView nestedScrollEnabled style={{elevation : 2, width : '100%', height : this.props.height, position : 'absolute', top : hp('7%'), backgroundColor: '#ffffff', zIndex : 9999}} contentContainerStyle={{borderWidth:1, borderRadius:3, borderColor:'#D0D0D0'}}>
              <FlatList
                data={this.props.listShow}
                keyExtractor={(item, index) => ""+ index}          
                renderItem={({item , index}) =>  
                  <TouchableOpacity onPress={() => {this.props.selectedValue(item); this.setState({isOpen : false})}} style={{height:hp('6.5%') , borderBottomWidth : 1, borderBottomColor : '#D0D0D0', justifyContent : 'center' , alignItems : 'flex-start'}}>
                    <Text style={{color : '#292929' , fontSize : (14), padding : wp('2%')}}>{item.name}</Text>
                  </TouchableOpacity>}     
              />
            </ScrollView>
          }
      </View>
    )
  }
}
