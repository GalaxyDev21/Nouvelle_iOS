import React ,{Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, ImageBackground, ScrollView} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
import StarRating from 'react-native-star-rating';
import TextInputField from '../InputFields/textInputField';
import TouchButton from '../InputFields/touchButton';
import ActionPerformFunc from '../InputFields/actionPerform';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';
// import { ChooseArea } from '../../Redux/createJob/jobAction' ;
// import { connect } from 'react-redux';

class ReviewContractor extends Component{
  constructor(props){
    super(props);
      this.state ={
        describeContractor : '',
        starCount : '',
        jobId : this.props.navigation.getParam('jobID', ''),
        image : this.props.navigation.getParam('image', ''),
        name : this.props.navigation.getParam('name', ''),
        userToken : this.props.navigation.getParam('userToken', ''),
        processing : false
      }
    }
    gotoNextScreen = async() => {
      if(this.state.describeContractor && this.state.starCount){
        try{
          this.setState({processing : true});
          var formData = new FormData();
          formData.append('id', this.state.jobId);
          formData.append('rating', this.state.starCount);
          formData.append('comment', this.state.describeContractor);
          console.log(formData);
          const res = await axios.post(server+'project_finish', formData ,{
            headers : {'Authorization': 'Bearer '+ this.state.userToken},
          });
          console.log('********** Response **********');
          console.log(res);
          console.log('************************');
          if(res.data.code === 200){
            ShowBar(res.data.data, 'success');
            this.setState({processing : false});
            this.props.navigation.navigate('HostDashBoard');
          }
          else{
            ShowBar('Sorry, Unable to give review', 'error');
            this.setState({processing : false});
          }
        }
        catch(error){
          console.log(' Catch function called ');
          console.log(error);
        }
      }  
      else{
        ShowBar("Please try Again", 'error');
      }
    }
    onChange = (name, value) => {
      this.setState({
        [name]: value,
      });
    }
    validityCheck = (name , validity) => {
      this.setState({
        [name+'Valid']: validity,
      });
    }
    onStarRatingPress = (rating) => {
      this.setState({starCount : rating})
    }
    render(){
      return(
        <ImageBackground source={require('../../assets/review_bg.jpg')} style={styles.container}>    
          <StatusBar title='ADD REVIEW' isIconDisplay={true} marginValue={hp('4%')} navigation = {this.props.navigation}/>
              <ScrollView>
                <View style={{flex : 0.5, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginHorizontal : wp('4%'), marginVertical : hp('5%')}}>
                  <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('2%')}}>
                    <View style={{alignItems : 'center' , justifyContent : 'center', overflow : 'hidden' ,height : hp('14%') , width : hp('14%') , borderRadius : 100 , marginRight : wp('3%')}}>
                      <Image source={{uri : this.state.image}} resizeMode = 'contain' style={{ height : hp('14%') , width : hp('14%')}}/>
                    </View>
                    <View style={{flex : 1 ,  justifyContent : 'center', alignItems : 'flex-start'}}>
                      <Text style={{color : '#292929' , fontFamily : 'Raleway-SemiBold' , fontSize:(20), marginBottom : wp('1%')}}>{this.state.name}</Text>
                        <Text style={{color : '#0071bc' , fontFamily : 'Raleway-SemiBold' , fontSize:(16), marginBottom : wp('1%')}}>Post a Review</Text> 
                    </View>
                  </View>
                  <View style={{flex : 0.2 , width : wp('30%'), marginBottom : hp('2%')}}>
                    <StarRating
                      disabled = {false}
                      maxStars={5}
                      fullStarColor='#fcb016'
                      emptyStarColor='#f4f4f4'
                      rating={parseInt(this.state.starCount)}
                      starSize = {45}
                      starStyle={{marginRight : wp('0.5%')}}
                      containerStyle={{marginRight : wp('1%')}}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}
                    /> 
                  </View>
                    <View style={{height : hp('18%'),  marginBottom : hp('2%')}}>      
                      <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Description</Text>
                        <TextInputField
                          name = 'describeContractor'
                          keyboardype = 'default'
                          placeholder = 'Describe Contractor'
                          placeholderTextColor='#292929'
                          secureTextEntry = {false}
                          multiline = {true}
                          numberOfLines = {12}
                          textAlign = 'top'
                          height = {hp('15%')}
                          validations = {{required : true}}
                          onChangeValue = {this.onChange}
                          validityChange = {this.validityCheck}
                        />
                    </View>  
                      {/* <View style={{}}> */}
                      <TouchableOpacity onPress={this.gotoNextScreen} activeOpacity = {0.5} style={{ backgroundColor : '#8CC63E', flexDirection : 'row', alignItems: 'center', justifyContent : 'center', height : hp('7%'), borderRadius : hp('5%'), marginBottom : hp('2%')}}>
                        <Text style={{ color : '#ffffff', fontSize : 18, marginRight : wp('3%')}}>Submit</Text>
                        {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                      </TouchableOpacity>
                        {/* <TouchButton 
                          buttonName = 'Submit'
                          actionPerform = {ActionPerformFunc}
                          move = {{doingAction : 'doingAction', action : this.gotoNextScreen}}
                          bgColor = '#8cc63f'
                          width = {wp('85%')}
                          height = {hp('7%')}
                          buttonNameSize = {(20)}
                          elevation = {0}
                          navigation = {this.props.navigation}
                          />
                      </View> */}
                </View>
              </ScrollView>      
      </ImageBackground>
    )
  }
}
export default ReviewContractor;
const styles = StyleSheet.create({
  container : {
      flex : 1 ,
      resizeMode : 'stretch',
    },
});