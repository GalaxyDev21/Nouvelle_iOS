import React ,{Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Tooltip from 'react-native-walkthrough-tooltip';
import {checkAndCreateRoom} from '../../Create_Chat_Room/checkAndCreateRoom';
import GetAQuotePopup from './quoteDailog';

export default class MessageButtons extends Component{
  constructor(props){
    super(props);
      this.state = {
        toolTipVisible1 : false,
        toolTipVisible2 : false,
        isStartMessages : false,
        isPropsIconPressed : false,
        messageButton : false,
        isDialogOpen : false,
        room : {},
        name : this.props.details.display_name,
        contractorId : this.props.details.id
      }
  }
  startMessages = () => {
    this.setState({isStartMessages : true, messageButton : true, isDialogOpen : false});
    checkAndCreateRoom(this.state.name, this.state.contractorId, this.props.details.roles, this.props.roleIdUserName).then(res =>{
      this.props.navigation.navigate('ChatScreen', {room : res});
      this.setState({ 
        isStartMessages : false
      });
    });
  }
  closeDialog = () => {
    this.setState({
      isDialogOpen : false
    })
  }
  isJobSelected = (value) => {
    this.setState({
      job : value,
      isDialogOpen : false
    })
  }
  render(){
    return(
      <View style={{flexDirection : 'row', alignItems : 'center' , justifyContent : this.props.details.hour_rate == 0 ? 'space-between' : 'center', padding:10}}>
        <View style={[styles.messageButton, {backgroundColor : this.state.isStartMessages ? '#0071bc' : '#ffffff', position : 'relative'}]}>
          <TouchableOpacity disabled={this.state.isStartMessages} onPress={this.startMessages} style={{marginRight : wp('3%'), height : hp('5%'), justifyContent : 'center'}}>
            <Text style={this.state.isStartMessages ? styles.messageButtonTitleAfterPressed : styles.messageButtonTitle}>Message</Text>
          </TouchableOpacity>
           <Tooltip
             isVisible={this.state.toolTipVisible1}
             content={<Text>Except where necessary, we encourage Hosts and Contractors to communicate within the Nouvelle app to better assist with potential disputes</Text>}
             placement="top"
             onClose={() => this.setState({toolTipVisible1 : false, isStartMessages : false})}
             contentStyle =  {{width : wp('80%')}}
            >
             <TouchableOpacity onPress={() => this.setState({toolTipVisible1 : !this.state.toolTipVisible1 ? true : false, isStartMessages : false})} style={[styles.iconInMessageButton, {backgroundColor :  '#ffffff'}]}>
               <Image source={require('../../../assets/icon_messageButton.png')} style={{height : hp('4%'), width : hp('4%'), resizeMode : 'contain'}}/>
             </TouchableOpacity> 
            </Tooltip>
            {this.state.isStartMessages &&
              <View style={styles.absoluteView}>
                <ActivityIndicator
                  size ='small'
                />
              </View>
            }
        </View> 
        {this.props.details.hour_rate == 0 &&
          <View style={[styles.messageButton, {backgroundColor : this.state.isDialogOpen ? '#0071bc' : '#ffffff'}]}>
            <TouchableOpacity disabled={this.state.isDialogOpen} onPress={() => this.setState({isStartMessages : false, isDialogOpen : true})} style={{marginRight : wp('3%'), height : hp('5%'), justifyContent : 'center'}}>
              <Text style={this.state.isDialogOpen ? styles.messageButtonTitleAfterPressed : styles.messageButtonTitle}>Get a Quote </Text>
            </TouchableOpacity>
            <Tooltip
              isVisible={this.state.toolTipVisible2}
              content={<Text>Except where necessary, we encourage Hosts and Contractors to communicate within the Nouvelle app to better assist with potential disputes</Text>}
              placement="auto"
              onClose={() => this.setState({toolTipVisible2 : false, isDialogOpen : false})}
              contentStyle =  {{width : wp('80%')}}
            >
              <TouchableOpacity onPress={() => this.setState({toolTipVisible2 : !this.state.toolTipVisible2 ? true : false, isDialogOpen : false})} style={[styles.iconInMessageButton, {backgroundColor : '#ffffff'}]}>
                <Image source={require('../../../assets/icon_messageButton.png')} style={{height : hp('4%'), width : hp('4%'), resizeMode : 'contain'}}/>
              </TouchableOpacity> 
            </Tooltip> 
          </View>
        }
        <GetAQuotePopup isDialogOpen = {this.state.isDialogOpen} cntID = {this.props.details.id} closeDialog = {this.closeDialog} isJobSelected ={this.isJobSelected}/>
      </View>
    );
  } 
}

const styles = StyleSheet.create({
  messageButton : {
    height : hp('5%'),
    width :  wp('40%'),
    borderRadius : hp('5%'),
    flexDirection : 'row', 
    alignItems : 'center',
    justifyContent : 'center', 
    borderColor : '#0071bc',
    borderWidth : 1
  },
  absoluteView : {
    height : hp('5%') ,
    width : '100%',
    borderRadius : hp('5%') , 
    alignItems : 'center' ,
    justifyContent : 'center' , 
    borderColor : '#0071bc',
    borderWidth : 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position : 'absolute'
  },
  messageButtonAfterTouch : {
    backgroundColor : '#0071bc' ,
    height : hp('5%') ,
    width :  wp('40%') ,
    borderRadius : hp('5%') ,
    flexDirection : 'row' , 
    alignItems : 'center' ,
    justifyContent : 'center' , 
    borderColor : '#0071bc',
    borderWidth : 1
  },
  messageButtonTitle : {
    fontSize : 16,
    color : '#0071bc' ,
    marginRight : 5 ,
  },
  messageButtonTitleAfterPressed : {
    fontSize : 16,
    color : '#ffffff',
    marginRight : 5,
  },
  iconInMessageButton : {
    height : hp('4%') ,
    width : hp('4%') ,
    borderRadius : 50
  },
  iconInMessageButtonAfterPressed : {
    height : hp('4%') ,
    width : hp('4%') ,
    borderRadius : 50
  },
})