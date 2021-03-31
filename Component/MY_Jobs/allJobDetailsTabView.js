import React ,{Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import JobDetails from './myJobDetail' ;
import JobMatchingContractors from './matchesContractor/allContractors' ;
import AllBidContractors from './matchesContractor/allBidContractors' ;
import WorkSpace from './workspace';
import StatusBar from '../InputFields/statusBar' ;
import CheckListsInEditProperty from '../Edit_Property/checklists';

export default class TabViewOfJobDetails extends Component {
  render() {
    return (
        <View style={{flex : 1}}>
          <StatusBar title='MY JOBS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
           <ScrollTab navigation={this.props.navigation} JobDetails = {this.props.navigation.getParam('jobDetails', '')}/>
        </View>
     );
  }
}

const styles = StyleSheet.create({
  statusBarStyle : {
    height:hp('11%'),
    width:wp('100%'),
    backgroundColor : '#0071bc' ,
    alignItems : 'center',
    flexDirection : 'row' 
  }
});
 
function ScrollTab(props) {
  return (
    <ScrollableTabView
      tabBarBackgroundColor='#ffffff' 
      tabBarUnderlineStyle={{backgroundColor:'#8cc63f'}} 
      tabBarTextStyle ={{ fontSize: (20) , fontFamily : 'Raleway-SemiBold'}}
      tabBarActiveTextColor ="#8cc63f" 
      tabBarInactiveTextColor ="#292929"
      // onChangeTab = {this.onChange}
      initialPage = {0}
      renderTabBar={() => <ScrollableTabBar />}
    >
      <JobDetails tabLabel="Job Details" navigation={props.navigation} JobDetails = {props.JobDetails}/>
      <JobMatchingContractors tabLabel="Matches" navigation = {props.navigation} JobDetails = {props.JobDetails}/>
      <AllBidContractors tabLabel="Biding" navigation = {props.navigation} JobDetails = {props.JobDetails}/>
      <CheckListsInEditProperty tabLabel="Checklists" navigation = {props.navigation} propertyId = {props.JobDetails.ID}/>
      <WorkSpace tabLabel="Workspace" navigation = {props.navigation} JobDetails = {props.JobDetails}/>
    </ScrollableTabView>
  );
}
 