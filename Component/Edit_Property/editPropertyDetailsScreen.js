import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , TouchableOpacity , ActivityIndicator} from 'react-native';
import ScrollableTabView, {DefaultTabBar , ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CheckIn_CheckOut from './checkIn_ckeckOut' ;
import CalenderInEditProperty from './calenderInEditProperty' ;
import TeamsInProperty from './TeamsInEditPropert/teamsDetails' ;
import CheckListsInEditProperty from './checklists';
import StatusBar from '../InputFields/statusBar' ;
import BothGeneralScreens from './combine_general';
import { connect } from 'react-redux';

 class EditPropertyDetails extends Component {
  constructor(props) {
    super(props);
      this.state = {
        isSwitchScreen : false  
      }
  }
  render() {
    return (
      <View style={{flex : 1}}>
        <StatusBar title='EDIT PROPERTY' isIconDisplay={true} marginValue={hp('2%')} navigation={this.props.navigation}/>
        {
          this.props.isPropertyDetailLoaded && <ScrollTab navigation={this.props.navigation} propertyId = {this.props.navigation.getParam('property_ID','')}/>
        }
        {!this.props.isPropertyDetailLoaded &&
          <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size='large'/>
          </View>
        } 
      </View>
    );
  }
}
const mapStateToProps = state => ({
  isPropertyDetailLoaded : state.createJob.isPropertyDetailLoaded ,
});
export default connect(mapStateToProps)(EditPropertyDetails);

function ScrollTab(props) {
  return (
    <ScrollableTabView
      tabBarBackgroundColor='#ffffff' 
      tabBarUnderlineStyle={{backgroundColor:'#8cc63f'}} 
      tabBarTextStyle ={{ fontSize: (20) , fontFamily : 'Raleway-SemiBold'}}
      tabBarActiveTextColor ="#8cc63f" 
      tabBarInactiveTextColor ="#292929"
      initialPage = {0}
      renderTabBar={() => <ScrollableTabBar />}
    >
      <BothGeneralScreens tabLabel="General" navigation={props.navigation} propertyId = {props.propertyId}/>
      <CalenderInEditProperty tabLabel="Calendar" navigation = {props.navigation} propertyId = {props.propertyId}/>
      <TeamsInProperty tabLabel="Team" navigation = {props.navigation} propertyId = {props.propertyId}/>
      <CheckIn_CheckOut tabLabel="Check in/Check out" navigation = {props.navigation} propertyId = {props.propertyId}/>
      <CheckListsInEditProperty tabLabel="Checklists" navigation = {props.navigation} propertyId = {props.propertyId}/>
    </ScrollableTabView>
  );
}
 