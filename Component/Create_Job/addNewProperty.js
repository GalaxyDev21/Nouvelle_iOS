import React ,{Component} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import StatusBar from '../InputFields/statusBar' ;
import { AddProperty, storeServiceForCreateJob} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import ZipCodeValidation from '../validations/zipCodeValidation' ;
import DropDownField from '../InputFields/dropDown';
import axios from 'axios' ;
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';

class NewPropertyScreen extends Component{
    constructor(props){
        super(props);
        this.state ={
          address : '',
          propertyName : '',
          zipCode : '',
          bedrooms : '' ,
          bathrooms : '',
          addressNotification : '',
          propertyNameNotification : '',
          zipNotification : '',
          bathroomNotification : '',
          bedroomNotification : '',
          processing : false
        }
      }
      chooseProperty = () => {
        this.setState({
          processing : true
       });
        if(this.state.propertyName && this.state.address && this.state.zipCode && this.state.bathrooms && this.state.bedrooms){
          this.addNewProperty();  
        }
        else{
          if(!this.state.propertyName) {
            this.setState({propertyNameNotification : 'property Name required'});
           }
          if(!this.state.address) {
           this.setState({addressNotification : 'address required'});
          }
          if(!this.state.zipCode) {
             this.setState({zipNotification : 'ZIP Code required'});
           }
            if(!this.state.bathrooms) {
              this.setState({bathroomNotification : 'Number of Bathrooms required'});
            }
            if(!this.state.bedrooms) {
              this.setState({bedroomNotification : 'Number of Bedrooms required'});
            }
            this.setState({
              processing : false
           });
        }  
      }

      addNewProperty =async () => {
        var formData = new FormData();
        formData.append('property_title', this.state.propertyName);
        formData.append('address_street_number',  this.state.address);
        formData.append('address_zipcode', this.state.zipcode);
        formData.append('post_bedrooms', this.state.bedrooms);
        formData.append('post_bathrooms', this.state.bathrooms);
        formData.append('ID', '');
        formData.append('address_unit_number', '');
        formData.append('address_city', '');
        formData.append('address_state', '');
        formData.append('address_country', '');
        formData.append('property_content', '');
        formData.append('property_image',  '');
        const res = await axios.post(server+'add_property', formData ,{
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        if(res.data.code === 200){
          var newProperty = {
            property_name : res.data.data.property_title,
            property_id : res.data.data.property_id
          } 
          this.props.AddProperty(newProperty);
          this.stopProcessing();
        }
        else if(res.data.code === 201){
          ShowBar('Add property first' , 'warning');
        }
      }

      stopProcessing =(data) => {
          this.props.navigation.navigate('CreateJob_Screen2');
            this.setState({
              processing : false
            });
      }
    render(){
        return(
          <ImageBackground source={require('../../assets/create_Job_bg.jpg')} style={styles.container}>
             <StatusBar title='CREATE JOB' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('6%')}/>
               <ScrollView>
               <View style={{flex : 0.08 , alignItems : 'center'}}>
                 <Text style={styles.titleStyle}>Location of your property</Text>
               </View>
                  <View style={{flex : 0.85, backgroundColor : '#ffffff', borderRadius : hp('1%'), padding : wp('3%'), margin : wp('4%')}}>
                  <View style={styles.eachField}>
                      <Text style={{ color : '#292929', fontSize : (18)}}>Name Your Property</Text>
                        <TextInput placeholder='Your property name' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({propertyName : text, propertyNameNotification : ''})} value={this.state.propertyName}/>
                          <Text style={{ color : 'red', fontSize : (12)}}>{this.state.propertyNameNotification}</Text>
                    </View>
                    <View style={styles.eachField}>
                      <Text style={{ color : '#292929', fontSize : (18)}}>Street address</Text>
                        <TextInput placeholder='Your property address' placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({address : text, addressNotification : ''})} value={this.state.address}/>
                          <Text style={{ color : 'red', fontSize : (12)}}>{this.state.addressNotification}</Text>
                    </View>
                      <View style={{height : hp('5%'), marginBottom : hp('1.5%'), borderBottomColor : '#DBDBDB', borderBottomWidth : 1, justifyContent : 'center'}}>
                        <Text style={{ color : '#292929', fontSize : (20)}}>Property information</Text>
                      </View>
                        <View style={styles.eachField}>
                          <Text style={{ color : '#292929', fontSize : (18)}}>Zip Code</Text>
                            <TextInput keyboardType='number-pad' placeholder="Your property's ZIP code / Postal code" placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({zipCode : text, zipNotification : ZipCodeValidation(text)})} value={this.state.zipCode}/>
                              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.zipNotification}</Text>
                        </View>
                        <View style={styles.eachField}>
                          <Text style={{ color : '#292929', fontSize : (18)}}>Bed rooms</Text>
                            <TextInput keyboardType='number-pad' placeholder="Enter number od bed rooms" placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({bedrooms : text})} value={this.state.bedrooms}/>
                              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.bedroomNotification}</Text>
                        </View>
                        <View style={styles.eachField}>
                          <Text style={{ color : '#292929', fontSize : (18)}}>Bathrooms</Text>
                            <TextInput keyboardType='number-pad' placeholder="Enter number od bath rooms" placeholderTextColor='#292929'  style={styles.textInputCon} onChangeText={(text)=>this.setState({bathrooms : text})} value={this.state.bathrooms}/>
                              <Text style={{ color : 'red', fontSize : (12)}}>{this.state.bathroomNotification}</Text>
                        </View>
                             <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
                               <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#0071bc'}]} onPress={()=>this.props.navigation.goBack()}>
                                  <Text style={{color : '#ffffff' , fontSize : (20)}}>Back</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f'}]} onPress={this.chooseProperty}>
                                 <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                                   <Text style={{ color : '#ffffff' , fontSize : (20), marginRight : wp('2%')}}>Next</Text>
                                     {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                                  </View>
                               </TouchableOpacity>
                             </View>
                     </View>
                     </ScrollView>   
           </ImageBackground>
        )
    }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken ,
  jobInformation : state.createJob.jobInformation ,
});
export default connect(mapStateToProps,{AddProperty, storeServiceForCreateJob})(NewPropertyScreen);

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
    eachField : {
      marginBottom : hp('3%'),
      height : hp('10%')
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
        fontSize: (14),
        backgroundColor : '#f4f4f4' ,
        paddingLeft : wp('2%'),
        borderRadius : 2 
     },
     TextInputField : {
        height : hp('7%') ,
        alignItems : 'flex-start' ,
        justifyContent : 'center' ,
        marginBottom : hp('3%') ,
        backgroundColor : '#f4f4f4'
     },
    });