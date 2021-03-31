export default ActionPerformFunc = (nextScreen , navigation) => {
      if(nextScreen === 'back'){
         navigation.goBack();
      }
      else if(nextScreen.doingAction === 'doingAction'){
          nextScreen.action(nextScreen.item_id);
      }
      else if(nextScreen.flag === 'forward'){
          navigation.navigate(nextScreen.screen);
      }
    }
    