import React ,{Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StatusBar from '../InputFields/statusBar' ;
//import moment from 'moment';
//import { connect } from 'react-redux';
export default class SmallRoom extends Component {
  constructor(props){
    super(props);
      this.state = {
        details : this.props.navigation.getParam('details' , ''),
      }
    }
    render(){
      return(
        <ImageBackground source={require('../../assets/my_jobs_bg.jpg')} style={styles.container}>
          <StatusBar title='Property Details' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('4%')}/>
            <View style={{ backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : wp('1%'), padding : wp('3%'), marginHorizontal : wp('3%'), marginBottom : hp('2%')}}>
              <View style={{width : '100%', alignItems : 'center'}}>
                <View style={{height : hp('30%'), width : hp('27%'), marginBottom : hp('3%')}}>
                {
                  this.state.details.property_image === "" && <Image source={require('../../assets/by_default_property.jpg')} style={{height : hp('30%'), width : hp('27%'), resizeMode : 'stretch'}}/>
                }
                {
                  this.state.details.property_image !== "" && <Image source={{ uri: this.state.details.property_image }} style={{height : hp('30%'), width : hp('27%'), resizeMode : 'stretch'}} />
                }
                </View>
              </View>
              <View style={{marginBottom : hp('2%')}}>
                <JobInfo heading = 'Property Name: ' value = {this.state.details.post_title} />
                <JobInfo heading = 'Bed rooms: ' value = {this.state.details.property_bedrooms}/>
                <JobInfo heading = 'Bathrooms: ' value = {this.state.details.property_bathrooms}/>
                <JobInfo heading = 'Zip Code: ' value = {this.state.details.address_zipcode}/>
                <JobInfo heading = 'Street Number: ' value = {this.state.details.address_street_number}/>
                <JobInfo heading = 'Unit Number: ' value = {this.state.details.address_unit_number}/>
                <JobInfo heading = 'City: ' value = {this.state.details.address_city}/>
                <JobInfo heading = 'State: ' value = {this.state.details.state[0].name}/>
                <JobInfo heading = 'Country: ' value = {this.state.details.country[0].name}/>
                <JobInfo heading = 'Renting Website: ' value = {this.state.details.renting_website}/>
                <JobInfo heading = 'Description: ' value = 'Dummy description'/>
              </View>
            </View>
        </ImageBackground>    
    )
  }
}
const styles = StyleSheet.create({
  container : {
      flex : 1 ,
      resizeMode : 'stretch',
   },
})

function JobInfo(props) {
  return(
    <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : hp('1%')}}>
      <Image source={require('../../assets/point_icon.png')} style={{height : hp('1.5%'), width : hp('1.5%'), resizeMode : 'contain'}}/>
        <View style={{flexDirection : 'row', alignItems : 'center'}}>
          <Text style={{color : '#0071bc' , fontSize : 17, marginLeft : wp('2%')}}>{props.heading}</Text>
            <Text style={{color : '#292929', fontSize : 15, marginLeft : wp('2%'), flexWrap : 'wrap', width : '60%'}}>{props.value}</Text>
        </View>
    </View>
  )
}