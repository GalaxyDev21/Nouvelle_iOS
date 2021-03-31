import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, FlatList, Animated} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import TouchButton from '../InputFields/touchButton';
import PopUpWindow from './popupScreen';
import EditDialog from './EditDialog';
import moment from 'moment';
import axios from 'axios';
import {server} from '../../Redux/server';
import {GetSpecificChecklistDetails, FalseLoader} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED} from '../../Redux/createJob/actionType';
import { Dialog} from 'react-native-simple-dialogs';

class EachChecklistDetails extends Component {
  constructor(props){
    super(props);
      this.state = {
        checklistName : this.props.data.post_title,
        isTextEditable : false,
        imageUrl : '',
        isDialogOpen : false,
        Index : '',
        editDialogOpen: false,
        itemSelectedToEdit: {},
        indexToEdit: -1,
        listChangeNumber: 0,
        data : this.props.data.headings,
        itemsArray : [],
      }
  }
  openNewHeadingDialog = () => {
      this.setState({
        isDialogOpen : true,
      });
  }
  closeNewHeadingDialog = () => {
      this.setState({
        isDialogOpen : false
      });
  }
  closeAndAddNewHeadingDialog = (obj, arr) => {
    tempArr = this.state.data.slice();
    tempArr.push(obj);
      this.setState({
        data : tempArr,
        isDialogOpen : false
      });
  }
  ActionOnSelectedProperty = (item) => {
    index = this.findIndexOfHeading(item);
    this.setState({
      Index : index
    }, function(){
        this.deleteSelectedItem(item);
    })      
  }
  findIndexOfHeading = (value) => {
      tempArr = this.state.data.slice();
      const index = tempArr.findIndex(checkIndex);
        function checkIndex(obj){
          return obj.ID === value.ID ;
        }
          return index;
  }
  deleteSelectedItem = () => {
    tempDataArray = this.state.data.slice();
    tempDataArray.splice(this.state.Index, 1);
    this.setState({data : tempDataArray});
  }
  openEditDialog = (item,index) => {
    const arr = item.titles.map((item, index) => {return item.title});
    this.setState({
      itemsArray : arr,
      itemSelectedToEdit: {...item},
      indexToEdit : index,
      editDialogOpen : true
    })
  }
  closeEditDialog = () => {
      this.setState({
        editDialogOpen : false
      });
  }
  onHeadingEdit = (text) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.item_title = text
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onItemEdit = (text,index) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempArr = this.state.itemsArray;
    tempItem.titles[index].title = text;
    tempArr[index] = text;
    this.setState({
      itemSelectedToEdit: tempItem,
      itemsArray : tempArr
    })
  }
  onItemChecked = (index) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.item[index].checked = !tempItem.item[index].checked;
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onHeadingChecked = () =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.high_light = tempItem.high_light === 'yes' ? 'no' : 'yes';
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onImageEdit = (image) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.add_image = image
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onRemoveItem = (index) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempArr = this.state.itemsArray;
    tempItem.titles.splice(index,1);
    tempArr.splice(index,1);
    this.setState({
      itemSelectedToEdit: tempItem,
      itemsArray : tempArr
    });
  }
  onAddItem = () =>{
    tempItem = this.state.itemSelectedToEdit;
    tempArr = this.state.itemsArray;
    if(tempItem.titles[0]){
      newObj = {
        ID:(Math.max.apply(Math, tempItem.titles.map(function(o) {return o.ID; })))+1,
        title: 'New Task',         
      };
      tempArr.push(newObj.title);
      tempItem.titles.push(newObj);
      this.setState({itemSelectedToEdit: tempItem, itemsArray : tempArr});
    }
    else{
      newObj = {
        ID : 1,
        title: 'New Task',         
      }
      tempArr.push(newObj.title);
      tempItem.titles.push(newObj);
      this.setState({itemSelectedToEdit: tempItem, itemsArray : tempArr});
    }
  }
  onEditConfirm = () => {
    tempItem = this.state.data;
    tempItem[this.state.indexToEdit] = {...this.state.itemSelectedToEdit}
    this.setState({
      data: tempItem,
      listChangeNumber: this.state.listChangeNumber+1
    })
  }
  onSwapItem = (index1,index2) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempArr = this.state.itemsArray;
    swapper = tempItem.titles[index1];
    swapper2 = tempArr[index1];
    tempItem.titles[index1] = tempItem.titles[index2];
    tempArr[index1] = tempArr[index2];       
    tempItem.titles[index2] = swapper;
    tempArr[index2] = swapper2;
    this.setState({
      itemSelectedToEdit: tempItem,
      itemsArray : tempArr
    })
  }
  onSwapMainItem = async(index1, index2) => {
    tempItem = this.state.data;
    swapper = tempItem[index1];
    tempItem[index1] = tempItem[index2];      
    tempItem[index2] = swapper;
    this.setState({
      data: tempItem,
      listChangeNumber: this.state.listChangeNumber+1
    })
    var formData = new FormData();
    formData.append('id', this.props.data.ID);
    formData.append('h1', tempItem[index1].ID);
    formData.append('h2', tempItem[index2].ID);
    const res = await axios.post(server+'check_list_heading_reorder', formData ,{
      headers : {'Authorization': 'Bearer '+ this.props.userToken},
    });
    if(res.data.code == 200){
      ShowBar('Change Saved!' , 'success');
      //this.setState({isDeleteHeading : false});
    }
    else{
      this.setState({isDeleteHeading : false});
      ShowBar('Sorry, Unable to save change' , 'error');
    }
  }
  swappingOther = (refname, direction) =>{
    if(direction === -1)
    {this[refname].swapDown();}
    else if(direction === 1)
    {this[refname].swapUp();}
  }
  onChangeName = (text) => {
    this.setState({checklistName : text},function(){
      this.props.setChecklistName(this.state.checklistName);
    });
  }
  getChecklistDetail = (id) => {

    var formData = new FormData();
      formData.append('id', id);
      this.props.FalseLoader(IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED);
      this.props.GetSpecificChecklistDetails(this.props.userToken, formData);
      ShowBar('Deleted Successfully' , 'success');
  }
  render(){
    // console.log("checklist Detail");
    // console.log(this.props.data);
    return(
      <View style={{marginBottom : hp('2%'), backgroundColor : '#f6f6f6', padding : wp('3%'), borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8'}}>
        <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('1%')}}>
          <TouchableOpacity onPress={()=>this.setState({isTextEditable : true})}>
            <TextInput editable = {this.state.isTextEditable} placeholder='Checklist Name' placeholderTextColor='#0071bc'  style={styles.textInputCon} onChangeText={(text)=>this.onChangeName(text)} value={this.state.checklistName}/>
          </TouchableOpacity>
            <TouchButton 
              buttonName = 'Add'
              actionPerform = {ActionPerformFunc}
              move = {{doingAction : 'doingAction', action : this.openNewHeadingDialog}}
              bgColor = '#8cc63f'
              width = {wp('22%')}
              height = {hp('4%')}
              marginValue = {wp('2%')}
              buttonNameSize = {(12)}
              navigation = {this.props.navigation}
            />
        </View>
          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (15), marginBottom : hp('1%')}}>Checklist draft</Text>
            <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%')}}>
              <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
              <Text style={{fontSize : (15), color : '#292929'}}>{moment(this.props.data.post_date).format('MMM D, YYYY')}</Text>
            </View>
              <ScrollView nestedScrollEnabled={true}>
                <FlatList
                  data={this.state.data}
                  renderItem={(item)=><SpecificHeadingAndItem 
                      item={item} 
                      ActionOnSelectedProperty = {this.ActionOnSelectedProperty}
                      openEdit = {this.openEditDialog}
                      ref={(itemref) => this['itemref'+item.item.ID]=itemref}
                      itemsArray = {this.state.data}
                      swappingOther = {this.swappingOther}
                      onSwapMainItem = {this.onSwapMainItem}
                      extraData = {this.state.listChangeNumber}
                      length = {this.state.data.length}
                      checklistID = {this.props.data.ID}
                      userToken = {this.props.userToken}
                      swipApiCall = {this.swipApiCall}
                      getChecklistDetail = {this.getChecklistDetail}
                    />
                  }
                  extraData = {this.state.listChangeNumber}
                  keyExtractor = {(item , index) => item.ID.toString()}
                  scrollPercent={5}
                />
              </ScrollView>
              {this.state.isDialogOpen && 
                <PopUpWindow 
                  isDialogOpen = {this.state.isDialogOpen} 
                  closeDialog = {this.closeNewHeadingDialog}
                  closeDialogAndAddItem = {this.closeAndAddNewHeadingDialog} 
                  navigation = {this.props.navigation}
                  item = {this.state.data}
                  onHeadingEdit = {this.onHeadingEdit}
                  onEditConfirm = {this.onEditConfirm}
                  checklistID = {this.props.data.ID}
                  userToken = {this.props.userToken}
                />
              }
              {this.state.editDialogOpen && 
                <EditDialog 
                  isDialogOpen = {this.state.editDialogOpen} 
                  closeDialog = {this.closeEditDialog} 
                  navigation = {this.props.navigation}
                  item = {this.state.itemSelectedToEdit}
                  onHeadingEdit = {this.onHeadingEdit}
                  onItemEdit = {this.onItemEdit}
                  onImageEdit = {this.onImageEdit}
                  onHeadingChecked = {this.onHeadingChecked}
                  onRemoveItem = {this.onRemoveItem}
                  onAddItem = {this.onAddItem}
                  onSwapItem = {this.onSwapItem}
                  onEditConfirm = {this.onEditConfirm}
                  checklistID = {this.props.data.ID}
                  userToken = {this.props.userToken}
                  itemsArray = {this.state.itemsArray}
                />
              }  
      </View>
    )    
  }
}

