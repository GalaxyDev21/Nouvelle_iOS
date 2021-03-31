import React, { Component } from 'react'
import { View, Text,StyleSheet, TouchableHighlight } from 'react-native';
// import { createAnimatableComponent } from 'react-native-animatable';

// export default class TouchHandler extends Component{
//     state = {

//     }
//     render() {
//         return(
//             <ToucableOpacity
//             style={{height : 100 , width : 100, backgroundColor : 'green'}}
//             onPress={()=>console.log('onPress')}
//             onPressIn={()=>console.log('onPressIn')}
//             onPressOut={()=>console.log('onPressOut')}
//             delayPressIn={1000}
//           />
//         )
//     }
// }
//import { Tooltip} from 'react-native-elements';
import Tooltip from 'react-native-walkthrough-tooltip';
 

export default class ToolTipTest extends Component{
    state = {
        toolTipVisible : false
    }
    render(){
        return(
            <View style={styles.container}>
              <Tooltip
               // animated
                  isVisible={this.state.toolTipVisible}
                  content={<Text>Check this out!</Text>}
                  placement="top"
                  onClose={() => this.setState({ toolTipVisible: false })}
               >
                 <TouchableHighlight style={styles.touchable} onPress={()=>this.setState({toolTipVisible : true})}>
                   <Text>Press me</Text>
                 </TouchableHighlight>
            </Tooltip>
            
                {/* <Tooltip popover={<Text>Info here</Text>} placement="top" containerStyle={{elevation : 5}}>
                    <Image source={require('./assets/icon_messageButton.png')} style={{height : 40, width : 40, resizeMode : 'contain'}}/>
                </Tooltip> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        justifyContent : 'center' ,
        alignItems : 'center'
    },
    touchable : {
      height : 50,
      width : 75 ,
      backgroundColor : 'green',
      justifyContent : 'center' ,
      alignItems : 'center' ,
      borderRadius : 40 ,
      elevation : 15
    },
    iconInMessageButton : {
        height : 40 ,
        width : 40 ,
        borderRadius : 50
    },
    iconInMessageButtonAfterPressed : {
        height :40 ,
        width : 40,
        borderRadius : 50
    },
})


