import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage, Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ContractorIntro from './contractorIntro' ;
import MessageButtons from './messageButtons' ;

export default class About extends Component{
  render(){
    const description = this.props.details.description.replace(/(<([^>]+)>)/g, "");
    const timing = this.props.details.work_experience.length > 0 ? this.props.details.work_experience[0] : [];
    return(
      <View style={{flex : 1}}>
        <ContractorIntro details = {this.props.details}/>
          <View style={styles.personalDetails}>
            <ScrollView>
              <View style = {styles.infoView}>
                <Text style={{color : '#0071bc', fontSize:20, marginBottom : hp('1%')}}>About Pro</Text>
                  <Text style={{color : '#292929',  fontSize:14}}>{description}</Text>
                </View>
                <View style = {styles.infoView}>
                  <Text style={{color : '#0071bc', fontSize:(20), marginBottom : hp('1%')}}>Business Hours</Text>
                    {
                      timing.map((item , index) => <BusinessHours item = {item} key = {index}/>)
                    }
                </View>
                <View style = {styles.skillsExpertise}>
                  <Text style={{color : '#0071bc', fontSize:(20), marginBottom : hp('1%')}}>Skills / Expertise</Text>
                  <View style={{flexWrap : 'wrap' ,  height : 'auto'}}>
                    {
                      this.props.details.project_category.map((item , index) => <Skills item = {item} key = {item.term_id}/>)
                    }
                  </View>
                </View>
            </ScrollView>
          </View>
          {
            (this.props.roleIdUserName.role === 'employer' || this.props.roleIdUserName.coHost === 'yes') && <MessageButtons navigation = {this.props.navigation} details={this.props.details} roleIdUserName={this.props.roleIdUserName}/> 
          }
      </View>
    )
  }
}

function Skills(props) {
  return(
    <View style={{flexDirection : 'row', marginRight : wp('2%') }}>
      <Image source = {require('../../../assets/toward_Right.jpg')} style={{height : hp('2%'), width : hp('2%'), resizeMode : 'contain'}}/>
      <Text style={{color : '#292929', fontSize:(14)}}>{props.item.name}</Text>
    </View>
  )
}
function BusinessHours(props) {
  return(
    <Text style={{color : '#292929', fontSize:(14)}}> {props.item.title} {`${props.item.m_from} - ${props.item.m_to}`}</Text>
  )
}
const styles = StyleSheet.create({
  personalDetails : {
    flex : 1 ,
    padding : 10 ,
    backgroundColor : '#f4f4f4' ,
  },
  infoView : {
    height : 'auto' ,
    backgroundColor : '#ffffff' ,
    padding : hp('2%') ,
    marginBottom : hp('2%') ,
    borderRadius : 3 ,
  },
  skillsExpertise : {
    backgroundColor : '#ffffff' ,
    padding : hp('2%') ,
    marginBottom : hp('2%') ,
    borderRadius : 3 ,
  }
});
