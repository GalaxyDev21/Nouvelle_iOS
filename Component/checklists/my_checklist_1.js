import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import {CopyNewChecklistInAllChecklistData, DeleteSelectedChecklistFromAllChecklistData, GetSpecificChecklistDetails, GetData, FalseLoader , ResetCheckListNotDeletedFlag } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import moment from 'moment';
import {GET_HOST_CHECKLISTS, IS_MORE_HOST_CHECKLISTS_LOADED, IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED} from '../../Redux/createJob/actionType';
import axios from 'axios';
import {server} from '../../Redux/server';
import ShowBar from '../validations/messageBar';
import NetInfo from "@react-native-community/netinfo";

class MyCheckLists1 extends Component{
  constructor(props){
    super(props);
      this.state = {
        offset : 0,
        alertMessage : '',
        newChecklistName : '',
        isNewChecklistDailogOpen : false,
        isAddButtonDisable : false
      }
  }
  addOtherCheckList = () => {
    this.setState({isNewChecklistDailogOpen : false});
  }
  copyChecklist = (checklistName, id) => {
    this.props.CopyNewChecklistInAllChecklistData(checklistName, id);    
  }
  deleteChecklist = (id) => {
    var formData = new FormData();
    formData.append('id', id);
    this.props.DeleteSelectedChecklistFromAllChecklistData(this.props.userToken, formData, id);
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
        this.props.FalseLoader(IS_MORE_HOST_CHECKLISTS_LOADED);
        this.props.GetData('get_all_check_lists', GET_HOST_CHECKLISTS , this.props.userToken, formData);
    })
  }
  addNewChecklist = async() => {
    this.setState({processing : true, isAddButtonDisable : true},async function(){
      await fetch(server+'add_new_check_list',{
        method: 'post', 
        headers: new Headers({'Authorization': 'Bearer '+ this.props.userToken})
        })
        .then((response) => response.json())
        .then((res)=>{
          if(res.code === 200){
            ShowBar('Checklist created successfully' , 'success');
            var formData = new FormData();
            formData.append('id', res.data.id);
            this.props.FalseLoader(IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED);
            this.props.GetSpecificChecklistDetails(this.props.userToken, formData);
            this.props.navigation.navigate('MyCheckLists2');
            this.setState({processing : false, isAddButtonDisable : false});
          }
          else{
            ShowBar('Sorry, Unable to create checklist' , 'error');
            this.setState({processing : false, isAddButtonDisable : false});
          }
        });
    });
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
        {!this.props.isMoreHostChecklistsLoaded && 
          <View style={[{elevation : 15, shadowOpacity : 0.3, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}, Platform.OS === 'ios'?{zIndex : 9999}:{}]}>
            <ActivityIndicator size='small' />
          </View>
        }
        <View style = {{marginHorizontal : wp('3%'), flex : 1}}>
          {this.props.isHostChecklistsLoaded &&
            <View style={{flex : 1}}>
              <View style={{alignItems : 'flex-end', marginVertical : hp('3%')}}>
                <TouchableOpacity disabled = {this.state.isAddButtonDisable} style={{flexDirection : 'row', alignItems  :'center', justifyContent : 'center', height : hp('6%'), backgroundColor : '#8cc63f', width : wp('45%'), borderRadius : hp('4%'), elevation : 2}} onPress={this.addNewChecklist}>
                  <Image source={require('../../assets/plus_sign.png')} style={{height : hp('2.5%'), width : hp('2.5%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                  <Text style={{ color : '#ffffff' , fontSize : (18), marginRight : wp('2%')}}>Add New</Text>
                    {this.state.processing && <ActivityIndicator size='small' color="#414141"/>}
                </TouchableOpacity>
              </View>
              {this.props.hostChecklists.length === 0 && 
                <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                  <Text style={{fontSize : (16), color : '#292929'}}>No Checklists Available</Text>
                </View>     
              }
              {this.props.hostChecklists.length > 0 && 
                <ScrollView style={{ marginBottom : hp('2%'), height : hp('70%')}}>
                  {
                    this.props.hostChecklists.map((item , index) => <EachChecklist 
                      key={item.ID} 
                      item={item} 
                      indexNo={index} 
                      navigation = {this.props.navigation} 
                      copyChecklist = {this.copyChecklist} 
                      deleteChecklist = {this.deleteChecklist} 
                      userToken = {this.props.userToken}
                      FalseLoader = {this.props.FalseLoader}
                      checkListNotDeleted = {this.props.checkListNotDeleted}
                      ResetCheckListNotDeletedFlag = {this.props.ResetCheckListNotDeletedFlag}
                      GetSpecificChecklistDetails = {this.props.GetSpecificChecklistDetails}
                    />)     
                  }
                  {this.props.hostChecklistCount > 10 && this.props.hostChecklists.length < this.props.hostChecklistCount &&
                    <View style={{justifyContent : 'center', alignItems : 'center',}}>
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
          {!this.props.isHostChecklistsLoaded &&
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator
                size='large'
              />
            </View>
          }
        </View>
      </ImageBackground>
    )
  } 
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  roleIdUserName : state.createJob.roleIdUserName,
  hostChecklistCount : state.createJob.hostChecklistCount,
  hostChecklists : state.createJob.hostChecklists,
  isHostChecklistsLoaded : state.createJob.isHostChecklistsLoaded,
  isMoreHostChecklistsLoaded : state.createJob.isMoreHostChecklistsLoaded,
  allChecklists : state.createJob.allChecklists,
  checkListNotDeleted : state.createJob.checkListNotDeleted
});
export default connect(mapStateToProps, {CopyNewChecklistInAllChecklistData, DeleteSelectedChecklistFromAllChecklistData, GetData, FalseLoader, GetSpecificChecklistDetails, ResetCheckListNotDeletedFlag})(MyCheckLists1);
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
    height : hp('4%') ,
    width : wp('22%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center',
  },
  textInputCon : {
    color : 'black',
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#f4f4f4' ,
    paddingLeft : wp('2%'),
 },
});

class EachChecklist extends Component {
  constructor(props){
    super(props);
      this.state = {
        isNewChecklistDailogOpen : false,
        newChecklistName : '',
        itemID : '',
        deleteDialogOpen : false,
        deleteProcessing : false,
        titleNotification : '',
        isCnfmBtnDisabled : false
      }
  }
  deleteButtonPressed = (id) => {
    this.setState({deleteDialogOpen : false, deleteProcessing : true});
    this.props.deleteChecklist(id);
  }
  confirmButtonPressed = async(id) => {
    try{
      netInfo = await NetInfo.fetch();
      isConnected = netInfo.isInternetReachable;
      if(!isConnected){
        ShowBar('Please check your internet connection!','warning');
        return;
      }
      else{
        if(this.state.newChecklistName){
          this.setState({confrmProcessing : true, isCnfmBtnDisabled : true});
          var formData = new FormData();
          formData.append('id', id);
          formData.append('title', this.state.newChecklistName) ;
          const res = await axios.post(server+'copy_check_list', formData ,{
            headers : {'Authorization': 'Bearer '+ this.props.userToken},
          });
          if(res.data.code === 200){
            this.props.copyChecklist(this.state.newChecklistName, res.data.data.checklistID);
            this.setState({isNewChecklistDailogOpen : false, confrmProcessing : false, isCnfmBtnDisabled : false});
            ShowBar('Checlist created' , 'success');
          }
          else{
            this.setState({confrmProcessing : false, isCnfmBtnDisabled : false});
            ShowBar('Sorry, Unable to copy checklist' , 'error');
          }
        }
        else{
          this.setState({titleNotification : 'title required'})
        } 
      }
    }
    catch(error){
      this.setState({confrmProcessing : false, isCnfmBtnDisabled : false});
      ShowBar('Sorry, Unable to copy checklist' , 'error');
    }
  }
  getChecklistDetail = () => {
    var formData = new FormData();
      formData.append('id', this.props.item.ID);
      this.props.FalseLoader(IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED);
      this.props.GetSpecificChecklistDetails(this.props.userToken, formData);
      this.props.navigation.navigate('MyCheckLists2')
  }
  static getDerivedStateFromProps(props, state) {
    if(props.checkListNotDeleted){
      state.deleteProcessing = false
    }
    return state;
  }
  componentDidUpdate(){
    if(this.props.checkListNotDeleted){
      this.props.ResetCheckListNotDeletedFlag();
    }
  }
  render(){
    return(
      <View style={{padding : wp('3%'), backgroundColor : '#f6f6f6', borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8' , marginBottom : hp('2%')}}>
        <TouchableOpacity onPress={this.getChecklistDetail}>
          <Text style={{ color : '#0071BD' , fontSize : (18)}}>{`${this.props.item.post_title}`}</Text>
        </TouchableOpacity>
        <Text style={{ color : '#292929' , fontSize : (15)}}>Checklist draft</Text>
        <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between'}}>
          <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
            <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
              <Text style={{fontSize : (15), color : '#292929'}}>{moment(this.props.item.post_date).format('MMM D, YYYY')}</Text>
          </View>
          <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between'}}>
            <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', marginRight : wp('2%')}]} onPress={() => this.setState({isNewChecklistDailogOpen : true})}>
              <Text style={{ color : '#ffffff' , fontSize : (12)}}>copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={() => this.setState({deleteDialogOpen : true})}>
              <Text style={{ color : '#ffffff' , fontSize : (12)}}>delete</Text>  
            </TouchableOpacity>
          </View>
        </View>
        {this.state.deleteProcessing &&
          <View style={{height : 100, width : 400 , alignItems : 'center', justifyContent : 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)', borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8' , position : 'absolute'}}>
            <ActivityIndicator size='large'/>
          </View>
        }
        <Dialog
            visible={this.state.isNewChecklistDailogOpen}
            onTouchOutside={() => this.setState({isNewChecklistDailogOpen: false})}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingBottom : 0,  backgroundColor : '#ffffff'}}
          > 
            <View>
              <Text style={{fontSize: (20) , color : '#292929', marginLeft : wp('3%') }}>Name Your Checklist </Text> 
                <View style={{marginBottom : hp('3%'), height : hp('7%'), marginHorizontal : wp('3%')}}>
                  <TextInput placeholder='Title' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({newChecklistName : text, titleNotification : ''})} value={this.state.newChecklistName}/>
                  <Text style={{color : 'red', fontSize : 12}}>{this.state.titleNotification}</Text>
                </View>
                <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                  <TouchableOpacity disabled={this.state.isCnfmBtnDisabled} style={{borderRadius : hp('5%'), flexDirection : 'row', justifyContent : 'center', alignItems : 'center', width : wp('40%'), height : hp('7%'), backgroundColor : '#8cc63f'}} onPress={()=>this.confirmButtonPressed(this.props.item.ID)}>
                    <Text style={{ color : '#ffffff' , fontSize : (20), marginRight : wp('3%')}}>Confirm</Text>
                    {this.state.confrmProcessing && <ActivityIndicator size='small' />}  
                  </TouchableOpacity>
                </View>
            </View>
          </Dialog>
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
                <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to delete this checklist?</Text>
              </View>
            </View>
            <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
              <TouchableOpacity onPress = {() => this.deleteButtonPressed(this.props.item.ID)}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
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