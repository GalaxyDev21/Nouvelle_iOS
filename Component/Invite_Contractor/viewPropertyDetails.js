import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
//import moment from 'moment';
//import { connect } from 'react-redux';
export default class ViewPropertyDetails extends Component {
  constructor(props){
    super(props);
      this.state = {
        details : this.props.navigation.getParam('details' , ''),
      }
    }
    render(){
      const timing = JSON.parse(this.state.details.job_timing);
      return(
        <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
          <StatusBar title='PROPERTY DETAILS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('4%')}/>
            <View style={{ backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : wp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginBottom : hp('2%')}}>
              <View style={{width : '100%', alignItems : 'center'}}>
                <View style={{height : hp('30%'), width : hp('27%'), borderRadius : 100, marginBottom : hp('1%')}}>
                {
                  this.state.details.property.property_image === "" && <Image source={require('../../assets/by_default_property.jpg')} style={{height : hp('30%'), width : hp('27%'), resizeMode : 'stretch'}}/>
                }
                {
                  this.state.details.property.property_image !== "" && <Image source={{ uri: this.state.details.property.property_image }} style={{height : hp('30%'), width : hp('27%'), resizeMode : 'stretch'}} />
                }
                </View>
                <Text style={{fontSize : 15, color : '#292929', textAlign : 'center', marginBottom : hp('2%')}}>Property Image</Text>
              </View>
              <View style={{marginBottom : hp('2%')}}>
                <JobInfo heading = 'Job Title: ' value = {this.state.details.post_title} />
                <JobInfo heading = 'Posted Date: ' value = {this.state.details.post_date}/>
                <JobInfo heading = 'Job Date: ' value = {this.state.details.job_date}/>
                <JobInfo heading = 'Job Timing: ' value = {timing}/>
                <JobInfo heading = 'Job Service: ' value = {this.state.details.job_service_name}/>
                <JobInfo heading = 'Job Area: ' value = {this.state.details.job_area}/>
                <JobInfo heading = 'Total Bids: ' value = {this.state.details.total_bids}/>
                <JobInfo heading = 'Job Area: ' value = {this.state.details.job_area}/>
              </View>
            </View>
        </ImageBackground>    
    )
  }
}
const styles = StyleSheet.create({
  container : {
      flex : 1 ,
      resizeMode : 'stretch',
   },
})

function JobInfo(props) {
  return(
    <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}>
      <Image source={require('../../assets/point_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
        <View style={{flexDirection : 'row', alignItems : 'center'}}>
          <Text style={{color : '#0071bc' , fontSize : 18, marginLeft : wp('2%')}}>{props.heading}</Text>
          <Text style={{color : '#292929', fontSize : 16, marginLeft : wp('2%'), flex : 1, flexWrap : 'wrap'}}>{props.heading === 'Job Timing: '? props.value.map((item) => item +', ' ) : props.value === '' ? '' : props.value}</Text>
        </View>
    </View>
  )
}