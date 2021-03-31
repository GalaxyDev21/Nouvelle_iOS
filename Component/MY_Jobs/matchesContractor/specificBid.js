import React ,{Component} from 'react';
import { StyleSheet, Text, View ,TextInput, Platform, ScrollView, ImageBackground, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import TouchButton from '../../InputFields/touchButton';
import StarRating from 'react-native-star-rating';
import { getPaymentAccountDetails, GetSampleWorkImages, GetContractorsReviews, FalseLoader } from '../../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG} from '../../../Redux/createJob/actionType';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { Icon } from 'react-native-elements';
// import axios from 'axios';
// import ShowBar from '../../validations/messageBar' ;
// import {server} from '../../../Redux/server';

class SpecificBid extends Component{
  constructor(props){
    super(props);
    this.state = {
      processing : false,
      isDailogOpen : false
    }
  }
  onAcceptBid = () => {
    console.log(`**************** ${this.props.item.ID} ****************`);
    var formData = new FormData();
    formData.append('id', this.props.item.ID);
    this.props.getPaymentAccountDetails(this.props.userToken, formData);
    this.setState({isDailogOpen : true});
  }
  // acceptBidButtonPressed = async() => {
  //   this.setState({processing : true});
  //   var formData = new FormData();
  //   formData.append('id', this.props.item.ID);
  //   const res = await axios.post(server+'accept_bid', formData ,{
  //     headers : {'Authorization': 'Bearer '+ this.props.userToken,},
  //   });
  //   // console.log('*********** accept bid response **********');
  //   // console.log(res.data);
  //   if(res.data.code === 200){
  //     ShowBar(res.data.data, 'success');
  //     this.setState({isDailogOpen : false});
  //     this.props.navigation.navigate('HostDashBoard');
  //   }
  //   else{
  //     this.setState({processing : false});
  //     ShowBar("Please try Again", 'error');
  //   }
  // }
  onViewProfile = () => {
    var formData = new FormData();
    formData.append('id', this.props.item.bidder_profile.id);
    this.props.FalseLoader(FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG);
    this.props.GetSampleWorkImages(this.props.userToken, formData);
    this.props.GetContractorsReviews(this.props.userToken, formData);
    this.props.navigation.navigate('ContractorsDetails', {details : this.props.item.bidder_profile})
  }
  componentDidMount(){
    console.log('************ post_status *************');
    console.log("Job Stats = " +this.props.JobDetails.post_status);
    console.log(this.props.item.post_title);
    console.log(this.props.item.post_status);
    console.log(this.props.item.post_type);
    console.log('*************************');
  }
  render(){
    return(
      <View style={styles.specificContainer}>
        <View style={{marginHorizontal : wp('2%'), height : hp('18%'),  justifyContent : 'center' , alignItems : 'center'}}>
          <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('12%') , width : hp('12%') , borderRadius : 100}}>
          <Image source={{uri : this.props.item.bidder_profile.profile_image}} resizeMode = 'contain' style={{ height : hp('12%') , width : hp('12%')}}/>
        </View>
        </View>
        <View style={{flex : 1, paddingHorizontal : wp('2%'), paddingVertical : wp('1%')}}>
          <View style={{flexDirection : 'row' , justifyContent : 'space-between' , marginBottom : hp('0.5%')}}>
            <TouchableOpacity onPress={this.onViewProfile}>
              <Text style={{color : '#0071bc', fontSize:(17), width : wp('40%'), flexWrap : 'wrap'}}>{this.props.item.bidder_profile.display_name}</Text>
            </TouchableOpacity>
            <Text style={{color : '#292929' , fontSize : 15}}>${this.props.item.bid_budget}</Text>
          </View>
          <Text style={{color : '#292929', fontSize : 15, marginBottom : hp('1%') }}>{this.props.item.bidder_profile.project_category[0].name}</Text>
          {/* <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('0.5%')}}>
            <Image source={require('../../../assets/location-icon.png')} style={{height : hp('3%') , width: hp('3%') , marginRight:wp('1.5%')}} resizeMode='contain'/>
            <Text style={{color : '#292929' , fontSize: 14}}>{this.props.item.bidder_profile.state.name}, {this.props.item.bidder_profile.et_zipcode}</Text>
          </View> */}
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
          { this.props.JobDetails.post_status === 'publish' &&
            <View style = {{marginBottom : hp('2%')}}>
              <TouchButton 
              buttonName = 'Accept Bid'
              actionPerform = {ActionPerformFunc}
              move = {{doingAction : 'doingAction', action : this.onAcceptBid}}
              bgColor = '#8cc63f'
              width = {wp('33%')}
              height = {hp('4%')}
              marginValue = {wp('2%')}
              buttonNameSize = {12}
              navigation = {this.props.navigation}
              />
            </View>
          }
        </View>
        <Dialog
          visible={this.state.isDailogOpen}
          onTouchOutside={() => this.setState({isDailogOpen: false})}
          dialogStyle={{borderRadius: 10, padding : 0 , overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
        > 
          <View style={{height : hp('50%')}}>
            {this.props.isPaymentAccountDetailsLoaded &&
              <View style={{justifyContent : 'space-between',  height : hp('50%')}}>
                <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
                  <Text style={{fontSize: (18) , color : '#ffffff' }}>Bid Acceptance Confirmation</Text> 
                </View>
                <ScrollView style={{padding : '3%'}}>
                  <Text style={{flexWrap : 'wrap', fontSize : 16, marginBottom : hp('2%')}}>You are about to accept this bid for <Text>{`${this.props.paymentAccoutDetails.budget}$.`}</Text>This bid acceptance requires the payment below </Text> 
                  <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('1%')}}>
                    <Text style={{fontSize : 16}}>Bid Budget</Text>
                    <Text style={{fontSize : 15, fontWeight : 'bold'}}>{`${this.props.paymentAccoutDetails.budget}$`}</Text>
                  </View>
                  <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('2%')}}>
                    <Text style={{fontSize : 16}}>Commission</Text>
                    <Text style={{fontSize : 16, fontWeight : 'bold'}}>{`${this.props.paymentAccoutDetails.commission}$`}</Text>
                  </View>
                  <View style={{height : 1, backgroundColor : '#292929', marginBottom : hp('2%')}}></View>
                  <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between',}}>
                    <Text style={{fontSize : 16}}>Total</Text>
                    <Text style={{fontSize : 16, color  : '#0071bc', fontWeight : 'bold'}}>{`${this.props.paymentAccoutDetails.total}$`}</Text>
                  </View>
                  {/* <View style={{flexDirection : 'row', alignItems : 'center'}}>
                    <Text style={{fontSize : 16}}>Your credit balance:</Text> 
                    <Text style={{fontWeight : 'bold', fontSize : 16}}> {`${Math.round(this.props.paymentAccoutDetails.available_credit)}$`}</Text>
                  </View>
                  <Text style={{fontSize : 16, marginBottom : hp('2%')}}>Credits in your account will be deducted to make the payment</Text> */}
                </ScrollView>
                <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderBottomLeftRadius : 10, borderBottomRightRadius : 10,  borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                  <TouchableOpacity onPress={()=>{this.setState({isDailogOpen : false}); this.props.navigation.navigate('AcceptBid', {bidID : this.props.item.ID})}}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                    <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Accept Bid</Text>
                    {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({isDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
                    <Text style={{color : '#ffffff' , fontSize : (18)}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            {!this.props.isPaymentAccountDetailsLoaded && 
              <View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                <ActivityIndicator size='large' />
              </View>
            }
          </View>
        </Dialog>
        { this.props.item.post_status === 'accept' &&
          <ImageBackground source = {require('../../../assets/ribbon.png')} style={{alignItems : 'center', justifyContent : 'center', position : 'absolute', height : 70, width : 60, right : ('12%'), resizeMode : 'contain'}}>
              <Icon name = 'toys' size = {25} color = 'white'/>
          </ImageBackground>
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  paymentAccoutDetails : state.createJob.paymentAccoutDetails,
  isPaymentAccountDetailsLoaded : state.createJob.isPaymentAccountDetailsLoaded
});
export default connect(mapStateToProps,{getPaymentAccountDetails, GetSampleWorkImages, GetContractorsReviews, FalseLoader})(SpecificBid);
const styles = StyleSheet.create({
  specificContainer : {
    flex : 1 ,
    backgroundColor : '#f6f6f6' ,
    marginBottom : hp('2%') ,
    flexDirection : 'row' ,
    paddingVertical : wp('1%') ,
    paddingHorizontal : wp('2%')
  },
  absoluteView : {
    height : hp('4%') ,
    width : wp('33%'),
    borderRadius : hp('5%') , 
    alignItems : 'center' ,
    justifyContent : 'center' , 
    borderColor : '#0071bc',
    borderWidth : 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position : 'absolute'
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('40%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});