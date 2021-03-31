import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CustomStatusBar from '../InputFields/statusBar';
import { connect } from 'react-redux';
import { FalseLoader, GetData, } from '../../Redux/createJob/jobAction';
import { FALSE_PROPERTY_LIST_FLAG, FALSE_MY_JOBS_FLAG, GET_MY_JOBS, EXISTING_PROPERTY } from '../../Redux/createJob/actionType';

class HostStats extends Component {
  moveToScreen = (title) => {
    if(title === 'Properties'){
      this.propertiesScreen();
    }
    // else if(title === 'Invitations'){
    //   return ;
    // }
    else{
      this.myJobs(title);
    }
  }
  propertiesScreen = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_PROPERTY_LIST_FLAG);
    this.props.GetData('existing_property', EXISTING_PROPERTY, this.props.userToken, formData);
    this.props.navigation.navigate('MyPropertyList');
  }
  myJobs = (title) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    title !== 'Total Jobs Posted' && formData.append('filter_days', title === 'Jobs Today' ? 1 : 7);
    console.log(formData);
    this.props.FalseLoader(FALSE_MY_JOBS_FLAG);
    this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
    this.props.navigation.navigate('HostMyJobsList', {title : title});
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/dashboard_bg.jpg')} style={styles.container}>
        <CustomStatusBar title='STATS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('2%')}/>
        {this.props.isDashboardStatsLoaded &&
          <View style={{flex : 1, flexDirection : 'row' , flexWrap : 'wrap', alignItems : 'center' , justifyContent : 'space-between', marginHorizontal : hp('2%'), zIndex : 9 }}>
            <SpecificTask number = {this.props.dashboardStats.total_job} title = 'Total Jobs Posted' moveToScreen = {this.moveToScreen}/>
            <SpecificTask number = {this.props.dashboardStats.today_jobs} title = 'Jobs Today'  moveToScreen = {this.moveToScreen}/>
            <SpecificTask number = {this.props.dashboardStats.week_jobs} title = 'Jobs This Week'  moveToScreen = {this.moveToScreen}/>
            <SpecificTask number = {this.props.dashboardStats.total_property} title = 'Properties'  moveToScreen = {this.moveToScreen}/>
            {/* <SpecificTask number = {this.props.dashboardStats.total_invites} title = 'Invitations'  moveToScreen = {this.moveToScreen}/> */}
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
export default connect(mapStateToProps,{FalseLoader, GetData})(HostStats);
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