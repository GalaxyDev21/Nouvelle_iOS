import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import StatusBar from '../InputFields/statusBar' ;
import { connect } from 'react-redux';
import moment from 'moment';

class SampleChecklistDetail extends Component{
  render(){
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
        <StatusBar title='CHECKLISTS DETAILS' isIconDisplay={true} marginValue={hp('2%')} navigation={this.props.navigation}/>
        {this.props.ischecklistDetailLoaded &&
          <View style = {{marginHorizontal : wp('2%'), flex : 1}}>
            <ScrollView>
              <EachChecklistDetails  data = {this.props.checklistDetail}/>
            </ScrollView>
          </View>
        }
        {!this.props.ischecklistDetailLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
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
  checklistDetail : state.createJob.checklistDetail,
  ischecklistDetailLoaded : state.createJob.ischecklistDetailLoaded
});
export default connect(mapStateToProps)(SampleChecklistDetail);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  iconAndText : {
    height : hp('6%'),
    flexDirection : 'row',
    alignItems : 'center',
    backgroundColor : 'lightgray',
    borderRadius : wp('1%'),
    paddingHorizontal : wp('2%')
  },
  textInputCon : {
    fontSize : (15) ,
    width : '83%' ,
    color : '#292929',
    marginRight : wp('2%')      
  },
});


class EachChecklistDetails extends Component {
  constructor(props){
    super(props);
      this.state = {
        statement : '' ,
        imageUrl : '',
        data : this.props.data.headings,
      }
  }   
  render(){
    return(
      <View style={{marginBottom : hp('2%'), backgroundColor : '#f6f6f6', padding : wp('3%'), borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8'}}>
        <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('1%')}}>
          <Text style={{color : '#0071BD' , fontSize : (18)}}>{this.props.data.post_title}</Text>
        </View>
          <Text style={{ color : '#292929' , fontSize : (15), marginBottom : hp('1%')}}>Checklist draft</Text>
            <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%')}}>
              <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                <Text style={{fontSize : (15), color : '#292929'}}>{moment(this.props.data.post_date).format('MMM D, YYYY')}</Text>
            </View>
              <ScrollView nestedScrollEnabled={true}>
                <FlatList data={this.state.data}
                  renderItem={(item)=><SpecificHeadingAndItem item={item} />
                  }
                  keyExtractor = {(item , index) => item.ID.toString()}
                />
              </ScrollView> 
      </View>
    )    
  }
}

class SpecificHeadingAndItem extends Component{
  constructor(props){
    super(props);
    this.state = {
      isDropDownOpen : false,
      isTouchDisable : true,
    }
  }
  render(){
    const { index, item} = this.props.item;
    return(
      <View style={{flex : 1, marginBottom : hp('2%')}}>
        <View style={{flexDirection:'row', flex:1}}>
          <View style={{height : hp('3%'), width : hp('3%'),justifyContent : 'center', alignItems : 'center',  backgroundColor : item.high_light === 'yes' ? '#0071bc' : '#8d8d8d', borderRadius : 100, marginRight : wp('2%')}}>
            <Icon name = 'check' size = {15} color = 'white'/>
          </View>
          <View style={{flex:0.5, marginLeft : wp('2%')}}>
            <Text style={{fontSize : (20), color : '#292929'}}>{item.item_title}</Text>
          </View>
        </View> 
          {
            item.titles.map((element, index)=>{
              return <View key={element.ID} style={styles.iconAndText}>
                <Text style={styles.textInputCon}>{element.title}</Text>
              </View>
            })
          } 
          {
            item.add_image &&  <Image style={{width: wp('87%'), height: hp('25%'), resizeMode : 'stretch', borderRadius : wp('1%')}} source={{uri: item.add_image}}/>
          }  
      </View>
    )
  }
}
