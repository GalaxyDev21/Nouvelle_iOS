import React ,{Component} from 'react';
import { Text, View, ScrollView, Image, AsyncStorage, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import CoHostIntro from './Intro' ;
import MessageAndInvite from './buttons';
import { connect } from 'react-redux';

class Review extends Component{
  constructor(props){
      super(props);
      this.state =  {
        role : ''
      }
  }
  render(){
    return(
      <View style={{flex : 1}}>
        <CoHostIntro details = {this.props.details}/>
        {this.props.isReviewsForContractorLoaded &&
          <View style = {{flex : 1, backgroundColor : '#f4f4f4', padding : hp('2%')}}>
            {this.props.reviewsForContractor && 
              <ScrollView>
                {this.props.reviewsForContractor.map((item , index) => <Reviews key={index} item={item}/>)}
              </ScrollView>
            }
            {!this.props.reviewsForContractor && 
              <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{fontSize : 15, color : '#292929'}}>No Reviews found</Text>
              </View>
            } 
          </View>
          }
          {!this.props.isReviewsForContractorLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator size='large'/>
          </View>
          }
          {this.props.roleIdUserName.coHost === 'no' && 
            <MessageAndInvite navigation = {this.props.navigation} details = {this.props.details} contractorID = {this.props.details.id} name = {this.props.details.display_name} roleIdUserName = {this.props.roleIdUserName}/>  
          }
          </View>
    )
  }
}
const mapStateToProps = state => ({
    userToken : state.createJob.userLoginToken,
    reviewsForContractor : state.createJob.reviewsForContractor,
    isReviewsForContractorLoaded : state.createJob.isReviewsForContractorLoaded,
    roleIdUserName : state.createJob.roleIdUserName
  });
  export default connect(mapStateToProps)(Review);

function Reviews(props) {
    return(
        <View style={{flexDirection : 'row', borderBottomWidth : 1, borderBottomColor : '#d0d0d0', padding : hp('2%')}}>
        <View style={{overflow : 'hidden', height : hp('12%'), width : hp('12%'), borderRadius : 100 , marginRight : wp('2%')}}>
           <Image source={{uri : props.item.profile_image}} resizeMode = 'contain' style={{ height : hp('12%') , width : hp('12%')}}/>
        </View>
          <View>
            <Text style={{color : '#0071bc' , fontSize:(18)}}>{props.item.display_name}</Text>
            <Text style={{color :  '#292929' , fontSize:(14) , marginBottom : hp('1.5%')}}>{props.item.date}</Text>
            <View style={{marginBottom : hp('0.5%'),  width : wp('22%')}}>
              <StarRating
                  maxStars={5}
                  fullStarColor='#fcb016'
                  emptyStarColor='#fcb016'
                  disabled = {true}
                  rating={parseFloat(props.item.rating)}
                  starSize = {15}
              />
              </View>
                <Text style={{color : '#292929', fontSize : 14, marginBottom : hp('2%'),}}>
                   {props.item.comments}
                </Text>
           </View>
       </View>
    )
}
