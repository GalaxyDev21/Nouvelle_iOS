import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { UploadImage, GetUploadImages} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';

 class ContractorProfileSampleWork extends Component{
  constructor(props){
    super(props);
    this.state = {
      buttonPressed : [ false, false ],
      dialogsuccess : false ,
      deleteDialogsuccess : false,
      uploadImageName : 'Upload photo',
      image: null,
      imageId : '',
      images : [],
      popupImage : '',
      processing : false,
      deleteProcessing : false,
      blob : {}
    }
  }
  deleteSpecificImage =async () => {
    var formData = new FormData();
    formData.append('picture_id',  this.state.imageId);
    await fetch(server+'delete_profile_picture',{
      method: 'post', 
      headers: new Headers({
        'Authorization': 'Bearer '+ this.props.userToken, 
      }),
      body : formData
    })
    .then((response) => response.json())
    .then(async(res) => {
      if(res.code === 200){
        ShowBar('Image Deleted Successfully' , 'success');
        await this.props.GetUploadImages(this.props.userToken);
        this.closeDailog();
      }
      else{
        ShowBar('Sorry, Unable to delete image' , 'error');
        this.closeDailog();
      }
    })
  }
  closeDailog = () => {
    this.setState({ deleteDialogsuccess : false, deleteProcessing : false });
  }
  deleteImageFromProfile = (index) => {
    this.setState({
       deleteDialogsuccess : !this.state.dialogsuccess,
       imageId : index
    });
  }
  imagePressed = (index) => {
    this.setState({popupImage : this.props.uploadedImages[index].url}, function(){
      this.setState({dialogsuccess : !this.state.dialogsuccess})
    });
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
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      const splitImageUri = result.uri.split('/');
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const blobData = blob._data;
      delete blobData.__collector;
      this.setState({
        image: result.uri,
        uploadImageName : splitImageUri[splitImageUri.length - 1],
        blob : {uri : result.uri, ...blobData}
      });
    }
  }
  onUploadPressed = () => {
    if(this.state.image){
      console.log('*********** Image URL *********');
      console.log(this.state.blob);
      console.log('*********************');
      this.setState({processing : true});
      var formData = new FormData();
      formData.append('property_image',  this.state.blob);
      this.apiCall(formData);
    }
    else{
      ShowBar('please click above link to select Image' , 'error');
    } 
  }
  apiCall = async(formData) => {
    await this.props.UploadImage(this.props.userToken, formData, this.state.image);
    if(this.props.isImageUploaded){
      this.stopProcessing();
    }
  }
  stopProcessing = () => {
    this.setState({processing : false, image : null, uploadImageName : 'Upload photo'});
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/contractor_profle_bg.jpg')} style={{flex: 1, resizeMode : 'stretch'}}>
        {this.props.isImagesLoaded &&
          <ScrollView style = {{padding : 10}}>
            <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', marginBottom:hp('2%'), flexWrap:'wrap'}}>
              {this.props.uploadedImages.map((item , index) => <DisplayImage imageNo={item}  key={item.id} index={index} imagePressed={ this.imagePressed } deleteImageProfile = {this.deleteImageFromProfile}/>)}
            </View>
          </ScrollView>
        }
        {!this.props.isImagesLoaded &&
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <ActivityIndicator
            size='large'
            />
          </View>
        }
        <Text style={{  color : '#292929', fontSize : (18) , marginTop : hp('3%'), marginLeft : wp('8%')}}>Upload Sample work</Text>
        <View style={{flexDirection : 'row', marginTop : hp('0.5%'), justifyContent : 'center' , alignItems : 'center'}}>
          <View style={{height : hp('7%'), width : wp('70%'), padding : hp('2%'), backgroundColor : '#F4F4F4', borderBottomLeftRadius : hp('1%'), borderTopLeftRadius : hp('1%')}}>
            <Text style={{color : '#292929', fontSize : (14)}}>{this.state.uploadImageName}</Text>
          </View>
          <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', backgroundColor : '#0071BD', height : hp('7%'), width : wp('12%'), borderBottomRightRadius : hp('1%'), borderTopRightRadius : hp('1%')}} onPress={this.pickImage}>
            <Image source={require('../../assets/image_upload_clip_icon.png')} style={{height : hp('4%'), width : hp('4%'), resizeMode : 'contain'}}/>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent : 'center', alignItems : 'center'}}>
          <TouchableOpacity onPress = {this.onUploadPressed} activeOpacity = {0.5} style={{alignItems: 'center', justifyContent: 'center', backgroundColor : '#8CC63E', height : hp('7%'), width : wp('82%'), marginTop : hp('2%'), marginBottom : hp('5%'), borderRadius : hp('5%')}}>
            <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
              <Text style={{color : '#ffffff', fontSize : (18), marginRight : wp('3%')}}>Upload</Text>
              {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
            </View>
          </TouchableOpacity>
        </View>
        <Dialog
          visible={this.state.dialogsuccess}
          onTouchOutside={() => this.setState({dialogsuccess: false})}
          dialogStyle={{borderRadius: 5, height : hp('49%'), overflow: 'hidden', backgroundColor : '#ffffff'}}
          contentStyle={{borderRadius: 5, height : hp('49%'), overflow: 'hidden'}} 
        > 
          <View style={{alignItems : 'center' , justifyContent : 'center'}}>
            <TouchableOpacity onPress={() => this.setState({dialogsuccess : false})} style={{width : wp('86%'), height : hp('3%'), alignItems : 'flex-end' , justifyContent : 'center'}}>
              <Image source = {require('../../assets/cross.png')} style={{height : hp('3%'), width : hp('3%') , resizeMode : 'contain'}}/>
            </TouchableOpacity>
            <View style={{justifyContent : 'center', alignItems : 'center'}}>
              <Image source = {{ uri : this.state.popupImage}}  style = {{height : hp('45%'), width : wp('93%'), resizeMode : 'stretch'}}/> 
            </View>
          </View>
        </Dialog>
        <Dialog
          visible={this.state.deleteDialogsuccess}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingBottom : 0, backgroundColor : '#ffffff'}}
        > 
          <View>
            <View style={{justifyContent : 'center', alignItems : 'center'}}>
              <Image source={require('../../assets/delete_group_icon.png')} style={{height : hp('7%'), width : hp('7%'), resizeMode : 'contain'}}/>
            </View>
            <View style={{alignItems : 'center'}}>
              <View style={{width  :wp('70%')}}>
                <Text style={{color : '#292929', textAlign : 'center', fontSize : (18), marginLeft :wp('6%'), marginBottom : hp('2%')}}>Are you sure you want to delete an image?</Text>
              </View>
            </View>
            <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-evenly' , backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
              <TouchableOpacity onPress={()=> {this.setState({deleteProcessing : true}); this.deleteSpecificImage()}}  style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), flexDirection : 'row', alignItems : 'center', justifyContent : 'center', backgroundColor : '#8CC63E'}}>
                <Text style={{ color : '#ffffff', fontSize : (18), marginRight : wp('3%')}}>YES</Text>
                {this.state.deleteProcessing && <ActivityIndicator size='small' />}  
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({deleteDialogsuccess : false})} style={{height : hp('7%'), width : wp('35%'), borderRadius : hp('4%'), alignItems : 'center', justifyContent : 'center', backgroundColor : '#0071BD'}}>
                <Text style={{color : '#ffffff', fontSize : (18)}}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog> 
      </ImageBackground>
    );
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  isImageUploaded : state.createJob.isImageUploaded,
  isImagesLoaded : state.createJob.isImagesLoaded,
  uploadedImages : state.createJob.uploadedImages,
});
export default connect(mapStateToProps, {UploadImage, GetUploadImages})(ContractorProfileSampleWork);

class DisplayImage extends Component {
  render(){
    return(
      <TouchableOpacity style={styles.specificImage} onPress={() => this.props.imagePressed(this.props.index)}>
        <Image source={{ uri: this.props.imageNo.url}}  style={styles.ImageHeightAndWidth}/> 
        <TouchableOpacity onPress={() => this.props.deleteImageProfile(this.props.imageNo.id)} style={{width : hp('4%'), width : hp('4%'), position : 'absolute', top : -48, right : 0}}>
          <Image source={require('../../assets/delete_icon.png')} style={{width : hp('4%'), width : hp('4%'), resizeMode : 'contain'}}/>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  specificImage :{
    overflow : 'hidden',
    height:hp('25%'),
    width: wp('30%'),
    borderRadius : 5,
    position : 'relative',
    marginRight : wp('1%'),
    marginBottom : hp('1%')
  },
  ImageHeightAndWidth : {
    height:hp('25%'),
    width: wp('30%'),
    resizeMode : 'cover'
  },
  popupImageStyle : {
    width : wp('93%'),
  }
});