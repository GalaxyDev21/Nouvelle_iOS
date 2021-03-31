import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import { connect } from 'react-redux';
import {DeleteProperty, GetPropertyDetails, FalseLoader, ResetDeletePropertyFlag, GetExistingProperty, GetData, GetPropertyCalenderURL} from '../../Redux/createJob/jobAction';
import { IS_MORE_EXISTING_PROPERTY_LOADED, FALSE_GET_PROPERTY_TEAM_FLAG, GET_PROPERTY_TEAM, GET_PROPERTY_CHECKLIST } from '../../Redux/createJob/actionType';
import { Dialog} from 'react-native-simple-dialogs';

class MyPropertyList extends Component{
  constructor(props){
    super(props);
      this.state = {
        offset : 0
      }
  }
  addProperty = () => {
    this.props.navigation.navigate('AddPropertyScreen1');
  }
  deleteProperty = async(id) => {
    var formData = new FormData();
    formData.append('ID', id);
    this.props.DeleteProperty(this.props.userToken, formData, id);
  }
  editProperty =(id) => {
    console.log('=======================================');
    console.log('*** property ID ***'+id);
    var formData = new FormData();
    formData.append('PropertyID', id);
    this.props.FalseLoader(FALSE_GET_PROPERTY_TEAM_FLAG);
    this.props.GetPropertyDetails(this.props.userToken, formData);
    this.props.GetPropertyCalenderURL(this.props.userToken, formData);
    this.getTeam(id);
    this.getPropertyChecklist(id);
    this.props.navigation.navigate('EditPropertyDetails', {property_ID : id});
  }
  getTeam = (ID) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    formData.append('id', ID);
    this.props.GetData('team_property', GET_PROPERTY_TEAM, this.props.userToken, formData);
  }
  getPropertyChecklist = (ID) => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    formData.append('id', ID); 
    this.props.GetData('get_check_lists_of_property', GET_PROPERTY_CHECKLIST, this.props.userToken, formData);
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
      this.props.FalseLoader(IS_MORE_EXISTING_PROPERTY_LOADED);
      this.props.GetExistingProperty(this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/my_property_list_bg.jpg')} style={styles.container}>
        <StatusBar title='MY PROPERTY' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
        {!this.props.isMoreExistingPropertyLoaded && 
          <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
            <ActivityIndicator size='small' />
          </View>
        }
        {this.props.isExistingProperty && 
          <View style={{margin : wp('3%')}}>
            <View style={{alignItems : 'flex-end', marginBottom : hp('2%')}}>
              <TouchButton 
                buttonName = 'New Property'
                actionPerform = {ActionPerformFunc}
                move = {{doingAction : 'doingAction', action : this.addProperty}}
                bgColor = '#8cc63f'
                width = {wp('40%')}
                height = {hp('7%')}
                buttonNameSize = {(18)}
                elevation = {5}
                navigation = {this.props.navigation}
                />
            </View>
            {this.props.existingProperty.length === 0 && 
              <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                <Text style={{fontSize : (18), color : '#292929'}}>No Properties Available</Text>
              </View>     
            }
            {this.props.existingProperty.length > 0 && 
              <ScrollView style={{height : hp('75%'), marginBottom : hp('4%')}}>
                {
                  this.props.existingProperty.map((item , index) => <EachProperty 
                    key={item.ID}
                    item={item}
                    navigation = {this.props.navigation}
                    deleteProperty = {this.deleteProperty} 
                    editProperty = {this.editProperty}
                    isErrorOccuredInDelete = {this.props.isErrorOccuredInDelete}
                    isPropertyDeleted = {this.props.isPropertyDeleted}
                    ResetDeletePropertyFlag = {this.props.ResetDeletePropertyFlag}
                  /> )     
                }
                {this.props.existingPropertyCount > 10 && this.props.existingProperty.length < this.props.existingPropertyCount &&
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
          </View> 
        }
        {!this.props.isExistingProperty &&
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
  existingPropertyCount : state.createJob.existingPropertyCount,
  existingProperty : state.createJob.existingProperty ,
  isPropertyDeleted : state.createJob.isPropertyDeleted,
  isExistingProperty : state.createJob.isExistingProperty,
  isMoreExistingPropertyLoaded : state.createJob.isMoreExistingPropertyLoaded,
  isErrorOccuredInDelete : state.createJob.isErrorOccuredInDelete
});
export default connect(mapStateToProps, {
  DeleteProperty, 
  GetPropertyDetails, 
  FalseLoader, 
  GetExistingProperty, 
  GetData,
  GetPropertyCalenderURL,
  ResetDeletePropertyFlag
})(MyPropertyList);
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
});

