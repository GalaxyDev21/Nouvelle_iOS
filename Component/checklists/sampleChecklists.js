import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import {CopyNewChecklistInAllChecklistData, DeleteSelectedChecklistFromAllChecklistData, GetSpecificChecklistDetails, GetData, FalseLoader } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import moment from 'moment';
import {GET_HOST_SAMPLE_CHECKLISTS, IS_MORE_HOST_SAMPLE_CHECKLISTS_LOADED, IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED} from '../../Redux/createJob/actionType';
import axios from 'axios';
import {server} from '../../Redux/server';
import ShowBar from '../validations/messageBar';
import NetInfo from "@react-native-community/netinfo";

class SampleChecklists extends Component{
  constructor(props){
    super(props);
      this.state = {
        offset : 0,
        alertMessage : '',
        newChecklistName : '',
        isNewChecklistDailogOpen : false,
      }
  }
  copyChecklist = (checklistName, id) => {
    this.props.CopyNewChecklistInAllChecklistData(checklistName, id); 
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
        this.props.FalseLoader(IS_MORE_HOST_SAMPLE_CHECKLISTS_LOADED);
          this.props.GetData('get_all_sample_check_lists', GET_HOST_SAMPLE_CHECKLISTS , this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
        {
            !this.props.isMoreHostSampleChecklistsLoaded && 
              <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
                <ActivityIndicator size='small' />
              </View>
          }
          <View style = {{marginHorizontal : wp('3%'), flex : 1 , marginTop : hp('2%')}}>
          {this.props.isHostSampleChecklistsLoaded &&
              <View style={{flex : 1}}>
                {this.props.hostSampleChecklists.length === 0 && 
                  <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                    <Text style={{fontSize : (16), color : '#292929'}}>No Sample Checklists Available</Text>
                  </View>     
                }
              <ScrollView style={{ marginBottom : hp('2%'), height : hp('80%')}}>
                {this.props.hostSampleChecklists.length > 0 &&
                  this.props.hostSampleChecklists.map((item , index) => <EachSampleChecklist 
                    key={item.ID} 
                    item={item} 
                    indexNo={index} 
                    navigation = {this.props.navigation} 
                    copyChecklist = {this.copyChecklist} 
                    userToken = {this.props.userToken}
                    FalseLoader = {this.props.FalseLoader}
                    GetSpecificChecklistDetails = {this.props.GetSpecificChecklistDetails}
                  />
                  )     
                }
                {
                this.props.hostSampleChecklistsCount > 10 && this.props.hostSampleChecklists.length < this.props.hostSampleChecklistsCount &&
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
              </View>
              }
              {
                !this.props.isHostSampleChecklistsLoaded &&
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
  hostSampleChecklistsCount : state.createJob.hostSampleChecklistsCount,
  hostSampleChecklists : state.createJob.hostSampleChecklists,
  isHostSampleChecklistsLoaded : state.createJob.isHostSampleChecklistsLoaded,
  isMoreHostSampleChecklistsLoaded : state.createJob.isMoreHostSampleChecklistsLoaded,
  allChecklists : state.createJob.allChecklists,
});
export default connect(mapStateToProps, {GetData, FalseLoader, CopyNewChecklistInAllChecklistData, DeleteSelectedChecklistFromAllChecklistData, GetSpecificChecklistDetails})(SampleChecklists);
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

class EachSampleChecklist extends Component {
  constructor(props){
    super(props);
      this.state = {
        isNewChecklistDailogOpen : false,
        newChecklistName : '',
        isCnfmBtnDisabled : false
      }
  }
  copyButtonPressed = (id) => {
    this.setState({isNewChecklistDailogOpen : true, itemID : id});
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
            ShowBar(res.data.data.msg , 'success');
          }
          else{
            this.setState({confrmProcessing : false, isCnfmBtnDisabled : false});
            ShowBar('Sorry, Unable to copy checklist', 'error');
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
    this.props.navigation.navigate('SampleChecklistDetail');
  }
  render(){
    return(
      <View style={{padding : wp('3%'), backgroundColor : '#f6f6f6', borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8' , marginBottom : hp('2%')}}>
        <TouchableOpacity onPress={this.getChecklistDetail}>
          <Text style={{ color : '#0071BD' , fontSize : (18)}}>{`${this.props.item.post_title} checklist`}</Text>
        </TouchableOpacity>
          <Text style={{ color : '#292929' , fontSize : (15)}}>Checklist draft</Text>
            <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                  <Text style={{fontSize : (15), color : '#292929'}}>{moment(this.props.item.post_date).format('MMM D, YYYY')}</Text>
              </View>
              <View style={{ alignItems : 'flex-end'}}>
                <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', marginRight : wp('2%')}]} onPress={() => this.copyButtonPressed(this.props.item.id)}>
                  <Text style={{ color : '#ffffff' , fontSize : (12)}}>copy</Text>
                </TouchableOpacity>
              </View>
            </View>
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
                    <TouchableOpacity disabled={this.state.isCnfmBtnDisabled}  style={{borderRadius : hp('5%'), flexDirection : 'row', justifyContent : 'center', alignItems : 'center', width : wp('40%'), height : hp('7%'), backgroundColor : '#8cc63f'}} onPress={()=>this.confirmButtonPressed(this.props.item.ID)}>
                      <Text style={{ color : '#ffffff' , fontSize : (20), marginRight : wp('3%')}}>Confirm</Text>
                      {this.state.confrmProcessing && <ActivityIndicator size='small' />}  
                    </TouchableOpacity>
                  </View>
              </View>
            </Dialog>
      </View>
    )
  }
}