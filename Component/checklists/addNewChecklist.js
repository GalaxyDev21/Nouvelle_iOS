import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, Dialog, TouchableOpacity,FlatList, ActivityIndicator,Animated} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import PopUpWindow from './popupScreen';
import EditDialog from './EditDialog'
import moment from 'moment-timezone';
import { connect } from 'react-redux'; 
import { StoreNewChecklistInAllChecklistData } from '../../Redux/createJob/jobAction' ;

class AddNewChecklist extends Component {
  constructor(props){
    super(props);
      this.state = {
        imageUrl : '',
        isDialogOpen : false,
        Index : '',
        editDialogOpen: false,
        indexToEdit: -1,
        itemSelectedToEdit: {},
        listChangeNumber: 0,
        data : [],
        newChecklistName : ''
      }
  }     
  performAction = () => {
    this.setState({
      isDialogOpen : true,
    });
  }
  closeDialog = () => {
      this.setState({
        isDialogOpen : false
      });
  }
  closeDialogAndAddItem = (obj) => {
    tempArr = this.state.data.slice();
    tempArr.push(obj);
    this.setState({
      data : tempArr,
      isDialogOpen : false
    });
}
  ActionOnSelectedProperty = (action, item) => {
    index = this.findIndexOfHeading(item);
    this.setState({
      Index : index
    }, function(){
      if(action === 'Edit'){
          this.setState({
            editableText : item,
            isTextEditable : true,
            isDialogOpen : true,
          }) 
        }
        else if(action === 'Delete'){
          this.deleteSelectedItem();
        }
    })      
  }
  findIndexOfHeading = (value) => {
    tempArr = this.state.data.slice();
    const index = tempArr.findIndex(checkIndex);
      function checkIndex(obj){
        return obj.id === value.id ;
      }
        return index;
  }
  deleteSelectedItem = () => {
    tempDataArray = this.state.data.slice();
    tempDataArray.splice(this.state.Index, 1);
      this.setState({data : tempDataArray});
  }
  openEditDialog = (item,index) =>{
    this.setState({
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
  tempItem.heading = text
  this.setState({
    itemSelectedToEdit: tempItem
  })
  }
  onItemEdit = (text,index) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.item[index].content = text
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onItemChecked = (index) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.item[index].checked = !tempItem.item[index].checked;
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onImageEdit = (image) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.image = image
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onRemoveItem = (index) =>{
    tempItem = this.state.itemSelectedToEdit;
    tempItem.item.splice(index,1);
    this.setState({
      itemSelectedToEdit: tempItem
    })
  }
  onAddItem = () =>{
    tempItem = this.state.itemSelectedToEdit;
    newObj = {
      id:(Math.max.apply(Math, tempItem.item.map(function(o) {return o.id; })))+1,
      content: 'New Task',
      checked: false         
    }
    tempItem.item.unshift(newObj);
    this.setState({
      itemSelectedToEdit: tempItem
    })
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
    swapper = tempItem.item[index1];
    tempItem.item[index1] = tempItem.item[index2];      
    tempItem.item[index2] = swapper;
    this.setState({
      itemSelectedToEdit: tempItem
    })
  } 
  onSwapMainItem = (index1,index2) =>{
    tempItem = this.state.data;
    swapper = tempItem[index1];
    tempItem[index1] = tempItem[index2];      
    tempItem[index2] = swapper;
    this.setState({
      data: tempItem,
      listChangeNumber: this.state.listChangeNumber+1
    })
  }
  swappingOther = (refname, direction) =>{
      if(direction === -1)
      {this[refname].swapDown();}
      else if(direction === 1)
      {this[refname].swapUp();}
  }
  createChecklistPressed =()=> {
      if(this.state.newChecklistName){
        tempChecklistObj = {
        id:(Math.max.apply(Math, this.props.allChecklists.map(function(o) {return o.id; })))+1,
          name : this.state.newChecklistName,
          time : moment(new Date()).format("MMM DD, YYYY"),
          data : this.state.data
        }
        this.props.StoreNewChecklistInAllChecklistData(tempChecklistObj);
        this.props.navigation.navigate('MyCheckLists1');
      }
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
        <StatusBar title='NEW CHECKLISTS' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          <View style={{marginBottom : hp('2%'), backgroundColor : '#f6f6f6', padding : wp('3%'), marginHorizontal : wp('2%'), borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8'}}>
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('1%')}}>
              <TextInput placeholder='Checklist Name' placeholderTextColor='#0071bc' style={styles.textInputCon1} onChangeText={(text)=>this.setState({newChecklistName : text})} value={this.state.newChecklistName}/>
                <TouchButton 
                  buttonName = 'Add'
                  actionPerform = {ActionPerformFunc}
                  move = {{doingAction : 'doingAction', action : this.performAction}}
                  bgColor = '#8cc63f'
                  width = {wp('22%')}
                  height = {hp('4%')}
                  marginValue = {wp('2%')}
                  buttonNameSize = {(12)}
                  navigation = {this.props.navigation}
                />
            </View>
            <Text style={{ color : '#292929' , fontSize : (15), marginBottom : hp('1%')}}>Checklist draft</Text>
              <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%')}}>
                <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                  <Text style={{fontSize : (15), color : '#292929'}}>{moment(new Date()).format("MMM DD, YYYY")}</Text>
              </View>
              <ScrollView style={{height : hp('60%')}} nestedScrollEnabled={true}>
                <FlatList
                  data={this.state.data}
                  renderItem={(item)=><SpecificHeadingAndItem 
                    item={item} 
                    ActionOnSelectedProperty = {this.ActionOnSelectedProperty}
                    openEdit = {this.openEditDialog}
                    ref={(itemref) => this['itemref'+item.item.id]=itemref}
                    itemsArray = {this.state.data}
                    swappingOther = {this.swappingOther}
                    onSwapMainItem = {this.onSwapMainItem}
                    extraData = {this.state.listChangeNumber}
                    length = {this.state.data.length}
                    //setCheckListScrolling = {this.props.setCheckListScrolling}
                    />
                  }
                    extraData = {this.state.listChangeNumber}
                    keyExtractor = {(item , index) => item.id.toString()}
                    scrollPercent={5}
                />
              </ScrollView>  
              {
                this.state.isDialogOpen && 
                <PopUpWindow 
                  isDialogOpen = {this.state.isDialogOpen} 
                  closeDialog = {this.closeDialog}
                  closeDialogAndAddItem = {this.closeDialogAndAddItem}
                  navigation = {this.props.navigation}
                  item = {this.state.data}
                  onHeadingEdit = {this.onHeadingEdit}
                  onItemEdit = {this.onItemEdit}
                  onImageEdit = {this.onImageEdit}
                  onItemChecked = {this.onItemChecked}
                  onRemoveItem = {this.onRemoveItem}
                  onAddItem = {this.onAddItem}
                  onSwapItem = {this.onSwapItem}
                  onEditConfirm = {this.onEditConfirm}
                />
              }
              {
                this.state.editDialogOpen && 
                <EditDialog 
                  isDialogOpen = {this.state.editDialogOpen} 
                  closeDialog = {this.closeEditDialog} 
                  addNewItemAndHeader ={this.addNewItemAndHeader}
                  EditTableText = {this.state.editableText}
                  navigation = {this.props.navigation}
                  item = {this.state.itemSelectedToEdit}
                  onHeadingEdit = {this.onHeadingEdit}
                  onItemEdit = {this.onItemEdit}
                  onImageEdit = {this.onImageEdit}
                  onItemChecked = {this.onItemChecked}
                  onRemoveItem = {this.onRemoveItem}
                  onAddItem = {this.onAddItem}
                  onSwapItem = {this.onSwapItem}
                  onEditConfirm = {this.onEditConfirm}
                />
              }  
          </View>
          <View style={{justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%')}}>
            <TouchButton 
              buttonName = 'Create Checklist'
              actionPerform = {ActionPerformFunc}
              move = {{doingAction : 'doingAction', action : this.createChecklistPressed}}
              bgColor = '#8cc63f'
              width = {wp('45%')}
              height = {hp('7%')}
              marginValue = {wp('2%')}
              buttonNameSize = {(17)}
              navigation = {this.props.navigation}
              elevation = {5}
            />
          </View>
      </ImageBackground>
    )    
  }
}
const mapStateToProps = state => ({
  allChecklists : state.createJob.allChecklists,
});
export default connect(mapStateToProps, {StoreNewChecklistInAllChecklistData})(AddNewChecklist);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
 },
  iconAndText : {
    height : hp('7%'),
    flexDirection : 'row',
    alignItems : 'center',
    backgroundColor : '#ffffff',
    borderRadius : wp('1%'),
    paddingHorizontal : wp('2%')
  },
  textInputCon : {
    fontSize : (15) ,
    width : '83%' ,
    color : '#292929',
    marginRight : wp('2%')      
  },
  textInputCon1 : {
    fontSize : (18) ,
    width : '60%' ,
    color : '#0071bc',     
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
      transitioning: false
    }
  }
  onLayout = (e) => {
    this.setState({
      compHeight: e.nativeEvent.layout.height,
    })
  }
  swapInitiateUp = () =>{
    this.props.swappingOther('itemref'+ this.props.itemsArray[this.props.item.index - 1].id, -1);
    this.swapUp();
  }
  swapInitiateDown = () =>{
    this.props.swappingOther('itemref'+ this.props.itemsArray[this.props.item.index + 1].id, 1);
    this.swapDown();
  }
  resetValues = (direction) =>{
    if(this.state.transitioning)
    {this.props.onSwapMainItem(this.props.item.index,this.props.item.index+direction);}
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:0,                   
        duration: 0,              
      }
    ).start(()=>{this.setState({transitioning:false})});
  }
  swapUp = () =>{
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:-(this.state.compHeight+hp('5%')),                   
        duration: 300,              
      }
    ).start(()=>{this.resetValues(-1)}); 
  }
  swapDown = () =>{
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:(this.state.compHeight+hp('5%')),                   
        duration: 300,              
      }
    ).start(()=>{this.resetValues(1)});
  }
  render(){
    const { index, item} = this.props.item;
    return(
      <Animated.View onLayout={this.onLayout} disabled = {this.state.isTouchDisable} style={{marginBottom : hp('5%'),transform: [{ translateY: this.state.positionVal }]}}>
        <View style={{flexDirection:'row',flex:1}}>
          <View style={{flex:0.5}}>
            <Text style={{fontSize : (20), color : '#292929'}}>{item.heading}</Text>
          </View>
          <View style={{flex:0.5, justifyContent:'flex-end',flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{this.props.ActionOnSelectedProperty('Delete',item)}} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
              <Image source={require('../../assets/delete_checklist.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/> 
            </TouchableOpacity>
            {index < this.props.length-1 &&
            <TouchableOpacity  onPress={()=>{this.setState({transitioning:true}, this.swapInitiateDown)}} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
              <Image source={require('../../assets/move_down_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/> 
            </TouchableOpacity>}
            {index >0 &&
              <TouchableOpacity onPress={()=>{this.setState({transitioning:true},this.swapInitiateUp)}}  style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                <Image source={require('../../assets/move_down_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain', transform: [{ rotate: '180deg'}]}}/> 
              </TouchableOpacity>} 
              <TouchableOpacity onPress={()=>{this.props.openEdit(item,index)}} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                <Image source={require('../../assets/edit_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/> 
              </TouchableOpacity>
          </View>
          </View> 
          {
            item.item.map((element)=>{
            return <View key={element.id} style={styles.iconAndText}>  
            <View style={{height : hp('3%'), width : hp('3%'),justifyContent : 'center', alignItems : 'center', backgroundColor : element.checked? '#0071bc' : '#8d8d8d', borderRadius : 100, marginRight : wp('2%')}}>
              <Icon name = 'check' size = {15} color = {'white'}/>
            </View>
              <Text style={styles.textInputCon}>{element.content}</Text>
            </View>
            })
          } 
          <Image style={{width: wp('87%'), height: hp('25%'), resizeMode : 'stretch', borderRadius : wp('1%')}} source={{uri: item.image}}/>  
      </Animated.View>
    )
  }
}