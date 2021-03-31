import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import StatusBar from '../InputFields/statusBar' ;
import ProgressBar from './progressbar' ;
import { connect } from 'react-redux';
import TouchButton from '../InputFields/touchButton';
import {FalseLoader, GetData} from '../../Redux/createJob/jobAction' ;
import { IS_MORE_CONTRACTORS_LOADED, GET_MY_JOBS} from '../../Redux/createJob/actionType';
import AbsoluteLoader from '../InputFields/absolutLoader';

class Step1 extends Component{
  constructor(props){
    super(props);
      this.state = {
        offset : 0,
        jobIDs : [],
        alertMessage : ''
      }
  }
  chooseContractor = (flag, jobID) => {
    const tempArr = this.state.jobIDs.slice();
      if(flag){
        tempArr.push(jobID);
        this.setState({ jobIDs : tempArr, alertMessage : '' });
      }
      else {
        const Index = tempArr.findIndex(checkIndex);
          function checkIndex(item){
            return item === jobID ;
          }
          tempArr.splice(Index , 1);
          this.setState({ jobIDs : tempArr, alertMessage : '' });
      } 
  }
  nextStep = () => {
    if(this.state.jobIDs[0]){
      this.props.navigation.navigate('Step2', {jobIds : this.state.jobIDs});
    }
    else{
      this.setState({alertMessage : 'Choose atleast one job'})
    }  
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
      this.props.FalseLoader(IS_MORE_CONTRACTORS_LOADED);
      this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/invite_contractor_bg.jpg')} style={styles.container}>
        <StatusBar title='INVITE CONTRACTORS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
          <ProgressBar stepOneColor='#8CC63E' stepTwoColor='#CECECE' stepThreeColor='#CECECE'/>
          {!this.props.isMoreContractorsLoaded && 
            <AbsoluteLoader/>
          }
          {this.props.isHostMyJobsLoaded &&
              <View style={{padding : wp('4%'), backgroundColor: 'rgba(244, 244, 244, 0.5)'}}>
                <View style={{height : hp('6%')}}>
                  <Text style={{color : '#292929' , fontSize : (22),}}>Select Jobs</Text>
                    <Text style={{ color : 'red' , fontSize : (12), marginBottom : hp('3%')}}>{this.state.alertMessage}</Text>
                </View>
                  <ScrollView style={{height : hp('60%'), marginBottom : hp('2%')}}>
                    {this.props.hostMyJobs.length > 0 &&
                      this.props.hostMyJobs.map((item , index) => <EachJob key={item.ID} item={item} indexNo={index} radioSelectedValue={this.state.radioSelectedValue} chooseContractor={this.chooseContractor} navigation = {this.props.navigation}/> )     
                    }
                    {this.props.hostCreatedJobCount > 10 && this.props.hostMyJobs.length < this.props.hostCreatedJobCount &&
                      <View style={{justifyContent : 'center', alignItems : 'flex-end', marginRight : wp('10%')}}>
                        <TouchButton 
                          buttonName = 'View More'
                          actionPerform = {ActionPerformFunc}
                          move = {{doingAction : 'doingAction', action : this.onViewMore}}
                          bgColor = '#0071bc'
                          width = {wp('33%')}
                          height = {hp('5%')}
                          buttonNameSize = {(15)}
                          elevation = {5}
                          navigation = {this.props.navigation}
                        />
                      </View>
                    }
                  </ScrollView>
                  <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', marginBottom : hp('2%')}}>
                    <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={() => this.props.navigation.goBack()}>
                      <Text style={{ color : '#ffffff' , fontSize : (20)}}>Back</Text>
                    </TouchableOpacity>
                      <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.nextStep}>
                        <Text style={{ color : '#ffffff' , fontSize : (20)}}>Next</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          }
          {!this.props.isHostMyJobsLoaded &&
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
  hostCreatedJobCount : state.createJob.hostCreatedJobCount,
  hostMyJobs : state.createJob.hostMyJobs,
  isHostMyJobsLoaded : state.createJob.isHostMyJobsLoaded,
  isMoreContractorsLoaded : state.createJob.isMoreContractorsLoaded
});
export default connect(mapStateToProps, {GetData, FalseLoader})(Step1);
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
     TouchableStyle :{
        height : hp('7%') ,
        width : wp('33%') ,
        borderRadius : hp('5%') ,
        justifyContent : 'center' ,
        alignItems : 'center',
     },
});

class EachJob extends Component{
  constructor(props){
    super(props);
      this.state = {
        checked : false
      }
  }
  selectJobs = () => {
    this.setState({checked : !this.state.checked ? true : false}, function(){
      this.props.chooseContractor(this.state.checked, this.props.item.ID);
    })  
  }
  render(){
    return(
      <TouchableOpacity style={{flexDirection : 'row' , alignItems : 'center', height : hp('10%'), marginBottom : hp('1%')}} onPress = {this.selectJobs}>
        <View style={{alignItems : 'center', justifyContent : 'center',  height : hp('3.5%'), width : hp('3.5%'), borderWidth : 1.5 , borderColor : '#292929', borderRadius : hp('0.5%'), marginRight : wp('2%')}}>
          {
            this.state.checked &&  
              <View style={{height : hp('3.5%'), width : hp('3.5%'),justifyContent : 'center', alignItems : 'center', backgroundColor : '#0071bc', borderWidth : 1.5 , borderColor : '#0071bc', borderRadius : hp('0.5%')}}>
                <Icon name = 'check' size = {18} color = 'white'/>
              </View>
          }
        </View>
          <View style={{flex : 1, marginLeft : wp('2%')}}>
            <Text style={{ color : '#0071BD' , fontSize : 18}}>{this.props.item.post_title}</Text>
              <TouchableOpacity activeOpacity={0.5} style={{marginTop : hp('1%')}} onPress={() => this.props.navigation.navigate('ViewPropertyDetails', {details : this.props.item})}>
                <Text style={{ color : '#8CC63E' , fontSize : (14)}}>View Details</Text>
              </TouchableOpacity>
          </View>
      </TouchableOpacity>
    )
  } 
}

// invitedContractors : [
            //     {
            //         image : require(`../../assets/working_image1.jpg`) ,
            //         name : 'Rainery Housing LLC'
            //     },
            //     {
            //         image : require(`../../assets/working_image2.jpg`) ,
            //         name : 'Georgia Landscaping'
            //     },
            //     {
            //         image : require(`../../assets/working_image3.jpg`),
            //         name : 'Best Interior Projects'
            //     }    
            // ]

            // <View style={{height : hp('20%'), width : wp('28%'), marginRight : wp('2%'), borderRadius : hp('1%')}}>
            //   {
            //     props.item.property_image === "" && <Image source={require('../../assets/by_default_property.jpg')} style={{height : hp('20%'), width : wp('28%'), resizeMode : 'stretch'}}/>
            //   }
            //   {
            //     props.item.property_image !== "" && <Image source={{ uri: props.item.property_image }} style={{height : hp('20%'), width : wp('28%'), resizeMode : 'stretch'}} />
            //   }
            // </View>