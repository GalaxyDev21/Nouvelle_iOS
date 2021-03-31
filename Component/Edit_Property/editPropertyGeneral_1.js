import React ,{Component} from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, ImageBackground, Linking , TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { EditPropertyDetail } from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import TextInputField from '../InputFields/textInputField';
import TouchButton from '../InputFields/touchButton';
import ActionPerformFunc from '../InputFields/actionPerform';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

class EditPropertyGeneralScreen_1 extends Component{
  constructor(props){
    super(props);
    this.state ={
      property : '',
      bedrooms : '',
      bathrooms : '',
      uploadImage : false,
      image: '',
      bedroomNotification : '',
      bathroomNotification : '' ,
      Describe_property : '',
      prevState : {property : ''},
      blob : {}
    }
  }
  componentDidMount() {
    this.getPermissionAsync();
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
     // allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const blobData = blob._data;
      delete blobData.__collector;
      this.setState({
        image: result.uri,
        uploadImage : true,
        blob : {uri : result.uri, ...blobData}
      });
    }
  };
  selectNoOfBedrooms = (value) => {
  this.setState({bedrooms : value, bedroomNotification : ''})
  }
  selectNoOfBathrooms = (value) => {
    this.setState({bathrooms : value, bathroomNotification : ''})
  }
  gotoNextScreen = () => {
    const tempObj = {
      image : this.state.blob,
      property_title : this.state.property,
      bedrooms : this.state.bedrooms,
      bathrooms : this.state.bathrooms,
      describe_property : this.state.Describe_property,
      img : this.state.image
    }
    this.props.EditPropertyDetail(tempObj);
    this.props.switchScreen(); 
  }
  onChange = (name, value) => {
  this.setState({
    [name]: value,
    [name+'Notification'] : ''
  });
  }
  validityCheck = (name , validity) => {
    this.setState({
      [name+'Valid']: validity,
    });
  }
  openLink = () => {
    Linking.openURL(this.state.websiteLinks[this.state.rentingWebsite]);
  }
  static getDerivedStateFromProps(props, state){
    if(state.prevState.property !== props.specificPropertyDetail.post_title){
      state.property = props.specificPropertyDetail.post_title;
      state.bedrooms = props.specificPropertyDetail.property_bedrooms;
      state.bathrooms = props.specificPropertyDetail.property_bathrooms;
      state.image = props.specificPropertyDetail.property_image;
      state.Describe_property = props.specificPropertyDetail.post_content.replace(/(<([^>]+)>)/g, "");
      state.prevState.property = props.specificPropertyDetail.post_title;
    }
    return state;
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/add_property_bg.jpg')} style={styles.container}>
          <ScrollView>
            <View style={{flex : 1, backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%'), padding : wp('3%'), marginHorizontal : wp('4%'), marginVertical : hp('2%')}}>
              <ScrollView nestedScrollEnabled = {true}>
                <View style={{flexDirection : 'row' , alignItems : 'center' , justifyContent : 'space-between', marginBottom : hp('3%')}}>
                  <View style={{justifyContent : 'center', alignItems : 'center', height: hp('25%'), width : wp('40%')}}>
                    <Image source={this.state.image ? { uri: this.state.image } : require('../../assets/default_property_image.jpg')} style={{height: hp('25%'), width : wp('40%'), resizeMode : 'stretch'}} /> 
                  </View>
                  <View style={{justifyContent : 'center', alignItems : 'center', height : hp('25%'), width : wp('40%'), borderWidth : 1, borderColor : '#DBDBDB', backgroundColor : '#ffffff'}}>
                    <View style={{alignItems: 'center', justifyContent: 'center',height : hp('7%'), width : wp('7%')}}>
                      <Image source={require('../../assets/upload_image.jpg')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
                    </View>
                    <TouchButton 
                      buttonName = 'Upload'
                      actionPerform = {ActionPerformFunc}
                      move = {{doingAction : 'doingAction', action : this.pickImage}}
                      bgColor = '#8cc63f'
                      width = {wp('30%')}
                      height = {hp('4%')}
                      buttonNameSize = {(15)}
                      elevation = {0}
                      navigation = {this.props.navigation}
                    />
                  </View>
                </View>
                  <View style={{height : hp('10%'),  marginBottom : hp('3%')}}>      
                    <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Name your property</Text>
                      <TextInputField
                        name = 'property'
                        keyboardType = 'default'
                        placeholder = 'your property'
                        placeholderTextColor='#292929'
                        secureTextEntry = {false}
                        multiline = {false}
                        numberOfLines = {1}
                        height = {hp('7%')}
                        validations = {{required : true}}
                        onChangeValue = {this.onChange}
                        validityChange = {this.validityCheck}
                        value = {this.state.property}
                      />
                  </View>
                  <View style={styles.eachField}>
                    <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Bed rooms</Text>
                      <TextInputField
                        name = 'bedrooms'
                        keyboardType = 'numeric'
                        placeholder = 'No of Bedrooms'
                        placeholderTextColor='#292929'
                        secureTextEntry = {false}
                        multiline = {false}
                        numberOfLines = {1}
                        height = {hp('7%')}
                        validations = {{required : true}}
                        onChangeValue = {this.onChange}
                        validityChange = {this.validityCheck}
                        value = {this.state.bedrooms}
                      />
                  </View>
                  <View style={styles.eachField}>
                    <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (18)}}>Bathrooms</Text>      
                      <TextInputField
                        name = 'bathrooms'
                        keyboardType = 'numeric'
                        placeholder = 'No of Bathrooms'
                        placeholderTextColor='#292929'
                        secureTextEntry = {false}
                        multiline = {false}
                        numberOfLines = {1}
                        height = {hp('7%')}
                        validations = {{required : true}}
                        onChangeValue = {this.onChange}
                        validityChange = {this.validityCheck}
                        value = {this.state.bathrooms}
                      />
                  </View>
                  <View style={{height : hp('18%'),  marginBottom : hp('3%')}}>      
                    <Text style={{fontSize : (18), fontFamily : 'Raleway-SemiBold', color: '#292929'}}>Property Description</Text>
                      <TextInputField
                        name = 'Describe_property'
                        keyboardType = 'default'
                        placeholder = 'Describe your property'
                        placeholderTextColor='#292929'
                        secureTextEntry = {false}
                        multiline = {true}
                        numberOfLines = {12}
                        textAlign = 'top'
                        height = {hp('15%')}
                        validations = {{required : true}}
                        onChangeValue = {this.onChange}
                        validityChange = {this.validityCheck}
                        value = {this.state.Describe_property}
                      />
                  </View>
                    <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
                      <TouchButton 
                        buttonName = 'Back'
                        actionPerform = {ActionPerformFunc}
                        move = 'back'
                        bgColor = '#0071bc'
                        width = {wp('33%')}
                        height = {hp('7%')}
                        buttonNameSize = {(20)}
                        elevation = {0}
                        navigation = {this.props.navigation}
                      />
                      <TouchButton 
                        buttonName = 'Next'
                        actionPerform = {ActionPerformFunc}
                        move = {{doingAction : 'doingAction', action : this.gotoNextScreen}}
                        bgColor = '#8cc63f'
                        width = {wp('33%')}
                        height = {hp('7%')}
                        buttonNameSize = {(20)}
                        elevation = {0}
                        navigation = {this.props.navigation}
                      />
                    </View>
                  </ScrollView>
              </View>
            </ScrollView>       
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  specificPropertyDetail : state.createJob.specificPropertyDetail,
});
export default connect(mapStateToProps, {EditPropertyDetail})(EditPropertyGeneralScreen_1);
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
  RadioButtonStyle : {
    flexDirection : 'row' ,
    alignItems : 'center' ,
    flexWrap : 'wrap' ,
    marginBottom : hp('3%') ,
    backgroundColor : '#f4f4f4',
    height : hp('12%'),
    padding : wp('1.2%')
  },
  innerViewInRadioButton  : {
    height:wp('5%'),
    width:wp('5%'),
    backgroundColor:'rgba(0,0,0,0)',
    borderRadius: 100,
    borderWidth :2,
    borderColor:'#0071bc',
    justifyContent:'center',
    alignItems:'center'
  },
  specificRadioButton : {
    flexDirection : 'row' ,
    alignItems : 'center' ,  
    marginBottom : hp('1%')
  },
  innerCircle : {
    height:wp('2.5%'),
    width:wp('2.5%'), 
    backgroundColor:'#0071bc',
    borderRadius: 100
  }
});