import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment, { relativeTimeRounding } from 'moment-timezone';
import axios from 'axios'
import { Dialog, ConfirmDialog } from 'react-native-simple-dialogs';
import {server} from '../../Redux/server'

export default class CustomCalendar extends Component {
  state={
    todaySelected: false,
    weekSelected: false,
    monthSelected: true,
    currentMonthFirstDate: moment(new Date()).tz('GMT').startOf('month'),
    currentWeekFirstDate: moment(new Date()).tz('GMT').startOf('week'),
    prevProps: this.props,
    data : [],
    filterData : [],
    popupDate: '',
    popupData: [],
    isEventLoaded : false
  }
  moveToNextMonth = () => {
     if(this.state.weekSelected){
       //thisWeek = this.state.currentWeekFirstDate;
       const nextWeek = moment(this.state.currentWeekFirstDate).add(1,'week');
       this.setState({
         currentWeekFirstDate: nextWeek,
         isEventLoaded : false
       },this.getCalendarData) 
      }
      else{
       // thisMonth = this.state.currentMonthFirstDate;
        const nextMonth = moment(this.state.currentMonthFirstDate).add(1,'month');
        this.setState({
          currentMonthFirstDate: nextMonth,
          isEventLoaded : false
        },this.getCalendarData)
      }
  }
  moveToPrevMonth = () =>{
      if(this.state.weekSelected){
      //  thisWeek = this.state.currentWeekFirstDate;
        const nextWeek = moment(this.state.currentWeekFirstDate).subtract(1,'week');
          this.setState({
            currentWeekFirstDate: nextWeek,
            isEventLoaded : false
          },this.getCalendarData) 
      }
      else
        { 
         // thisMonth = this.state.currentMonthFirstDate;
          const nextMonth = moment(this.state.currentMonthFirstDate).subtract(1,'month');
            this.setState({
              currentMonthFirstDate: nextMonth,
              loadWeekRows: false,
              isEventLoaded : false
            },this.getCalendarData)
        }
  }
  componentDidMount(){
    this.getCalendarData();
  }
  getCalendarData = async() =>{
    //console.log('get calendar Data function called ');
    var formData = new FormData();
    if(this.state.monthSelected)
    {
     formData.append('start_date', moment (this.state.currentMonthFirstDate).format('YYYY-MM-DD'));
     formData.append('end_date', moment(this.state.currentMonthFirstDate.tz('GMT')).add(1,'months').format('YYYY-MM-DD')) ;
    }
    else if(this.state.weekSelected)
    {
     formData.append('start_date', moment (this.state.currentWeekFirstDate).format('YYYY-MM-DD'));
     formData.append('end_date', moment(this.state.currentWeekFirstDate.tz('GMT')).endOf('week').add(2,'days').format('YYYY-MM-DD')) ;
    }
    else if(this.state.todaySelected){
      formData.append('start_date', moment (new Date()).format('YYYY-MM-DD'));
      formData.append('end_date', moment(new Date()).add(1,'days').format('YYYY-MM-DD')) ;
    }
    // console.log('*** formData ***');
    // console.log(formData);
    const res = await  axios.post(server+'get_calendar_events', formData,
     {headers : {'Authorization': 'Bearer '+ this.props.token}});
    //  console.log('Events Response');
    //  console.log(res.data);
     if(res.data.code === 200){
        this.props.onDataLoaded();
        this.setState({
          data : res.data.data,
          filterData : res.data.data,
          isEventLoaded : true
        });
     }   
  }
  setDialog = (date, data) =>{
    const d =  moment(date).format('MMM D, YYYY').toString();
    this.setState({
      popupDate : d,
      popupData:data,
      dialogVisible:true
    });
  }
  static getDerivedStateFromProps(props, state) {
    if(props.applyFilter){
      const dataArr = state.data;
      const arrFilter = dataArr.filter(checkElement);
      function checkElement(el) {
         chk = true;
        if(props.contractorFilter){
          if(el.contractor_id != props.contractorFilter){
            chk = false;
          }
        }
         chk1 = false;
        if(props.propertyFilter.length > 0 ){
          if(!chk){
            return;
          }
          for(var i =0 ; i < props.propertyFilter.length ; i++){
            if(el.property == props.propertyFilter[i])
            {
              chk1 = true;
            }
          }
          chk = chk1;
        }
        if(chk){
          return el;
        }  
      }
      state.filterData = arrFilter;
    }
    else if (props.clearFilter){
      state.filterData = state.data;
    }
       return state;
  }
  render() {
    return (
      <View style={[{width:wp(this.props.width + '%'), backgroundColor:"#fff"}, Platform.OS === 'ios'?{zIndex : -6}:{}]}>
        {this.props.isDataLoaded &&
          <View>
            <View style={{width:wp(this.props.width + '%'), height:hp('6%'), backgroundColor:"#8CC63F",flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'row',alignItems:'center',paddingLeft:wp('2%')}}>
                {(this.state.monthSelected || this.state.todaySelected) && 
                  <Text style={{color : '#fff', fontSize : 16}}>{ moment(this.state.currentMonthFirstDate).format('MMM YYYY')}</Text>
                }
                {this.state.weekSelected && 
                  <View>
                    <Text style={{color:'#fff',fontSize:13}}>{ moment(this.state.currentWeekFirstDate).format('MMM D, YY')} -</Text> 
                    <Text style={{color:'#fff',fontSize:13}}>{ moment(this.state.currentWeekFirstDate).add(6,'days').format('MMM D, YY')}</Text>
                  </View>
                }
                {!this.state.todaySelected &&
                  <TouchableOpacity onPress = {this.moveToPrevMonth}>
                    <Text style={{color:'#fff',fontSize:25}}>{'  <'}</Text>
                  </TouchableOpacity>
                }
                {!this.state.todaySelected &&
                  <TouchableOpacity onPress = {this.moveToNextMonth}>
                    <Text style={{color:'#fff',fontSize:25}}>{'  >'}</Text>
                  </TouchableOpacity>
                }
              </View>
              <View style={{flexDirection:'row',alignItems:'center',paddingRight:wp('2%')}}>
                <View style={{backgroundColor:'#fff',width:wp((this.props.width/2)+ '%'),height:hp('3.5'),borderRadius: 20,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=>{this.setState({isEventLoaded : false, loadWeekRows:false,monthSelected:false,todaySelected:true,weekSelected:false,currentMonthFirstDate: moment(new Date()).tz('GMT').startOf('month')},this.getCalendarData)}}>
                    <Text style={this.state.todaySelected?{color:'#0071BC'}:{}}>Today</Text>
                  </TouchableOpacity >
                  <Text> | </Text>
                  <TouchableOpacity onPress={()=>{this.setState({isEventLoaded : false, monthSelected:false,todaySelected:false,weekSelected:true,currentWeekFirstDate: moment(new Date()).tz('GMT').startOf('week'),},this.getCalendarData)}}>
                    <Text style={this.state.weekSelected?{color:'#0071BC'}:{}}>Week</Text>
                  </TouchableOpacity>
                  <Text> | </Text>
                  <TouchableOpacity  onPress={()=>{this.setState({isEventLoaded : false, loadWeekRows:false,monthSelected:true,todaySelected:false,weekSelected:false,currentMonthFirstDate: moment(new Date()).tz('GMT').startOf('month')},this.getCalendarData)}}>
                    <Text style={this.state.monthSelected?{color:'#0071BC'}:{}}>Month</Text>
                  </TouchableOpacity>                              
                </View>  
              </View>
            </View>
            {this.state.isEventLoaded &&
                <View>
                {this.state.monthSelected &&
                  <MonthlyView setDialog ={this.setDialog} data ={this.state.filterData} width = {this.props.width} currentMonthFirstDate = {this.state.currentMonthFirstDate}/>
                }
                {this.state.weekSelected &&
                  <WeeklyView setDialog ={this.setDialog} data ={this.state.filterData} width = {this.props.width} currentWeekFirstDate = {this.state.currentWeekFirstDate} currentMonthFirstDate = {this.state.currentMonthFirstDate}/>
                }
                {this.state.todaySelected &&
                  <TodayView setDialog ={this.setDialog} data ={this.state.filterData} width = {this.props.width} currentMonthFirstDate = {this.state.currentMonthFirstDate}/>
                }
              </View>
            }
            {!this.state.isEventLoaded &&
              <View style={{width : wp(this.props.width + '%'), height : hp('40%'), alignItems : 'center', justifyContent : 'center'}}>
                <ActivityIndicator
                  size='large'
                />
              </View>
            }
          </View>
        }
        <Dialog
          visible={this.state.dialogVisible}
          dialogStyle={{borderRadius: 10,overflow: 'hidden'}}
          contentStyle={{borderRadius: 10,overflow: 'hidden', padding : 0 , paddingTop : 0, backgroundColor : '#ffffff'}}
          onTouchOutside={() => this.setState({dialogVisible: false})} >
          <View style = {{ height:hp('45%')}}>
            <View style={{ height:hp('9%'), backgroundColor : '#ededed', justifyContent : 'center', alignItems : 'center', borderTopLeftRadius : 10, borderTopRightRadius : 10}}>
              <Text style={{fontSize : 20, color : '#000', textAlign : 'center'}}>{this.state.popupDate}</Text> 
            </View>
            <ScrollView>             
              {this.state.popupData.map((element,index) =>{
                return (<View key = {element.start + '' + index} style={{flexDirection : 'row', alignItems : 'center', borderBottomWidth : 2, borderBottomColor : '#ededed', paddingVertical : wp('1%')}}>
                <View style={{elevation : 5, shadowOpacity : 0.3, shadowColor : '#292929', height : hp('3%'), width : hp('3%'), borderRadius : 100 , backgroundColor : element.color === '#3a87ad' ? '#0071bc' : '#8cc63f', marginHorizontal : wp('3%') }}></View>
                  <View>
                    {element.contractor !== null && 
                      <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : wp('1%')}}>
                        <Text style={{fontSize : 16, color : '#292929', marginRight : wp('2%')}}>Contractor: </Text>
                        <Text style={{color:'#292929', fontSize:16, flexWrap : 'wrap'}}>{element.contractor}</Text>
                      </View>
                    }
                  <View style={{flexDirection : 'row', alignItems : 'center', marginBottom : wp('1%')}}>
                    <Text style={{fontSize : 16, color : '#292929',  marginRight : wp('2%')}}>Job Title: </Text>
                    <Text style={{color : '#292929', fontSize : 14, width : wp('55%'), flexWrap : 'wrap'}}>{element.title}</Text>
                  </View>
                  </View>
                </View>)
              }) 
              }
            </ScrollView>
          </View>
        </Dialog>
      </View>
    )
  }
}

