import React ,{Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import moment from 'moment';
import { connect } from 'react-redux';
import { FalseLoader, GetMatchesContractorsOfHostJob, GetData, GetHostWorkSpace } from '../../Redux/createJob/jobAction' ;
import { FALSE_GET_MATCHES_CONTRACTORS_OF_HOST_JOB_FLAG, GET_MATCHES_CONTRACTORS_OF_HOST_JOB, GET_PROPERTY_CHECKLIST, GET_THOSE_CONTRTACTORS_WHOSE_BID_ON_JOB} from '../../Redux/createJob/actionType';

class SpecificJob extends Component {
  viewDetails = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    formData.append('service_id', this.props.item.job_service);
    this.props.FalseLoader(FALSE_GET_MATCHES_CONTRACTORS_OF_HOST_JOB_FLAG);
    this.props.GetData('job_matches', GET_MATCHES_CONTRACTORS_OF_HOST_JOB, this.props.userToken, formData); 
    this.getBiddingContractor();
    this.getPropertyChecklist();
    this.getWorkSpace();
    this.props.navigation.navigate('TabViewOfJobDetails', {jobDetails : this.props.item});
  }
  getBiddingContractor = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    formData.append('id', this.props.item.ID);
    this.props.GetData('get_job_bids', GET_THOSE_CONTRTACTORS_WHOSE_BID_ON_JOB, this.props.userToken, formData);
  }
  getPropertyChecklist = (ID) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    formData.append('id', this.props.item.property.ID); 
    this.props.GetData('get_check_lists_of_property', GET_PROPERTY_CHECKLIST, this.props.userToken, formData);
  }
  getWorkSpace = () => {
    var formData = new FormData();
    formData.append('id', this.props.item.ID);
    this.props.GetHostWorkSpace(this.props.userToken, formData);
  }
  render(){
    return(
      <View style={{backgroundColor : '#f4f4f4', borderRadius : wp('1%'), borderWidth : 1, borderColor : '#dbdbdb' , marginBottom : hp('2%'), padding : wp('2%')}}>
        <View style={{ marginBottom : hp('1%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}> 
          <Text style={{ color : '#0071BD' , fontSize : (18), flexWrap : 'wrap', width : wp('65%')}}>{this.props.item.post_title}</Text>
          <Text style={{ color : '#292929' , fontSize : (15)}}>{this.props.item.post_status === 'publish' ? 'Active' : this.props.item.post_status === 'complete'  ? 'Completed' : this.props.item.post_status === 'close' ? 'Processing' : this.props.item.post_status === 'disputed' ? 'Resolved' : this.props.item.post_status === 'draft' ? 'Draft' : 'Disputed'}</Text>
        </View>
        <Text style={{marginBottom : hp('1%'), color : '#292929' , fontSize : 16}}>Description:  {this.props.item.post_content}</Text>
        <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%'), flexWrap : 'wrap'}}>
          <Text style={{color : '#0071bc' , fontSize : (15)}}>Posted</Text>
          <Text style={{ color : '#0071bc' , fontSize : (15), marginLeft : wp('2%')}}>{moment(this.props.item.post_date).format('MMM DD, YYYY')}</Text>
          <View style={{height : hp('2%'), width : 2, marginHorizontal : wp('2%'), backgroundColor : '#0071bc'}}></View>
          <Text style={{ color : '#0071bc' , fontSize : (15)}}>{this.props.item.total_bids} bid(s)</Text>
          <View style={{height : hp('2%'), width : 2 , marginHorizontal : wp('2%'), backgroundColor : '#0071bc'}}></View>
          <Text style={{ color : '#0071bc' , fontSize : (15)}}>{this.props.item.property && this.props.item.property.state[0] ? this.props.item.property.state[0].name : ''}</Text>
        </View>
        <TouchButton 
          buttonName = 'View Details'
          actionPerform = {ActionPerformFunc}
          move = {{doingAction : 'doingAction', action : this.viewDetails}}
          bgColor = '#8cc63f'
          width = {wp('33%')}
          height = {hp('4%')}
          marginValue = {wp('2%')}
          buttonNameSize = {12}
          navigation = {this.props.navigation}
        />
      </View>      
    )
  }
}

const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
});
export default connect(mapStateToProps,{
  FalseLoader, 
  GetMatchesContractorsOfHostJob,
  GetData,
  GetHostWorkSpace
})(SpecificJob);