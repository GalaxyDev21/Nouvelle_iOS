import React ,{Component} from 'react';
import { StyleSheet, Text, View , ImageBackground , ActivityIndicator ,ScrollView , TouchableOpacity , Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios' ;
import ShowBar from '../validations/messageBar' ;
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import {server} from '../../Redux/server';

class PassportSetting extends Component{
  constructor(props){
    super(props);
    this.state ={
      image1 : Object.keys(this.props.passportImages).length !== 0 && typeof(this.props.passportImages) === 'object' ? this.props.passportImages.front_image : null,
      imageFlag1 : false,
      image2 :  Object.keys(this.props.passportImages).length !== 0 && typeof(this.props.passportImages) === 'object' ? this.props.passportImages.back_image : null,
      imageFlag2 : false,
      processing : false,
      notification : ''
    } 
  }
  componentDidMount() {
    this.getPermissionAsync();
    setTimeout(() => {
      this.getValue();
    }, 5000); 
  }
  getValue = () => {
    this.setState({
      image1 : Object.keys(this.props.passportImages).length !== 0 && typeof(this.props.passportImages) === 'object' ? this.props.passportImages.front_image : null,
      image2 : Object.keys(this.props.passportImages).length !== 0 && typeof(this.props.passportImages) === 'object' ? this.props.passportImages.back_image : null,
    });
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
    }
  }
  pickImage1 = async () => {
    this.setState({notification : ''});
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
    this.setState({
      image1 : result.uri,
      imageFlag1 : true,
      base64 : true,
    });
    }
  };
  pickImage2 = async () => {
    this.setState({notification : ''});
    let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    //allowsEditing: true,
    aspect: [4, 3],
    });
    if (!result.cancelled) {
    this.setState({
        image2 : result.uri,
        imageFlag2 : true,
        base64 : true,
    });
    }
  };
  onUploadImages = async () => {
    if(this.state.imageFlag1 && this.state.imageFlag2){
      this.setState({processing : true});
      const file1 = {
        uri: this.state.image1,
        name: 'passpost_doc_front',
        type: 'image/jpg',
      }
      const file2 = {
        uri: this.state.image2,
        name: 'passpost_doc_back',
        type: 'image/jpg',
      }
      var formData = new FormData();
      formData.append('passpost_doc_front', file1);
      formData.append('passpost_doc_back', file2);
      try{
        const res = await axios.post(server+'add_passport_images', formData ,{
        headers : {'Authorization': 'Bearer '+ this.props.userToken,},
        });
          if(res.data.code === 200) {
            if(this.props.roleIdUserName.coHost === 'no'){
              this.props.navigation.navigate('ContractorDashBoard');
            }
            else{
              this.props.navigation.navigate('HostDashBoard');
            }
            ShowBar('Your images have uploaded Successfully' , 'success');
          }
          else{
            this.setState({processing : false})
            ShowBar('Sorry, Unable to Upload Images' , 'error');
          }
        }
        catch(error){
          console.log(error);
        }
    }
    else if(this.state.image1 && this.state.image2){
      if(this.props.roleIdUserName.coHost === 'no'){
        this.props.navigation.navigate('ContractorDashBoard');
      }
      else{
        this.props.navigation.navigate('HostDashBoard');
      }
    }
    else{
      this.setState({notification : 'Please Upload Both Images', processing : false})
    }
  };
  render(){
    return(
      <ImageBackground source={require('../../assets/Nouvelle_bg.jpg')} style={{flex : 1}}  resizeMode={'stretch'}>
        {this.props.isPassportImagesLoaded &&
          <View>
            <View style={{alignItems : 'center' , marginTop : hp('10%'), marginBottom : hp('4%')}}>
              <Text style={{ fontSize : 22,  color : '#292929'}}>Passport Images</Text>
            </View>
            <View style={{marginBottom : hp('2%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', padding  :wp('3%')}}>    
              <View>
                <Text style={{ color : '#292929', fontSize : (18), textAlign : 'center',  marginBottom : hp('1%')}}>Identity Front</Text> 
                <View style={{justifyContent : 'center', alignItems : 'center', height : hp('25%'), width : wp('45%'), borderWidth : 1, borderColor : '#DBDBDB', backgroundColor : '#f4f4f4', borderTopLeftRadius : 5, borderTopRightRadius : 5}}>
                  {!this.state.image1 &&  
                    <View style={{alignItems: 'center', justifyContent: 'center',height : hp('10%'), width : hp('10%')}}>
                      <Image source={require('../../assets/image_upload_icon.png')} style={{height : hp('10%'), width : hp('10%'), resizeMode : 'contain'}}/>
                    </View>
                  } 
                  {this.state.image1 && 
                    <View style={{height : hp('25%'), width : wp('45%'), borderWidth : 1, borderColor : '#DBDBDB',}}> 
                      <Image source={{ uri: this.state.image1 }} style={{height: hp('25%'), width : wp('45%'), resizeMode : 'stretch'}}/> 
                    </View>
                  }
                </View>
                <View>
                  <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',height : hp('7%'), alignContent : 'flex-end', width : wp('45%'), backgroundColor : '#0071bc', borderBottomLeftRadius: 5, borderBottomRightRadius : 5}} onPress={this.pickImage1}>
                    <Text style={{fontSize : 15, color : '#fff'}}>Change Image</Text>
                  </TouchableOpacity>
                </View>    
              </View>
              <View>
                <Text style={{ color : '#292929', fontSize : (18), textAlign : 'center',  marginBottom : hp('1%')}}>Identity Back</Text> 
                <View style={{justifyContent : 'center', alignItems : 'center', height : hp('25%'), width : wp('45%'), borderWidth : 1, borderColor : '#DBDBDB', backgroundColor : '#f4f4f4', borderTopLeftRadius : 5, borderTopRightRadius : 5}}>
                  {!this.state.image2 &&  
                    <View style={{alignItems: 'center', justifyContent: 'center',height : hp('10%'), width : hp('10%')}}>
                      <Image source={require('../../assets/image_upload_icon.png')} style={{height : hp('10%'), width : hp('10%'), resizeMode : 'contain'}}/>
                    </View>
                  } 
                  {this.state.image2 && 
                    <View style={{height : hp('25%'), width : wp('45%'), borderWidth : 1, borderColor : '#DBDBDB',}}> 
                      <Image source={{ uri: this.state.image2 }} style={{height: hp('25%'), width : wp('45%'), resizeMode : 'stretch'}}/> 
                    </View>
                  }
                </View>
                <View>
                  <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center',height : hp('7%'), alignContent : 'flex-end', width : wp('45%'), backgroundColor : '#0071bc', borderBottomLeftRadius: 5, borderBottomRightRadius : 5}} onPress={this.pickImage2}>
                    <Text style={{fontSize : 15, color : '#fff'}}>Change Image</Text>
                  </TouchableOpacity>
                </View>    
              </View>
            </View>
            <Text style={{fontSize : 12, color : 'red', marginBottom : hp('2%'), marginHorizontal : wp('3%')}}>{this.state.notification}</Text>     
            <View style={{height : hp('7%'), paddingHorizontal : wp('3%')}}>
              <TouchableOpacity style={styles.touchCon} onPress={this.onUploadImages}>
                <Text style={styles.touchButton}>Upload Images</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
              </TouchableOpacity>
            </View>
          </View>
        }
        {!this.props.isPassportImagesLoaded &&
          <View style={{flex:1, alignItems:'center', justifyContent:'center', marginBottom : hp('15%')}}>
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
  passportImages : state.createJob.passportImages,
  isPassportImagesLoaded : state.createJob.isPassportImagesLoaded,
  roleIdUserName : state.createJob.roleIdUserName
});
export default connect(mapStateToProps)(PassportSetting);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
  },
  touchCon : {
    height: hp('7%') ,
    flexDirection : 'row' ,
    backgroundColor : '#8cc63f' ,
    borderRadius : 25 ,
    alignItems : 'center' ,
    justifyContent : 'center' ,
    marginBottom : hp('2%') ,
  },
  touchButton : {
    fontFamily : 'Raleway-SemiBold' , 
    fontSize : (18) ,
    color : '#ffffff' ,
  },
});

// pickImage1 = async () => {
//   this.setState({notification : ''});
//   let result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.All,
//     aspect: [4, 3],
//   });
//   if (!result.cancelled) {
//     const response = await fetch(result.uri);
//     const blob = await response.blob();
//     const blobData = blob._data;
//     delete blobData.__collector;
//     this.setState({
//       image1 : result.uri,
//       imageFlag1 : true,
//       blob1 : {uri : result.uri, ...blobData}
//     });
//   }
// };
// pickImage2 = async () => {
//   this.setState({notification : ''});
//   let result = await ImagePicker.launchImageLibraryAsync({
//   mediaTypes: ImagePicker.MediaTypeOptions.All,
//   aspect: [4, 3],
//   });
//   if (!result.cancelled) {
//     const response2 = await fetch(result.uri);
//     const blob2 = await response2.blob();
//     const blobData2 = blob2._data;
//     delete blobData2.__collector;
//     this.setState({
//       image2 : result.uri,
//       imageFlag2 : true,
//       blob2 : {uri : result.uri, ...blobData2}
//     });
//   }
// };