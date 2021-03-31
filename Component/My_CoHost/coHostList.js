import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import { connect } from 'react-redux';
import { FalseLoader, GetData, GetContractorsReviews} from '../../Redux/createJob/jobAction' ;
import TouchButton from '../InputFields/touchButton';
import StarRating from 'react-native-star-rating';
import { IS_MORE_MY_CO_HOST_LOADED, GET_MY_CO_HOST, FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG} from '../../Redux/createJob/actionType';

class MyCoHost extends Component{
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
        this.props.FalseLoader(IS_MORE_MY_CO_HOST_LOADED);
        if(this.props.roleIdUserName.role === 'employer'){
          this.props.GetData('co_host_list_all', GET_MY_CO_HOST , this.props.userToken, formData);
        }
        else{
          this.props.GetData('host_list_all', GET_MY_CO_HOST , this.props.userToken, formData);
        }
        
      });
  }
  listPrevCoHost = () => {
    let prevCoHostList = [];
    for(let i = 0; i < this.props.myCoHostList.length; i++){
      if(this.props.myCoHostList[i].current_associated_host === undefined){
        prevCoHostList.push(<SpecificCoHost key={this.props.myCoHostList[i].id} item={this.props.myCoHostList[i]} indexNo={i} navigation ={this.props.navigation} userToken = {this.props.userLoginToken} FalseLoader = {this.props.FalseLoader} GetContractorsReviews = {this.props.GetContractorsReviews}/>)
      }
    }
    return prevCoHostList.length > 0 ? prevCoHostList : <MessageComp message='No Previous Co-Host' viewHeight={hp('20%')}/>;
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
        <StatusBar title='My Co-Host' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          {!this.props.isMoreMYCoHostListLoaded && 
            <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
              <ActivityIndicator size='small' />
            </View>
          }
          {this.props.isMyCoHostListLoaded &&
            <View>
              {!this.props.myCoHostList[0] && <MessageComp message='No Co-Host Found' viewHeight={hp('70%')}/>}
              {this.props.myCoHostList[0] && 
                <View style={{ margin : wp('3%')}}>
                  <Text style={{fontSize : 18, color : '#292929'}}>Current Co-Host</Text>
                  {this.props.myCoHostList[0].current_co_host && 
                    <SpecificCoHost 
                      item={this.props.myCoHostList[0]} 
                      indexNo = 'zero'
                      navigation ={this.props.navigation} 
                      userToken = {this.props.userLoginToken} 
                      FalseLoader = {this.props.FalseLoader} 
                      GetContractorsReviews = {this.props.GetContractorsReviews}
                  />
                  }
                  {!this.props.myCoHostList[0].current_co_host && 
                    <MessageComp message='No Current Co-Host' viewHeight={hp('20%')}/>
                  }
                  <Text style={{fontSize : 18, color : '#292929'}}>Previous Co-Host</Text>
                  <ScrollView style={{height : hp('70%'), marginBottom : hp('2%')}}>
                    {this.listPrevCoHost()} 
                    {this.props.myCoHostListCount > 10 && this.props.coHostList.length < this.props.myCoHostListCount &&
                      <View style={{justifyContent : 'center', alignItems : 'center'}}>
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
                  </ScrollView>
                </View>
              }
            </View>
          }
          {!this.props.isMyCoHostListLoaded &&
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
  myCoHostListCount : state.createJob.myCoHostListCount,
  myCoHostList : state.createJob.myCoHostList,
  isMyCoHostListLoaded : state.createJob.isMyCoHostListLoaded,
  isMoreMYCoHostListLoaded : state.createJob.isMoreMYCoHostListLoaded,
  roleIdUserName : state.createJob.roleIdUserName
});
export default connect(mapStateToProps, {FalseLoader, GetData, GetContractorsReviews})(MyCoHost);
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
     TextInputField : {
        height : hp('7%') ,
        alignItems : 'flex-start' ,
        justifyContent : 'center' ,
        marginBottom : hp('1%') ,
        backgroundColor : '#f4f4f4'
     },
     TouchableStyle :{
        height : hp('7%') ,
        width : wp('33%') ,
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center',
     },
     eachField : {
        marginBottom : hp('1%'),
        height : hp('10%')
      },
      coHostContainer : {
        backgroundColor : '#f6f6f6' ,
        marginBottom : hp('2%') ,
        flexDirection : 'row' ,
        borderRadius : 2
      },
});

class SpecificCoHost extends Component {
  onViewProfile = () => {
    var formData = new FormData();
    formData.append('id', this.props.item.id);
    this.props.FalseLoader(FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG);
    this.props.GetContractorsReviews(this.props.userToken, formData);
    this.props.navigation.navigate('CoHostDetails', {details : this.props.item})
  }
  render(){
    var text = this.props.item.description === '' ? 'No description added' : this.props.item.description.replace(/(<([^>]+)>)/g, "");
    return(
      <View>
        { (this.props.indexNo === 'zero' || this.props.item.current_associated_host === undefined) &&
          <View style={styles.coHostContainer}>
            <View style={{marginHorizontal : wp('2%'), height : hp('18%'), justifyContent : 'center' , alignItems : 'center'}}>
              <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('14%') , width : hp('14%') , borderRadius : 100 , marginBottom : hp('2%')}}>
                <Image source={{uri : this.props.item.profile_image}} resizeMode = 'contain' style={{ height : hp('14%') , width : hp('14%')}}/>
              </View>
            </View>
            <View style={{flex : 1 ,  paddingVertical : hp('2%') ,paddingHorizontal : hp('2%'),}}>
              <Text style={{color : '#0071bc' , fontSize:(18), marginBottom : wp('1%')}}>{this.props.item.display_name}</Text>
              <Text style={{color : '#292929' , fontFamily : 'Raleway-SemiBold' , fontSize:(14), marginBottom : wp('1%')}}>{text}</Text>     
                  <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('1%')}}>
                    <StarRating
                      maxStars={5}
                      fullStarColor='#fcb016'
                      emptyStarColor='#fcb016'
                      disabled = {true}
                      rating={parseFloat(this.props.item.rating_score)}
                      starSize = {15}
                      starStyle={{marginRight : wp('0.5%')}}
                      containerStyle={{marginRight : wp('1%')}}
                    />
                  </View>
                  <TouchableOpacity style={{width : wp('40%'), backgroundColor : '#0071bc' , justifyContent : 'center' , alignItems : 'center' , height : hp('4%') , borderRadius : wp('4%')}} onPress={this.onViewProfile}>
                    <Text style={{color : 'white', fontSize:(12)}}>View Profile</Text>
                  </TouchableOpacity>
            </View>
          </View>
        }
      </View>      
    )
  }
}

function MessageComp(props){
  return(
    <View style={{height : props.viewHeight, alignItems : 'center', justifyContent : 'center'}}>
      <Text style={{fontSize : 16, textAlign : 'center', color : '#292929'}}>{props.message}</Text>
    </View>
  )
}