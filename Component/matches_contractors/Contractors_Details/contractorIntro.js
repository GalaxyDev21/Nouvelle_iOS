import React ,{Component} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';

export default class ContractorIntro extends Component{
  render(){
    return(
      <ImageBackground source={require('../../../assets/profile_bg.png')} style={styles.container}>
        <View style={{overflow : 'hidden', height : hp('12%'), width : hp('12%'), borderRadius : 100, marginTop : hp('1%') }}>
          <Image source = {{uri : this.props.details.profile_image}} resizeMode = 'contain' style={{ height : hp('12%') , width : hp('12%') , }}/>
        </View>
        <Text style={{color : '#0071bc', fontSize:(22), marginBottom : wp('1%')}}>{this.props.details.display_name}</Text>
        <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : wp('1%')}}>
          <Text style={{color : '#292929', fontSize:(16), marginRight : wp('3%')}}>{this.props.details.state.name},</Text>
          <Text style={{color : '#292929', fontSize:(16)}}>{this.props.details.et_zipcode}</Text>
        </View>
        <View style={{height : hp('4%') , flexDirection : 'row', alignItems:'center', marginBottom : hp('0.5%')}}>
          <StarRating
            maxStars={5}
            fullStarColor='#fcb016'
            emptyStarColor='#fcb016'
            disabled = {true}
            rating={parseFloat(this.props.details.rating_score)}
            starSize = {20}
            starStyle={{marginRight : wp('0.5%')}}
            containerStyle={{marginRight : wp('1%')}}
          />
          <Text style={{color : '#292929', fontSize:(17) , marginRight : wp('1%')}}>Reviews {this.props.details.reviews}</Text>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    height : hp('25%'),
    width : wp('100%'),
    resizeMode : 'stretch',
    alignItems : 'center',
    justifyContent : 'center',
    paddingVertical : hp('1%')
  },
})