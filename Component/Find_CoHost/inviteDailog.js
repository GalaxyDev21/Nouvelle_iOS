import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ScrollView, Image , FlatList, ImageBackground, TouchableOpacity , TextInput, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import axios from 'axios';
import ShowBar from '../../validations/messageBar' ;
import {server} from '../../../Redux/server';

class InvitePopup extends Component {
    constructor(props){
      super(props);
        this.state = {
          checked : false,
          jobName : '',
          jobId : '',
          selectedJobErr : ''
        }
      }
      
      selectedJob = (value, id) => {
        this.setState({jobName : value, jobId : id})
      }
      getAQuote = async() => {
        if(this.state.jobName){
          var formData = new FormData();
            formData.append('id', this.state.jobId);
            formData.append('invite_user_id', this.props.hostMyJobs[0].post_author);
            const res = await axios.post(server+'invite_for_job', formData, {
              headers : {'Authorization': 'Bearer '+ this.props.userToken,},
            });
            console.log(' Resposne from invite for job ');
            console.log(res.data);
            console.log('********************');
            if(res.data.code === 200){
              ShowBar(res.data.data, 'success');
              this.props.closeDialog(); 
               this.setState({processing : false});
            }
            else{
              ShowBar('SomeThing Wrong Please try again:' , 'error');
              this.props.closeDialog();
              this.setState({processing : false});
            }
        }
        else{
          this.setState({selectedJobErr : 'please choose job'});
        } 
      }
      PressedCancel = () => {
        this.props.closeDialog(); 
      }
      render(){
        return(
          <Dialog
            visible={this.props.isDialogOpen}
            dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
            contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
          > 
          <View>
            <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', marginBottom : hp('2%'), borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
              <Text style={{fontSize: (20) , color : '#ffffff' }}>{`Select property(s) to invite to join`} </Text> 
            </View>
           
               

            <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                <TouchableOpacity style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Invite</Text>
                {this.state.processing && <ActivityIndicator size ='small' color="#414141"/>}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.PressedCancel}  style={[styles.TouchableStyle , {backgroundColor : '#0071bd'}]}>
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
    existingProperty : state.createJob.existingProperty ,
  });
  export default connect(mapStateToProps)(InvitePopup);

const styles = StyleSheet.create({
  touchForDropDown : {
    height:hp('7%'), 
    alignItems : 'flex-start', 
    justifyContent : 'center', 
    backgroundColor : '#f4f4f4' , 
    padding : wp('1.2%'),
    position : 'relative', 
    borderWidth : 1,
    borderColor :'#f4f4f4', 
    borderRadius : 2
  },
  TouchableStyle :{
    height : hp('7%') ,
    width : wp('40%') ,
   // marginBottom : hp('2%'),
    borderRadius : hp('5%') ,
    justifyContent : 'center' ,
    alignItems : 'center'
  },
});
