import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, Platform, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import moment from 'moment';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import { connect } from 'react-redux';
import {server} from '../../Redux/server';
import NetInfo from "@react-native-community/netinfo";

class JobDetailsInFindJob extends Component {
  constructor(props){
    super(props);
      this.state = {
        budget : '',
        content : '',
        submitProcessing : false,
        processing : false
      }
  }
  componentDidMount(){
    console.log('************ JOB ID **********');
    console.log(this.props.JobDetails.ID);
  }
  onBidJob = () => {
    this.setState({isDailogOpen : true});
  }
  onSubmit = async() => {
   const netInfo = await NetInfo.fetch();
   const isConnected = netInfo.isInternetReachable;
    if(!isConnected){
      ShowBar('Please check your internet connection!','warning');
      return;
    }
    else{
      if(this.state.budget && this.state.content){
        this.setState({submitProcessing : true});
        var formData = new FormData();
        formData.append('id', this.props.JobDetails.ID);
        formData.append('budget', this.state.budget);
        formData.append('content', this.state.content);
        const res = await axios.post(server+'place_bid', formData, {
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        if(res.data.code === 200){
          ShowBar(res.data.data, 'success');
          this.setState({isDailogOpen : false, submitProcessing : false});
          this.props.navigation.navigate('ContractorDashBoard');
        }
        else{
          this.setState({isDailogOpen : false, submitProcessing : false});
          ShowBar("Sorry, Unable to bid on this job", 'error');
        }
      }
      else{
        ShowBar("Fields are required", 'error');
      }
    }  
  }
  onCancelBid = async() => {
    this.setState({isCancelBidDailogOpen : true}); 
  }
  onConfirm = async() => {
    this.setState({processing : true});
      var formData = new FormData();
      formData.append('id', this.props.JobDetails.cancel_bid_id);
      const res = await axios.post(server+'cancel_bid', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      console.log(res.data);
      if(res.data.code === 200){
        ShowBar(res.data.data, 'success');
        this.setState({isCancelBidDailogOpen : false, processing : false});
        this.props.navigation.navigate('ContractorDashBoard');
      }
      else{
        this.setState({isCancelBidDailogOpen : false, processing : false});
        ShowBar("Sorry, Unable to delete your bid", 'error');
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
            { typeof(this.props.JobDetails.cancel_bid_id) == 'string' &&
              <View style = {{marginBottom : hp('2%')}}>
                <TouchButton 
                  buttonName = 'Bid'
                  actionPerform = {ActionPerformFunc}
                  move = {{doingAction : 'doingAction', action : this.onBidJob}}
                  bgColor = '#8cc63f'
                  height = {hp('7%')}
                  marginValue = {wp('2%')}
                  buttonNameSize = {20}
                  navigation = {this.props.navigation}
                />
              </View>
            }
            { typeof(this.props.JobDetails.cancel_bid_id) == 'number' &&
              <View style = {{marginBottom : hp('2%')}}>
                <TouchButton 
                  buttonName = 'Cancel'
                  actionPerform = {ActionPerformFunc}
                  move = {{doingAction : 'doingAction', action : this.onCancelBid}}
                  bgColor = '#0071bd'
                  height = {hp('7%')}
                  marginValue = {wp('2%')}
                  buttonNameSize = {20}
                  navigation = {this.props.navigation}
                />
              </View>
            }
          </View>
          <Dialog
            visible={this.state.isDailogOpen}
            onTouchOutside={() => this.setState({isDailogOpen: false})}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
          > 
            <View>
              <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
                <Text style={{fontSize: (20) , color : '#ffffff' }}>Bid this job</Text> 
              </View>
              <View style={{height : hp('8%'), marginBottom : hp('2%'), marginHorizontal : wp('3%')}}>
                <Text style={{ color : '#292929', fontSize : (18)}}>Your Bid</Text>
                <TextInput value={this.state.budget} onChangeText = {(text) => {this.setState({budget : text})}} placeholder='$' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, textAlignVertical:'top', height : hp('6%')},Platform.OS === 'ios'?{height:hp('6%')}:{}]}/>
              </View> 
              <View style={{height : hp('15%'), marginBottom : hp('1%'), marginHorizontal : wp('3%')}}>
                <Text style={{ color : '#292929', fontSize : (18)}}>Add Notes</Text>
                <TextInput value={this.state.content} onChangeText = {(text) => {this.setState({content : text})}} multiline numberOfLines = {12} placeholder='Text here...' placeholderTextColor="#292929" style={[{color:'black',fontSize:(15), backgroundColor:'#f4f4f4', padding : wp('2%'), borderWidth : 1, borderColor : '#DBDBDB', borderRadius : 2, textAlignVertical:'top', height : hp('12%')},Platform.OS === 'ios'?{height:hp('12%')}:{}]}/>
              </View>
              <View style={{marginBottom : hp('3%'), marginHorizontal : wp('3%')}}>
                <Text>1% Commission for Bid $801 or more</Text>
                <Text style={{marginLeft : -3}}> 1.5% Commission for Bid between $325 to $800</Text>
                <Text style={{marginLeft : -3}}> 2% Commission for Bid between $200 to $324</Text>
                <Text>3% Commission for Bid $199 or less</Text>
              </View>
              <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                <TouchableOpacity onPress={this.onSubmit}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                  <Text style={{color : '#ffffff' , fontSize : (18), marginRight :wp('3%')}}>Submit</Text>
                  {this.state.submitProcessing && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({isDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
                  <Text style={{color : '#ffffff' , fontSize : (20)}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.isCancelBidDailogOpen}
            onTouchOutside={() => this.setState({isCancelBidDailogOpen: false})}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
          > 
            <View>
              <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
                <Text style={{fontSize: (20) , color : '#ffffff' }}>Bid Retraction</Text> 
              </View>
              <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginBottom : hp('1%')}}>Are you sure you want to cancel your bid on this job?</Text>
              <Text style={{color : '#292929', textAlign : 'center', fontSize : (15), marginBottom : hp('2%')}}>Once you cancel the bid, this job will be removed from your working list. However, you can bid this job again after canceling.</Text>
              <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                <TouchableOpacity onPress={this.onConfirm}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                  <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Confirm</Text>
                  {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({isCancelBidDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
                  <Text style={{color : '#ffffff' , fontSize : (20)}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
        </ScrollView>
      </ImageBackground>    
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
});
export default connect(mapStateToProps)(JobDetailsInFindJob);
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
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('40%') ,
    marginBottom : hp('2%'),
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});

function JobInfo(props) {
  return(
    <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}>
      <Image source={require('../../assets/point_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
      <View style={{flexDirection : 'row', alignItems : 'center'}}>
        <Text style={{color : '#0071bc' , fontSize : 16, marginLeft : wp('2%')}}>{props.heading}</Text>
        <Text style={{color : '#292929', fontSize : 14, marginLeft : wp('2%'), flex : 1, flexWrap : 'wrap'}}>{props.heading === 'Job Timing: ' ?  props.value.map(el => el +', ') : props.value}</Text>
      </View>
    </View>
  )
}
//{props.heading === 'Job Timing: ' ?  props.value.map(el => el +', ') : props.value}