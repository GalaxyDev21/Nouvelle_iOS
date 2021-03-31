import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import { Icon } from 'react-native-elements';
import StatusBar from '../InputFields/statusBar';
import ProgressBar from './progressbar' ;

export default class InviteContractorsButton extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
    return(
        <ImageBackground source={require('../../assets/invite_contractor_bg.jpg')} style={styles.container}>
          <StatusBar title='Invite Contractors' isIconDisplay={true} navigation={this.props.navigation}/>
            <TouchableOpacity activeOpacity={0.5} style={{elevation : 5, height : hp('7%'), width : wp('40%'), alignItems : 'center', justifyContent : 'center', borderRadius : hp('4%'), backgroundColor : '#8CC63F', marginTop : hp('6%'), marginLeft : wp('30%')}} onPress={() => this.props.navigation.navigate('Step1')}>
               <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (22)}}>{`+ Invite`}</Text>
            </TouchableOpacity>
         </ImageBackground>
        )
     } 
  }
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
    });

