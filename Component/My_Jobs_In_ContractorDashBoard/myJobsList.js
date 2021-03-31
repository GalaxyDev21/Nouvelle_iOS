import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import { connect } from 'react-redux';
import { FalseLoader, GetData, GetContractorWorkSpace} from '../../Redux/createJob/jobAction' ;
import {IS_MORE_CONTRACTOR_MY_JOB_LOADED, GET_CONTRACTOR_MY_JOBS} from '../../Redux/createJob/actionType';
import SpecificJob from './specificJob';

class ContractorMyJobsList extends Component{
    constructor(props){
        super(props);
        this.state = {
          offset : 0,
          title : this.props.navigation.getParam('title','')
        }
    }
    onViewMore = () => {
      this.setState({
        offset : this.state.offset + 10,
      },function(){
        if(this.state.title === 'no stats'){
          var formData = new FormData();
          formData.append('offset', this.state.offset);
          formData.append('limit', 10);
          this.myJobs(formData);
        }
        else{
          var formData = new FormData();
          formData.append('offset', this.state.offset);
          formData.append('limit', 10);
          (this.state.title !== 'Total Jobs Worked' &&  this.state.title !== 'Completed Jobs') && formData.append('filter_days', this.state.title === 'Jobs Pending Today' ? 1 : 7);
          this.myJobs(formData);
        } 
      })
    }
    myJobs = (formData) => {
      this.props.FalseLoader(IS_MORE_CONTRACTOR_MY_JOB_LOADED);
      this.props.GetData(this.state.title === 'Completed Jobs' ? 'my_completed_jobs_of_contractor' : 'my_jobs_of_contractor', GET_CONTRACTOR_MY_JOBS, this.props.userToken, formData);
    }
    render(){
      return(
        <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
          <StatusBar title='MY JOBS' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
            {!this.props.isMoreContractorJobLoaded && 
              <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
                <ActivityIndicator size='small' />
              </View>
            }
            {this.props.isContractorJobListLoaded &&
              <View style={{margin : wp('3%')}}>
                <ScrollView style={{height : hp('85%')}}>
                  {this.props.contractorJobList.length === 0 &&
                    <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                      <Text style={{fontSize : (18), color : '#292929'}}>No Jobs Found</Text>
                    </View>     
                  }
                  {this.props.contractorJobList.length > 0 &&
                    this.props.contractorJobList.map((item , index) => <SpecificJob key={item.ID} item={item} indexNo={item.ID} navigation = {this.props.navigation} getWorkSpace = {this.getWorkSpace}/> )     
                  }
                  { this.props.contractorJobsCount > 10 && this.props.contractorJobList.length < this.props.contractorJobsCount &&
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
            {!this.props.isContractorJobListLoaded &&
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
  contractorJobsCount : state.createJob.contractorJobsCount,
  contractorJobList : state.createJob.contractorJobList ,
  isContractorJobListLoaded : state.createJob.isContractorJobListLoaded,
  isMoreContractorJobLoaded : state.createJob.isMoreContractorJobLoaded
});
export default connect(mapStateToProps, {GetData, FalseLoader, GetContractorWorkSpace })(ContractorMyJobsList);
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