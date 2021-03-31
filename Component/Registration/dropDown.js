import React ,{Component} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

class DropDownField extends Component{
  constructor(props){
    super(props);
    this.state ={
      placeholder : this.props.placeholder,
      isOpen : false,
      dropDownNotification : ''
    }
  }
  selectValue = (value) => {
    if(!this.props.value){
        this.setState({
      isOpen : false,
      placeholder : !this.props.isObject ? value : value[this.props.name]
    });
    }
    if(this.props.isObject){
      this.props.selectedValue(value[this.props.name] , value[this.props.id]);
    }
    else{
      this.props.selectedValue(value);
    }  
  }
  render(){
    return(
      <View>
        <TouchableOpacity onPress={() => {this.setState({isOpen : !this.state.isOpen ? true : false})}} style={[styles.touchForDropDown, { height : hp('4%'), width : this.props.width}]}>
          <Text style={{ color : '#292929', fontSize : (14)}}>{this.state.placeholder}</Text>
            <Image source={require('../../assets/dropDown_Icon.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain' ,position : 'absolute' ,right : 9 ,top : 4}}></Image>
        </TouchableOpacity>
        {this.state.isOpen && 
          <ScrollView style={{elevation : 2, width : this.props.width, height : this.props.listShow.length === 1 ? hp('6%') : this.props.listShow.length === 2 ? hp('12%') : this.props.height, position : 'absolute', top : hp('4%'), backgroundColor: '#ffffff', zIndex : 9999}}  contentContainerStyle={{borderWidth:1, borderRadius:3, borderColor:'#D0D0D0'}}>
            <FlatList
              data={this.props.listShow}
              keyExtractor={(item, index) => ""+ index}          
              renderItem={({item , index}) =>  
                <TouchableOpacity onPress={() => this.selectValue(item)} style={{height:hp('6%') , borderBottomWidth : 0.5 , borderBottomColor : '#D0D0D0', justifyContent : 'center' , alignItems : 'flex-start'}}>
                  <Text style={{ color : '#292929' , fontSize : (14), padding : wp('2%')}}>{!this.props.isObject ? item : item[this.props.name]}</Text>
                </TouchableOpacity>}     
            />
          </ScrollView>
        }
      </View>
    )
  }
}
export default DropDownField;
const styles = StyleSheet.create({
  touchForDropDown : {
    alignItems : 'flex-start', 
    justifyContent : 'center', 
    backgroundColor :  'rgba(1,1,1,0)',
    borderBottomWidth: 0.5,
    position : 'relative', 
    borderBottomColor : '#121212', 
  }
});