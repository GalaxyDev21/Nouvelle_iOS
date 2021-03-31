import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , ImageBackground, TextInput, Platform, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import TouchButton from '../InputFields/touchButton';
import StarRating from 'react-native-star-rating';
import { FalseLoader, GetData, GetSampleWorkImages, GetContractorsReviews} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { IS_MORE_BIDDING_CONTRACTORS_LOADED, FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG, GET_THOSE_CONTRTACTORS_WHOSE_BID_ON_JOB} from '../../Redux/createJob/actionType';
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
        this.props.GetData('get_job_bids', GET_THOSE_CONTRTACTORS_WHOSE_BID_ON_JOB, this.props.userToken, formData);
    })
  }
  onViewProfile = (ID, bidder_details) => {
    var formData = new FormData();
    formData.append('id', ID);
    this.props.FalseLoader(FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG);
    this.props.GetSampleWorkImages(this.props.userToken, formData);
    this.props.GetContractorsReviews(this.props.userToken, formData);
    this.props.navigation.navigate('ContractorsDetails', {details : bidder_details})
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}> 
        {!this.props.isMoreBiddingContractorsLoaded && 
          <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
            <ActivityIndicator size='small' />
          </View>
        } 
        {this.props.isbiddingContractorsOfHostJobLoaded &&
          <View>
            {!this.props.biddingContractorsOfHostJob[0] &&
                <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                  <Text style={{fontSize : (18), color : '#292929'}}>No Bidding Contractors</Text>
                </View>    
            }
            {this.props.biddingContractorsOfHostJob[0] &&
              <View>
                <ScrollView style={{height : hp('75'), marginBottom : hp('2%')}}>
                  <Text style={{color : '#292929', fontSize : 18, marginBottom : hp('1%')}}>{`Bids on this job`}</Text>
                  {
                    this.props.biddingContractorsOfHostJob.map((item , index) =>
                      <View style={styles.contractorProfile} key={item.ID}>
                        <SpecificBid item={item} navigation={this.props.navigation}  JobDetails = {this.props.JobDetails} onViewProfile = {this.onViewProfile}/>
                      </View>
                    )
                  }
                  {this.props.biddingContractorsOfHostJobCount > 10 && this.props.biddingContractorsOfHostJob.length < this.props.biddingContractorsOfHostJobCount &&
                    <View style={{justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%')}}>
                      <TouchButton 
                        buttonName = 'View More'
                        actionPerform = {ActionPerformFunc}
                        move = {{doingAction : 'doingAction', action : this.onViewMore}}
                        bgColor = '#8cc63f'
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
          </View>
        }
        {!this.props.isbiddingContractorsOfHostJobLoaded &&
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
export default connect(mapStateToProps,{FalseLoader, GetData, GetSampleWorkImages, GetContractorsReviews})(AllBidContractors);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    padding : wp('3%'),
  },
  contractorProfile : {
    height : hp('22%')
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

class SpecificBid extends Component{
    constructor(props){
      super(props);
        this.state = {
          processing : false,
        }
    }
    render(){
      return(
        <View style={styles.specificContainer}>
          <View style={{marginHorizontal : wp('2%'), height : hp('18%'),  justifyContent : 'center' , alignItems : 'center'}}>
          <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('12%') , width : hp('12%') , borderRadius : 100}}>
              <Image source={{uri : this.props.item.bidder_profile.profile_image}} resizeMode = 'contain' style={{ height : hp('12%') , width : hp('12%')}}/>
          </View>
          </View>
            <View style={{flex : 1, padding : wp('3%')}}>
              <View style={{flexDirection : 'row' , justifyContent : 'space-between' , marginBottom : hp('0.5%')}}>
                <TouchableOpacity onPress={()=>this.props.onViewProfile(this.props.item.bidder_profile.id, this.props.item.bidder_profile)}>
                  <Text style={{color : '#0071bc', fontSize:(17)}}>{this.props.item.bidder_profile.display_name}</Text>
                </TouchableOpacity>  
                  <Text style={{color : '#292929' , fontSize : 15}}>${this.props.item.bid_budget}</Text>
              </View>
              <Text style={{color : '#292929', fontSize : 15, marginBottom : hp('1%') }}>{this.props.item.bidder_profile.project_category[0].name}</Text>
              <View style={{flexDirection : 'row' , marginBottom : hp('1%') , justifyContent : 'space-between'}}>
                <View style={{flexDirection : 'row'}}>
                  <Text style={{color : '#fcb016', fontSize : 14 , marginRight : wp('1%')}}>{parseFloat(this.props.item.bidder_profile.rating_score).toFixed(1)}</Text>
                    <StarRating
                      maxStars={5}
                      fullStarColor='#fcb016'
                      emptyStarColor='#fcb016'
                      disabled = {true}
                      rating={parseFloat(this.props.item.bidder_profile.rating_score)}
                      starSize = {18}
                      starStyle={{marginRight : wp('0.5%')}}
                      containerStyle={{marginRight : wp('1%')}}
                    />
                  </View>
              </View>
            </View>
              { 
                this.props.item.post_status === 'accept' &&
                  <ImageBackground source = {require('../../assets/ribbon.png')} style={{alignItems : 'center', justifyContent : 'center', position : 'absolute', height : 70, width : 60, right : ('15%'), resizeMode : 'contain'}}>
                     <Icon name = 'toys' size = {25} color = 'white'/>
                  </ImageBackground>
              }
        </View>
      )
    }
  }