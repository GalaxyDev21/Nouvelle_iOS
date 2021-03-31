import React ,{Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CheckLists from './checklist';
import Workspace from './workspace' ;
import StatusBar from '../InputFields/statusBar' ;
import JobDetails from './specificJobDetail' ;

export default class TabViewOfJobDetailsInContracrtor extends Component {
  render() {
    return (
        <View style={{flex : 1}}>
          <StatusBar title='MY JOBS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
           <ScrollTab navigation={this.props.navigation} JobDetails = {this.props.navigation.getParam('jobDetails', '')}/>
        </View>
     );
  }
}
 
function ScrollTab(props) {
  return (
    <ScrollableTabView
      tabBarBackgroundColor='#ffffff' 
      tabBarUnderlineStyle={{backgroundColor:'#8cc63f'}} 
      tabBarTextStyle ={{ fontSize: (20)}}
      tabBarActiveTextColor ="#8cc63f" 
      tabBarInactiveTextColor ="#292929"
      // onChangeTab = {this.onChange}
      initialPage = {0}
    >
      <JobDetails tabLabel="Job Details" navigation={props.navigation} JobDetails = {props.JobDetails}/>
      <CheckLists tabLabel="Checklist" navigation = {props.navigation}/>
      <Workspace tabLabel="WorkSpace" navigation = {props.navigation} JobDetails = {props.JobDetails}/>
    </ScrollableTabView>
  );
}
 