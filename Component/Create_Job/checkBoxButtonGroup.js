import React ,{Component} from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements' ;
import { ChooseTime } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';

class CheckBoxButtons extends Component {
  constructor(props){
    super(props);
    this.state ={
      radioSelectedValue : [false , false , false , false , false],
      selectedTimes : [],
    }
  }
  changeValue = (value, time) =>{
    let tempArr = this.state.radioSelectedValue.slice();
    let tempTimeArr = this.state.selectedTimes.slice();
    tempArr[value] = !tempArr[value] ? true : false ;
    if(tempArr[value]){
      tempTimeArr.push(time);
      this.props.chooseTime(true);
    }
    else if(!tempArr[value]){
      const Index = tempTimeArr.findIndex(checkIndex);
      function checkIndex(item){
        return item === time ;
      }
      tempTimeArr.splice(Index , 1);
      this.props.chooseTime(false);
    }
    this.setState({
      radioSelectedValue : tempArr,
      selectedTimes : tempTimeArr
    });
    this.props.selectTimes(tempTimeArr); 
  }
  render() {
    return (
      <View>
        <View style={styles.specificRadioButton}>
          <TouchableOpacity onPress ={()=>{this.changeValue(0, '6:00:00')}} style={{flexDirection : 'row' , alignItems : 'center'}}>
            <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3%'), width : hp('3%'), borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
              {
                this.state.radioSelectedValue[0] &&
                  <View style={{height : hp('3%'), width : hp('3%'), justifyContent : 'center', alignItems : 'center', backgroundColor : '#0071bc', borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
                    <Icon name = 'check' size = {15} color = 'white'/>
                  </View>
              }
            </View>
            <Text style={{color:'#292929',fontSize: (16), marginLeft:wp('4%')}}>Early Morning (before 9 am)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.specificRadioButton}>
          <TouchableOpacity onPress ={()=>{this.changeValue(1, '9:00:00')}} style={{flexDirection : 'row' , alignItems : 'center'}}>
            <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3%'), width : hp('3%'), borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
              {
                this.state.radioSelectedValue[1] &&
                  <View style={{height : hp('3%'), width : hp('3%'), justifyContent : 'center', alignItems : 'center', backgroundColor : '#0071bc', borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
                    <Icon name = 'check' size = {15} color = 'white'/>
                  </View>
              }
            </View>
            <Text style={{color:'#292929',fontSize: (16), marginLeft:wp('4%')}}>Morning (9am - 12pm)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.specificRadioButton}>
          <TouchableOpacity onPress ={()=>{this.changeValue(2, '12:00:00')}} style={{flexDirection : 'row' , alignItems : 'center'}}>
            <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3%'), width : hp('3%'), borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
              {
                this.state.radioSelectedValue[2] &&
                  <View style={{height : hp('3%'), width : hp('3%'), justifyContent : 'center', alignItems : 'center', backgroundColor : '#0071bc', borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
                    <Icon name = 'check' size = {15} color = 'white'/>
                  </View>
              }
            </View>
            <Text style={{color:'#292929',fontSize: (16), marginLeft:wp('4%')}}>Afternoon (12pm - 3pm)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.specificRadioButton}>
          <TouchableOpacity onPress ={()=>{this.changeValue(3, '15:00:00')}} style={{flexDirection : 'row' , alignItems : 'center'}}>
            <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3%'), width : hp('3%'), borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
              {
                this.state.radioSelectedValue[3] &&
                  <View style={{height : hp('3%'), width : hp('3%'), justifyContent : 'center', alignItems : 'center', backgroundColor : '#0071bc', borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
                    <Icon name = 'check' size = {15} color = 'white'/>
                  </View>
              }
            </View>
            <Text style={{color:'#292929',fontSize: (16), marginLeft:wp('4%')}}>Late Afternoon (3pm - 6pm)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.specificRadioButton}>
          <TouchableOpacity onPress ={()=>{this.changeValue(4, '18:00:00')}} style={{flexDirection : 'row' , alignItems : 'center'}}>
            <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3%'), width : hp('3%'), borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
              {
                this.state.radioSelectedValue[4] &&
                  <View style={{height : hp('3%'), width : hp('3%'), justifyContent : 'center', alignItems : 'center', backgroundColor : '#0071bc', borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
                    <Icon name = 'check' size = {15} color = 'white'/>
                  </View>
              }
            </View>
            <Text style={{color:'#292929',fontSize: (16), marginLeft:wp('4%')}}>Evening (after 6pm)</Text>
          </TouchableOpacity>  
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  jobInformation : state.createJob.jobInformation ,
});
const dispatchStateToProps = dispatch => ({
  selectTimes : (times) => dispatch(ChooseTime(times)),
});
export default connect(mapStateToProps, dispatchStateToProps)(CheckBoxButtons);

const styles = StyleSheet.create({
  specificRadioButton : {
    justifyContent:'flex-start',
    borderBottomWidth : 0.5 ,
    borderBottomColor : '#d0d0d0' ,
    marginBottom : hp('2%') ,
    paddingBottom : hp('1%')
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
})