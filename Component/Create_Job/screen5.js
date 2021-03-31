import React ,{Component} from 'react';
import { StyleSheet, Text, View , TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import StatusBar from '../InputFields/statusBar' ;
import { ChooseArea } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';

class CreateJob_Screen5 extends Component{
    constructor(props){
        super(props);
        this.state ={
            Area : '' ,
            areaNotification : ''
        }
      }

      chooseAreaForCleaning = () => {
        if(this.state.Area) {
           this.props.selectArea(this.state.Area);
           this.props.navigation.navigate('CreateJob_Screen6');
        }
        else{
          this.setState({areaNotification : 'Select area for cleaning'})
        }  
      }

    render(){
        return(
          <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
             <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/>
               <ScrollView>
               <View style={{flex : 0.08 , alignItems : 'center' , marginBottom : hp('4%') }}>
                 <Text style={styles.titleStyle}>Describe the Area Where Service is Needed</Text>
               </View>
                   <View style={{flex : 0.3, backgroundColor : '#ffffff', padding:wp('5%'), borderRadius : hp('1%'), paddingHorizontal : wp('5%'), paddingVertical : hp('6%'), margin : wp('4%')}}>
                     <View style={{ height : hp('8%'), marginBottom : hp('2%')}}>
                        <TextInput placeholder='e.g Kitchen, living room, bathroom, bedroom etc' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({Area : text, areaNotification : ''})} value={this.state.Area}/>
                          <Text style={{ color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12), marginBottom : hp('3%')}}>{this.state.areaNotification}</Text>
                       </View>
                       <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
                         <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
                           <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Back</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.chooseAreaForCleaning}>
                           <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>Next</Text>
                         </TouchableOpacity>
                       </View>
                   </View> 
                  </ScrollView>       
           </ImageBackground>
        )
    }
}
const mapStateToProps = state => ({
  jobInformation : state.createJob.jobInformation ,
});

const dispatchStateToProps = dispatch => ({
      selectArea : (area) => dispatch(ChooseArea(area)),
});

export default connect(
 mapStateToProps,
 dispatchStateToProps
)(CreateJob_Screen5);

