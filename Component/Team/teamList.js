import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , TouchableOpacity, ImageBackground, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificTeam from './specificTeam' ;
import StatusBar from '../InputFields/statusBar' ;
import TouchButton from '../InputFields/touchButton';
import { connect } from 'react-redux';
import {GetData, FalseLoader} from '../../Redux/createJob/jobAction' ;
import { IS_MORE_HOST_TEAM_LOADED, FALSE_MY_JOBS_FLAG, GET_HOST_TEAM, GET_MY_JOBS } from '../../Redux/createJob/actionType';
import AbsoluteLoader from '../InputFields/absolutLoader';

class Teams extends Component{
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
        this.props.FalseLoader(IS_MORE_HOST_TEAM_LOADED);
        this.props.GetData('my_team', GET_HOST_TEAM , this.props.userToken, formData);
    })
  }
  getHostJobs = () => {
    var formData = new FormData();
    formData.append('offset', this.state.offset);
    formData.append('limit', 10);
    this.props.FalseLoader(FALSE_MY_JOBS_FLAG);
    this.props.GetData('my_jobs_of_host', GET_MY_JOBS, this.props.userToken, formData);
    this.props.navigation.navigate('Step1');
  }
  render(){
    return(
      <ImageBackground source={require('../../assets/team_bg.jpg')} style={styles.container}>
        <StatusBar title='TEAM' isIconDisplay={true} marginValue={hp('0%')} navigation={this.props.navigation}/>
          {!this.props.isMoreHostTeamLoaded && 
           <AbsoluteLoader/>
          }
          {this.props.isHostTeamLoaded &&
          <View>
            <View style={{alignItems : 'flex-end', marginRight : wp('2%'), marginVertical : hp('1.5%')}}>
              <TouchButton 
                buttonName = 'Invite Contractor'
                actionPerform = {ActionPerformFunc}
                move = {{doingAction : 'doingAction', action : this.getHostJobs}}
                bgColor = '#8cc63f'
                width = {wp('45%')}
                height = {hp('7%')}
                buttonNameSize = {(18)}
                elevation = {5}
                navigation = {this.props.navigation}
              />
            </View>
            <ScrollView style={{height : hp('80%'), marginBottom : hp('2%')}}>
              {this.props.hostTeam.length === 0 &&
                <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                  <Text style={{fontSize : (18), color : '#292929'}}>No Team Found</Text>
                </View>
              }
              {this.props.hostTeam.length > 0 &&
              <View>
                <View style={{marginHorizontal : wp('2%'), padding : wp('2%'), backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%')}}>
                  <View style={{height : hp('5%'),marginBottom : hp('2%')}}>
                    <Text style={{fontSize: 20 , color : '#292929'}}>My Team</Text>
                  </View>
                    {this.props.hostTeam.map((item , index) =>
                      <View style={styles.contractorProfile} key={index}>
                        <SpecificTeam item={item} navigation={this.props.navigation} />
                      </View>
                      )
                    }
                    { this.props.hostTeamCount > 10 && this.props.hostTeam.length < this.props.hostTeamCount &&
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
              </View>
              }
            </ScrollView>
          </View>
          }
          {!this.props.isHostTeamLoaded &&
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
  hostTeamCount : state.createJob.hostTeamCount,
  hostTeam : state.createJob.hostTeam ,
  isHostTeamLoaded : state.createJob.isHostTeamLoaded,
  isMoreHostTeamLoaded : state.createJob.isMoreHostTeamLoaded
});
export default connect(mapStateToProps,{FalseLoader, GetData})(Teams);

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

