import React ,{Component} from 'react';
import { StyleSheet, Text, View, Image,  FlatList, Platform, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
export default class DropDown extends Component{
    constructor(props){
      super(props);
        this.state ={
          placeholder : this.props.placeholder,
          isOpen : false,
          dropDownNotification : '',
          height : this.props.listShow.length === 1 ? hp('6%'): this.props.listShow.length === 2 ? hp('12%'): hp('24%'),
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
    static getDerivedStateFromProps(props, state) {
      state.placeholder = props.placeholder;
        return state;
    }
    render(){
      return(
        <View>
          <TouchableOpacity onPress={() => {this.setState({isOpen : !this.state.isOpen ? true : false})}} style={[styles.touchForDropDown, { height : hp('7%'), width : '100%', backgroundColor : '#f4f4f4', borderWidth : 1}]}>
            <Text style={{ color : '#292929', fontSize : this.props.fontSize ? this.props.fontSize : (16), padding : wp('2%')}}>{this.state.placeholder}</Text>
              <Image source={require('../../assets/dropDown_Icon.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain' ,position : 'absolute' ,right : 9 ,top : 17}}></Image>
          </TouchableOpacity>
            {
              this.state.isOpen && 
                <ScrollView style={{elevation : 2, width : '100%', height : this.state.height, position : 'absolute', top : hp('7%'), backgroundColor: '#ffffff', zIndex : 9999}} contentContainerStyle={{borderWidth:1, borderRadius:3, borderColor:'#D0D0D0'}}>
                  <FlatList
                    data={this.props.listShow}
                    keyExtractor={(item, index) => ""+ index}          
                    renderItem={({item , index}) =>  
                      <TouchableOpacity onPress={() => this.selectValue(item)} style={{height:hp('6%')  , borderBottomWidth : 1, borderBottomColor : '#D0D0D0', justifyContent : 'center' , alignItems : 'flex-start'}}>
                        <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (15), padding : wp('2%')}}>{!this.props.isObject ? item : item[this.props.name]}</Text>
                      </TouchableOpacity>}     
                  />
                </ScrollView>
            }
        </View>
      )
    }
  }
const styles = StyleSheet.create({
    eachField : {
        marginBottom : hp('3%'),
        height : hp('10%'),
        position : 'relative'
      },
  touchForDropDown : {
    alignItems : 'flex-start', 
    justifyContent : 'center',  
    padding : wp('1.2%'),
    position : 'relative', 
    borderColor :'#f4f4f4', 
    borderRadius : 2
  }
});