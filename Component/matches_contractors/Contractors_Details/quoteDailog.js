import React ,{Component} from 'react';
import { StyleSheet, Text, View , Image , TouchableOpacity , Platform, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { connect } from 'react-redux';
import DropDownField from '../../InputFields/dropDown';
import axios from 'axios';
import ShowBar from '../../validations/messageBar' ;
import {server} from '../../../Redux/server';

  class GetAQuotePopup extends Component {
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
        this.setState({jobName : value, jobId : id});
      }
      getAQuote = async() => {
        if(this.state.jobName){
          var formData = new FormData();
            formData.append('id', this.state.jobId);
            formData.append('invite_user_id', this.props.cntID);
            const res = await axios.post(server+'invite_for_job', formData, {
              headers : {'Authorization': 'Bearer '+ this.props.userToken,},
            });
            console.log(' get a quote response ');
            console.log(res.data);
            if(res.data.code === 200){
              ShowBar(res.data.data, 'success');
              this.props.closeDialog(); 
              this.setState({processing : false});
            }
            else{
              ShowBar('Sorry, Unable to send invite' , 'error');
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
          <View style={{height : hp('55%')}}>
            <View style={{ height:hp('9%'), backgroundColor : '#0071bc', justifyContent : 'center', alignItems : 'center', borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
              <Text style={{fontSize: (20) , color : '#ffffff' }}>GET A QUOTE </Text> 
            </View>
             <View style={{justifyContent : 'center', alignItems : 'center'}}>
                  <Image source={require('../../../assets/new_group_icon.png')} style={{height : hp('10%'), width : hp('13%'), resizeMode : 'contain'}}/>
                </View>
                <View style={{marginBottom : hp('16%'), height : hp('9%'), marginHorizontal : wp('3%')}}>
                  <Text style={{ color : '#292929', fontFamily : 'Raleway-SemiBold', fontSize : (16)}}>Choose Job</Text>
                    <DropDownField
                      listShow = {this.props.hostMyJobs}
                      placeholder = 'Choose Job'
                      selectedValue = {this.selectedJob}
                      name = 'post_title'
                      id = 'ID'
                      isObject = {true}
                    />
                    <Text style={[{color : 'red', fontFamily : 'Raleway-SemiBold', fontSize : (12)}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>{this.state.selectedJobErr}</Text>
                </View>

                <View style={[{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderBottomLeftRadius : 10, borderBottomRightRadius : 10,  borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}, Platform.OS === 'ios'?{zIndex : -1}:{}]}>
                  <TouchableOpacity onPress={()=> {this.setState({processing : true}), this.getAQuote()}}  style={[styles.TouchableStyle , {backgroundColor : '#8cc63f', flexDirection : 'row', alignItems : 'center'}]}>
                    <Text style={{color : '#ffffff' , fontSize : (18), marginRight : wp('3%')}}>Quote</Text>
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
    hostMyJobs : state.createJob.hostMyJobs,
    roleIdUserName : state.createJob.roleIdUserName,
  });
  export default connect(mapStateToProps)(GetAQuotePopup);

//   class DropDownForNewGroup extends Component {
//     constructor(props) {
//       super(props);
//         this.state = {
//           placeholder : this.props.placeholder,
//           isOpen : false,
//           dropDownNotification : '',
//         }
//     }
//       selectValue = (value) => {
//         this.setState({
//           isOpen : false,
//           placeholder : value
//         });
//         this.props.selectedValue(value);  
//       }
//     render(){
//       return(
//         <View>
//            <TouchableOpacity onPress={() => {this.setState({isOpen : !this.state.isOpen ? true : false})}} style={[styles.touchForDropDown, { height : hp('7%'),width : this.props.width, backgroundColor : '#f4f4f4', borderWidth : 1}]}>
//                 <Text style={{ color : '#292929', fontSize : this.props.fontSize ? this.props.fontSize : (16), padding : wp('2%')}}>{this.state.placeholder}</Text>
//                   <Image source={require('../../../assets/dropDown_Icon.png')} style={{width:hp('2%') , height:hp('2%') , resizeMode :'contain' ,position : 'absolute' ,right : 9 ,top : 15}}></Image>
//               </TouchableOpacity>
//             {
//               this.state.isOpen && 
//                 <View style={{elevation : 2, width : '100%', height : this.props.height, position : 'absolute', top : hp('7%'), zIndex: 2, backgroundColor: '#ffffff'}}>
//                     <FlatList
//                       data={this.props.listShow}
//                       keyExtractor={(item, index) => ""+ index}          
//                       renderItem={({item , index}) =>  
//                         <TouchableOpacity onPress={() => this.selectValue(item)} style={{height:hp('7%') , borderBottomWidth : 1, borderBottomColor : '#D0D0D0', justifyContent : 'center' , alignItems : 'flex-start'}}>
//                           <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (18), padding : wp('2%')}}>{item}</Text>
//                         </TouchableOpacity>}     
//                     />
//                 </View>
//             }
//         </View>
//         )
//     }
// }
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

{/* <View style={{flexDirection : 'row' , justifyContent : 'space-evenly', backgroundColor : '#ededed', borderTopWidth : 2, borderTopColor : '#c0c0c0', paddingVertical : hp('2%')}}>
                  <TouchButton 
                    buttonName = 'Quote'
                    actionPerform = {ActionPerformFunc}
                    move = {{doingAction : 'doingAction', action : this.getAQuote}}
                    bgColor = '#8cc63f'
                    width = {wp('35%')}
                    height = {hp('7%')}
                    buttonNameSize = {(20)}
                    elevation = {0}
                    navigation = {this.props.navigation}
                  />
                  <TouchButton 
                    buttonName = 'Cancel'
                    actionPerform = {ActionPerformFunc}
                    move = {{doingAction : 'doingAction', action : this.PressedCancel}}
                    bgColor = '#0071bc'
                    width = {wp('35%')}
                    height = {hp('7%')}
                    buttonNameSize = {(20)}
                    elevation = {0}
                    navigation = {this.props.navigation}
                  />
                </View> */}