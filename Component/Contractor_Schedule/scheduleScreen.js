import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import CustomCalendar from '../Schedules/CustomCalendar';
import { connect } from 'react-redux';

class ScheduleCalendarInContractor extends Component{
  constructor(props){
    super(props);
      this.state = {
        isDataLoaded : false,
      }
  }
  onDataLoaded = () => {
    this.setState({isDataLoaded : true})
  }  
  render(){
    return(
      <ImageBackground source={require('../../assets/schedule_bg.jpg')} style={styles.container}>
        <StatusBar title='SCHEDULE' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
          <View style={{backgroundColor : '#ffffff', borderRadius : hp('1%'), padding : wp('2%'), margin : wp('2%')}}>
            {!this.state.isDataLoaded &&
              <View style={{height : hp('49%'), alignItems:'center',justifyContent:'center'}}>
                  <ActivityIndicator size='large'/>
                </View>
            }
            <CustomCalendar width = {90} token = {this.props.userToken} isDataLoaded = {this.state.isDataLoaded} onDataLoaded = {this.onDataLoaded}/>
          </View> 
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken
});
export default connect(mapStateToProps)(ScheduleCalendarInContractor);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
});