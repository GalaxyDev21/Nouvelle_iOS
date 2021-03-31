import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import EachChecklistDetails from './eachChecklistDetails';
import PropertyListComponent from './visibleToPublic';
import { connect } from 'react-redux';
import axios from 'axios';
import {server} from '../../Redux/server';
import ShowBar from '../validations/messageBar';
import {EditChecklistTitle, FalseLoader, GetData} from '../../Redux/createJob/jobAction' ;
import { FALSE_HOST_CHECKLISTS_FLAG, GET_HOST_CHECKLISTS, GET_HOST_SAMPLE_CHECKLISTS} from '../../Redux/createJob/actionType';

class MyCheckLists2 extends Component{
  constructor(props){
    super(props);
      this.state = {
        properties : [],
        checklistName : '',
        processing : false,
        change : false
      }
  }
  selectProperties = (properties) => {
    this.setState({properties : properties});
  } 
  setChecklistName = (text) => {
    this.setState({checklistName : text, change : true});
  }
  onSubmit = async() => {
    this.setState({processing : true});
     var name = this.state.change ? this.state.checklistName : this.props.checklistDetail.post_title;
      var properties =  JSON.stringify(this.state.properties);
      var formData = new FormData();
        formData.append('id', this.props.checklistDetail.ID);
        formData.append('title', name);
        formData.append('property_ids_json', properties) ;
        const res = await axios.post(server+'edit_check_list', formData ,{
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        if(res.data.code == 200){
          ShowBar('Your Changes have been saved' , 'success');
          this.props.EditChecklistTitle(name, this.props.checklistDetail.ID);
          this.getNewChecklists();
          this.props.navigation.goBack();
        }
        else{
          ShowBar('Unable to save changes' , 'error');
          this.setState({processing : false});
        }
  }
  getNewChecklists = () => {
    var formData = new FormData();
    formData.append('offset', 0);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_HOST_CHECKLISTS_FLAG);
    this.props.GetData('get_all_check_lists', GET_HOST_CHECKLISTS , this.props.userToken, formData);
    this.props.GetData('get_all_sample_check_lists', GET_HOST_SAMPLE_CHECKLISTS , this.props.userToken, formData);
  }
  render(){
    //const isDataLoaded = this.props.navigation.getParam('isChecklistLoad', '');
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
        <StatusBar title='CHECKLISTS DETAILS' isIconDisplay={true} backToScreen={'TabViewOfChecklist'} marginValue={hp('0%')} navigation={this.props.navigation}/>
        {this.props.ischecklistDetailLoaded &&
          <ScrollView scrollEnabled = {!this.state.checkListScrolling}>
            <View style = {{marginHorizontal : wp('3%'), flex : 1}}>
              <View style={{marginVertical : hp('2%')}}>
                <EachChecklistDetails data = {this.props.checklistDetail} setChecklistName={this.setChecklistName} navigation = {this.props.navigation}/>
                <PropertyListComponent data = {this.props.checklistDetail} selectProperties = {this.selectProperties} properties = {this.state.properties}/>
                <View style={{marginBottom : hp('2%')}}>
                  <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.onSubmit}>
                    <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                      <Text style={{ color : '#ffffff' , fontSize : (20)}}>Submit</Text>
                        {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        }
        {!this.props.ischecklistDetailLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator
              size='large'
            />
          </View>
        }
      </ImageBackground>
    )
  } 
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  checklistDetail : state.createJob.checklistDetail,
  ischecklistDetailLoaded : state.createJob.ischecklistDetailLoaded
});
export default connect(mapStateToProps, {EditChecklistTitle, FalseLoader, GetData})(MyCheckLists2);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  TouchableStyle :{
    height : hp('7%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});