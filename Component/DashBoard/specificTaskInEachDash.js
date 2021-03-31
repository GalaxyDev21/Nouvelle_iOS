import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView, Image ,ImageBackground, TouchableOpacity , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class SpecificTask  extends Component {
  render(){
    return(
      <TouchableOpacity activeOpacity = {0.5} style={{width : wp('45%'), height : hp('16%'), marginBottom : hp('2%'), borderLeftWidth : 5, borderRadius : hp('1%'), borderLeftColor : this.props.borderColor, backgroundColor : '#ffffff', overflow : 'hidden'}} onPress = {() => this.props.moveToNextScreen(this.props.screen)}>
        <ImageBackground source={require('../../assets/specificViewWith_bg.png')} style={{flex : 1, resizeMode : 'stretch', flexDirection : 'row', alignItems : 'center', borderRadius : hp('1%'), padding : wp('1%')}}>
          {(this.props.title !== 'My Contractors' && this.props.title !== 'My Co Hosts' && this.props.title !== 'My Hosts' && this.props.title !== 'Cleaners') &&
            <View style={styles.ImageInEachTouch}>      
              <Image source={this.props.imageUrl} style={styles.imageSize}/>
            </View> 
          }
          {(this.props.title === 'My Contractors' || this.props.title === 'My Co Hosts' || this.props.title === 'My Hosts' || this.props.title === 'Cleaners' ) &&
            <View style={[styles.ImageInEachTouch, {flexDirection : 'row'}]}> 
              <Image source={this.props.imageUrl1} style={{ height : hp('4%'), width : hp('4%'), resizeMode : 'contain'}}/>
              <Image source={this.props.imageUrl2} style={{ height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginLeft : -wp('2%')}}/>
            </View>
          }
          <View style={{flex : 1, justifyContent : 'center' , alignItems : 'flex-start'}}>
            <Text style={{fontFamily : 'Raleway-SemiBold', fontSize: (15) , color : '#0071bc'}}>{this.props.title}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
    ImageInEachTouch : {
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#F4F4F4',
        height : hp('8%'),
        width : hp('8%'),
        borderRadius : 100,
        marginHorizontal : wp('1%')
      },
      imageSize : {
        height : hp('5%'),
        width : hp('5%'),
        resizeMode : 'contain'
        }
});