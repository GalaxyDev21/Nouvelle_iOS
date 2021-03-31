import React ,{Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import JobDetailsInFindJob from './jobDetails' ;
import AllBidContractors from './biddingList' ;
import CheckListsInFindJob from './checklist';
import StatusBar from '../InputFields/statusBar' ;

export default class TabViewOfContractorFindJob extends Component {
  render() {
    return (
        <View style={{flex : 1}}>
          <StatusBar title='FIND JOBS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
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
      initialPage = {0}
      renderTabBar={() => <ScrollableTabBar />}
    >
      <JobDetailsInFindJob tabLabel="Job Details" navigation={props.navigation} JobDetails = {props.JobDetails}/>
      <AllBidContractors tabLabel="Biding" navigation = {props.navigation} JobDetails = {props.JobDetails}/>
      <CheckListsInFindJob tabLabel = 'Checklist' navigation = {props.navigation} JobDetails = {props.JobDetails}/>
    </ScrollableTabView>
  );
}
 