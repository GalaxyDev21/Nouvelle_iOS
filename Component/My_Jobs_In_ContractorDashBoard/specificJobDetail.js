import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ScrollView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
//import { connect } from 'react-redux';
export default class JobDetails extends Component {
  render(){
    const timing = JSON.parse(this.props.JobDetails.job_timing);
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
        <ScrollView>
          <View style={{flex : 1, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : wp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginVertical : hp('2%')}}>
            <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}> 
              <Text style={{ color : '#0071BD' , fontSize : (20)}}>{this.props.JobDetails.post_title}</Text>
            </View>
            <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%'), flexWrap : 'wrap'}}>
              <Text style={{color : '#0071bc' , fontSize : (15)}}>Posted</Text>
              <Text style={{ color : '#0071bc' , fontSize : (15), marginLeft : wp('2%')}}>{moment(this.props.JobDetails.post_date).format('MMM DD, YYYY')}</Text>
              <View style={{height : hp('2%'), width : 2, marginHorizontal : wp('2%'), backgroundColor : '#0071bc'}}></View>
              <Text style={{ color : '#0071bc' , fontSize : (15)}}>{this.props.JobDetails.total_bids} bid(s)</Text>
              <View style={{height : hp('2%'), width : 2 , marginHorizontal : wp('2%'), backgroundColor : '#0071bc'}}></View>
              <Text style={{ color : '#0071bc' , fontSize : (15)}}>{this.props.JobDetails.property && this.props.JobDetails.property.state[0] ? this.props.JobDetails.property.state[0].name : ''}</Text>
            </View>
            <View style={{marginBottom : hp('2%')}}>
              <JobInfo heading = 'Job Service: ' value = {this.props.JobDetails.job_service_name}/>
              <JobInfo heading = 'Job Date: ' value = {this.props.JobDetails.job_date}/>
              <JobInfo heading = 'Job Timing: ' value = {timing} />
              <JobInfo heading = 'Job Area: ' value = {this.props.JobDetails.job_area}/> 
            </View>
          </View>
        </ScrollView>
      </ImageBackground>    
    )
  }
}
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  contractorProfile : {
    height : hp('22%')
  },
  contractorContainer : {
    flex : 1 ,
    backgroundColor : '#f6f6f6' ,
    marginBottom : hp('2%') ,
    flexDirection : 'row' ,
    padding : hp('1%') ,
  },
});

function JobInfo(props) {
  return(
    <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}>
      <Image source={require('../../assets/point_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
        <View style={{flexDirection : 'row', alignItems : 'center'}}>
          <Text style={{color : '#0071bc' , fontSize : 16, marginLeft : wp('2%')}}>{props.heading}</Text>
          <Text style={{color : '#292929', fontSize : 14, marginLeft : wp('2%')}}>{props.heading === 'Job Timing: ' ?  props.value.map(el => el +', ') : props.value}</Text>
        </View>
    </View>
  )
}
//{props.heading === 'Job Timing: ' ?  props.value.map(el => el +', ') : props.value}