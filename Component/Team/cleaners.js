import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificTeam from './specificTeam' ;
import StatusBar from '../InputFields/statusBar' ;
import TouchButton from '../InputFields/touchButton';
import { connect } from 'react-redux';
import {GetData, FalseLoader} from '../../Redux/createJob/jobAction' ;
import {FALSE_CLEANERS_LIST_FLAG, GET_CLEANERS_LIST } from '../../Redux/createJob/actionType';
import AbsoluteLoader from '../InputFields/absolutLoader';

class Cleaners extends Component{
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
        this.props.FalseLoader(FALSE_CLEANERS_LIST_FLAG);
        this.props.GetData('get_cleaner', GET_CLEANERS_LIST , this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/team_bg.jpg')} style={styles.container}>
        <StatusBar title='CLEANERS' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          {!this.props.isMoreCleanersListLoaded && 
           <AbsoluteLoader/>
          }
          {this.props.isCleanersListLoaded &&
            <ScrollView style={{height : hp('80%'), marginVertical : hp('2%')}}>
              {this.props.cleanersList.length === 0 &&
                <View style={{height : hp('80%'), alignItems : 'center', justifyContent : 'center'}}>
                  <Text style={{fontSize : (18), color : '#292929'}}>No Cleaners Found</Text>
                </View>
              }
              {this.props.cleanersList.length > 0 &&
                <View style={{marginHorizontal : wp('2%'), padding : wp('2%'), backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%')}}>
                  <View style={{height : hp('5%'), marginBottom : hp('2%')}}>
                    <Text style={{fontSize: 20 , color : '#292929'}}>My Cleaners</Text>
                  </View>
                  {
                    this.props.cleanersList.map((item , index) =>
                      <View style={styles.contractorProfile} key={index}>
                        <SpecificTeam item={item} navigation={this.props.navigation} />
                      </View>
                    )
                  }
                  { this.props.cleanersListCount > 10 && this.props.cleanersList.length < this.props.cleanersListCount &&
                      <View style={{justifyContent : 'center', alignItems : 'center'}}>
                        <TouchButton 
                        buttonName = 'View More'
                        actionPerform = {ActionPerformFunc}
                        move = {{doingAction : 'doingAction', action : this.onViewMore}}
                        bgColor = '#0071bc'
                        width = {wp('40%')}
                        height = {hp('5%')}
                        buttonNameSize = {(15)}
                        elevation = {5}
                        navigation = {this.props.navigation}
                      />
                    </View>
                  }
                </View>
              }
            </ScrollView>
          }
          {!this.props.isCleanersListLoaded &&
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
  cleanersListCount : state.createJob.cleanersListCount,
  cleanersList : state.createJob.cleanersList,
  isCleanersListLoaded : state.createJob.isCleanersListLoaded,
  isMoreCleanersListLoaded : state.createJob.isMoreCleanersListLoaded,
});
export default connect(mapStateToProps,{FalseLoader, GetData})(Cleaners);

const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  contractorProfile : {
    //height : hp('23%')
  },
  specificContractor : {
    flexDirection : 'row'
  }
});

