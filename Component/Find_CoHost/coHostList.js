import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Image, ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import { connect } from 'react-redux';
import { FalseLoader, GetData, GetContractorsReviews} from '../../Redux/createJob/jobAction' ;
import DropDownField from '../InputFields/dropDown';
import TextInputField from '../InputFields/textInputField';
import TouchButton from '../InputFields/touchButton';
import StarRating from 'react-native-star-rating';
import { GET_CO_HOST, IS_MORE_CO_HOST_LOADED, FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG, FALSE_FILTER_LOADER} from '../../Redux/createJob/actionType';

class FindCoHost extends Component{
  constructor(props){
    super(props);
      this.state = {
        offset : 0,
        Keyword : '',
        email : '',
        filterState : '',
        stateID : '',
        KeywordPlaceholder : 'Search Co-host by Keyword',
        emailPlaceholder : 'Search Co-host by Email',
        statePlaceholder : 'Any State',
        clearButtonPressed : false,
        applyFilter : false
      }
  }
  viewDetails = () => {
    console.log('Button Pressed');
  }
  onViewMore = () => {
    if(this.state.applyFilter){
      this.setState({
        offset : this.state.offset + 10,
      },function(){
        var formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('limit', 10);
        isNaN(this.state.Keyword) ? formData.append('keyword', this.state.Keyword) : '';
        isNaN(this.state.email) ? formData.append('email', this.state.email) : '';
        typeof(this.state.stateID) === 'number' ? formData.append('state_id', this.state.stateID) : '';
        this.props.FalseLoader(IS_MORE_CO_HOST_LOADED);
        this.props.GetData('find_co_host', GET_CO_HOST , this.props.userToken, formData);
      });
    }
    else{
      this.setState({
      offset : this.state.offset + 10,
      },function(){
        var formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('limit', 10);
        this.props.FalseLoader(IS_MORE_CO_HOST_LOADED);
        this.props.GetData('find_co_host', GET_CO_HOST , this.props.userToken, formData);
      });
    } 
  }
  selectState = (value, id) => {
    this.setState({
      filterState : value,
      stateID : id
    });
  }
  onChange = (name, value) => {
      this.setState({
          [name]: value,
          [name+'Notification'] : ''
      });
  }
  validityCheck = (name , validity) => {
    this.setState({
      [name+'Valid']: validity,
    });
  }
  clearFilter = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_FILTER_LOADER);
    this.props.GetData('find_co_host', GET_CO_HOST , this.props.userToken, formData); 
    this.setState({
      KeywordPlaceholder : 'Search Co-host by Keyword',
      emailPlaceholder : 'Search Co-host by Email',
      statePlaceholder : 'Any State',
      Keyword : '',
      email : '',
      stateID : '',
      clearButtonPressed : true,
      applyFilter : false
    });
  }
  applyFilter = () => {
    this.setState({applyFilter : true});
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    isNaN(this.state.Keyword) ? formData.append('keyword', this.state.Keyword) : '';
    isNaN(this.state.email) ? formData.append('email', this.state.email) : '';
    typeof(this.state.stateID) === 'number' ? formData.append('state_id', this.state.stateID) : '';
    console.log('********** Form Data *********');
    console.log(formData);
    this.props.FalseLoader(FALSE_FILTER_LOADER);
    this.props.GetData('find_co_host', GET_CO_HOST , this.props.userToken, formData);
  }
  falseClearButton = () => {
    this.setState({
      clearButtonPressed : false,
      isYesButtonPressed : false
    });
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
        <StatusBar title='Find Co-Host' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          {!this.props.isMoreCoHostListLoaded && 
            <View style={[{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}, Platform.OS === 'ios'?{zIndex : 10}:{}]}>
              <ActivityIndicator size='small' />
            </View>
          }
          {this.props.isCoHostListLoaded &&
            <View style={{ margin : wp('2%')}}>
            <View style={styles.eachField}>
                <Text style={{ color : '#292929', fontSize : 18}}>Location</Text>
                  <DropDownField
                    listShow = {this.props.states}
                    placeholder = {this.state.statePlaceholder}
                    selectedValue = {this.selectState}
                    clearButton = {this.state.clearButtonPressed}
                    falseClearButton = {this.falseClearButton}
                    name = 'name'
                    id = 'term_id'
                    isObject = {true}
                  />
              </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('1%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>      
                <Text style={{fontSize : (18), color: '#292929'}}>Keyword</Text>
                  <TextInputField
                    name = 'Keyword'
                    keyboardType = 'default'
                    placeholder = {this.state.KeywordPlaceholder}
                    placeholderTextColor='#292929'
                    secureTextEntry = {false}
                    multiline = {false}
                    numberOfLines = {1}
                    height = {hp('7%')}
                    onChangeValue = {this.onChange}
                    validityChange = {this.validityCheck}
                    value = {this.state.Keyword}
                  />
              </View>
              <View style={[{height : hp('10%'),  marginBottom : hp('1%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>      
                <Text style={{fontSize : (18), color: '#292929'}}>Email</Text>
                  <TextInputField
                    name = 'email'
                    keyboardType = 'email-address'
                    placeholder = {this.state.emailPlaceholder}
                    placeholderTextColor='#292929'
                    secureTextEntry = {false}
                    multiline = {false}
                    numberOfLines = {1}
                    height = {hp('7%')}
                    onChangeValue = {this.onChange}
                    validityChange = {this.validityCheck}
                    value = {this.state.email}
                  />
              </View>
              <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly', marginBottom : hp('1%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                  <TouchButton 
                    buttonName = 'Clear Filter'
                    actionPerform = {ActionPerformFunc}
                    move = {{doingAction : 'doingAction', action : this.clearFilter}}
                    bgColor = '#0071bc'
                    width = {wp('40%')}
                    height = {hp('7%')}
                    buttonNameSize = {(20)}
                    elevation = {0}
                    navigation = {this.props.navigation}
                  />
                  <TouchButton 
                    buttonName = 'Apply'
                    actionPerform = {ActionPerformFunc}
                    move = {{doingAction : 'doingAction', action : this.applyFilter}}
                    bgColor = '#8cc63f'
                    width = {wp('40%')}
                    height = {hp('7%')}
                    buttonNameSize = {(20)}
                    elevation = {0}
                    navigation = {this.props.navigation}
                  />
                </View>
                {
                  this.props.isCoHostFilterLoaded &&
                  <ScrollView style={[{height : hp('47%')}, Platform.OS === 'ios'?{zIndex : -10}:{}]}>
                    {!this.props.coHostList[0] && <View style={{height : hp('45%'), alignItems : 'center', justifyContent : 'center'}}><Text style={{fontSize : 15}}>No Co-Host Found</Text></View>}
                    {this.props.coHostList[0] && this.props.coHostList.map((item , index) => <SpecificCoHost key={index} item={item} indexNo={index} navigation ={this.props.navigation} userToken = {this.props.userLoginToken} FalseLoader = {this.props.FalseLoader} GetContractorsReviews = {this.props.GetContractorsReviews}/> )}
                    {
                    this.props.hostCreatedJobCount > 10 && this.props.coHostList.length < this.props.hostCreatedJobCount &&
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
                }
              {!this.props.isCoHostFilterLoaded && 
                <View style={{height : hp('40%'), alignItems:'center',justifyContent:'center'}}>
                  <ActivityIndicator size='large' />
                </View>
              }   
            </View>
          }
          {!this.props.isCoHostListLoaded &&
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
  states : state.createJob.states,
  availableServiceWithId : state.createJob.servicesForCreateJobWithId ,
  coHostListCount : state.createJob.coHostListCount,
  coHostList : state.createJob.coHostList,
  isCoHostListLoaded : state.createJob.isCoHostListLoaded,
  isMoreCoHostListLoaded : state.createJob.isMoreCoHostListLoaded,
  isCoHostFilterLoaded : state.createJob.isCoHostFilterLoaded
});
export default connect(mapStateToProps, {FalseLoader, GetData, GetContractorsReviews})(FindCoHost);
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
  constructor(props){
    super(props);
      this.state = {

      }
    }
    onViewProfile = () => {
      var formData = new FormData();
      formData.append('id', this.props.item.id);
      this.props.FalseLoader(FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG);
      this.props.GetContractorsReviews(this.props.userToken, formData);
      this.props.navigation.navigate('CoHostDetails', {details : this.props.item});
    }
    render(){
      var text = this.props.item.description === '' ? 'No description added' : this.props.item.description.replace(/(<([^>]+)>)/g, "");
      return(
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
      )
    }
}