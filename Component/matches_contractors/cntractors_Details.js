import React ,{Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SampleWork from './Contractors_Details/Photos' ;
import About from './Contractors_Details/About' ;
import Review from './Contractors_Details/Reveiws' ;
import StatusBar from '../InputFields/statusBar' ;
import { connect } from 'react-redux';
//contractorID = {this.props.navigation.getParam('contractorID','')} name = {this.props.navigation.getParam('name','')}
class ContractorsDetails extends Component {
  render() {
    return (
        <View style={{flex : 1}}>
          <StatusBar title='Profile' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('0%')}/>
          <ScrollTab navigation={this.props.navigation} details = {this.props.navigation.getParam('details','')} roleIdUserName = {this.props.roleIdUserName}/>
        </View>
     );
  }
}
const mapStateToProps = state => ({
  roleIdUserName : state.createJob.roleIdUserName,
});
export default connect(mapStateToProps)(ContractorsDetails);

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
      tabBarTextStyle ={{ fontSize: 18}}
      tabBarActiveTextColor ="#8cc63f" 
      tabBarInactiveTextColor ="#292929"
      // onChangeTab = {this.onChange}
      initialPage = {1}
    >
      <About tabLabel="About" navigation={props.navigation} details = {props.details} roleIdUserName = {props.roleIdUserName}/>
      <SampleWork tabLabel="SampleWork" navigation = {props.navigation} details = {props.details} roleIdUserName = {props.roleIdUserName}/>
      <Review tabLabel="Reviews" navigation = {props.navigation} details = {props.details} roleIdUserName = {props.roleIdUserName}/>
    </ScrollableTabView>
  );
}
 