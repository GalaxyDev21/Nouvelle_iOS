import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CustomStatusBar from '../InputFields/statusBar';
import { connect } from 'react-redux';
import { FalseLoader, GetData, } from '../../Redux/createJob/jobAction';
import { GET_PENDING_INVITATION, FALSE_PENDING_INVITATION_FLAG, FALSE_CONTRACTOR_MY_JOB_LOADER, GET_CONTRACTOR_MY_JOBS } from '../../Redux/createJob/actionType';

class ContractorStats extends Component {
  moveToScreen = (title) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    (title !== 'Total Jobs Worked' &&  title !== 'Completed Jobs') && formData.append('filter_days', title === 'Jobs Pending Today' ? 1 : 7);
    //console.log(formData);
    this.props.FalseLoader(FALSE_CONTRACTOR_MY_JOB_LOADER);
    this.props.GetData(title === 'Completed Jobs' ? 'my_completed_jobs_of_contractor' : 'my_jobs_of_contractor', GET_CONTRACTOR_MY_JOBS, this.props.userToken, formData);
    this.props.navigation.navigate('ContractorMyJobsList', {title : title});
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/dashboard_bg.jpg')} style={styles.container}>
        <CustomStatusBar title='STATS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('2%')}/>
        {this.props.isDashboardStatsLoaded &&
          <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%'), zIndex : 9 }}>
            <SpecificTask number = {this.props.dashboardStats.total_jobs} title = 'Total Jobs Worked' moveToScreen = {this.moveToScreen}/>
            <SpecificTask number = {this.props.dashboardStats.total_completed_job} title = 'Completed Jobs'moveToScreen = {this.moveToScreen}/>
            <SpecificTask number = {this.props.dashboardStats.today_jobs} title = 'Jobs Pending Today' moveToScreen = {this.moveToScreen}/>
            <SpecificTask number = {this.props.dashboardStats.week_jobs} title = 'Pending Jobs This Week' moveToScreen = {this.moveToScreen}/>
          </View>
        }
        {!this.props.isDashboardStatsLoaded &&
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
  userName : state.createJob.userName,
  dashboardStats : state.createJob.dashboardStats,
  isDashboardStatsLoaded : state.createJob.isDashboardStatsLoaded,
});
export default connect(mapStateToProps, {FalseLoader, GetData})(ContractorStats);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch'
  }
});

function SpecificTask(props) {
  return(
    <TouchableOpacity onPress={()=>props.moveToScreen(props.title)} elevation = {15} style={{justifyContent : 'center', width : wp('45%'), height : hp('16%'), marginBottom : hp('2%'), borderRadius : hp('1%'), backgroundColor : '#ffffff', padding : wp('3%')}}>
      <Text style={{ fontSize: 20 , color : '#8cc63f', marginBottom : hp('1%')}}>{props.number}</Text>
      <Text style={{ fontSize: 18 , color : '#292929'}}>{props.title}</Text>
    </TouchableOpacity>
  )
}