class MonthlyView extends Component {
  setRows = () => {
    // console.log('******** data ********');
    // console.log(this.props.data);
    // console.log('********************************');
    const firstIndex = moment(this.props.currentMonthFirstDate).format('d');
    // console.log('=========== first index ============');
    // console.log(firstIndex);
    // console.log(moment(this.props.currentMonthFirstDate).format('D'))
    // console.log('=======================');
    const first = true;
    var rows = [];
    var dates = [];
    const lastDate = moment(this.props.currentMonthFirstDate).endOf('month').format('D');
    // console.log('++++++++++++++++++++++++');
    // console.log(lastDate);
    // console.log('++++++++++++++++++++++');
    let currentDateToEnter = this.props.currentMonthFirstDate;
    for (let index = 0; index < firstIndex; index++) {
      const newDate = {};
      newDate.date = 'no';
      dates.push(newDate); 
    }
    for (let index = 1; index <= lastDate; index++) {
      const  newDate = {};
        newDate.date = currentDateToEnter;
        dates.push(newDate);
        currentDateToEnter = moment(currentDateToEnter).add(1,'day');
    }
    let currentDateIndex = 0;
    const rowIndex = 0;
    const rowsArray = []
    while(currentDateIndex < dates.length){
      let tempArray = [];
        for (let index = currentDateIndex; index < (currentDateIndex+7 < dates.length ? currentDateIndex+7 : dates.length); index++) {
          tempArray.push(dates[index]);
        }
        rowsArray.push(tempArray);
        currentDateIndex+=7;
    }
    for (let index = 0; index < rowsArray.length; index++) {
      rows.push(
        <View key={'row'+index} style={{width:wp(this.props.width + '%'),flexDirection:'row'}}>
          {
            rowsArray[index].map((element,ind) => {
              return <DateBox setDialog ={this.props.setDialog} tasks = {element.date === 'no'?[]: this.props.data.filter((task)=>{return moment(task.start).format('YYYY-MM-DD') === moment(element.date).format('YYYY-MM-DD')})} key={'date'+element.date+ind} info = {element}  width = {this.props.width/7}/>
            })
          }
        </View>
      )
    }
    return rows;
  }
  render() {
    return (
      <View>
        <View style={{width:wp(this.props.width +'%'), height:hp('4%'), backgroundColor:"#F6F6F6",flexDirection:'row',borderWidth:wp('0.5%'),borderColor:'#EFEFEF'}}>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Sun</Text>
          </View>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Mon</Text>
          </View>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Tue</Text>
          </View>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Wed</Text>
          </View>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Thu</Text>
          </View>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Fri</Text>
          </View>
          <View style={{width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
            <Text>Sat</Text>
          </View>
        </View>  
        <View>
          {this.setRows()}
        </View>
      </View>
    )
  }
}
class WeeklyView extends Component {
  state = {
    loadWeekRows: true
  }
  setRows = () =>{ 
    firstIndex = moment(this.props.currentWeekFirstDate).format('D');
    first = true;
    var rows = [];
    var dates = [];
    lastDate = moment(this.props.currentWeekFirstDate).endOf('week').format('D');
    currentDateToEnter = this.props.currentWeekFirstDate;
    for (let index = 0; index <= 6; index++) {
      newDate = {};
      newDate.date = currentDateToEnter;
      dates.push(newDate);
      currentDateToEnter = moment(currentDateToEnter).add(1,'day');
    }
    currentDateIndex = 0;
    rowIndex = 0;
    for(let index = 0; index < dates.length; index++){
      rows.push(
        <View key={'row'+index}>
            <View style={{backgroundColor:"#F6F6F6",width:wp((this.props.width/7) + '%'),justifyContent:'center',alignItems:'center',height:hp('4%')}}>
                <Text>{moment(dates[index].date).format('ddd')}</Text>
            </View>                                             
            <DateBox setDialog ={this.props.setDialog} tasks = {dates[index].date === 'no'?[]: this.props.data.filter((task)=>{return moment(task.start).format('YYYY-MM-DD') === moment(dates[index].date).format('YYYY-MM-DD')})} key={'date'+dates[index].date+index} info = {dates[index]}  width = {this.props.width/7}/>                      
        </View>
      )
    }
    return rows;
  }
  setTimeRows = () => {
    firstIndex = moment(this.props.currentWeekFirstDate).format('D');
    first = true;
    var rows = [];
    var dates = [];
    lastDate = moment(this.props.currentWeekFirstDate).endOf('week').format('D');
    currentDateToEnter = this.props.currentWeekFirstDate;
    for (let index = 0; index <= 6; index++) {
      newDate = {};
      newDate.date = currentDateToEnter;
      dates.push(newDate);
      currentDateToEnter = moment(currentDateToEnter).add(1,'day');
    }
    currentDateIndex = 0;
    rowIndex = 0;
    for (let index = 0; index < dates.length; index++) {
      rows.push(
        <View key={'row'+index}>
          {
            this.getHours(dates[index],this.props.data.filter((task)=>{return moment(task.start).format('YYYY-MM-DD') === moment(dates[index].date).format('YYYY-MM-DD')}))
          }
        </View>
      )
    }
    return rows;
  }
  getHours = (date,tasks)=>{
    hourArray = [];
    for (let index = 0; index < 24; index++) {
      hourArray.push(<TimeBox 
        setDialog ={this.props.setDialog}
        key = {date + '' + index}
        tasks = {tasks.length>0?tasks.filter((task)=>{return moment(task.start).format('H') === ''+index}):[]}                
        width = {this.props.width/7}
        height = {this.props.width/7}/>)
    }
    return hourArray;
  }
  render() {
    return (
      <View  style={{width:wp(this.props.width +'%'), borderWidth:wp('0.5%'),borderColor:'#EFEFEF'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={{flexDirection:'row'}}>
              <View style={{height:(hp('4%') + wp(this.props.width/7+'%')), width:wp(this.props.width/14 + '%')}}></View>
              {this.setRows()}
            </View>
            <View style={{height: hp(((this.props.width/7)*2)+'%')}}>
              <ScrollView nestedScrollEnabled={true}>
                <View style={{flexDirection:'row'}}>
                  <View>
                    {
                      hoursArray.map(element=>{
                        return <View key = {'hourmark'+element} style={{height: wp (this.props.width/7 + '%'), width:wp(this.props.width/14 + '%'),alignItems:'flex-end',paddingRight:wp('1%')}}>
                          <Text style={{fontSize:10}}>{moment('2019-01-01T'+element+':00:00').format('hh')}</Text>
                          <Text style={{fontSize:10}}>{moment('2019-01-01T'+element+':00:00').format('a')}</Text>
                        </View>
                      })
                    }
                  </View>
                  {this.setTimeRows()}
                </View>
              </ScrollView>
            </View> 
          </View>
        </ScrollView>  
      </View>
    )
  }
}
class TodayView extends Component {
  setRows = () =>{
    date = new Date();
    rows = []
      rows.push(
        <View key = 'todayDateView'>
          <View style={{backgroundColor:"#F6F6F6",width:wp((this.props.width - this.props.width/14) + '%'),justifyContent:'center',alignItems:'flex-start',height:hp('4%'),paddingLeft:wp('2%')}}>
            <Text>{moment(date).format('dddd')}</Text>
          </View>                                             
          <DateBox setDialog ={this.props.setDialog} tasks = {this.props.data.filter((task)=>{return moment(task.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')})}  info = {date}  width = {this.props.width/7}/>                      
        </View>
      )
    return rows;
  }
  setTimeRows = () =>{ 
    var rows = [];
    var date = new Date();
    rows.push(
      <View key = 'todayTimeView'>
        {
          this.getHours(date,this.props.data.filter((task)=>{return moment(task.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')}))
        }                      
      </View>
    )
    return rows;
  }
  getHours = (date,tasks)=>{
    hourArray = [];
    for (let index = 0; index < 24; index++) {
      hourArray.push(<TimeBox 
        setDialog ={this.props.setDialog}
        key = {date + '' + index}
        tasks = {tasks.filter((task)=>{return moment(task.date).format('H') === ''+index})}                
        width = {this.props.width - this.props.width/14}
        height = {this.props.width/7}/>)
    }
    return hourArray;
  }
  render() {
    return (
      <View  style={{width:wp(this.props.width +'%'), borderWidth:wp('0.5%'),borderColor:'#EFEFEF'}}>
        <View>
          <View>
            <View style={{flexDirection:'row'}}>
              <View style={{height:(hp('4%') + wp(this.props.width/7+'%')), width:wp(this.props.width/14 + '%')}}></View>
                {this.setRows()}
            </View>
            <View style={{height: hp(((this.props.width/7)*2)+'%')}}>
              <ScrollView nestedScrollEnabled={true}>
                <View style={{flexDirection:'row'}}>
                  <View>
                    {
                      hoursArray.map(element=>{
                        return <View key = {'hourmark'+element} style={{height: wp (this.props.width/7 + '%'), width:wp(this.props.width/14 + '%'),alignItems:'flex-end',paddingRight:wp('1%')}}>
                          <Text style={{fontSize:10}}>{moment('2019-01-01T'+element+':00:00').format('hh')}</Text>
                          <Text style={{fontSize:10}}>{moment('2019-01-01T'+element+':00:00').format('a')}</Text>
                        </View>
                      })
                    }
                  </View>
                  {this.setTimeRows()}
                </View>
              </ScrollView>
            </View> 
          </View>
        </View>
      </View>
    )
  }
}
class DateBox extends Component {
  state ={
    popoverString:''
  }
  render() {
    return (
      <View>
        {this.props.tasks.length>0 &&            
          <TouchableOpacity onPress = {()=>{this.props.setDialog(this.props.info.date,this.props.tasks)}}>
            <View style={[{width:wp(this.props.width+'%'),justifyContent:'flex-start',alignItems:'flex-start',height:wp(this.props.width+'%'),borderWidth:wp('0.5%'),borderColor:'#EFEFEF'},{backgroundColor:this.props.tasks.length>0?'#8CC63F':'rgba(0,0,0,0)'}]}>
              <Text style={{paddingLeft:wp('1%'),fontSize:12}}>{this.props.info.date!=='no'? moment(this.props.info.date).format('D'):''}</Text>
            </View>
          </TouchableOpacity>
        }
        {this.props.tasks.length==0 &&            
          <View style={[{width:wp(this.props.width+'%'),justifyContent:'flex-start',alignItems:'flex-start',height:wp(this.props.width+'%'),borderWidth:wp('0.5%'),borderColor:'#EFEFEF'},{backgroundColor:this.props.tasks.length>0?'#8CC63F':'rgba(0,0,0,0)'}]}>
            <Text style={{paddingLeft:wp('1%'),fontSize:12}}>{this.props.info.date!=='no'? moment(this.props.info.date).format('D'):''}</Text>
          </View>
        }
      </View>
    )
  }
}
class TimeBox extends Component {
  state ={
    popoverString:''
  }
  render() {
    return (
      <View>
        {this.props.tasks.length>0 &&            
          <TouchableOpacity onPress = {()=>{this.props.setDialog(this.props.tasks[0].start,this.props.tasks)}}>
            <View style={[{width:wp(this.props.width+'%'),justifyContent:'flex-start',alignItems:'flex-start',height:wp(this.props.height+'%'),borderWidth:wp('0.5%'),borderColor:'#EFEFEF'},{backgroundColor:this.props.tasks.length>0?'#8CC63F':'rgba(0,0,0,0)'}]}></View>
          </TouchableOpacity>
        }
        {this.props.tasks.length==0 &&            
          <View style={[{width:wp(this.props.width+'%'),justifyContent:'flex-start',alignItems:'flex-start',height:wp(this.props.height+'%'),borderWidth:wp('0.5%'),borderColor:'#EFEFEF'},{backgroundColor:this.props.tasks.length>0?'#8CC63F':'rgba(0,0,0,0)'}]}></View>
        }
      </View>
    )
  }
}
const hoursArray =  ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];