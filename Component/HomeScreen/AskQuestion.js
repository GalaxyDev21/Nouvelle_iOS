import React,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground , Image , TouchableOpacity ,ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";

export default class AskQuestion extends Component{
    constructor(props){
        super(props);
        this.state ={
            processing : [false , false]
        }
    };
    contractorForm =() => {
      this.props.navigation.navigate('ContractorLogin');
    }
    HostForm = () => {
       this.props.navigation.navigate('HostLogin', {type : this.props.navigation.getParam('type' , ''), hostId : this.props.navigation.getParam('hostId' , '')});
    }
    render(){
      return(
        <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={styles.containerBg}>
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/Nouvelle_Transparent_Logo.png')} style={styles.nouvelleImage}/>
               </View>
               <View style={styles.textContainer}>
                   <Text style={{fontSize : (19) , color : '#292929' , fontFamily : 'Raleway-Medium'}}>Which describes you best?</Text>
                 </View>
               
               <TouchableOpacity activeOpacity={0.5} style={styles.contractor} onPress={this.contractorForm} >
                    <Text style={styles.touchButton}>I am a Contractor</Text>
                    {this.state.processing[0] && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} style={styles.Host} onPress={this.HostForm} >
                    <Text style={styles.touchButton}>I am a Host / Property Manager</Text>
                    {this.state.processing[1] && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>

                <View style={styles.signUp}>
                   <Text style={{color : '#292929' , fontSize : (14)}}>Don't have an account?</Text>
                   <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.props.navigation.navigate('AskQuestionForRegister')}}>
                      <Text style={{color : '#0071bc' , fontSize : (14)}}>{` Sign Up`}</Text>
                   </TouchableOpacity>
              </View>
            </ImageBackground>
        );
    }
   
};

const styles = StyleSheet.create({
    containerBg : {
        flex : 1 ,
        resizeMode : 'stretch' ,
        padding : wp('5%') ,
    },
    imageContainer :{
        flex : 0.2 ,
        marginVertical : hp('12%') ,
        justifyContent: 'center' ,
        alignItems : 'center' ,
    } ,
    nouvelleImage : {
        height : hp('4%') ,
        resizeMode:'contain',
    } ,
    textContainer : {
        flex : 0.1 ,
        justifyContent : 'center' ,
        alignItems : 'center' ,
        marginBottom : hp('5%') ,
    },
    contractor : {
        height : hp('7%') ,
        flexDirection : 'row' ,
        justifyContent: 'center' ,
        alignItems : 'center' ,
        marginBottom : hp('2%') ,
        backgroundColor : '#0071bc' ,
        borderRadius : wp('10') , 
    } ,
    Host : {
        height : hp('7%') ,
        flexDirection : 'row' ,
        justifyContent: 'center' ,
        alignItems : 'center' ,
        marginBottom : hp('4%') ,
        backgroundColor : '#8cc63f' ,
        borderRadius : wp('10%') , 
    } ,
    touchButton : {
       color : '#ffffff' ,
       fontWeight : 'bold' , 
       fontSize : (15) ,
       fontFamily : 'Raleway-SemiBold' ,
       marginRight : wp('2%')
    },
    signUp : {
        flex : 0.1 ,
        flexDirection : 'row' ,
        justifyContent: 'center' ,
        alignItems : 'center' ,
    }
})