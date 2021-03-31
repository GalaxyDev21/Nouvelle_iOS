import React, { Component } from 'react';
import {View,StyleSheet,TextInput,Text,Image, Animated} from 'react-native';
import validator from 'validator';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class TextInputField extends Component {
  constructor(props){
    super(props);
    this.state={
      valueValid: true,
      errorMessage: '',
      currentText: '',
      prevProps:{}
    }
  }
  onValueChange = (e) =>{
    this.setState({currentText:e})
      this.props.onChangeValue(this.props.name,e);
      this.validateValue(e);
  }
  validateValue = (text) =>{
    if(this.props.validations)
    {
        if(this.props.validations.required){
          this.validateRequired(text);
        }

        if(this.props.validations.email){
          this.validateEmail(text);
        }
        if(this.props.validations.password){
           this.validateLength(text);
        }
        if(this.props.validations.url){
          this.validateURL(text);
       }
    }
  }
  validateEmail = (text) =>{
    if(!validator.isEmail(text)){
       this.setErrorMessage('Please enter a valid email address');
    }
    else{
      this.setToNoError();
    }
  }
  validateURL = (text) =>{
    if(!validator.isURL(text)){
       this.setErrorMessage('Please enter a valid URL');
    }
    else{
      this.setToNoError();
    }
  }
  validateLength = (text) => {
    if(text.length<this.props.validations.length){
      this.setErrorMessage( this.props.placeholder+ ' length must be more than ' + this.props.validations.length + ' characters');
    }
    else{
      this.setToNoError();
    }   
  }
  validateRequired = (text) =>{
    if(text==''){
       this.setErrorMessage(this.props.name + ' is required');
    }
    else{this.setToNoError();}
  }
  setErrorMessage = (message) =>{
    this.setState({
      valueValid: false,
      errorMessage: message
    });
    this.props.validityChange(this.props.name,false);
  }
  setToNoError = () =>{
    this.setState({
      valueValid: true,
      errorMessage: ''
    });
    this.props.validityChange(this.props.name,true);
  }
  // static getDerivedStateFromProps(props, state) {
  //   if(state.prevProps.externalError==null)
  //    {state.prevProps = props;}
  //   if(props.externalError.message !== state.prevProps.externalError.message){
  //         state.valueValid =  props.externalError.valid;
  //         state.errorMessage = props.externalError.message;         
  //   }
  //   state.prevProps = props;
  //   return state;
  // }  
  render() {
    return (
      <View>
        <TextInput 
            placeholder = {this.props.placeholder}
            placeholderTextColor = {this.props.placeholderTextColor}
            onChangeText = {this.onValueChange} 
            style={{fontSize : (16), color : 'black', textAlign : this.props.AlignItem ? this.props.AlignItem : 'left', height: this.props.height, width:this.props.width ? this.props.width : ('100%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#f4f4f4', padding : wp('1%'), borderWidth : 1, borderColor :'#f4f4f4', borderRadius : 2}}
            secureTextEntry={this.props.secureTextEntry}
            value = {this.props.value}
            keyboardType = {this.props.keyboardType}
            // textContentType = {this.props.textContentType}
            multiline = {this.props.multiline}
            numberOfLines = {this.props.numberOfLines}
            textAlignVertical = {this.props.textAlign}
        />
            { !this.state.valueValid &&
              <Text style={styles.errorText}>{this.state.errorMessage}</Text>
            }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  errorText:{
    fontSize : (12),
    color : 'red'
  }
});
// TextInputField.defaultProps = {
//   externalError: {valid: true, message: ''}
// }