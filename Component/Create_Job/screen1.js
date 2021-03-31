import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView, Image ,ImageBackground, TouchableOpacity , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import Tooltip from 'react-native-walkthrough-tooltip';
import { SetPropertyType, GetData} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { EXISTING_PROPERTY } from '../../Redux/createJob/actionType';

class CreateJob_Screen1 extends Component{
  constructor(props){
    super(props);
      this.state ={
          show : false ,
          toolTipVisible : false,
          processing : false,
      }
  }
  showProps =()=> {
    this.setState({show : !this.state.show ? true : false})
  }
  setPropertyType = (type) => {
    if(type === 'new'){
      this.props.SetPropertyType('New_property');
      this.props.navigation.navigate('NewPropertyScreen');
    }
    else{
      this.setState({processing : true});
      this.props.SetPropertyType('Existing_property');
      this._getExistingProperty();
    }
  }
  _getExistingProperty = async () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 100);
    await this.props.GetData('existing_property', EXISTING_PROPERTY, this.props.userToken, formData);
    this.props.navigation.navigate('ExistingPropertyScreen');
    this.stopProcessing();
  }
  stopProcessing =() => {
    this.setState({processing : false});
  }
  render(){
    // const routesArr = this.props.navigation.dangerouslyGetParent().state;
    //   console.log('************* Route state ***********');
    //   console.log(this.props.navigation.dangerouslyGetParent().state);
    //   console.log(routesArr.routes.length);
    //   console.log('************************');
    return(
      <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
        <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('8%')}/>
          <View style={{padding : hp('6%')}}>
            <View style={{height:hp('5%'),width:wp('75%'), flexDirection:'row' , justifyContent : 'center' ,alignItems : 'center' , marginBottom : hp('8%') , position:'relative'}}>
              <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (22)}}>Find Pros</Text>
                <Tooltip
                  isVisible={this.state.toolTipVisible}
                  content={<Text>Co-hosts, cleaners, landscapers, electricians, plumbers!</Text>}
                  placement="auto"
                  onClose={() => this.setState({ toolTipVisible: false })}
                  contentStyle =  {{width : wp('45%')}}
                >
                <TouchableOpacity onPress={()=>this.setState({toolTipVisible : true})}>
                  <Image source={require('../../assets/exclamation_img.png')} style={{height:hp('3%') , width : hp('3%') ,marginRight:wp('1%') , resizeMode:'contain'}} />
                </TouchableOpacity>
              </Tooltip>
              <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (22)}}>for</Text> 
            </View>
            <TouchableOpacity style={[ styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={() => this.setPropertyType('new')}>  
              <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20)}}>New Property</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.TouchableStyle ,{backgroundColor : '#0071bc'}]} onPress={()=> this.setPropertyType('existing')}>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#ffffff' , fontSize : (20), marginRight : wp('2%')}}>Existing Property</Text>
                  {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </View>
            </TouchableOpacity>
          </View>
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken ,
});
export default connect(mapStateToProps,{SetPropertyType, GetData})(CreateJob_Screen1);
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch'
     },
     TouchableStyle :{
        height : hp('7%') ,
        width : wp('80%') ,
        marginBottom : hp('3%'),
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center'
     }
});

