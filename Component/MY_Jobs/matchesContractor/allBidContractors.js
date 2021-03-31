import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , ImageBackground, TextInput, Platform, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import TouchButton from '../../InputFields/touchButton';
import StarRating from 'react-native-star-rating';
import { FalseLoader, GetThoseContractorsWhoseBidOnJob, getPaymentAccountDetails} from '../../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { IS_MORE_BIDDING_CONTRACTORS_LOADED} from '../../../Redux/createJob/actionType';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import SpecificBid from './specificBid';

class AllBidContractors extends Component{
  constructor(props){
    super(props);
    this.state = {
      offset : 0,
    }
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
      formData.append('id', this.props.JobDetails.ID);
        this.props.FalseLoader(IS_MORE_BIDDING_CONTRACTORS_LOADED);
          this.props.GetThoseContractorsWhoseBidOnJob(this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../../assets/my_jobs_bg.jpg')} style={styles.container}> 
        {!this.props.isMoreBiddingContractorsLoaded && 
          <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
            <ActivityIndicator size='small' />
          </View>
        } 
        {
          this.props.isbiddingContractorsOfHostJobLoaded &&
            <View>
              {
                !this.props.biddingContractorsOfHostJob[0] &&
                  <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                    <Text style={{fontSize : (18), color : '#292929'}}>No Bidding Contractors Found</Text>
                  </View>    
              }
              {
                this.props.biddingContractorsOfHostJob[0] &&
                  <View>
                    <ScrollView style={{height : hp('80%'), marginBottom : hp('3%')}}>
                      <Text style={{color : '#292929', fontSize : 18, marginBottom : hp('1%')}}>{`Bids on this job`}</Text>
                        {
                          this.props.biddingContractorsOfHostJob.map((item , index) =>
                            <View style={styles.contractorProfile} key={item.ID}>
                              <SpecificBid item={item} navigation={this.props.navigation}  JobDetails = {this.props.JobDetails}/>
                            </View>
                          )
                        }
                    </ScrollView>
                    {
                      this.props.biddingContractorsOfHostJobCount > 10 && this.props.biddingContractorsOfHostJob.length < this.props.biddingContractorsOfHostJobCount &&
                        <View style={{justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%')}}>
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
                  </View>
              }
            </View>
        }
        {
          !this.props.isbiddingContractorsOfHostJobLoaded &&
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
  biddingContractorsOfHostJobCount : state.createJob.biddingContractorsOfHostJobCount,
  biddingContractorsOfHostJob : state.createJob.biddingContractorsOfHostJob,
  isbiddingContractorsOfHostJobLoaded : state.createJob.isbiddingContractorsOfHostJobLoaded,
  isMoreBiddingContractorsLoaded : state.createJob.isMoreBiddingContractorsLoaded,
});
export default connect(mapStateToProps,{GetThoseContractorsWhoseBidOnJob, FalseLoader})(AllBidContractors);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    padding : wp('3%'),
  },
  contractorProfile : {
    height : hp('20%')
  },
  specificContainer : {
    flex : 1 ,
    backgroundColor : '#f6f6f6' ,
    marginBottom : hp('2%') ,
    flexDirection : 'row' ,
    paddingVertical : hp('1%') ,
    paddingHorizontal : hp('1%')
 },
});