class EachProperty extends Component {
  constructor(props){
    super(props);
      this.state = {
        deleteProcessing : false,
        deleteDialogOpen : false,
        prevProps : {}
      }
  }
  deleteProperty =()=> {
    this.setState({deleteDialogOpen : true});
  }
  deleteSelectedProperty = (id) => {
    console.log('======================'+id);
    this.setState({deleteProcessing : true , deleteDialogOpen : false});
    this.props.deleteProperty(id);
  }
  static getDerivedStateFromProps(props, state) {
    if(props.isErrorOccuredInDelete){
      state.deleteProcessing = false
    }
    return state;
  }
  componentDidUpdate(){
    if(this.props.isErrorOccuredInDelete){
      this.props.ResetDeletePropertyFlag();
    }
  }
  render(){
    return(
      <View style={{marginBottom : hp('2%')}}>
        <View style={{flexDirection : 'row' , alignItems : 'center' , backgroundColor : '#f4f4f4', borderRadius : wp('1%'), borderWidth : 1, borderColor : '#dbdbdb' , position : 'relative'}}>
          <View style={{height : hp('25%'), width : hp('20%'), marginRight : wp('2%')}}>
            {
              this.props.item.property_image === "" && <Image source={require('../../assets/default_property_image.jpg')} style={{height : hp('25%'), width : hp('20%'), resizeMode : 'stretch'}}/>
            }
            {
              this.props.item.property_image !== "" && <Image source={{ uri: this.props.item.property_image }} style={{height: hp('25%'), width : hp('20%'), resizeMode : 'stretch'}} />
            }
          </View>
          <View style={{flex : 1, justifyContent : 'center', alignItems : 'flex-start',  marginRight : wp('2%'), padding : wp('2%')}}>
            <Text style={{ color : '#0071BD' , fontSize : (18), marginBottom : hp('2%')}}>{this.props.item.post_title}</Text>
            <Text style={{color : '#292929' , fontSize : (15), marginBottom : hp('4%')}}>{this.props.item.address_street_number}</Text>
            <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-evenly'}}>
              <TouchButton 
                buttonName = 'Edit'
                actionPerform = {ActionPerformFunc}
                move = {{doingAction : 'doingAction', action : this.props.editProperty, item_id : this.props.item.ID}}
                bgColor = '#8cc63f'
                width = {wp('20%')}
                height = {hp('4%')}
                marginValue = {wp('2%')}
                buttonNameSize = {(12)}
                navigation = {this.props.navigation}
              />
              <TouchButton 
                buttonName = 'Delete'
                actionPerform = {ActionPerformFunc}
                move = {{doingAction : 'doingAction', action : this.deleteProperty}}
                bgColor = '#0071bc'
                width = {wp('20%')}
                height = {hp('4%')}
                buttonNameSize = {(12)}
                navigation = {this.props.navigation}
              />
            </View>
          </View>
        </View>
          {this.state.deleteProcessing &&
            <View style={{height : hp('25%'), width : '100%', alignItems : 'center', justifyContent : 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)', borderRadius : wp('1%'), borderWidth : 1, borderColor : '#dbdbdb' , marginBottom : hp('2%'), position : 'absolute'}}>
              <ActivityIndicator
                size='large'
              />
            </View>
          }
          <Dialog
            visible={this.state.deleteDialogOpen}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingBottom : 0, backgroundColor : '#ffffff'}}
          > 
          <View>
            <View style={{justifyContent : 'center', alignItems : 'center'}}>
              <Image source={require('../../assets/delete_group_icon.png')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
            </View>
            <View style={{alignItems : 'center'}}>
              <View style={{width  :wp('70%')}}>
                <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to delete this property?</Text>
              </View>
            </View>
            <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
              <TouchableOpacity onPress = {() => this.deleteSelectedProperty(this.props.item.ID)}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                <Text style={{ color : '#ffffff', fontSize : (18)}}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({deleteDialogOpen : false})} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071BD'}}>
                <Text style={{color : '#ffffff', fontSize : (18)}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>
      </View>
    )
  }
}