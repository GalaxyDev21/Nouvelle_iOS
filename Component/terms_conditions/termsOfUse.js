import React ,{Component} from 'react';
import { StyleSheet, Text, View ,ImageBackground,} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CustomStatusBar from '../InputFields/statusBar';

export default class TermsOfUse extends Component{
    constructor(props){
        super(props);
        this.state = {
          text : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }
      }
    render(){
        return(
            <View style={styles.container}>
              <CustomStatusBar title='Terms Of Use' isIconDisplay={true} navigation={this.props.navigation} marginValue={hp('2%')}/>
                <View style={{flex : 1, padding : wp('3%')}}>
                  <Text style={{fontSize : 16, color : '#292929'}}>{this.state.text}</Text>
                </View>
           </View>
        )
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
     },
  });

