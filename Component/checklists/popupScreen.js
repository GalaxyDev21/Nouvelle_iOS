import React ,{Component} from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, TouchableOpacity, Image,CheckBox,Animated} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {server} from '../../Redux/server';

class PopupScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      header : '', 
      items : [
        {
          ID : 1,
          title : '',
        }
      ],
      itemsWithoutID : [''],
      itemHeaderObj : {},
      isAddNewItem : '',
      image : null,
      swapIndex: -1,
      checked : false,
      headerNotification : '',
      deleteDialogOpen : false
    }
  }
  componentDidMount() {
    this.getPermissionAsync();
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({
        image: result.uri,
        uploadImage : true
      });
    }
  };
  setItems = () =>{
    items = []
    for (let index = 0; index < this.state.items.length; index++) {
      const element = this.state.items[index];
      newItem =  <ItemItem 
        onSwapItem = {this.onSwapItem} 
        itemsArray = {this.state.items} 
        swappingOther = {this.swappingOther}  
        ref={(itemref) => this['itemref'+element.ID] = itemref}  
        length = {this.state.items.length}
        onRemoveItem = {this.onRemoveItem}  
        key ={element.ID+''} 
        item ={this.state.items}
        element = {element} 
        onItemEdit = {this.onItemEdit} 
        index = {index}
      />
      items.push(newItem);
    }
    return items;
  }
  swappingOther = (refname,direction) =>{
      if(direction === -1)
      {this[refname].swapDown();}
      else if(direction === 1)
      {this[refname].swapUp();}
  }
  onSwapItem = (index1,index2) =>{
    tempItem = this.state.items;
    swapper = tempItem[index1];
    tempItem[index1] = tempItem[index2];      
    tempItem[index2] = swapper;
    this.setState({
      items : tempItem
    })
  }
  onItemEdit = (text, index) =>{
    tempItem = this.state.items;
    tempArr = this.state.itemsWithoutID;
    tempItem[index].title = text,
    tempArr[index] = text,
    this.setState({
      items: tempItem,
      itemsWithoutID : tempArr
    })
  }
  onRemoveItem = (index) =>{
    tempItem = this.state.items;
    tempArr = this.state.itemsWithoutID;
    tempItem.splice(index,1);
    tempArr.splice(index,1);
    this.setState({
      items: tempItem,
      itemsWithoutID : tempArr
    })
  }
  onAddItem = () =>{
    tempItem = this.state.items;
    tempArr = this.state.itemsWithoutID;
    newObj = {
      ID : (Math.max.apply(Math, tempItem.map(function(o) {return o.ID; }))) + 1,
      title : 'New Task',         
    }
    tempArr.push(newObj.title);
    tempItem.push(newObj);
    // console.log('*********** Temp Items **********');
    // console.log(tempItem);
    // console.log('*********************');
    this.setState({
      items: tempItem,
      itemsWithoutID : tempArr 
    })
  }
  pressedcancel = () => {
    this.props.closeDialog();
  }
  pressedAdd = () => {
    if(this.state.header){
      this.setState({addProcessing : true, isButtonDisable : true}, function(){this.apiCall()}); 
    }
    else{
      this.setState({headerNotification : 'heading required'});
    }
  }
  apiCall = async() => {
    var items = JSON.stringify(this.state.itemsWithoutID);
    const file= {
      uri: this.state.image,
      name: 'image',
      type: 'image/jpg',
    }
    var formData = new FormData();
      formData.append('id', this.props.checklistID);
      formData.append('heading_title', this.state.header) ;
      formData.append('highlight', this.state.checked) ;
      formData.append('private', 'yes') ;
      formData.append('sub_title_json', items) ;
      formData.append('add_image', this.state.image ? file : '');
      const res = await axios.post(server+'add_check_list_heading', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      if(res.data.code == 200){
        ShowBar('Added Successfully' , 'success');
        const tempObj = {
          ID : !this.props.item[0] ? 1 : (Math.max.apply(Math, this.props.item.map(function(o) {return o.ID; })))+1,
          item_title : this.state.header,
          make_private : "yes",
          add_image : this.state.image,
          high_light : this.state.checked ? 'yes' : 'no',
          titles : this.state.items,  
        }
        this.props.closeDialogAndAddItem(tempObj);
      }
      else{
        ShowBar('Sorry, Unable to add' , 'error');
        this.setState({addProcessing : false, isButtonDisable : false});
      }
  }
  render(){
    return(
      <Dialog
        visible={this.props.isDialogOpen}
        dialogStyle={{borderRadius: 10,overflow: 'hidden', backgroundColor : '#ffffff'}}
        contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0, paddingTop : 0 }}
      >
        <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
          <Text style={{fontSize: (24) , color : '#ffffff' }}>EDIT CHECKLIST</Text> 
        </View>
        <View style={{margin : wp('3%'),height:hp('60%')}}>
          <ScrollView>
            <View style={{marginBottom : hp('2%'), height : hp('9%')}}>
              <Text style={{ color : '#292929', fontSize : (18)}}>Heading</Text>
              <TextInput placeholder='Heading' placeholderTextColor='#292929'  style={styles.textInputInDailog} onChangeText={(text)=>this.setState({header : text})} value = {this.state.header}  />
              <Text style={{color : 'red', fontSize : (12)}}>{this.state.headerNotification}</Text>
            </View>
            <CheckBox onValueChange = {()=>this.setState({checked : !this.state.checked ? true : false})} value= {this.state.checked}/>
              <View style={{marginBottom : hp('2%')}}>
                <View style={{flexDirection:'row',alignItems:'center', marginBottom : hp('0.5%')}}>
                  <Text style={{ color : '#292929', fontSize : (18), marginRight : wp('2%')}}>Item</Text>
                  <TouchableOpacity onPress = {this.onAddItem} style={{marginLeft:wp('1%'),backgroundColor : '#8cc63f', height : hp('4%'), width : hp('4%'), justifyContent : 'center', alignItems : 'center', borderRadius : hp('2%')}}>
                    <Image source={require('../../assets/plus_sign.png')} style={{height : hp('1.5%'), width : hp('1.5%'), resizeMode : 'contain'}}/> 
                  </TouchableOpacity>
                </View>
                <View>
                  {
                    this.setItems()
                  }
                </View>
                <Text style={{color : 'red', fontSize : (12)}}>{this.state.itemErr}</Text>
              </View>
              <Text style={{fontSize : (18), color: '#292929'}}>Add Image</Text>
              <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between', marginBottom : hp('3%')}}>
                <View style={{justifyContent : 'center', alignItems : 'center', height : hp('21%'), width : hp('19%'), borderWidth : 1, borderColor : '#DBDBDB', backgroundColor : '#ffffff'}}>
                  <View style={{alignItems: 'center', justifyContent: 'center',height : hp('7%'), width : wp('7%')}}>
                    <Image source={require('../../assets/upload_image.jpg')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
                  </View>
                  <TouchButton 
                    buttonName = 'Add image'
                    actionPerform = {ActionPerformFunc}
                    move = {{doingAction : 'doingAction', action : this.pickImage}}
                    bgColor = '#8cc63f'
                    width = {wp('30%')}
                    height = {hp('4%')}
                    buttonNameSize = {(15)}
                    elevation = {0}
                    navigation = {this.props.navigation}
                  />
                </View>
                <View style={{justifyContent : 'center', alignItems : 'center', height: hp('21%'), width : hp('19%')}}>
                  <Image source={{ uri: this.state.image }} style={{height: hp('21%'), width : hp('19%'), resizeMode : 'stretch'}} /> 
                </View>
              </View>
            </ScrollView>
            <View style={{height : 1, backgroundColor : '#c0c0c0', marginBottom : hp('2%')}}></View>
            <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', marginBottom : hp('2%')}}>
              <TouchableOpacity disabled={this.state.isButtonDisable} style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.pressedAdd}>
                <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{ color : '#ffffff' , fontSize : (20)}}>Add</Text>
                    {this.state.addProcessing && <ActivityIndicator size ='small' color="#414141"/>}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={this.pressedcancel}>
                <Text style={{ color : '#ffffff' , fontSize : (20)}}>Cancel</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Dialog>
    )
  }
}
class ItemItem extends Component {
  state = {      
      fadeValue: new Animated.Value(1),
      positionVal: new Animated.Value(0),
      compHeight: 0,
      transitioning: false
  }
  onLayout = (e) => {
    this.setState({
      compHeight: e.nativeEvent.layout.height,
    })
  }
  removeElement = () =>{
    Animated.timing(                  
      this.state.fadeValue,            
      {
        toValue:0,                   
        duration: 300,              
      }
    ).start(()=>{this.props.onRemoveItem(this.props.index)}); 
  }
  swapInitiateUp = () =>{
    this.props.swappingOther('itemref'+ this.props.itemsArray[this.props.index-1].ID,-1);
    this.swapUp();
  }
  swapInitiateDown = () =>{
    this.props.swappingOther('itemref'+ this.props.itemsArray[this.props.index+1].ID,1);
    this.swapDown();
  }
  swapUp = () =>{
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:-(this.state.compHeight+hp('1%')),                   
        duration: 300,              
      }
    ).start(()=>{this.resetValues(-1)}); 
  }
  resetValues = (direction) =>{
    if(this.state.transitioning)
    {this.props.onSwapItem(this.props.index,this.props.index+direction);}
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:0,                   
        duration: 0,              
      }
    ).start(()=>{this.setState({transitioning:false})});
  }
  swapDown = () =>{
    Animated.timing(                  
      this.state.positionVal,            
      {
        toValue:(this.state.compHeight+hp('1%')),                   
        duration: 300,              
      }
    ).start(()=>{this.resetValues(1)});
  }
  textStringFunc = () =>{
    return 'text string works' +this.props.index;
  }
  render() {
    return (
      <Animated.View onLayout={this.onLayout} key ={this.props.element.id+''} style={{ marginBottom:hp('1%'),flexDirection : 'column',opacity: this.state.fadeValue,transform: [{ translateY: this.state.positionVal }]}}>
        <TextInput placeholder='Item' placeholderTextColor='#292929'  style={styles.textInputInDailog} onChangeText={(text)=>{this.props.onItemEdit(text, this.props.index)}} value={this.props.item[this.props.index].title}/>
          <View style = {{flexDirection:'row',alignItems:'center'}}>
            {this.props.length >1 && this.props.index < this.props.length-1 &&
              <TouchableOpacity onPress = {()=>{this.setState({transitioning:true},this.swapInitiateDown) }} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                <Image source={require('../../assets/move_down_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/> 
              </TouchableOpacity>
            }
            {this.props.length >1 && this.props.index>0 &&
              <TouchableOpacity onPress = {()=>{this.setState({transitioning:true},this.swapInitiateUp) }} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                <Image source={require('../../assets/move_down_icon.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain', transform: [{ rotate: '180deg'}]}}/> 
              </TouchableOpacity>  
            }
            {this.props.length >1 &&
              <TouchableOpacity onPress = {this.removeElement} style={{marginRight:wp('1%'), alignItems : 'center', justifyContent : 'center', width : hp('3%'), height : hp('3%'), borderRadius : 100, backgroundColor : '#0071bc'}}>
                <Image source={require('../../assets/delete_checklist.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/> 
              </TouchableOpacity>
            }
          </View>
      </Animated.View>
    )
  }
}  
export default PopupScreen;
const styles = StyleSheet.create({
  textInputInDailog : {
    color : 'black',
    width : wp('65%'),
    height : hp('7%') ,
    fontSize: (14),
    backgroundColor : '#ffffff',
    justifyContent : 'center',
    paddingHorizontal : wp('2%'),
    borderRadius : wp('1%'),
    borderWidth : 1,
    borderColor : '#dfdfdf'
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});