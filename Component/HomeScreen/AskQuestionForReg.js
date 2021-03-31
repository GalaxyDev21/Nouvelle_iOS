import React,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground , Image , TouchableOpacity ,ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import { Icon } from 'react-native-elements' ;

export default class AskQuestionForRegister extends Component{
    constructor(props){
        super(props);
        this.state ={
            processing : [false , false]
        }
    };
    contractorForm =(index) => {
      this.props.navigation.navigate('ContractorReg');
    }

    HostForm = (index) => {
      this.props.navigation.navigate('HostReg');
    }
    render(){
      return(
        <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={styles.containerBg}>
            
            <View style={{flex : 0.1 , alignItems : 'flex-start' , marginTop : hp('2%')}}>
                 <TouchableOpacity activeOpacity={0.6} onPress={()=>this.props.navigation.goBack()}><Icon name='arrow-back' size={25}  color='black'/></TouchableOpacity>
             </View> 
              <View style={styles.imageContainer}>
                <Image source={require('../../assets/Nouvelle_Transparent_Logo.png')} style={styles.nouvelleImage}/>
               </View>
               <View style={styles.textContainer}>
                   <Text style={{fontSize : (25) , color : '#292929' , fontFamily : 'Raleway-SemiBold' }}>SIGN UP</Text>
                 </View>
               
               <TouchableOpacity activeOpacity={0.6} style={styles.contractor} onPress={() => this.contractorForm(0)} >
                    <Text style={styles.touchButton}>I am a Contractor</Text>
                    {this.state.processing[0] && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.6} style={styles.Host} onPress={() => this.HostForm(1)} >
                    <Text style={styles.touchButton}>I am a Host / Property Manager</Text>
                    {this.state.processing[1] && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>

                <View style={styles.signUp}>
                   <Text style={{color : '#292929' , fontSize : (15)}}>Already have an account?</Text>
                   <TouchableOpacity activeOpacity={0.6} onPress={()=>this.props.navigation.navigate('AskQuestion')}>
                      <Text style={{color : '#0071bc' , fontSize : (15)}}>{` Sign In`}</Text>
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
        padding : wp('5%')
    },
    imageContainer :{
        flex : 0.2 ,
        marginTop : hp('3%') ,
        marginBottom : hp('4%') , 
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
        marginBottom : hp('7%')
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