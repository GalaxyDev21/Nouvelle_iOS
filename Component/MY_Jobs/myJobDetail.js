import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import axios from 'axios';
import ShowBar from '../validations/messageBar';
import {server} from '../../Redux/server';
import { connect } from 'react-redux';
import { DeleteJob} from '../../Redux/createJob/jobAction';
import { Dialog} from 'react-native-simple-dialogs';

class JobDetails extends Component {
  constructor(props){
    super(props);
      this.state = {
        processing : false,
        deleteDialogOpen : false
      }
  }
  onDeleteJob = async () => {
    this.setState({processing : true})
    var formData = new FormData();
    formData.append('id', this.props.JobDetails.ID);
    try{
      const res = await axios.post(server+'delete_job', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code === 200){
        ShowBar('Job Deleted Successfully', 'success');
        this.props.DeleteJob(this.props.JobDetails.ID);
        this.setState({processing : false, deleteDialogOpen : false});
        this.props.navigation.goBack();
      }
      else{
        ShowBar('Sorry, Unable to delete job', 'error');
        this.setState({processing : false, deleteDialogOpen : false});
      }
    }
    catch(error){
      ShowBar('Sorry, Unable to delete job', 'error');
      this.setState({processing : false, deleteDialogOpen : false})
    }
  }
  render(){
    const timing = JSON.parse(this.props.JobDetails.job_timing);
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
        <ScrollView>
          <View style={{flex : 1, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : wp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginVertical : hp('2%')}}>
            <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}> 
              <Text style={{ color : '#0071BD' , fontSize : (20)}}>{this.props.JobDetails.post_title}</Text>
            </View>
            <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%'), flexWrap : 'wrap' }}>
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
            <View style = {{marginBottom : hp('2%')}}>
              <TouchableOpacity onPress={()=>{console.log(this.props.JobDetails.ID); this.setState({deleteDialogOpen : true})}} activeOpacity = {0.5} style={{ backgroundColor : '#8CC63E', flexDirection : 'row', alignItems: 'center', justifyContent : 'center', height : hp('7%'), borderRadius : hp('5%'), marginBottom : hp('2%')}}>
                <Text style={{ color : '#ffffff', fontSize : 18}}>Delete Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Dialog
          visible={this.state.deleteDialogOpen}
          dialogStyle={{borderRadius: 10, overflow: 'hidden'}}
          contentStyle={{borderRadius: 10, overflow: 'hidden', padding : 0 , paddingBottom : 0, backgroundColor : '#ffffff'}}
        > 
          <View>
            <View style={{justifyContent : 'center', alignItems : 'center'}}>
              <Image source={require('../../assets/delete_group_icon.png')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
            </View>
            <View style={{alignItems : 'center'}}>
              <View style={{width  :wp('70%')}}>
                <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to delete this job?</Text>
              </View>
            </View>
            <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
              <TouchableOpacity onPress={this.onDeleteJob} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                <Text style={{ color : '#ffffff', fontSize : (18), marginRight : wp('3%')}}>Yes</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({deleteDialogOpen : false})} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071BD'}}>
                <Text style={{color : '#ffffff', fontSize : (18)}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog> 
      </ImageBackground>    
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken
});
export default connect(mapStateToProps,{DeleteJob})(JobDetails);
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
    <View style={{flexDirection : 'row', marginBottom : hp('1%')}}>
      <Image source={require('../../assets/point_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
      <Text style={{color : '#0071bc' , fontSize : 16, marginLeft : wp('2%')}}>{props.heading}</Text>
      <Text style={{color : '#292929', fontSize : 14, marginLeft : wp('2%'), flex : 1, flexWrap : 'wrap'}}>{props.heading === 'Job Timing: ' ?  props.value.map(el => el +', ') : props.value}</Text>
    </View>
  )
}