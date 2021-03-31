import React ,{Component} from 'react';
import { StyleSheet, Text, View , Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import TouchButton from '../InputFields/touchButton';
import ActionPerformFunc from '../InputFields/actionPerform';
import {checkAndCreateRoom} from '../Create_Chat_Room/checkAndCreateRoom';
import { FalseLoader, GetSampleWorkImages, GetContractorsReviews, GetData } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG, GET_MY_JOBS } from '../../Redux/createJob/actionType';
class SpecificTeam extends Component{
  constructor(props){
      super(props);
      this.state = {
        isStartMessages : false
      }
    }
    chatScreen = () => {
      this.setState({isStartMessages : true});
      checkAndCreateRoom(this.props.item.display_name, this.props.item.id, this.props.item.roles, this.props.roleIdUserName).then(res =>{
        this.props.navigation.navigate('ChatScreen', {room : res});
        this.setState({ 
          isStartMessages : false
        });
      });
    }
    onViewProfile = () => {
      console.log('ID'+this.props.item.id);
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
    render(){
      const description = this.props.item.description === '' ? 'No description added' : this.props.item.description.replace(/(<([^>]+)>)/g, "");
      return(
        <View style={styles.container}>
          <View style={{marginLeft : wp('2%'), height : hp('21%'),  justifyContent : 'center' , alignItems : 'center'}}>
            <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('14%') , width : hp('14%') , borderRadius : 100}}>
              <Image source={{ uri : this.props.item.profile_image}} resizeMode = 'contain' style={{ height : hp('14%') , width : hp('14%')}}/>
            </View>
          </View>
            <View style={{flex : 1, paddingVertical : wp('1%'), paddingHorizontal : wp('2%'),}}>
            <TouchableOpacity onPress={this.onViewProfile}> 
              <Text style={{color : '#0071bc' , fontSize:(18), marginBottom : wp('1%')}}>{this.props.item.display_name}</Text>
            </TouchableOpacity>
                <Text style={{color : '#292929' , fontSize:(16), marginBottom : wp('1%')}}>{this.props.item.et_professional_title}</Text>
                  <StarRating
                    maxStars={5}
                    fullStarColor='#fcb016'
                    emptyStarColor='#fcb016'
                    disabled = {true}
                    rating={parseFloat(this.props.item.rating_score)}
                    starSize = {15}
                    containerStyle={{ width : wp('22%')}}
                  />
                  <Text style={{color : '#292929' , fontSize : (14), marginVertical : wp('1%')}}>Description: {description}</Text>     
                    <View style={{marginBottom : hp('1%')}}>
                      <TouchButton 
                        buttonName = 'Message'
                        actionPerform = {ActionPerformFunc}
                        move = {{doingAction : 'doingAction', action : this.chatScreen}}
                        bgColor = '#0071bc'
                        width = {wp('25%')}
                        height = {hp('3%')}
                        buttonNameSize = {(13)}
                        elevation = {0}
                        navigation = {this.props.navigation} 
                      />
                      {this.state.isStartMessages &&
                        <View style={styles.absoluteView}>
                          <ActivityIndicator size ='small' />
                        </View>
                      }
                </View>
            </View>
        </View>
      )
    }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  roleIdUserName : state.createJob.roleIdUserName,
  hostMyJobs : state.createJob.hostMyJobs,
});
export default connect(mapStateToProps,{FalseLoader, GetSampleWorkImages, GetContractorsReviews, GetData})(SpecificTeam);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    backgroundColor : '#f6f6f6' ,
    marginBottom : hp('2%') ,
    flexDirection : 'row' ,
    borderRadius : 2
  },
  absoluteView : {
    height : hp('3%') ,
    width : wp('25%'),
    borderRadius : hp('5%') , 
    alignItems : 'center' ,
    justifyContent : 'center' , 
    borderColor : '#0071bc',
    borderWidth : 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position : 'absolute'
  },
}); 
