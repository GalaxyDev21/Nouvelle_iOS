import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { FalseLoader, GetData, GetSpecificChecklistDetails} from '../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { IS_MORE_PROPERTY_CHECKLIST_LOADED, GET_PROPERTY_CHECKLIST, IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED} from '../../Redux/createJob/actionType';
import moment from 'moment';

class CheckListsInEditProperty extends Component{
  constructor(props){
    super(props);
    this.state = {
      offset : 0,
    }
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
      formData.append('id', this.props.propertyId.ID);
      this.props.FalseLoader(IS_MORE_PROPERTY_CHECKLIST_LOADED);
      this.props.GetData('get_check_lists_of_property', GET_PROPERTY_CHECKLIST, this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/checklist_bg.jpg')} style={styles.container}>
        {!this.props.isMorePropertyChecklistsLoaded && 
          <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
            <ActivityIndicator size='small' />
          </View>
        } 
        {this.props.isPropertyChecklistsLoaded && 
          <View style = {{margin : wp('2%'), flex : 1}}>
            {!this.props.propertyChecklists[0] && 
              <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                <Text style={{fontSize : (18), color : '#292929'}}>No Checklist Occure</Text>
              </View>     
            }
            {this.props.propertyChecklists[0] &&
            <ScrollView >
              {
                this.props.propertyChecklists.map((item , index) => <EachChecklist 
                key = {item.ID} 
                item = {item} 
                indexNo = {index} 
                navigation = {this.props.navigation} 
                userToken = {this.props.userToken}
                GetSpecificChecklistDetails = {this.props.GetSpecificChecklistDetails} 
                FalseLoader = {this.props.FalseLoader}/>)     
              }
              {this.props.propertyChecklistsCount > 10 && this.props.propertyChecklists.length < this.props.propertyChecklistsCount &&
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                  <TouchButton 
                    buttonName = 'View More'
                    actionPerform = {ActionPerformFunc}
                    move = {{doingAction : 'doingAction', action : this.onViewMore}}
                    bgColor = '#8cc63f'
                    width = {wp('40%')}
                    height = {hp('5%')}
                    buttonNameSize = {(15)}
                    elevation = {5}
                    navigation = {this.props.navigation}
                  />
                </View>
              }
              </ScrollView>
            }
          </View>
        }
        {!this.props.isPropertyChecklistsLoaded &&
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
  userToken : state.createJob.userLoginToken,
  propertyChecklistsCount : state.createJob.propertyChecklistsCount,
  propertyChecklists : state.createJob.propertyChecklists,
  isPropertyChecklistsLoaded : state.createJob.isPropertyChecklistsLoaded,
  isMorePropertyChecklistsLoaded : state.createJob.isMorePropertyChecklistsLoaded,
});
export default connect(mapStateToProps, {FalseLoader, GetData, GetSpecificChecklistDetails})(CheckListsInEditProperty);
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
    });
    //onPress={() => this.props.navigation.navigate('ChecklistDetailsInFindJob', {index : this.props.indexNo})} 
    class EachChecklist extends Component {
      getChecklistDetail = () => {
        var formData = new FormData();
          formData.append('id', this.props.item.ID);
          this.props.FalseLoader(IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED);
          this.props.GetSpecificChecklistDetails(this.props.userToken, formData);
          this.props.navigation.navigate('SampleChecklistDetail')
      }
      render(){
         return(
            <View style={{padding : wp('3%'), backgroundColor : '#f6f6f6', borderRadius : wp('1%'), borderWidth : 2, borderColor : '#e8e8e8' , marginBottom : hp('2%')}}>
            <TouchableOpacity onPress={this.getChecklistDetail}><Text style={{ color : '#0071BD' , fontSize : (18)}}>{`${this.props.item.post_title}`}</Text></TouchableOpacity>
                <Text style={{ color : '#292929' , fontSize : (15)}}>Checklist draft</Text>
                <View style={{flexDirection : 'row' , alignItems : 'center', justifyContent : 'space-between'}}>
                  <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
                    <Image source={require('../../assets/calendarIcon.png')} style={{height : hp('3%'), width : hp('3%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                        <Text style={{fontSize : (15), color : '#292929'}}>{moment(this.props.item.post_date).format('MMM D, YYYY')}</Text>
                    </View>
                </View>
            </View>
        )
      }
    }