const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
});
export default connect(mapStateToProps, {GetSpecificChecklistDetails, FalseLoader})(EachChecklistDetails);
const styles = StyleSheet.create({
  iconAndText : {
    height : hp('6%'),
    flexDirection : 'row',
    alignItems : 'center',
    backgroundColor : 'lightgray',
    borderRadius : wp('1%'),
    paddingHorizontal : wp('2%')
  },
  textInputCon3 : {
    fontSize : 15 ,
    width : '85%' ,
    color : '#292929',
    marginRight : wp('2%')      
  },
  textInputCon : {
    fontSize : 20 ,
    width : wp('60%') ,
    color : '#0071bc',
    marginRight : wp('2%')      
  },
});

class SpecificHeadingAndItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      isDropDownOpen : false,
      isTouchDisable : true,
      fadeValue: new Animated.Value(1),
      positionVal: new Animated.Value(0),
      compHeight: 0,
      transitioning: false,
      isDeleteHeading : false,
      deleteDialogOpen : false
    }
  }
  onLayout = (e) => {
    this.setState({
      compHeight: e.nativeEvent.layout.height,
    });
  }
  swapInitiateUp = () =>{
    this.props.swappingOther('itemref'+ this.props.itemsArray[this.props.item.index - 1].ID, -1);
    this.swapUp();
  }
  swapInitiateDown = () =>{
    this.props.swappingOther('itemref'+ this.props.itemsArray[this.props.item.index + 1].ID, 1);
    this.swapDown();
  }
  resetValues = (direction) =>{
    if(this.state.transitioning)
    {this.props.onSwapMainItem(this.props.item.index,this.props.item.index+direction);}
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue : 0,                   
        duration : 0,              
      }
    ).start(()=>{this.setState({transitioning : false})});
  }
  swapUp = () =>{
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:-(this.state.compHeight+hp('5%')),                   
        duration: 500,              
      }
    ).start(()=>{this.resetValues(-1)}); 
  }
  swapDown = () =>{
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:(this.state.compHeight+hp('5%')),                   
        duration: 500,              
      }
    ).start(()=>{this.resetValues(1)});
  }
  deleteHeading = async() => {
    var formData = new FormData();
    formData.append('check_list_id', this.props.checklistID);
    formData.append('row_id', this.props.item.item.ID) ;
    const res = await axios.post(server+'delete_check_list_heading', formData ,{
      headers : {'Authorization': 'Bearer '+ this.props.userToken},
    });
    if(res.data.code == 200){
      this.props.getChecklistDetail(this.props.checklistID);
      //this.props.ActionOnSelectedProperty(this.props.item.item);
    }
    else{
      this.setState({isDeleteHeading : false});
      ShowBar('Sorry, Unable to delete' , 'error');
    }
  }
  render(){
    const { index, item} = this.props.item;
    return(
      <Animated.View onLayout={this.onLayout} disabled = {this.state.isTouchDisable} style={{flex : 1, marginBottom : hp('2%'),transform: [{ translateY: this.state.positionVal }]}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{height : hp('3%'), width : hp('3%'),justifyContent : 'center', alignItems : 'center',  backgroundColor : item.high_light === 'yes' ? '#0071bc' : '#8d8d8d', borderRadius : 100, marginRight : wp('2%')}}>
            <Icon name = 'check' size = {15} color = 'white'/>
          </View>
          <View style={{flex:0.5, marginLeft : wp('2%')}}>
            <Text style={{fontSize : (20), color : '#292929'}}>{item.item_title}</Text>
          </View>
          <View style={{flex:0.5, justifyContent:'flex-end',flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{console.log(item.ID); this.setState({deleteDialogOpen : true})}} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('4%'), height : hp('4%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
              <Image source={require('../../assets/delete_checklist.png')} style={{height : hp('2.5%'), width : hp('2.5%'), resizeMode : 'contain'}}/> 
            </TouchableOpacity>
            {index < this.props.length-1 &&
              <TouchableOpacity  onPress={()=>{this.setState({transitioning:true}, this.swapInitiateDown)}} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('4%'), height : hp('4%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                <Image source={require('../../assets/move_down_icon.png')} style={{height : hp('2.5%'), width : hp('2.5%'), resizeMode : 'contain'}}/> 
              </TouchableOpacity>}
              {index >0 &&
                <TouchableOpacity onPress={()=>{this.setState({transitioning:true},this.swapInitiateUp)}}  style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('4%'), height : hp('4%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                  <Image source={require('../../assets/move_down_icon.png')} style={{height : hp('2.5%'), width : hp('2.5%'), resizeMode : 'contain', transform: [{ rotate: '180deg'}]}}/> 
                </TouchableOpacity>} 
                <TouchableOpacity onPress={()=>{this.props.openEdit(item,index)}} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('4%'), height : hp('4%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                  <Image source={require('../../assets/edit_icon.png')} style={{height : hp('2.5%'), width : hp('2.5%'), resizeMode : 'contain'}}/> 
                </TouchableOpacity>
          </View>
        </View> 
          {
            item.titles.map((element, index)=>{
              return <View key={element.ID} style={styles.iconAndText}>
                <Text style={styles.textInputCon3}>{element.title}</Text>
              </View>
            })
          } 
          {
            item.add_image &&  <Image style={{width: wp('87%'), height: hp('25%'), resizeMode : 'stretch', borderRadius : wp('1%')}} source={{uri: item.add_image}}/>
          }  
          {this.state.isDeleteHeading &&
            <View style={{height : this.state.compHeight, width : '100%', alignItems : 'center', justifyContent : 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)', borderRadius : wp('1%'), borderWidth : 1, borderColor : '#dbdbdb', position : 'absolute'}}>
              <ActivityIndicator size='small'/>
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
                  <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to delete this checklist?</Text>
                </View>
                </View>
                <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                  <TouchableOpacity onPress={()=>{this.deleteHeading(), this.setState({isDeleteHeading : true, deleteDialogOpen : false})}}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                    <Text style={{ color : '#ffffff', fontSize : (18)}}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({deleteDialogOpen : false})} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071BD'}}>
                    <Text style={{color : '#ffffff', fontSize : (18)}}>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Dialog> 
      </Animated.View>
    )
  }
}
