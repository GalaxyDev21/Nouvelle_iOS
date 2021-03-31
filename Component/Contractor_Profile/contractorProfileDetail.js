import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , TouchableOpacity , ActivityIndicator} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import { Icon } from 'react-native-elements' ;
import ContractorProfileSampleWork from './sampleWork';
import ContractorProfile from './profile' ;
import ContractorsServices from './services' ;
import StatusBar from '../InputFields/statusBar' ;
import { connect } from 'react-redux';

 class ContractorsProfileDetails extends Component {
  render() {
    return (
        <View style={{flex : 1}}>
          <StatusBar title='PROFILE' isIconDisplay={true} navigation={this.props.navigation}/>
          {
             this.props.isProfileDetailsLoaded && <ScrollTab navigation={this.props.navigation} />
          }
          {
            !this.props.isProfileDetailsLoaded &&
              <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator
                 size='large'
                />
              </View>
          }
        </View>
     );
  }
}
const mapStateToProps = state => ({
  // userToken : state.createJob.userLoginToken,
  isProfileDetailsLoaded : state.createJob.isProfileDetailsLoaded ,
   });
   export default connect(mapStateToProps)(ContractorsProfileDetails);

const styles = StyleSheet.create({
    statusBarStyle : {
        height:hp('12%'),
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
      initialPage = {0}
    >
      <ContractorProfile tabLabel="Profile" navigation = {props.navigation}/>
      <ContractorProfileSampleWork tabLabel="SampleWork" navigation = {props.navigation}/>
      <ContractorsServices tabLabel="Services" navigation = {props.navigation}/>
    </ScrollableTabView>
  );
}
 