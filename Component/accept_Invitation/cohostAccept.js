import React ,{Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dialog} from 'react-native-simple-dialogs';
import axios from 'axios';
import {server} from '../../Redux/server';
import ShowBar from '../validations/messageBar' ;
import { connect } from 'react-redux';

class AcceptInviteDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      processing : false
    }
  }
  
  acceptInvite = async() => {
    this.setState({processing : true});
    var formData = new FormData();
      formData.append('id', this.props.hostId);
      //console.log(formData);
      const res = await axios.post(server+'accept_host_invite', formData, {
        headers : {'Authorization': 'Bearer '+ this.props.userToken},
      });
      //console.log(res.data);
      if(res.data.code === 200){
        await AsyncStorage.setItem('host_associate', 'yes');
        ShowBar(res.data.data.msg, 'success');
        this.props.closeDailog('yes');
      }
      else{
        ShowBar('Sorry, Unable to accept invite' , 'error');
        this.props.closeDailog('no');
        this.setState({processing : false});
      }
  }
  cancelInvite = () => {
    this.props.closeDailog('no');
  }
  render(){
    return(
      <Dialog
        visible={this.props.isDailogOPen}
        dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
        contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
      > 
        <View>
          <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
            <Text style={{fontSize: (20) , color : '#ffffff' }}>Accept Invite </Text> 
          </View>
          <Text style={{fontSize : 16, marginBottom : hp('6%'), marginHorizontal : wp('3%')}}>You are inviting this co host for all of your properties</Text>
          <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
            <TouchableOpacity onPress={this.acceptInvite}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
              <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Accept</Text>
              {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
            </TouchableOpacity>
            <TouchableOpacity onPress={this.cancelInvite}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
              <Text style={{color : '#ffffff' , fontSize : (18)}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog> 
    )
  }
}
const mapStateToProps = state => ({
  userToken : state.createJob.userLoginToken,
});
export default connect(mapStateToProps)(AcceptInviteDialog);
const styles = StyleSheet.create({
    TouchableStyle :{
    height : hp('7%') ,
    width : wp('33%') ,
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});