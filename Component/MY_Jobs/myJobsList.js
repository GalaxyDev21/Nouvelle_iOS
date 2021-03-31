import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import { connect } from 'react-redux';
import { GetMyJobs,FalseLoader, GetData } from '../../Redux/createJob/jobAction' ;
import { IS_MORE_CONTRACTORS_LOADED, GET_MY_JOBS } from '../../Redux/createJob/actionType';
import SpecificJob from './specificJob';
import AbsoluteLoader from '../InputFields/absolutLoader';

class HostMyJobsList extends Component {
  constructor(props){
    super(props);
      this.state = {
        offset : 0,
        isViewMoreButton : false,
        title : this.props.navigation.getParam('title', '')
      }
  }
  viewDetails = () => {
    this.props.navigation.navigate('CreateJob_Screen1');
  }
  onViewMore = () => {
    console.log('Length = '+this.props.hostMyJobs.length);
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      if(this.state.title === 'no stats'){
        console.log('If condition satisfied');
        var formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('limit', 10);
        this.myJobs(formData);
      }
      else{
        console.log('Else condition satisfied');
        var formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('limit', 10);
        this.state.title !== 'Total Jobs Posted' && formData.append('filter_days', this.state.title === 'Jobs Today' ? 1 : 7);
        this.myJobs(formData);
      }
    })
  }
  myJobs = (formData) => {
    console.log('FormData in myJobs function');
    console.log(formData);
    this.props.FalseLoader(IS_MORE_CONTRACTORS_LOADED);
    this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
        <StatusBar title='MY JOBS' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          {!this.props.isMoreContractorsLoaded && 
            <AbsoluteLoader/>
          }
          {this.props.isHostMyJobsLoaded &&
            <View style={{margin : wp('3%')}}>
              <View style={{alignItems : 'flex-end', marginBottom : hp('2%')}}>
                <TouchButton 
                  buttonName = 'Add New Job'
                  actionPerform = {ActionPerformFunc}
                  move = {{doingAction : 'doingAction', action : this.viewDetails}}
                  bgColor = '#8cc63f'
                  width = {wp('40%')}
                  height = {hp('7%')}
                  buttonNameSize = {(18)}
                  elevation = {5}
                  navigation = {this.props.navigation}
                />
              </View>
              <ScrollView style={{height : hp('76%'), marginBottom : hp('2%')}}>
                {this.props.hostMyJobs.length > 0 &&
                  this.props.hostMyJobs.map((item , index) => <SpecificJob key={item.ID} item={item} indexNo={item.ID} navigation = {this.props.navigation}/>)     
                }
                {this.props.hostMyJobs.length === 0 &&
                  <View style={{alignItems : 'center' , justifyContent : 'center',height : hp('70%') }}>
                    <Text style={{fontSize : 18, color : '#292929'}}>No Jobs Found</Text>
                  </View>     
                }
                {this.props.hostCreatedJobCount > 10 && this.props.hostMyJobs.length < this.props.hostCreatedJobCount &&
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
            </View>
          }
          {!this.props.isHostMyJobsLoaded &&
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
  hostCreatedJobCount : state.createJob.hostCreatedJobCount,
  hostMyJobs : state.createJob.hostMyJobs,
  isHostMyJobsLoaded : state.createJob.isHostMyJobsLoaded,
  isMoreContractorsLoaded : state.createJob.isMoreContractorsLoaded
});
export default connect(mapStateToProps,{GetMyJobs, FalseLoader, GetData})(HostMyJobsList);
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
});
