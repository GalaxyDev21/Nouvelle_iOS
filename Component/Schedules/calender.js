import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView, Image , FlatList, ImageBackground, TouchableOpacity ,  Platform, TextInput, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import DropDownField from '../InputFields/dropDown';
import TouchButton from '../InputFields/touchButton';
import StatusBar from '../InputFields/statusBar' ;
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import CustomCalendar from './CustomCalendar';
import { connect } from 'react-redux';
import axios from 'axios'
import {server} from '../../Redux/server';

class ScheduleCalendar extends Component{
  constructor(props){
    super(props);
      this.state = {
        properties : [{ID: 17624, "title": "No Results Found"}],
        contractors : [{ID: "333", name: "No Results Found"}],
        groupOfArray : [],
        groupNameArray : [{title : 'No Results Found', ID : 1}],
        propertyFilter : '',
        propertyId : '',
        contractorFilter : '',
        contractorId : '',
        groupFilter : '',
        groupId : '',
        specificGroupIndex  : '',
        groupName : '',
        propertiesPlaceHolder : 'Search by Property',
        propertiesGroupPlaceHolder : 'Search by Group',
        contractorsPlaceHolder : 'Search by Contractors',
        clearButtonPressed : false,
        deleteDialogOpen : false,
        isAddNewGroupDialogOpen : false,
        isYesButtonPressed : false,
        isDataLoaded : false,
        deleteDialogOpen : false,
        propFilter : [],
        applyFilter : false,
        clearFilter : false,
        notification : '',
        deleteNotification : ''
      }
  }
  componentDidMount(){
    this.getFilters();
  }
  getFilters = async()=>{
    const res = await  axios.post(server+'get_calendar_filters',{},
    {headers : {'Authorization': 'Bearer '+ this.props.userToken}});
    //console.log(res.data.data);
    this.setState({
      properties: res.data.data.properties.length > 0 ? res.data.data.properties : this.state.properties,
      contractors: res.data.data.contractors.length > 0 ? res.data.data.contractors : this.state.contractors,
      groupNameArray: res.data.data.groups.length > 0 ? res.data.data.groups : this.state.groupNameArray
    });
  }
  filterByProperties = (value, id) => {
    if(value !== 'No Results Found'){
    const tempArr = [];
    tempArr.push(id);
    console.log(tempArr);
    this.setState({
      propertyFilter : value, 
      propertyId : id, 
      propFilter : tempArr,
      groupFilter : '',
      groupId : '',
      propertiesGroupPlaceHolder : 'Search by group',
      applyFilter : false,
      clearFilter : false,
      notification : ''});
    }
  }
  filterByContractor = (value, id) => {
    if(value !== 'No Results Found'){
      this.setState({contractorFilter : value, contractorId : id, notification : '', applyFilter : false, clearFilter : false,});
    }
  }
  filterByGroup = (value, id) => {
    if(value !== 'No Results Found'){
      const index = this.state.groupNameArray.findIndex(checkIndex);
      function checkIndex(obj){
        return obj.ID === id ;
      }
      this.setState({
        groupFilter : value, 
        groupId : id, 
        propFilter : this.state.groupNameArray[index].properties,
        propertyFilter : '',
        propertyId : '',
        propertiesPlaceHolder : 'Search by Property',
        applyFilter : false,
        clearFilter : false,
        notification : '',
        deleteNotification : ''
      }); 
    }
  }
  applyFilter = () => {
    if(this.state.propertyId || this.state.groupId || this.state.contractorId){
      this.setState({applyFilter : true, clearFilter : false});
    }
    else{
      this.setState({notification : 'Choose any filter'});
    }
  }
  clearFilter = () => {
    this.setState({
      propertiesPlaceHolder : 'Search by Property',
      propertiesGroupPlaceHolder : 'Search by Group',
      contractorsPlaceHolder : 'Search by Contractors',
      clearButtonPressed : true,
      propertyFilter : '',
      propertyId : '',
      contractorFilter : '',
      contractorId : '',
      groupFilter : '',
      groupId : '',
      applyFilter : false,
      clearFilter : true,
      notification : ''
    });
  }
  falseClearButton = () => {
    this.setState({
      clearButtonPressed : false,
    });
  }
  CreateGroupDialog = () => {
    this.setState({isAddNewGroupDialogOpen : !this.state.isAddNewGroupDialogOpen ? true : false ,});
  }
  addGroupInGroupArray = (object) => {
    const tempArr = this.state.groupNameArray.slice();
    tempObj = {
      ID:(Math.max.apply(Math, tempArr.map(function(o) {return o.ID; })))+1,
    }
    newObj = {...tempObj, ... object};
      tempArr.push(newObj);
      this.setState({
        groupNameArray : tempArr,
        isAddNewGroupDialogOpen : !this.state.isAddNewGroupDialogOpen ? true : false,  
      });      
  }
  deleteGroupFromGroupArray = () => {
    const groupID = this.state.groupId;
    const Index = this.state.groupNameArray.findIndex(checkIndex);
      function checkIndex(obj){
        return obj.ID == groupID;
      }
      this.setState({deleteDialogOpen : true , specificGroupIndex : Index})
  }
  deleteSelectedGroup = async() => {
    if(this.state.groupId){
      tempGroupNameArr = this.state.groupNameArray[0].title === 'No Results Found' ? [] : this.state.groupNameArray.slice();
      this.setState({deleteProcesing : true});
      var formData = new FormData();
      formData.append('id', this.state.groupId);
      const res = await axios.post(server+'delete_properties_group', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code == 200){
        tempGroupNameArr.splice(this.state.specificGroupIndex , 1);
        ShowBar('Group Deleted Successfully' , 'success');
        this.setState({
          deleteProcesing : false, 
          deleteDialogOpen : false, 
          groupNameArray : tempGroupNameArr, 
          propertiesGroupPlaceHolder : 'Search by Group',
          clearButtonPressed :true
        });
      }
      else{
        ShowBar('Something Wrong' , 'error');
        this.setState({deleteProcesing : false, deleteDialogOpen : false});
      }
    }
    else{
      this.setState({ 
        deleteDialogOpen : false,
        deleteNotification : 'Please select group first'
      });
    }
    
  }
  addNewJob = () => {
    this.props.navigation.navigate('CreateJob_Screen1');
  }
  onDataLoaded = () => {
    this.setState({isDataLoaded : true})
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/schedule_bg.jpg')} style={styles.container}>
        <StatusBar title='SCHEDULE' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
          <KeyboardAvoidingView style={{flex : 1}} behavior="padding" enabled keyboardVerticalOffset={5}>
            <ScrollView>
              <View style={{flex : 1, backgroundColor : '#ffffff', borderRadius : hp('1%'), padding : wp('2%'), margin : wp('2%')}}>
                {this.state.isDataLoaded &&
                    <View>
                      <View style={[styles.eachField, Platform.OS === 'ios'?{zIndex : 1}:{}]}>
                    <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Properties</Text>
                      <DropDownField
                        listShow = {this.state.properties}
                        placeholder = {this.state.propertiesPlaceHolder}
                        clearButton = {this.state.clearButtonPressed}
                        falseClearButton = {this.falseClearButton}
                        selectedValue = {this.filterByProperties}
                        name = 'title'
                        id = 'ID'
                        isObject = {true}
                      />
                  </View>
                      <View style={[{height : hp('10%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                        <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Properties Group</Text>
                          <DropDownField
                            listShow = {this.state.groupNameArray}
                            placeholder = {this.state.propertiesGroupPlaceHolder}
                            clearButton = {this.state.clearButtonPressed}
                            falseClearButton = {this.falseClearButton}
                            selectedValue = {this.filterByGroup}
                            name = 'title'
                            id = 'ID'
                            isObject = {true}                      
                          />
                      </View>
                      <View style={[{flexDirection : 'row' , alignItems : 'center'}, Platform.OS === 'ios'?{zIndex : -2}:{}]}>
                        <TouchableOpacity onPress={this.deleteGroupFromGroupArray}><Text style={{fontFamily : 'Raleway-SemiBold' , color : '#0071bc' , fontSize : (16)}}>Delete group</Text></TouchableOpacity>
                          <View style={{borderRightWidth : 1 , borderRightColor : '#0071bc', marginHorizontal : wp('1%'), height : hp('2%')}}></View>
                            <TouchableOpacity onPress={this.CreateGroupDialog}><Text style={{fontFamily : 'Raleway-SemiBold' , color : '#0071bc' , fontSize : (16)}}>New group</Text></TouchableOpacity>
                      </View>
                      <Text style={[{fontSize : 13, color : 'red', marginBottom : hp('2%')}, Platform.OS === 'ios'?{zIndex : -2}:{}]}>{this.state.deleteNotification}</Text>
                      <View style={[styles.eachField, Platform.OS === 'ios'?{zIndex : -3}:{}]}>
                        <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Contractors</Text>
                          <DropDownField
                            listShow = {this.state.contractors}
                            placeholder = {this.state.contractorsPlaceHolder}
                            clearButton = {this.state.clearButtonPressed}
                            falseClearButton = {this.falseClearButton}
                            selectedValue = {this.filterByContractor}
                            name = 'name'
                            id = 'ID'
                            isObject = {true}
                          />
                      </View>
                      <Text style={[{fontSize : 15 , color : 'red', marginBottom : wp('1%')}, Platform.OS === 'ios'?{zIndex : -4}:{}]}>{this.state.notification}</Text>
                      <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly', marginBottom : hp('2%')}, Platform.OS === 'ios'?{zIndex : -5}:{}]}>
                        <TouchableOpacity onPress = {this.clearFilter}  style={{flexDirection : 'row', height : hp('7%'), width : wp('40%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071bc'}}>
                          <Text style={{ color : '#ffffff', fontSize : (18), marginRight : wp('2%')}}>Clear Filter</Text>
                            {this.state.abcProcesing && <ActivityIndicator size ='small' color="#414141"/>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.applyFilter} style={{height : hp('7%'), width : wp('40%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8cc63f'}}>
                          <Text style={{color : '#ffffff', fontSize : (18)}}>Apply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                }
                {!this.state.isDataLoaded &&
                  <View style={{height : hp('100%'), alignItems:'center',justifyContent:'center'}}>
                      <ActivityIndicator
                        size='large'
                      />
                    </View>
                }
                  <CustomCalendar
                    width = {90}
                    token = {this.props.userToken} 
                    clearFilter = {this.state.clearFilter} 
                    applyFilter = {this.state.applyFilter} 
                    isDataLoaded = {this.state.isDataLoaded} 
                    propertyFilter = {this.state.propFilter} 
                    contractorFilter = {this.state.contractorId} 
                    onDataLoaded = {this.onDataLoaded}
                  />
                {this.state.isDataLoaded &&
                    <View style={{marginVertical : hp('2%')}}>
                      <TouchButton 
                        buttonName = 'Add New Job'
                        actionPerform = {ActionPerformFunc}
                        move = {{doingAction : 'doingAction', action : this.addNewJob}}
                        bgColor = '#8cc63f'
                        width = {wp('40%')}
                        height = {hp('7%')}
                        buttonNameSize = {(18)}
                        elevation = {5}
                        navigation = {this.props.navigation}
                      />
                    </View>
                }
              </View>
              <CreateGroupPopWindow userToken = {this.props.userToken} properties = {this.props.existingProperty}  addGroupInGroupArray = {this.addGroupInGroupArray} CreateGroupDialog = {this.CreateGroupDialog} isAddNewGroupDialogOpen = {this.state.isAddNewGroupDialogOpen}/>  
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
                    <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to delete this properties group?</Text>
                  </View>
                 </View>
                  <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                    <TouchableOpacity onPress = {this.deleteSelectedGroup}  style={{flexDirection : 'row', height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                      <Text style={{ color : '#ffffff', fontSize : (18), marginRight : wp('2%')}}>YES</Text>
                      {this.state.deleteProcesing && <ActivityIndicator size ='small' color="#414141"/>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({deleteDialogOpen : false})} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071BD'}}>
                      <Text style={{color : '#ffffff', fontSize : (18)}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
              </View>
             </Dialog>
            </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
}

const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  existingProperty : state.createJob.existingProperty,
});
export default connect(mapStateToProps)(ScheduleCalendar);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
    justifyContent : 'center'
  },
  eachField : {
    marginBottom : hp('2%'),
    height : hp('10%'),
  },
  textInputCon : {
    color : 'black',
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#f4f4f4' ,
    paddingLeft : wp('2%'),
  },
  touchForDropDown : {
    height:hp('7%'), 
    alignItems : 'flex-start', 
    justifyContent : 'center', 
    backgroundColor : '#f4f4f4' , 
    padding : wp('1.2%'),
    position : 'relative', 
    borderWidth : 1,
    borderColor :'#f4f4f4', 
    borderRadius : 2
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});

class CreateGroupPopWindow extends Component {
  constructor(props){
    super(props);
      this.state = {
        checked : false,
        groupName : '',
        groupNameErr : '',
        propertiesInGroup : [],
        propertiesInGroupErr : ''
      }
  }
  addNewPropertyGroup = async() => {
    if(this.state.groupName && this.state.propertiesInGroup){
      this.setState({processing : true});
      var jsonProperties = JSON.stringify(this.state.propertiesInGroup);
      var formData = new FormData();
      formData.append('title', this.state.groupName);
      formData.append('property_ids_json', jsonProperties);
      const res = await axios.post(server+'create_properties_group', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code == 200){
        ShowBar('Create Group Successfully' , 'success');
          obj = {
            title : this.state.groupName,
            properties : this.state.propertiesInGroup
          }
          this.setState({groupName : ''});
          this.props.addGroupInGroupArray(obj);
      }
      else{
        ShowBar('Something Wrong' , 'error');
        this.setState({processing : false});
      }
    }
    else{
      if(!this.state.groupName) {
        this.setState({groupNameErr : 'group name required'});
        }
      if(!this.state.propertiesInGroup[0]) {
        this.setState({propertiesInGroupErr : 'property required'});
      }
    }
  }
  addpropertiesInGroup = (array) => {
    this.setState({propertiesInGroup : array, propertiesInGroupErr : ''})
  }
  PressedCancel = () => {
    this.setState({groupName : ''});
    this.props.CreateGroupDialog(); 
  }
  render(){
    return(
      <Dialog
        visible={this.props.isAddNewGroupDialogOpen}
        dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
        contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
      > 
        <View>
          <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
            <Text style={{fontSize: (20) , color : '#ffffff' }}>NEW PROPERTY GROUP </Text> 
          </View>
          <View style={{justifyContent : 'center', alignItems : 'center'}}>
            <Image source={require('../../assets/new_group_icon.png')} style={{height : hp('10%'), width : hp('13%'), resizeMode : 'contain'}}/>
            </View>
          <View style={{marginBottom : hp('2%'), height : hp('10%'), marginHorizontal : wp('3%')}}>
              <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (16)}}>Property Group Name</Text>
                <TextInput placeholder='Group Name' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({groupName : text, groupNameErr : ''})} value={this.state.groupName}/>
                  <Text style={{color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12)}}>{this.state.groupNameErr}</Text>
            </View>
          <View style={{marginBottom : hp('10%'), height : hp('9%'), marginHorizontal : wp('3%')}}>
            <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (16)}}>Choose properties for this  group</Text>
              <DropDownForNewGroup
                listShow = {this.props.properties}
                placeholder = 'Choose Properties'
                height = {hp('18%')}
                selectedValue = {this.addpropertiesInGroup}
              />
              <Text style={{color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12)}}>{this.state.propertiesInGroupErr}</Text>
          </View>
          <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
            <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.addNewPropertyGroup}>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{ color : '#ffffff' , fontSize : (20)}}>Create</Text>
                  {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={this.PressedCancel}>
              <Text style={{ color : '#ffffff' , fontSize : (20)}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    )  
  }
}
class DropDownForNewGroup extends Component {
  constructor(props) {
    super(props);
      this.state = {
        placeholder : this.props.placeholder,
        isOpen : false,
        dropDownNotification : '',
        propertyIds : [],
        propertiesNames : [],
        prevProps : {}
      }
  }
  selectValue = (value) => {
    var flag = true ;
    flag = checkElement(this.state.propertiesNames);
      function checkElement(elementArr) {
        for(var i = 0; i < elementArr.length; i++){
          if(elementArr[i].id === value.ID) {
              return false ;
          }
        }
      }
    if(flag !== false){
      const tempIdsArr = this.state.propertyIds.slice();
      const tempNamesArr = this.state.propertiesNames.slice();
      tempIdsArr.push(value.ID);
      tempNamesArr.push({id : value.ID, name : value.post_title});
      this.setState({propertyIds : tempIdsArr, propertiesNames : tempNamesArr, isOpen : false});
      this.props.selectedValue(tempIdsArr);
      }    
  }
  deletePropertyFromGroup = (item) => {
    const tempIdsArr = this.state.propertyIds.slice();
    const tempNamesArr = this.state.propertiesNames.slice();
    const Index = tempNamesArr.findIndex(checkIndex);
    function checkIndex(property){
        return property.id === item.id;
      }
      tempNamesArr.splice(Index, 1);
      tempIdsArr.splice(Index, 1);
      this.setState({propertyIds : tempIdsArr, propertiesNames : tempNamesArr});
      this.props.selectedValue(tempIdsArr);
  }
  render(){
    return(
      <View>
        <View style={[styles.touchForDropDown, {width : this.props.width}]}>
          <TouchableOpacity onPress={() => {this.setState({isOpen : !this.state.isOpen ? true : false})}} style={{ height:hp('7%'), width : this.props.width, flexDirection : 'row', alignItems : 'center', width : this.props.width, flexWrap : 'wrap'}}>
            <ScrollView>
              <View style={{flexDirection : 'row', alignItems : 'center', width : this.props.width, flexWrap : 'wrap'}}>
                {
                  this.state.propertiesNames.map((item , index) => (
                    <View key={index} style={{height:hp('4%'), backgroundColor : '#f1fee0', flexDirection : 'row', alignItems : 'center' , borderRadius : hp('2%'), paddingHorizontal : wp('2%'), marginBottom : wp('0.5%') , marginRight : wp('1%')}}>
                      <Text style={{ color : '#8cc63f', fontSize : (14), marginRight : wp('3%')}}>{item.name}</Text>
                      <TouchableOpacity onPress = {() => this.deletePropertyFromGroup(item)} style={{height : hp('4%'), width : hp('4%'), justifyContent : 'center', alignItems : 'center'}}>
                        <Image source={require('../../assets/delete_prop_from_group_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
                      </TouchableOpacity>
                    </View>  
                  ))
                }
                {this.state.propertiesNames.length === 0 && <Text style={{fontSize : 15, color : '#292929', marginTop : hp('4%')}}>Select Properties</Text>}
              </View>
            </ScrollView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.setState({isOpen : !this.state.isOpen ? true : false})}} style={{width:hp('5%') , height:hp('5%'), justifyContent : 'center', alignItems : 'center', position : 'absolute', right : 5 ,top : 7}}>
            <Image source={require('../../assets/dropDown_Icon.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain' }}></Image>
          </TouchableOpacity>
        </View>
          {
            this.state.isOpen && 
              <ScrollView style={{elevation : 2, width : '100%', height : this.props.height, position : 'absolute', top : hp('7%'), backgroundColor: '#ffffff', zIndex : 9999}}  contentContainerStyle={{borderWidth:1, borderRadius:3, borderColor:'#D0D0D0'}}>
                  <FlatList
                    data={this.props.listShow}
                    keyExtractor={(item, index) => ""+ index}          
                    renderItem={({item , index}) =>  
                      <TouchableOpacity onPress={() => this.selectValue(item)} style={{height:hp('6%') , borderBottomWidth : 1, borderBottomColor : '#D0D0D0', justifyContent : 'center' , alignItems : 'flex-start'}}>
                        <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (13), padding : wp('2%')}}>{item.post_title}</Text>
                      </TouchableOpacity>}     
                  />
                </ScrollView>
          }
      </View>
    )
  }
}