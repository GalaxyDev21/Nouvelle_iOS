import React ,{Component} from 'react';
import {View} from 'react-native';
import EditPropertyGeneralScreen_1 from './editPropertyGeneral_1';
import EditPropertyGeneralScreen_2 from './editPropertyGeneral_2';

class BothGeneralScreens extends Component{
    constructor(props){
      super(props);
        this.state ={
          isGeneralScreenSwitch : false
        }
    }
    switchScreen = () => {
      this.setState({isGeneralScreenSwitch : !this.state.isGeneralScreenSwitch ? true : false})
    }
    render(){
      return(
        <View style={{flex : 1}}>
          {
            !this.state.isGeneralScreenSwitch && <EditPropertyGeneralScreen_1 switchScreen = {this.switchScreen} navigation = {this.props.navigation} propertyId = {this.props.propertyId}/>
          }
          {
            this.state.isGeneralScreenSwitch && <EditPropertyGeneralScreen_2 switchScreen = {this.switchScreen} navigation = {this.props.navigation} propertyId = {this.props.propertyId}/>
          }  
        </View>
      )
    }
}
export default BothGeneralScreens;