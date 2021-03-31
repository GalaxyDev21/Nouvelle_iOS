import React ,{Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import PasswordSetting from './passwordSetting' ;
import PassportSetting from './passportsetting' ;
import StatusBar from '../InputFields/statusBar' ;

export default class TabViewOfPasswordAndPassport extends Component {
  render() {
    return (
        <View style={{flex : 1}}>
          <StatusBar title='SETTINGS' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
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
      tabBarTextStyle ={{ fontSize: (20)}}
      tabBarActiveTextColor ="#8cc63f" 
      tabBarInactiveTextColor ="#292929"
      // onChangeTab = {this.onChange}
      initialPage = {0}
      renderTabBar={() => <ScrollableTabBar />}
    >
      <PasswordSetting tabLabel="Reset Password" navigation={props.navigation} />
      <PassportSetting tabLabel="Identification Documents" navigation = {props.navigation}/>
    </ScrollableTabView>
  );
}
 