import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, AsyncStorage, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';
import ContractorIntro from './contractorIntro' ;
import MessageButtons from './messageButtons';
import { connect } from 'react-redux';

class SampleWork extends Component{
  constructor(props){
    super(props);
    this.state = {
      dialogsuccess : false ,
      popupImage : null,
      role: ''
    }
  }
  imagePressed = (index) => {
    this.setState({
      dialogsuccess : !this.state.dialogsuccess ? true : false,
      popupImage :  this.props.sampleWorkImages[index],
    });
  }
  // componentDidMount(){
  //   console.log('****** details ******');
  //   console.log(this.props.details);
  //   console.log('**********************');
  // }
  render(){
    return(
      <View style={{flex : 1}}>
        <ContractorIntro details = {this.props.details}/>
          {this.props.isSampleWorkImagesLoaded &&
            <ScrollView style = {{padding : 10, flex : 1, backgroundColor : '#f4f4f4'}}>
              {this.props.sampleWorkImages.length === 0 && 
                <View style={{height : hp('45%'), alignItems : 'center', justifyContent : 'center'}}>
                  <Text style={{fontSize : 16}}>No Sample Work Images Found</Text>
                </View>
              }
              {this.props.sampleWorkImages.length > 0 && 
                <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', marginBottom:hp('2%'), flexWrap:'wrap'}}>
                  {this.props.sampleWorkImages.map((item , index) => <DisplayImage image ={item}  key={index} index={index} imagePressed={this.imagePressed}/>)}
                </View>
              }
            </ScrollView>
          }
          {!this.props.isSampleWorkImagesLoaded &&
            <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator size='large'/>
            </View>
          }
          {
            (this.props.roleIdUserName.role === 'employer' || this.props.roleIdUserName.coHost === 'yes') && <MessageButtons navigation = {this.props.navigation} details={this.props.details} roleIdUserName={this.props.roleIdUserName}/> 
          }  
          <Dialog
                visible={this.state.dialogsuccess}
                onTouchOutside={() => this.setState({dialogsuccess: false})}
                dialogStyle={{borderRadius: 5, height : hp('49%'), overflow: 'hidden', backgroundColor : '#ffffff'}}
                contentStyle={{borderRadius: 5, height : hp('49%'), overflow: 'hidden'}} 
              > 
              <View style={{alignItems : 'center' , justifyContent : 'center'}}>
                <TouchableOpacity onPress={this.imagePressed} style={{width : wp('86%'), height : hp('3%'), alignItems : 'flex-end' , justifyContent : 'center'}}>
                  <Image source = {require('../../../assets/cross.png')} style={{height : hp('3%'), width : hp('3%') , resizeMode : 'contain'}}/>
                </TouchableOpacity>
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                  <Image source = {{uri : this.state.popupImage}}  style = {{height : hp('45%'), width : wp('93%'), resizeMode : 'stretch'}}/> 
                </View>
              </View>
            </Dialog>     
        </View>
    );
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  sampleWorkImages : state.createJob.sampleWorkImages,
  isSampleWorkImagesLoaded : state.createJob.isSampleWorkImagesLoaded,
  sampleWorkImagesCount : state.createJob.sampleWorkImagesCount
});
export default connect(mapStateToProps)(SampleWork);

function DisplayImage(props) {
  return(
    <TouchableOpacity style={styles.specificImage} onPress={() => props.imagePressed(props.index)}>
      <Image source = {{uri : props.image}}  style={styles.ImageHeightAndWidth}/> 
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container : {
    height : hp('25%'),
    width : wp('100%'),
    resizeMode : 'stretch',
    alignItems : 'center',
    justifyContent : 'center' ,
    marginBottom: 5
  },
  specificImage :{
    overflow : 'hidden',
    height:hp('25%'),
    width: wp('30%'),
    borderRadius : 5,
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
    margin: -7 ,
    borderRadius: 10
  }
})


//"work_experience": "a:3:{s:6:\"h_from\";s:5:\"00:24\";s:4:\"h_to\";s:5:\"15:30\";s:5:\"title\";s:8:\"saturday\";}",