import React ,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, ImageBackground, TouchableOpacity,FlatList, ActivityIndicator} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {  } from "react-native-responsive-fontsize";
import { Icon } from 'react-native-elements';
import StatusBar from '../InputFields/statusBar' ;
import ActionPerformFunc from '../InputFields/actionPerform';
import TouchButton from '../InputFields/touchButton';

      export default class DropDown extends Component {
            constructor(props) {
              super(props);
                this.state = {
                  placeholder : this.props.placeholder,
                  isOpen : false,
                  dropDownNotification : '', 
                }
            }
            render(){
              return(
                <View style={[{elevation : 5, width : this.props.width, height : this.props.height, position : 'absolute', top : hp('9%'), right : wp('2%'), backgroundColor: '#ffffff', borderRadius : wp('2%'), borderWidth : 1, borderColor : '#dfdfdf'}, Platform.OS === 'ios'?{zIndex : 9999}:{}]}>
                  <ScrollView nestedScrollEnabled = {true}>
                    <FlatList
                      data={this.props.listShow}
                      keyExtractor={(item, index) => ""+ index}          
                      renderItem={({item , index}) =>  
                        <TouchableOpacity onPress={() => this.props.selectProperty(item.title)} style={{height:hp('6.5%') , flexDirection : 'row', alignItems : 'center', borderBottomWidth : 1, borderBottomColor : '#dfdfdf', paddingHorizontal : wp('3%')}}>
                          <Image source={item.image} style={{height : hp('2.5%'), width : hp('2.5%'), resizeMode : 'contain'}}/> 
                            <Text style={{fontFamily : 'Raleway-SemiBold' , color : '#292929' , fontSize : (18), padding : wp('2%'), marginLeft : wp('3%')}}>{this.props.isTitleChange && item.title === 'Highlight' ? 'Remove Highlight' : item.title}</Text>
                        </TouchableOpacity>
                        }     
                      />
                  </ScrollView>
                </View>
              )
           }
        }