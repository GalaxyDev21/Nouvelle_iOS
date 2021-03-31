import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , ImageBackground, TouchableOpacity , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificContractors from './specificContractor' ;
import TouchButton from '../../InputFields/touchButton';
import { FalseLoader, GetData } from '../../../Redux/createJob/jobAction' ;
import { connect } from 'react-redux';
import { IS_MORE_MATCHES_CONTRACTORS_OF_HOST_JOB_LOADED, GET_MATCHES_CONTRACTORS_OF_HOST_JOB} from '../../../Redux/createJob/actionType';
import AbsoluteLoader from '../../InputFields/absolutLoader';

class JobMatchingContractors extends Component{
  constructor(props){
      super(props);
      this.state = {
        offset : 0  
      }
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
      formData.append('service_id', this.props.JobDetails.job_service);
      this.props.FalseLoader(IS_MORE_MATCHES_CONTRACTORS_OF_HOST_JOB_LOADED);
      this.props.GetData('job_matches', GET_MATCHES_CONTRACTORS_OF_HOST_JOB, this.props.userToken, formData);
    })
  }
  render(){
    return(
      <ImageBackground source={require('../../../assets/my_jobs_bg.jpg')} style={styles.container}>
        {!this.props.isMoreMatchesContractorsOfHostJobLoaded && 
          <AbsoluteLoader/>
        } 
        {this.props.ismatchesContractorsOfHostJobLoaded &&
          <View>
            {!this.props.matchesContractorsOfHostJob[0] &&
              <View style={{height : hp('70%'), alignItems : 'center', justifyContent : 'center'}}>
                <Text style={{fontSize : (18), color : '#292929'}}>No Matches Contractors Found</Text>
              </View>    
            }
            {this.props.matchesContractorsOfHostJob[0] &&
              <View>
                <ScrollView style={{height : hp('80%'), marginBottom : hp('2%')}}>
                  <Text style={{color : '#292929' , fontFamily : 'Raleway-SemiBold' , fontSize:(18), marginBottom : hp('1%')}}>{`MATCHES CONTRACTOR`}</Text>
                    {
                      this.props.matchesContractorsOfHostJob.map((item , index) =>
                        <View style={styles.contractorProfile} key={item.id}>
                          <SpecificContractors item={item} navigation={this.props.navigation} />
                        </View>
                      )
                    }
                
                { this.props.matchesContractorsOfHostJobCount > 10 && this.props.matchesContractorsOfHostJob.length < this.props.matchesContractorsOfHostJobCount &&
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
                </ScrollView>
              </View>
            }
          </View>
        }
        {
        !this.props.ismatchesContractorsOfHostJobLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size='large'/>
          </View>
        } 
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  matchesContractorsOfHostJobCount : state.createJob.matchesContractorsOfHostJobCount,
  matchesContractorsOfHostJob : state.createJob.matchesContractorsOfHostJob,
  ismatchesContractorsOfHostJobLoaded : state.createJob.ismatchesContractorsOfHostJobLoaded,
  isMoreMatchesContractorsOfHostJobLoaded : state.createJob.isMoreMatchesContractorsOfHostJobLoaded
});
export default connect(mapStateToProps, {GetData, FalseLoader})(JobMatchingContractors);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    padding : wp('3%')
  },
  contractorProfile : {
    height : hp('21%')
  },
});