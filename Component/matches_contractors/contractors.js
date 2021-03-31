import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , TouchableOpacity , ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificContractors from './specificContractor' ;
import StatusBar from '../InputFields/statusBar' ;
import TouchButton from '../InputFields/touchButton';
import { FalseLoader, GetData } from '../../Redux/createJob/jobAction' ;
import { IS_MORE_MATCHES_CONTRACTORS_OF_HOST_JOB_LOADED, GET_MATCHES_CONTRACTORS_OF_HOST_JOB} from '../../Redux/createJob/actionType';
import { connect } from 'react-redux';
class Contractors extends Component{
  constructor(props){
    super(props);
      this.state = {
        offset : 0,
        service_id : this.props.navigation.getParam('serviceID','')
      }
  }
  onViewMore = () => {
    this.setState({
      offset : this.state.offset + 10,
    },function(){
      var formData = new FormData();
      formData.append('offset', this.state.offset);
      formData.append('limit', 10);
      formData.append('service_id', this.state.service_id);
      this.props.FalseLoader(IS_MORE_MATCHES_CONTRACTORS_OF_HOST_JOB_LOADED);
      this.props.GetData('job_matches', GET_MATCHES_CONTRACTORS_OF_HOST_JOB, this.props.userToken, formData);
    })
  }
  render(){
    return(
      <View style={styles.container}>  
        <StatusBar title='CONTACTORS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')} backToScreen='myJobList'/>
          {!this.props.isMoreMatchesContractorsOfHostJobLoaded && 
            <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
              <ActivityIndicator size='small' />
            </View>
          }
          {this.props.ismatchesContractorsOfHostJobLoaded &&
            <View style={{flex : 1 , padding : wp('3%')}}>
              {!this.props.matchesContractorsOfHostJob[0] &&
                <View style={{height : hp('80%'), alignItems : 'center', justifyContent : 'center'}}>
                  <Text style={{fontSize : (18), color : '#292929'}}>No Contractors Matches</Text>
                </View>    
              }
              {this.props.matchesContractorsOfHostJob[0] &&
                <View>
                  <View style={{height : hp('5%'),marginBottom : hp('2%')}}>
                    <Text style={{fontFamily : 'Raleway-SemiBold', fontSize: (22) , color : '#292929'}}>Great matches for your projects</Text>
                  </View>
                  <ScrollView style={{height : hp('80'), marginBottom : hp('2%')}}>
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
          {!this.props.ismatchesContractorsOfHostJobLoaded &&
            <View style={{height : hp('100%'), alignItems:'center',justifyContent:'center'}}>
                  <ActivityIndicator
                    size='large'
                  />
                </View>
          }
      </View>
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
export default connect(mapStateToProps, {FalseLoader, GetData})(Contractors);
const styles = StyleSheet.create({
  container : {
      flex : 1 ,
    },
    contractorProfile : {
        height : hp('22%')
    },
    specificContractor : {
        flexDirection : 'row'
    }
});