const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
     titleStyle : {
        fontFamily : 'Raleway-SemiBold',
        textAlign : 'center' ,
        color : '#292929' ,
        fontSize : (22) ,
        marginHorizontal : wp('8%'),
    },
     TouchableStyle :{
        height : hp('7%') ,
        width : wp('33%') ,
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center'
     },
     textInputCon : {
        color : 'black',
        height : hp('7%') ,
        fontSize: (13),
        backgroundColor : '#f4f4f4' ,
        paddingLeft : wp('3%')  
     },
    });

     // textflag : true ,
            // touchflag : false ,
            // styleChange : [true , true ,true ,true ,true ,true]
    // selectSpecificArea =(index) => {
    //     tempArr = this.state.styleChange.slice();
    //     tempArr[index] = tempArr[index] ? false : true ;
    //     this.setState({styleChange : tempArr})
    // }
    // <View style={{flex : 0.5 ,flexDirection: 'row' ,justifyContent:'space-between' , marginBottom:hp('2%')}}>           
    // <TouchableOpacity style={this.state.styleChange[0] ? styles.specificAreaCont : styles.AfterPressSpecificAreaCont} onPress={()=>this.selectSpecificArea(0)}>
    //      <View style={{flex: 1 , justifyContent : 'center' , alignItems : 'center'}}>
    //          <Image source={require('../../assets/bathroom.png')} style={{height:hp('13%') , width:hp('13%') , resizeMode:'contain'}}/>
    //      </View>
    //      <View style={styles.EachButtonWithImage} disabled={this.state.touchflag} onPress={()=>this.selectSpecificArea}>
    //          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (18)}}>Bathroom</Text>
    //      </View>
    //  </TouchableOpacity>
    //  <TouchableOpacity style={this.state.styleChange[1] ? styles.specificAreaCont : styles.AfterPressSpecificAreaCont} onPress={()=>this.selectSpecificArea(1)}>
    //      <View style={{flex: 1 , justifyContent : 'center' , alignItems : 'center'}}>
    //          <Image source={require('../../assets/kitchen.png')} style={{height:hp('13%') , width:hp('13%') , resizeMode:'contain'}}/>
    //      </View>
    //      <View style={styles.EachButtonWithImage} disabled={this.state.touchflag} onPress={()=>this.selectSpecificArea}>
    //          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (18)}}>kitchen</Text>
    //      </View>
    //  </TouchableOpacity>
    //  <TouchableOpacity style={this.state.styleChange[2] ? styles.specificAreaCont : styles.AfterPressSpecificAreaCont} onPress={()=>this.selectSpecificArea(2)}>
    //      <View style={{flex: 1 , justifyContent : 'center' , alignItems : 'center'}}>
    //          <Image source={require('../../assets/living_room.png')} style={{height:hp('13%') , width:hp('13%') , resizeMode:'contain'}}/>
    //      </View>
    //      <View style={styles.EachButtonWithImage} disabled={this.state.touchflag} onPress={()=>this.selectSpecificArea}>
    //          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (18)}}>Living room</Text>
    //      </View>
    //  </TouchableOpacity>
    // </View>
    // <View style={{ flex : 0.5 , flexDirection: 'row',justifyContent:'space-between' , marginBottom:hp('2%')}}>

    //   <TouchableOpacity style={this.state.styleChange[3] ? styles.specificAreaCont : styles.AfterPressSpecificAreaCont} onPress={()=>this.selectSpecificArea(3)}>
    //      <View style={{flex: 1 , justifyContent : 'center' , alignItems : 'center'}}>
    //          <Image source={require('../../assets/bedroom.png')} style={{height:hp('13%') , width:hp('13%') , resizeMode:'contain'}}/>
    //      </View>
    //      <View style={styles.EachButtonWithImage} disabled={this.state.touchflag} onPress={()=>this.selectSpecificArea}>
    //          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (18)}}>Bedroom</Text>
    //      </View>
    //  </TouchableOpacity>
    //  <TouchableOpacity style={this.state.styleChange[4] ? styles.specificAreaCont : styles.AfterPressSpecificAreaCont} onPress={()=>this.selectSpecificArea(4)}>
    //      <View style={{flex: 1 , justifyContent : 'center' , alignItems : 'center'}}>
    //          <Image source={require('../../assets/basement.png')} style={{height:hp('13%') , width:hp('13%') , resizeMode:'contain'}}/>
    //      </View>
    //      <View style={styles.EachButtonWithImage} disabled={this.state.touchflag}>
    //          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (18)}}>Basement</Text>
    //      </View>
    //  </TouchableOpacity>
    //  <TouchableOpacity style={this.state.styleChange[5] ? styles.specificAreaCont : styles.AfterPressSpecificAreaCont} onPress={()=>this.selectSpecificArea(5)}>
    //      <View style={{flex: 1 , justifyContent : 'center' , alignItems : 'center'}}>
    //          <Image source={require('../../assets/Attic.png')} style={{height:hp('13%') , width:hp('13%') , resizeMode:'contain'}}/>
    //      </View>
    //      <View style={styles.EachButtonWithImage} disabled={this.state.touchflag}>
    //          <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (18)}}>Attic</Text>
    //      </View>
    //  </TouchableOpacity>

    // </View>

     //  TextInputField : {
    //     height : hp('7%') ,
    //     width : wp('85%') ,
    //     alignItems : 'flex-start' ,
    //     justifyContent : 'center' ,
    //     marginBottom : hp('3%') ,
    //     backgroundColor : '#f4f4f4'
    //  },
     //  specificAreaCont : {
    //     flex : 0.33 ,
    //     borderWidth : 1 ,
    //     borderRadius : hp('1%'),
    //     borderColor:'#dfdede', 
    //  },
    //  AfterPressSpecificAreaCont : {
    //     flex : 0.33 ,
    //     borderWidth : 1 ,
    //     borderRadius : hp('1%'),
    //     borderColor:'#8cc63f',
    //     backgroundColor : 'rgba(4 ,7,8,0.2)' 
    //  },
    //  EachButtonWithImage : {
    //     justifyContent : 'center',
    //     height:hp('5%') , 
    //     alignItems: 'center' ,
    //     backgroundColor:'#8cc63f',
    //     borderBottomLeftRadius : hp('1%'),
    //     borderBottomRightRadius:hp('1%')
    //  }

