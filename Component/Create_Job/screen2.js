import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground, TouchableOpacity , Platform, TextInput, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { ChooseService, GetMyJobs } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import {server} from '../../Redux/server';
import axios from 'axios';
import StatusBar from '../InputFields/statusBar' ;
import DropDownField from '../InputFields/dropDown';
import { ScrollView } from 'react-native-gesture-handler';

class CreateJob_Screen2 extends Component{
  constructor(props){
    super(props);
    this.state = {
      serviceId : '',
      serviceName : '' ,
      typeService : '',
      typeServiceNotification : '',
      pickerServices : [],
      isOtherServiceNeed : false,
      isLoaderStart : false
    }
  }   
  selectService = (value , id) => {
    this.setState({serviceName : value , serviceId : id, isOtherServiceNeed : value === 'Other' ? true : false});
  }
  chooseService = async() => {
    if(this.state.isOtherServiceNeed){
      if(this.state.typeService !== ''){
        this.setState({isLoaderStart : true});
        var formData = new FormData();
        formData.append('Category', this.state.typeService);
        const res = await axios.post(server+'add_job_category', formData ,{
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        console.log(res.data);
        if(res.data.code === 200){
          const serviceObj = {
            service_name : this.state.typeService,
            service_id : res.data.data.term_id
          }
          this.storeData(serviceObj);
          this.setState({isLoaderStart : false});
        }
        else if(res.data.code === 201){
          this.setState({isLoaderStart : false});
          ShowBar('Sorry, This service is already exist', 'error');
        }
        else{
          ShowBar('Sorry, Unable to choose other service', 'error');
          this.setState({isLoaderStart : false});
        }
      }
      else{
        this.setState({typeServiceNotification : 'please enter service name' });
      }
    }
    else{
      if(this.state.serviceName){
        const serviceObj = {
          service_name : this.state.serviceName,
          service_id : this.state.serviceId
        }
        this.storeData(serviceObj);  
      }
    }  
  }
  storeData = (obj) => {
    this.props.ChooseService(obj);
    this.props.navigation.navigate('CreateJob_Screen3');
  }
  render(){
    const addOther = [{name : 'Other', term_id : (Math.max.apply(Math, this.props.availableServiceWithId.map(function(o) {return o.term_id; })))+1}, ...this.props.availableServiceWithId];
    return(
      <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
        <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/>
          <ScrollView >
          <View style={{flex : 0.08 , alignItems : 'center' , marginBottom : hp('2%') }}>
            <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (22)}}>Choose the Service</Text>
          </View>
          <View style={{flex : this.state.isOtherServiceNeed ? 0.55 : 0.44 , margin : hp('2%') , backgroundColor : '#ffffff' , borderRadius : hp('1%') , padding : hp('2%')}}>
            <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (18) ,  marginBottom : hp('1%')}}>Select Service</Text>
            <View style = {{marginBottom : hp('2%')}}>
              <DropDownField
                listShow = {addOther}
                placeholder = 'choose service'
                width = {wp('85%')}
                selectedValue = {this.selectService}
                style={{marginBottom : hp('2%')}}
                name = 'name'
                id = 'term_id'
                isObject = {true}
              />
            </View>
            {this.state.isOtherServiceNeed &&
              <View style={{ height : hp('8%'), marginBottom : hp('2%')}}>
                <TextInput placeholder='Enter Other Service' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({typeService : text, typeServiceNotification : ''})} value={this.state.typeService}/>
                <Text style={{ color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12), marginBottom : hp('3%')}}>{this.state.typeServiceNotification}</Text>
              </View>
            }
            <TouchableOpacity style={[styles.TouchableStyle, Platform.OS === 'ios'?{zIndex : -1}:{}]} onPress={this.chooseService}>
              <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20), marginRight : wp('3%')}}>Get a Quote</Text>
              {this.state.isLoaderStart && <ActivityIndicator size ='small' color="#414141"/>}
            </TouchableOpacity>
            <View onPress={this.testRouteStack} style={[{justifyContent : 'center' , alignItems : 'center'}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
              <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (15)}}>It's free with no obligation to hire</Text>
            </View>
          </View>
          </ScrollView>
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  availableServiceWithId : state.createJob.servicesForCreateJobWithId,
});
export default connect(
 mapStateToProps,
 {ChooseService, GetMyJobs}
)(CreateJob_Screen2);

const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch'
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('85%') ,
    backgroundColor : '#8cc63f' ,
    marginBottom : hp('3%'),
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center',
    flexDirection : 'row'
  },
  textInputCon : {
    color : 'black',
    height : hp('7%'),
    fontSize: (13),
    backgroundColor : '#f4f4f4',
    paddingLeft : wp('3%')  
  },
});

