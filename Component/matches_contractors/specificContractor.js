import React ,{Component} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , Image ,ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import { FalseLoader, GetSampleWorkImages, GetContractorsReviews, GetData } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG, GET_MY_JOBS } from '../../Redux/createJob/actionType';
import GetAQuotePopup from './Contractors_Details/quoteDailog';

class SpecificContractors extends Component{
  constructor(props){
    super(props);
    this.state = {
      isDialogOpen : false,
    }
  }
  onViewProfile = () => {
    var formData = new FormData();
    formData.append('id', this.props.item.id);
    this.props.FalseLoader(FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG);
    this.props.GetSampleWorkImages(this.props.userToken, formData);
    this.props.GetContractorsReviews(this.props.userToken, formData);
    this.props.navigation.navigate('ContractorsDetails', {details : this.props.item});
    if(this.props.hostMyJobs.length === 0){
      this.getJobs();
    }
  }
  getJobs = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
  }
  closeDialog = () => {
    this.setState({
      isDialogOpen : false
    })
  }
  isJobSelected = (value) => {
    this.setState({
      job : value,
      isDialogOpen : false
    })
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={{marginRight : wp('2%')}} >
          <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('12%') , width : hp('12%') , borderRadius : 100 , marginBottom : hp('2%')}}>
            <Image source={{uri : this.props.item.profile_image}} resizeMode = 'contain' style={{ height : hp('12%') , width : hp('12%')}}/>
          </View> 
          <TouchableOpacity style={{ backgroundColor : '#0071bc' , justifyContent : 'center' , alignItems : 'center' , height : hp('3%') , borderRadius : wp('4%')}} onPress={this.onViewProfile}>
            <Text style={{color : 'white', fontSize:(12)}}>View Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex : 1 , marginLeft : wp('1%') }}>
          <View style={{flex : 0.25 ,  flexDirection : 'row' , justifyContent : 'space-between' , marginBottom : hp('0.5%')}}>
            <Text style={{color : '#0071bc' , fontSize:(18)}}>{this.props.item.display_name}</Text>
            <Text style={{color : '#292929' , fontSize:(16)}}>${this.props.item.hour_rate === '' ? 0 : this.props.item.hour_rate}</Text>
          </View>
          <View style={{flex : 0.25 ,flexDirection : 'row' , marginBottom : hp('0.5%') , justifyContent : 'space-between'}}>
            <View style={{flexDirection : 'row'}}>
              <Text style={{color : '#fcb016', fontSize:(14) , marginRight : wp('1%')}}>{parseFloat(this.props.item.rating_score).toFixed(1)}</Text>
                <StarRating
                  maxStars={5}
                  fullStarColor='#fcb016'
                  emptyStarColor='#fcb016'
                  disabled = {true}
                  rating={parseFloat(this.props.item.rating_score)}
                  starSize = {13}
                  starStyle={{marginRight : wp('0.5%')}}
                  containerStyle={{marginRight : wp('1%')}}
                />
                <Text style={{color : '#292929' ,  fontSize:(14) , marginRight : wp('1%')}}>{this.props.item.reviews}</Text>
            </View>
            {
              !this.props.item.hour_rate &&
                <TouchableOpacity onPress={() => this.setState({isDialogOpen : true})}>
                  <Text style={{color : '#292929' , fontSize:(14), color : '#8cc63f'}}>Contact for quote</Text>
                </TouchableOpacity>
            }
          </View>
          <View style={{flex : 0.25, flexDirection : 'row', alignItems : 'center', marginBottom : hp('0.5%')}}>
            <Image source={require('../../assets/location-icon.png')} style={{height : hp('3%') , width: hp('3%') , marginRight:wp('1.5%')}} resizeMode='contain'/>
              <Text style={{color : '#292929' , fontSize:(14)}}>{this.props.item.state.name}, {this.props.item.et_zipcode}</Text>
          </View>
          <View style={{flex : 0.25, flexDirection : 'row', alignItems : 'center', marginBottom : hp('0.5%')}}>
            <Image source={require('../../assets/Nouvelle_Contractors.png')} style={{height : hp('3%') , width: hp('3%') , marginRight:wp('1.5%')}} resizeMode='contain'/>
              <Text style={{color : '#292929' , fontSize:(14)}}>{this.props.item.et_experience} years in business</Text>
          </View>
          <View style={{flex : 0.25 , flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center' , marginBottom : hp('0.5%')}}>
            <View style={{flex : 0.6 , flexDirection: 'row' , alignItems : 'center' }}>
              <Image source={require('../../assets/shack_hand_icon.png')} style={{height : hp('3%') , width: hp('3%') , marginRight:wp('1.5%')}} resizeMode='contain'/>
              <Text style={{color : '#292929' , fontSize:(14)}}>{this.props.item.total_projects_worked} hires on Nouvelle</Text>
            </View>       
          </View>
        </View>
        <GetAQuotePopup isDialogOpen = {this.state.isDialogOpen} closeDialog = {this.closeDialog} isJobSelected ={this.isJobSelected}/>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  hostMyJobs : state.createJob.hostMyJobs
});
export default connect(mapStateToProps,{FalseLoader, GetSampleWorkImages, GetContractorsReviews, GetData})(SpecificContractors);

const styles = StyleSheet.create({
  container : {
    flex : 1 ,
      backgroundColor : '#f6f6f6' ,
      marginBottom : hp('2%') ,
      flexDirection : 'row' ,
      paddingVertical : hp('1%') ,
      paddingHorizontal : hp('1%')
    },
});