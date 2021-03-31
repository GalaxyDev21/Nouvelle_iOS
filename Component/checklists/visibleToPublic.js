import React ,{Component} from 'react';
import { Text, View, Image, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
//import { storeServiceForCreateJob, AddProperty} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import {server} from '../../Redux/server';
import ShowBar from '../validations/messageBar';
import axios from 'axios';

class PropertyListComponent extends Component {
  constructor(props){
    super(props);
      this.state = {
        checked : this.props.data.public_post === 'false' ? false : true ,
        toolTipVisible1 : false,
        isPropsOpen : false,
      }
  }
  makePublicVisible = () => {
    this.setState({checked : !this.state.checked}, async function(){
      const check = this.state.checked.toString();
      var formData = new FormData();
        formData.append('id', this.props.data.ID);
        formData.append('check', check) ;
        const res = await axios.post(server+'make_check_list_public', formData ,{
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        if(res.data.code == 200){
          ShowBar(res.data.data.msg , 'success');
        }
        else{
          ShowBar('Sorry, Unable to saved checklist' , 'error');
        }
     })
  }
  render(){
    return(
      <View>
        <TouchableOpacity onPress={this.makePublicVisible} style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('2%')}}>
      <View style={{height : hp('3%'), width : hp('3%'),justifyContent : 'center', alignItems : 'center',  backgroundColor : this.state.checked ? '#0071bc' : '#8d8d8d', borderRadius : 100, marginRight : wp('2%')}}>
        <Icon name = 'check' size = {15} color = 'white'/>
      </View>
        <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#0071BD' , fontSize : (18), marginRight : wp('2%')}}>Make visible to public</Text>
        <Tooltip
          isVisible={this.state.toolTipVisible1}
          content={<Text>By checking this box, your checklist can be viewed by all Nouvelle users. This is a great way for users to share helpful checklist items!</Text>}
          placement="bottom"
          onClose={() => this.setState({toolTipVisible1 : false})}
          contentStyle =  {{width : wp('90%')}}
        >
          <TouchableOpacity onPress={() => this.setState({toolTipVisible1 : !this.state.toolTipVisible1 ? true : false,})}>
            <Image source={require('../../assets/propsIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain'}}/>
          </TouchableOpacity> 
        </Tooltip>
    </TouchableOpacity>
          <View style={{ marginBottom : hp('2%'), backgroundColor : '#f6f6f6', padding : wp('3%'), borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8',}}>
            <Text style={{fontSize : (15), color : '#292929', marginBottom : hp('2%')}}>Set as default checklist for:</Text>
              {
                this.props.existingProperty.map((item , index) =>
                  <CheckBoxButtons 
                    item = {item} 
                    key = {item.ID}
                    data = {this.props.data.checklist_properties}
                    properties = {this.props.properties}
                    selectProperties = {this.props.selectProperties}
                  />
                )
              }      
        </View>
      </View>
    )    
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  existingProperty : state.createJob.existingProperty ,
});
export default connect(mapStateToProps)(PropertyListComponent);

class CheckBoxButtons extends Component {
  constructor(props){
    super(props);
      this.state ={
        checked : false,
      }
  }
  componentDidMount(){
    this.checkElement(this.props.data);
  }
  checkElement = (elementArr) => {
    for(var i = 0; i < elementArr.length; i++){
      if(elementArr[i] == this.props.item.ID) {
        this.setState({checked : true});
      }
    }
  }
  selectProperty = (property) => {
    this.setState({checked : !this.state.checked}, function(){
      if(this.state.checked){
        tempArr = this.props.properties.length > 0 ? [...this.props.properties] : [...this.props.data, ...this.props.properties];
        tempArr.push(property.ID);
        this.props.selectProperties(tempArr); 
      }
      else{
        const index = this.findIndexOfHeading(property.ID);
        tempArr = this.props.properties.length > 0 ? [...this.props.properties] : [...this.props.data, ...this.props.properties];
        tempArr.splice(index, 1);
        this.props.selectProperties(tempArr);
      }
    });
  }
  findIndexOfHeading = (value) => {
    tempArr = this.props.properties.length > 0 ? [...this.props.properties] : [...this.props.data, ...this.props.properties];
    const index = tempArr.findIndex(checkIndex);
      function checkIndex(obj){
        return obj == value ;
      }
      return index;
  }
  render() {
    return (
      <TouchableOpacity onPress = {() => this.selectProperty(this.props.item)} style={{flexDirection : 'row' , alignItems : 'center', backgroundColor : '#ffffff', height : hp('7%'), borderRadius : wp('1%'), marginBottom : hp('2%'), paddingHorizontal: wp('2%')}}>
        <View style={{height : hp('3%'), width : hp('3%'),justifyContent : 'center', alignItems : 'center', backgroundColor : this.state.checked ? '#0071bc' : '#8d8d8d', borderRadius : 100, marginRight : wp('2%')}}>
          <Icon name = 'check' size = {15} color = 'white'/>
        </View>
        <Text style={{color:'#292929',fontSize: (16)}}>{this.props.item.post_title}</Text>
      </TouchableOpacity>
    );
  }
}