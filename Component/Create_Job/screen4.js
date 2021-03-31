import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CheckBoxButtons from './checkBoxButtonGroup' ;
import StatusBar from '../InputFields/statusBar' ;
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

class CreateJob_Screen4 extends Component{
    constructor(props){
        super(props);
        this.state ={
            timeNotification : '',
            checked : false
        }
      }
      chooseTime = (value) => {
         this.setState({timeNotification : '' , checked : value})
      }
      goNext = () => {
        if(this.state.checked){
            this.props.navigation.navigate('CreateJob_Screen5')
         }
         else{
           this.setState({timeNotification : 'Choose Time for service'})
         }
      }   
    render(){

      return(
        <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
          <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/> 
            {this.props.specificPropertyDetail.check_in_time !== undefined && this.props.specificPropertyDetail.check_out_time !== undefined && <DailogBox check_in_time={this.props.specificPropertyDetail.check_in_time} check_out_time={this.props.specificPropertyDetail.check_out_time}/>}
            <View style={{flex : 0.08 , alignItems : 'center' , marginBottom : hp('2%') }}>
              <Text style={{marginHorizontal:wp('8%') , color : '#292929' ,textAlign : 'center', fontSize : (22)}}>Choose Your Requested Time of Service</Text>
            </View>
              <View style={styles.whiteBackGroundCont}>
                <View style={styles.grayBackGroundCont}>
                  <CheckBoxButtons chooseTime={this.chooseTime} navigation={this.props.navigation}/>
                    <View style={{flexDirection : 'row' , justifyContent : 'space-between'}}>
                      <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
                        <Text style={{ color : '#ffffff' , fontSize : (20)}}>Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.goNext}>
                        <Text style={{ color : '#ffffff' , fontSize : (20)}}>Next</Text>
                      </TouchableOpacity>
                    </View>
                      <Text style={{ color : 'red', fontSize : (12)}}>{this.state.timeNotification}</Text>
                </View>
              </View>
          </ImageBackground>
        )
    }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  specificPropertyDetail : state.createJob.specificPropertyDetail,
});
export default connect(mapStateToProps)(CreateJob_Screen4);
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch'
     },
     whiteBackGroundCont : {
        flex : 0.67 ,
        margin : hp('2%') ,
        backgroundColor : '#ffffff' ,
        borderRadius : hp('1%') ,
        padding : hp('2%')
     },
     grayBackGroundCont : {
        flex : 1 ,
        margin : hp('2%') ,
        backgroundColor : '#f4f4f4' ,
        borderRadius : hp('1%') ,
        padding : hp('2%')
     },
     TouchableStyle :{
        height : hp('7%') ,
        width : wp('33%') ,
        marginBottom : hp('2%'),
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center'
     },
});

class DailogBox extends Component{
  state = {
    isDailogOpen : true
  }
  render(){
    return(
      <Dialog
        visible={this.state.isDailogOpen}
        onTouchOutside={() => this.setState({isDailogOpen: false})}
        dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
        contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
      > 
      <View style={{height : hp('40%')}}>
        <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
          <Text style={{fontSize: (18) , color : '#ffffff' }}>Check-in and Check-out Time</Text> 
        </View>
        <Text style={{fontSize : 16, color : '#292929', marginBottom : hp('2%'), marginHorizontal : wp('2%')}}>Please Choose time between Check-in and check-out</Text>
        <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'center', marginBottom : hp('0.5%')}}>
          <Text style={{fontSize : 16, color : '#0071bd', width : '43%'}}>Check-In Time : </Text>
          <Text style={{fontSize : 16, color : '#292929'}}>{this.props.check_in_time}</Text>
        </View>
        <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'center', marginBottom : hp('3%')}}>
          <Text style={{fontSize : 16, color : '#0071bd', width : '43%'}}>Check-Out Time : </Text>
          <Text style={{fontSize : 16, color : '#292929'}}>{this.props.check_out_time}</Text>
        </View>
        <View style={{alignItems : 'center'}}>
        <TouchableOpacity onPress={() => this.setState({isDailogOpen : false})}  style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]}>
          <Text style={{color : '#ffffff' , fontSize : (18)}}>Ok</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Dialog>  
    )
  }
}

    