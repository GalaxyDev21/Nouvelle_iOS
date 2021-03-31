import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class ProgressBar extends Component {
    render(){
         return(
        <View style={{height : hp('10%'), backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center'}}>
        <View style={{ justifyContent : 'center', alignItems : 'center', flexDirection: 'row'}}>
          <View style={{height: hp('3%'), width : hp('3%'), borderRadius : 100, backgroundColor : this.props.stepOneColor}}></View>
          <View style={{height: hp('0.5%'), width : hp('23%'), backgroundColor : this.props.stepOneColor}}></View>
          <View style={{height: hp('3%'), width : hp('3%'), borderRadius : 100, backgroundColor : this.props.stepTwoColor}}></View>
        </View>
        <View style={{width : hp('31%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
          <Text style={{fontFamily : 'Raleway-SemiBold' , color : this.props.stepOneColor , fontSize : (12)}}>Step 1</Text>
          <Text style={{fontFamily : 'Raleway-SemiBold' , color : this.props.stepTwoColor , fontSize : (12)}}>Step 2</Text>
        </View>
      </View>
    )
    }
   
}