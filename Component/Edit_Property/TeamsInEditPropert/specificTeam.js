import React ,{Component} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Image ,ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import { GetSampleWorkImages, GetContractorsReviews, FalseLoader } from '../../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG} from '../../../Redux/createJob/actionType';
class SpecificTeam extends Component{
  constructor(props){
    super(props);
      this.state ={
        checked : false
      }
  }
  onViewProfile = () => {
    var formData = new FormData();
      formData.append('id', this.props.item.bidder_profile.id);
        this.props.FalseLoader(FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG);
          this.props.GetSampleWorkImages(this.props.userToken, formData);
            this.props.GetContractorsReviews(this.props.userToken, formData);
              this.props.navigation.navigate('ContractorsDetails', {details : this.props.item.bidder_profile})
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
            <TouchableOpacity onPress={this.onViewProfile}>
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
                  <Text style={{color : '#0071bc' , fontSize:(15) , marginLeft : wp('1%')}}>Review {this.props.item.bidder_profile.reviews}</Text> 
                </View>
            </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  });
  export default connect(mapStateToProps,{GetSampleWorkImages, GetContractorsReviews, FalseLoader})(SpecificTeam);

const styles = StyleSheet.create({
  specificContainer : {
    flex : 1 ,
    backgroundColor : '#f6f6f6' ,
    marginBottom : hp('2%') ,
    flexDirection : 'row' ,
    paddingVertical : hp('1%') ,
    paddingHorizontal : hp('1%')
},
});
