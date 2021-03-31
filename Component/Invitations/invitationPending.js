import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView , TouchableOpacity, ImageBackground, Image, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SpecificInvitation from './specificInpendingInvitation' ;
import StatusBar from '../InputFields/statusBar' ;
import TouchButton from '../InputFields/touchButton';
import AbsoluteLoader from '../InputFields/absolutLoader';
import { connect } from 'react-redux';
import {GET_PENDING_INVITATION, FALSE_PENDING_INVITATION_FLAG } from '../../Redux/createJob/actionType';
import { DeleteInvitation} from '../../Redux/createJob/jobAction' ;

class InvitationList extends Component {
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
      this.props.FalseLoader(FALSE_PENDING_INVITATION_FLAG);
      this.props.GetData('pending_invitations', GET_PENDING_INVITATION, this.props.userToken, formData);
    });
  }
  
  render(){
    return(
      <ImageBackground source={require('../../assets/invitation_bg.jpg')} style={styles.container}>
        <StatusBar title='INVITATION' isIconDisplay={true} marginValue={hp('2%')} navigation={this.props.navigation}/>
        {!this.props.isMorePendingInvitationListLoaded && 
          <AbsoluteLoader/>
        }
        {this.props.isPendingInvitationListLoaded &&
          <View>
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginBottom : hp('2%'), marginHorizontal : wp('3%')}}>
              <Text style={{ fontSize: (20) , color : '#292929'}}>Pending Invitations</Text>
              <View style={{justifyContent : 'center', alignItems : 'center'}}>
                <TouchableOpacity style={[styles.TouchableStyle , {height : hp('6%'), backgroundColor : '#8cc63f', width : wp('42%') ,elevation : 2}]} onPress={()=>this.props.navigation.navigate('Invite_Step1')}>
                  <Image source={require('../../assets/plus_sign.png')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain', marginRight : wp('2%')}}/>
                  <Text style={{ color : '#ffffff' , fontSize : (15)}}>Co-host/Host</Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.props.pendingInvitationList.length === 0 &&
              <View style={{alignItems : 'center', justifyContent : 'center', height : hp('70%') }}>
                <Text style={{fontSize : 18, color : '#292929'}}>No Pending Invitations Found</Text>
              </View>     
            }
            <ScrollView style={{height : hp('77%')}}>
              {
                this.props.pendingInvitationList.map((item , index) =>
                  <View style={styles.contractorProfile} key={item.comment_ID}>
                    <SpecificInvitation item={item} navigation={this.props.navigation} userToken={this.props.userToken} DeleteInvitation={this.props.DeleteInvitation}/>
                  </View>
                )
              }
              {this.props.pendingInvitationListCount > 10 && this.props.pendingInvitationList.length < this.props.pendingInvitationListCount &&
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
        {!this.props.isPendingInvitationListLoaded &&
          <View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
            <ActivityIndicator
              size='large'
            />
          </View>
        } 
      </ImageBackground>
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
  userName : state.createJob.userName,
  pendingInvitationListCount : state.createJob.pendingInvitationListCount,
  pendingInvitationList : state.createJob.pendingInvitationList,
  isPendingInvitationListLoaded : state.createJob.isPendingInvitationListLoaded,
  isMorePendingInvitationListLoaded : state.createJob.isMorePendingInvitationListLoaded,
});
export default connect(mapStateToProps, {DeleteInvitation})(InvitationList);
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    resizeMode : 'stretch',
  },
  contractorProfile : {
    height : hp('20%'),
    marginHorizontal : wp('3%')
  },
  specificContractor : {
    flexDirection : 'row'
  },
  TouchableStyle :{
    flexDirection : 'row',
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  }
});

