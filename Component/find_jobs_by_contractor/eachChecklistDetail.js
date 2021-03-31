import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, Dialog, TouchableOpacity,FlatList, ActivityIndicator,Animated} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import StatusBar from '../InputFields/statusBar';

class ChecklistDetailsInFindJob extends Component {
    constructor(props){
        super(props);
            this.state = {
                Index : '',
                listChangeNumber: 0,
                data : this.props.allChecklists[this.props.navigation.getParam('index', '')],
            }
    }
        render(){
          return(
            <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
              <StatusBar title='CHECKLIST DETAILS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('2%')}/>
                  <View style={{padding : wp('3%')}}>
                  <View style={{marginBottom : hp('1%')}}>
                    <Text style={{ color : '#0071BD' , fontSize : (18)}}>{this.state.data.name}</Text>
                  </View>
                  <Text style={{ color : '#292929' , fontSize : (15), marginBottom : hp('1%')}}>Checklist draft</Text>
                    <View style={{flexDirection : 'row' , alignItems : 'center', marginBottom : hp('2%')}}>
                      <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                        <Text style={{fontSize : (15), color : '#292929'}}>{this.state.data.time}</Text>
                    </View>
                    <View style={{height : hp('72%'), marginBottom : hp('2%')}}>
                    <FlatList
                      data={this.state.data.data}
                      renderItem={(item)=><SpecificHeadingAndItem 
                        item={item} 
                        ref={(itemref) => this['itemref'+item.item.id]=itemref}
                        itemsArray = {this.state.data}
                        extraData = {this.state.listChangeNumber}
                        length = {this.state.data.length}
                       />
                      }
                      extraData = {this.state.listChangeNumber}
                      keyExtractor = {(item , index) => item.id.toString()}
                      scrollPercent={5}
                    />
                    </View>
                    </View>
            </ImageBackground>
           )    
        }
    }
    const mapStateToProps = state => ({
        allChecklists : state.createJob.allChecklists,
        });
        export default connect(mapStateToProps)(ChecklistDetailsInFindJob);
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
  iconAndText : {
    height : hp('7%'),
    flexDirection : 'row',
    alignItems : 'center',
    backgroundColor : '#ffffff',
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

  class SpecificHeadingAndItem extends Component{
    render(){
      const { index, item} = this.props.item;;
      return(
        <View style={{marginBottom : hp('5%'), elevation : 5}}>
          <View style={{flexDirection:'row',flex:1}}>
              <Text style={{fontSize : (20), color : '#292929'}}>{item.heading}</Text>
           </View> 
           {
             item.item.map((element)=>{
             return <View key={element.id} style={styles.iconAndText}>  
              <View style={{height : hp('3%'), width : hp('3%'),justifyContent : 'center', alignItems : 'center', backgroundColor : element.checked? '#0071bc' : '#8d8d8d', borderRadius : 100, marginRight : wp('2%')}}>
               <Icon name = 'check' size = {15} color = {'white'}/>
             </View>
               <Text style={styles.textInputCon}>{element.content}</Text>
             </View>
             })
           }  
            <Image style={{width: '100%', height: hp('25%'), resizeMode : 'stretch', borderRadius : wp('1%')}} source={{uri: item.image}}/>
        </View>
      )
    }
  }