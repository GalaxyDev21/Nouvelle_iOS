import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , ImageBackground, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificTeam from './specificTeam' ;
import { connect } from 'react-redux';
import { FalseLoader, GetData } from '../../../Redux/createJob/jobAction' ;
import { IS_MORE_PROPERTY_TEAM_LOADED, GET_PROPERTY_TEAM} from '../../../Redux/createJob/actionType';

class TeamsInProperty extends Component{
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
          formData.append('id', this.props.propertyId);
            this.props.FalseLoader(IS_MORE_PROPERTY_TEAM_LOADED);
            this.props.GetData('team_property', GET_PROPERTY_TEAM, this.props.userToken, formData);
        })
      }
render(){
    console.log(`*********** ${this.props.propertyId} ************`);
  return(
    <ImageBackground source={require('../../../assets/add_property_bg.jpg')} style={styles.container}>
      {!this.props.isMorePropertyTeamLoaded && 
        <View style={{elevation : 15, height : hp('5%'), width : hp('5%'), borderRadius : 100, backgroundColor : '#ffffff', justifyContent : 'center', alignItems : 'center', position : 'absolute', top : hp('15%'), left : wp('45%')}}>
          <ActivityIndicator size='small' />
        </View>
      }
      {
         this.props.ispropertyTeamLoaded &&
           <View>
             {
                !this.props.propertyTeam[0] &&
                  <View style={{height : hp('80%'), alignItems : 'center', justifyContent : 'center'}}>
                    <Text style={{fontSize : (18), color : '#292929'}}>No Team Found</Text>
                  </View>    
             }
             {
               this.props.propertyTeam[0] &&
               <ScrollView style={{height : hp('80')}}>
                 <View style={{margin : wp('3%'), padding : wp('3%'), backgroundColor : 'rgba(255, 255, 255, 0.9)', borderRadius : hp('1%')}}>
                   
                     {
                       this.props.propertyTeam.map((item , index) =>
                         <View style={styles.contractorProfile} key={item.ID}>
                           <SpecificTeam item={item} navigation={this.props.navigation} />
                         </View>
                        )
                     }
                     { 
                        this.props.propertyTeamCount > 10 && this.props.propertyTeam.length < this.props.propertyTeamCount &&
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
                   
                 </View>
                 </ScrollView>
             }
           </View>
      }
      {
        !this.props.ispropertyTeamLoaded &&
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
    propertyTeamCount : state.createJob.propertyTeamCount,
    propertyTeam : state.createJob.propertyTeam,
    ispropertyTeamLoaded : state.createJob.ispropertyTeamLoaded,
    isMorePropertyTeamLoaded : state.createJob.isMorePropertyTeamLoaded,
});
export default connect(mapStateToProps,{
    FalseLoader, 
    GetData,
})(TeamsInProperty);

const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        resizeMode : 'stretch',
     },
     contractorProfile : {
        height : hp('20%')
     },
     specificContractor : {
         flexDirection : 'row'
     }
});

