import React ,{Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import axios from 'axios';
import ShowBar from '../validations/messageBar' ;
import {server} from '../../Redux/server';
class SpecificInvitation extends Component {
  constructor(props){
    super(props);
    this.state = {
      isButtonDisable : false,
      isSendAgain : false,
      isCancel : false
    }
  }
  cancelButtonPressed = () => {
    this.setState({isCancel : true, isButtonDisable : true},async function(){
        var formData = new FormData();
        formData.append('id', this.props.item.comment_ID);
        const res = await axios.post(server+'cancel_invitations', formData, {
          headers : {'Authorization': 'Bearer '+ this.props.userToken},
        });
        if(res.data.code === 200){
          this.props.DeleteInvitation(this.props.item.comment_ID);
          ShowBar(res.data.data, 'success');
        }
        else{
          this.setState({isCancel : false, isButtonDisable : false});
          ShowBar('Sorry, Unable to delete invitation', 'error');
        }
    });
  }
  sendAgain = () => {
    this.setState({isSendAgain : !this.state.isSendAgain, isButtonDisable : false});
  }
  componentWillUnmount(){
    this.setState({isCancel : false, isButtonDisable : false, isSendAgain : false});
  }
  render(){
    const {item} = this.props ;
    return(
      <View style={styles.container}>
        <View style={{marginBottom : hp('2%'), flexDirection : 'row', alignItems : 'center'}}>
          <Text style={{fontSize: (17) , color : '#292929', marginRight : wp('6%')}}>Name</Text>
          <Text style={{fontSize: (15) , color : '#0071bc'}}>{item.reciver_name}</Text>
        </View>
        <View style={{marginBottom : hp('2%'), flexDirection : 'row', alignItems : 'center'}}>
          <Text style={{fontSize: (17) , color : '#292929', marginRight : wp('6%')}}>{item.invitation_status === 'email' ? 'Email' : 'Phone No.'}</Text>
          <Text style={{fontSize: (15) , color : '#0071bc'}}>{item.invitation_status === 'email' ? item.reciver_email : item.reciver_phone}</Text>
        </View>
        <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-around'}}>
          <TouchableOpacity disabled={this.state.isButtonDisable} style={[styles.TouchableStyle , {flexDirection : 'row', alignItems : 'center', backgroundColor : '#8cc63f'}]} onPress={this.sendAgain}>
            <Text style={{color : '#ffffff' , fontSize : (12), marginRight : wp('2%')}}>Send Invite</Text>
            {this.state.isSendAgain &&
              <LoaderComp/>
            }
          </TouchableOpacity>
          <TouchableOpacity disabled={this.state.isButtonDisable} style={[styles.TouchableStyle , {flexDirection : 'row', alignItems : 'center', backgroundColor  : '#0071bc'}]} onPress={this.cancelButtonPressed}>
            <Text style={{color : '#ffffff' , fontSize : (12), marginRight : wp('2%')}}>Cancel Invite</Text>
            {this.state.isCancel &&
              <LoaderComp/>
            }
          </TouchableOpacity>
        </View>         
      </View>
    )
  }
}
export default SpecificInvitation ;
const styles = StyleSheet.create({
  container : {
    flex : 1 ,
    backgroundColor : '#f6f6f6' ,
    marginBottom : hp('2%') ,
    borderRadius : 2,
    padding : wp('3%')
  },
  TouchableStyle :{
    height : hp('4%') ,
    width : wp('30%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center',
 },
 absoluteView : {
  height : hp('4%') ,
  width : '100%',
  borderRadius : hp('5%') , 
  alignItems : 'center' ,
  justifyContent : 'center' , 
  borderColor : '#0071bc',
  borderWidth : 1,
  backgroundColor: 'rgba(52, 52, 52, 0.8)',
  position : 'absolute'
},
});

function LoaderComp(){
  return(
    <View style={styles.absoluteView}>
      <ActivityIndicator
        size ='small'
      />
    </View>
  )
}



//     <View style={styles.container}>
//     <View style={{width : wp('30%')}}>
//       <View style={{marginBottom : hp('1%')}}>
//         <Text style={{ fontSize: (17) , color : '#292929'}}>Role</Text>
//           <Text style={{ fontSize: (15) , color : '#0071bc'}}>{item.comment_type}</Text>
//       </View>
//       <View style={{marginBottom : hp('1%')}}>
//         <Text style={{fontSize: (17) , color : '#292929'}}>Name</Text>
//           <Text style={{fontSize: (15) , color : '#0071bc'}}>{item.name}</Text>
//       </View>
//       <View style={{marginBottom : hp('1%')}}>
//         <Text style={{fontSize: (17) , color : '#292929'}}>{item.inviation_status === 'email' ? 'Email' : 'Phone No.'}</Text>
//           <Text style={{fontSize: (15) , color : '#0071bc'}}>{item.invitation_status === 'email' ? item.reciver_email : item.reciver_phone}</Text>
//       </View>
//     </View>
//     <View style={{flex : 1, marginLeft : wp('2%')}}>
//       <View style={{marginBottom : hp('1%')}}>
//         <Text style={{fontSize: (17) , color : '#292929'}}>Invitation Code</Text>
//           <Text style={{fontSize: (15) , color : '#0071bc'}}>{item.comment_author}</Text>
//       </View>
//       <View style={{marginBottom : hp('1%')}}>
//         <Text style={{fontSize: (17) , color : '#292929'}}>Email</Text>
//           <Text style={{ fontSize: (15) , color : '#0071bc'}}>{item.comment_author_email}</Text>
//       </View>
//       <View style={{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
//         <TouchButton 
//           buttonName = 'Cancel Invite'
//           actionPerform = {ActionPerformFunc}
//           move = {{doingAction : 'doingAction', action : this.cancelButtonPressed}}
//           bgColor = {this.state.isCancelBgColorChange ? '#0071bc' : '#939393'}
//           width = {wp('25%')}
//           height = {hp('4%')}
//           buttonNameSize = {(12)}
//           elevation = {0}
//           navigation = {this.props.navigation}
//         />
//         <TouchButton 
//           buttonName = 'Send Again'
//           actionPerform = {ActionPerformFunc}
//           move = {{doingAction : 'doingAction', action : this.sendButtonPressed}}
//           bgColor = {this.state.isSendBgColorChange ? '#0071bc' : '#939393'}
//           width = {wp('25%')}
//           height = {hp('4%')}
//           buttonNameSize = {(12)}
//           elevation = {0}
//           navigation = {this.props.navigation}
//         />
//       </View> 
//     </View>        
// </View>