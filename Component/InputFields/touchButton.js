import React ,{Component} from 'react';
import { StyleSheet, Text, TouchableOpacity,} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

class TouchButton extends Component{
  constructor(props){
      super(props);
      this.state ={
      
      }
  }
  render(){
    return(
      <TouchableOpacity style={[styles.TouchableStyle , {height : this.props.height, backgroundColor : this.props.bgColor, width : this.props.width , marginRight : this.props.marginValue, elevation : this.props.elevation}]} onPress={() => this.props.actionPerform(this.props.move , this.props.navigation)}>
        <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : this.props.buttonNameSize}}>{this.props.buttonName}</Text>
      </TouchableOpacity>
    )
  }
}
export default TouchButton;
const styles = StyleSheet.create({
     TouchableStyle :{
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center'
     }
    });
