import React ,{Component} from 'react';
import { StyleSheet, Text, View , TouchableOpacity , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";

export default function StatusBar(){
    return(
        <View style={styles.statusBarStyle}>
            <Text style={{fontFamily : 'Raleway-SemiBold',marginTop : hp('5%') , fontSize: (24) , color : '#ffffff' }}>Invite Contractors</Text>
        </View>     
    )
}
const styles = StyleSheet.create({
    statusBarStyle : {
        height:hp('11%'),
        width:wp('100%'),
        backgroundColor : '#0071bc' ,
        alignItems : 'center'
      }
    });

