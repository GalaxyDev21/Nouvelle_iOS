import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import StatusBar from '../InputFields/statusBar' ;
import ProgressBar from './progressbar' ;

export default class Step2 extends Component{
  constructor(props){
      super(props);
      this.state = {
          radioSelectedValue : ''
      }
  }
    radioChange = (value) => {
      this.setState({radioSelectedValue : value});
    }
     nextScreen = () => {
         if(this.state.radioSelectedValue === 0){
            this.props.navigation.navigate('Step3_Email', {jobIds : this.props.navigation.getParam('jobIds', '')});
         }
         else if(this.state.radioSelectedValue === 1){
            this.props.navigation.navigate('Step3_SMS');
        }
     }
    render(){
    return(
        <ImageBackground source={require('../../assets/invite_contractor_bg.jpg')} style={styles.container}>
          <StatusBar title='INVITE CONTRACTORS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
            <ProgressBar stepOneColor='#8CC63E' stepTwoColor='#8CC63E' stepThreeColor='#CECECE'/>
            <View style={{padding : wp('4%'), backgroundColor: 'rgba(244, 244, 244, 0.5)'}}>
                <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (22), marginBottom : hp('3%')}}>Invitation Method</Text>
                  <TouchableOpacity onPress ={()=>{this.radioChange(0)}}  style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%')}}>
                   <View style={styles.innerViewInRadioButton}>
                     {this.state.radioSelectedValue === 0 &&
                       <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
                     }
                    </View>
                      <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>Send invitation via Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress ={()=>{this.radioChange(1)}}  style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('3%')}}>
                   <View style={styles.innerViewInRadioButton}>
                     {this.state.radioSelectedValue === 1 &&
                       <View style={{height:wp('3.5%'),width:wp('3.5%'), backgroundColor:'#0071bc',borderRadius: 100}}/>
                     }
                    </View>
                      <Text style={{color:'#292929',fontSize: (16),fontFamily :'Raleway-SemiBold', marginLeft:wp('4%')}}>Send invitation via SMS</Text>
                    </TouchableOpacity>
                     <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
                       <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={() => this.props.navigation.goBack()}>
                         <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Back</Text>
                       </TouchableOpacity>
                         <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.nextScreen}>
                           <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Next</Text>
                         </TouchableOpacity>
                      </View>
                 </View>
           </ImageBackground>
        )
     } 
  }

const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
     TextInputField : {
        height : hp('7%') ,
        alignItems : 'flex-start' ,
        justifyContent : 'center' ,
        marginBottom : hp('1%') ,
        backgroundColor : '#f4f4f4'
     },
      buttonTextStyle :{
        color: '#393939' ,
        width : wp('25%'),
        height : hp('7%'),
        backgroundColor : 'grey',
        borderRadius : hp('3%'),
        alignItems : 'center' ,
        justifyContent : 'center'
    },
    TouchableStyle :{
        height : hp('7%') ,
        width : wp('33%') ,
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center',
     },
     innerViewInRadioButton  : {
        height:wp('6%'),
        width:wp('6%'),
        backgroundColor:'rgba(0,0,0,0)',
        borderRadius: 100,
        borderWidth:2.,
        borderColor:'#0071bc',
        justifyContent:'center',
        alignItems:'center'
     }
    });