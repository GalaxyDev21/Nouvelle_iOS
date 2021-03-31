import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import { connect } from 'react-redux';
import { moreFindJobsLoaded, GetAllFindJObsList, FalseLoader, GetData, GetMatchesContractorsOfHostJob, GetThoseContractorsWhoseBidOnJob} from '../../Redux/createJob/jobAction' ;
import { GET_ALL_FIND_JOBS_LIST, FALSE_FIND_JOB_FILTER_LOADER, IS_MORE_FIND_JOBS_LOADED} from '../../Redux/createJob/actionType';
import DropDownField from '../InputFields/dropDown';
import TextInputField from '../InputFields/textInputField';
import TouchButton from '../InputFields/touchButton';
import SpecificJob from './specificJob';

class FindJobs extends Component{
  constructor(props){
      super(props);
      this.state = {
        offset : 0,
        Keyword : '',
        filterService : '',
        service_id : '',
        filterState : '',
        stateID : '',
        KeywordPlaceholder : 'Search Job by Keyword',
        servicePlaceholder : 'Select Service',
        statePlaceholder : 'Any State',
        clearButtonPressed : false,
        applyFilter : false
      }
  }
  onViewMore = () => {
    if(this.state.applyFilter){
      this.setState({
        offset : this.state.offset + 10,
      },function(){
        var formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('limit', 10);
        isNaN(this.state.Keyword) ? formData.append('keyword', this.state.Keyword) : '';
        typeof(this.state.service_id) === 'number' ? formData.append('service_id', this.state.service_id) : '';
        typeof(this.state.stateID) === 'number' ? formData.append('state_id', this.state.stateID) : '';
        this.props.FalseLoader(IS_MORE_FIND_JOBS_LOADED)
        this.props.GetData('find_jobs_contractor', GET_ALL_FIND_JOBS_LIST, this.props.userToken, formData);
      });
    }
    else{
      this.setState({
        offset : this.state.offset + 10,
    },function(){
        var formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('limit', 10);
        this.props.FalseLoader(IS_MORE_FIND_JOBS_LOADED)
        this.props.GetData('find_jobs_contractor', GET_ALL_FIND_JOBS_LIST, this.props.userToken, formData);
      });
    }
  }
  selectState = (value, id) => {
    if(value === 'Any State'){
      this.setState({
        filterState : '',
        stateID : ''
      });
    }
    else{
      this.setState({
        filterState : value,
        stateID : id
      });
    }  
  }
  selectService = (value, id) => {
    if(value === 'Any Service'){
      this.setState({
        filterService : '',
        service_id : ''
     })
    }
    else{
      this.setState({
         filterService : value,
         service_id : id
      })
    }   
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
  clearFilter = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_FIND_JOB_FILTER_LOADER);
    this.props.GetData('find_jobs_contractor', GET_ALL_FIND_JOBS_LIST, this.props.userToken, formData); 
    this.setState({
      KeywordPlaceholder : 'Search Job by Keyword',
      servicePlaceholder : 'Select Service',
      statePlaceholder : 'Any State',
      stateID : '',
      service_id : '',
      Keyword : '',
      clearButtonPressed : true,
      applyFilter : false
    });
  }
  applyFilter = () => {
    this.setState({applyFilter : true});
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    isNaN(this.state.Keyword) ? formData.append('keyword', this.state.Keyword) : '';
    typeof(this.state.service_id) === 'number' ? formData.append('service_id', this.state.service_id) : '';
    typeof(this.state.stateID) === 'number' ? formData.append('state_id', this.state.stateID) : '';
    this.props.FalseLoader(FALSE_FIND_JOB_FILTER_LOADER);
    this.props.GetData('find_jobs_contractor', GET_ALL_FIND_JOBS_LIST, this.props.userToken, formData);
  }
  falseClearButton = () => {
    this.setState({
      clearButtonPressed : false,
      isYesButtonPressed : false
    });
  }
  render(){
    const servicesArr = [{name : 'Any Service', term_id : (Math.max.apply(Math, this.props.availableServiceWithId.map(function(o) {return o.term_id; })))+1}, ...this.props.availableServiceWithId];
    const statesArr = [{name : 'Any State', term_id : (Math.max.apply(Math, this.props.states.map(function(o) {return o.term_id; })))+1}, ...this.props.states];
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
        <StatusBar title='FIND JOBS' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          {!this.props.isMoreFindJobsLoaded && 
            <View style={[{elevation : 15, shadowOpacity : 0.3, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}, Platform.OS === 'ios'?{zIndex : 9}:{}]}>
              <ActivityIndicator size='small' />
            </View>
          }
          {this.props.isFindJobListLoaded &&
            <View style={{margin : wp('2%')}}>
             <View style={[styles.eachField, Platform.OS === 'ios'?{zIndex : 0}:{}]}>
                <Text style={{ color : '#292929', fontSize : 18}}>Service</Text>
                  <DropDownField
                    listShow = {servicesArr}
                    placeholder = {this.state.servicePlaceholder}
                    selectedValue = {this.selectService}
                    clearButton = {this.state.clearButtonPressed}
                    falseClearButton = {this.falseClearButton}
                    name = 'name'
                    id = 'term_id'
                    isObject = {true}
                  />
              </View>
              <View style={[styles.eachField, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                <Text style={{ color : '#292929', fontSize : 18}}>Location</Text>
                  <DropDownField
                    listShow = {statesArr}
                    placeholder = {this.state.statePlaceholder}
                    selectedValue = {this.selectState}
                    clearButton = {this.state.clearButtonPressed}
                    falseClearButton = {this.falseClearButton}
                    name = 'name'
                    id = 'term_id'
                    isObject = {true}
                  />
              </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('1%')}, Platform.OS === 'ios'?{zIndex : -2}:{}]}>      
                <Text style={{fontSize : (18), color: '#292929'}}>Keyword</Text>
                  <TextInputField
                    name = 'Keyword'
                    keyboardType = 'default'
                    placeholder = {this.state.KeywordPlaceholder}
                    placeholderTextColor='#292929'
                    secureTextEntry = {false}
                    multiline = {false}
                    numberOfLines = {1}
                    height = {hp('7%')}
                    onChangeValue = {this.onChange}
                    validityChange = {this.validityCheck}
                    value = {this.state.Keyword}
                  />
              </View>
              <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly', marginBottom : hp('1%')}, Platform.OS === 'ios'?{zIndex : -3}:{}]}>
                <TouchButton 
                  buttonName = 'Clear Filter'
                  actionPerform = {ActionPerformFunc}
                  move = {{doingAction : 'doingAction', action : this.clearFilter}}
                  bgColor = '#0071bc'
                  width = {wp('40%')}
                  height = {hp('7%')}
                  buttonNameSize = {(20)}
                  elevation = {0}
                  navigation = {this.props.navigation}
                />
                <TouchButton 
                  buttonName = 'Apply'
                  actionPerform = {ActionPerformFunc}
                  move = {{doingAction : 'doingAction', action : this.applyFilter}}
                  bgColor = '#8cc63f'
                  width = {wp('40%')}
                  height = {hp('7%')}
                  buttonNameSize = {(20)}
                  elevation = {0}
                  navigation = {this.props.navigation}
                />
              </View>
              {
                this.props.isFindJobFilterLoaded &&
                  <ScrollView style={[{height : hp('45%')}, Platform.OS === 'ios'?{zIndex : -5}:{}]}>
                    {!this.props.findJobsList[0] && <View style={{height : hp('45%'), alignItems : 'center', justifyContent : 'center'}}><Text style={{fontSize : 15}}>No Jobs Found</Text></View>}
                {this.props.findJobsList[0] &&
                  this.props.findJobsList.map((item , index) => <SpecificJob key={item.ID} item={item} indexNo={item.ID} navigation = {this.props.navigation}/> )     
                }
                { this.props.findJobsListCount > 10 && this.props.findJobsList.length < this.props.findJobsListCount &&
                  <View style={{justifyContent : 'center', alignItems : 'center'}}>
                    <TouchButton 
                      buttonName = 'View More'
                      actionPerform = {ActionPerformFunc}
                      move = {{doingAction : 'doingAction', action : this.onViewMore}}
                      bgColor = '#0071bc'
                      width = {wp('40%')}
                      height = {hp('5%')}
                      buttonNameSize = {(15)}
                      elevation = {5}
                      navigation = {this.props.navigation}
                  />
                  </View>
                }
                </ScrollView>
              }
              {
                !this.props.isCoHostFilterLoaded && 
                  <View style={{height : hp('40%'), alignItems:'center',justifyContent:'center'}}>
                  <ActivityIndicator size='large' />
                </View>
              }
            </View>  
          }
          {!this.props.isFindJobListLoaded &&
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator
                  size='large'
                />
              </View>
          }
      </ImageBackground>
    )
  } 
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  findJobsListCount : state.createJob.findJobsListCount,
  findJobsList : state.createJob.findJobsList ,
  isFindJobListLoaded : state.createJob.isFindJobListLoaded,
  isMoreFindJobsLoaded : state.createJob.isMoreFindJobsLoaded,
  states : state.createJob.states,
  availableServiceWithId : state.createJob.servicesForCreateJobWithId,
  isFindJobFilterLoaded : state.createJob.isFindJobFilterLoaded
});
export default connect(mapStateToProps, {
  moreFindJobsLoaded,
  GetAllFindJObsList,
  FalseLoader,
  GetData,
  GetMatchesContractorsOfHostJob, 
  GetThoseContractorsWhoseBidOnJob
})(FindJobs);
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
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center',
  },
  eachField : {
    marginBottom : hp('1%'),
    height : hp('10%'),
  },
});

