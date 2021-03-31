import React ,{Component} from 'react';
import {View ,ActivityIndicator, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default function AbsoluteLoader () {
  return(
    <View style={[{elevation : 15, shadowOpacity : 0.3, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}, Platform.OS === 'ios'?{zIndex : 10}:{}]}>
      <ActivityIndicator size='small' />
    </View>
  )
} 