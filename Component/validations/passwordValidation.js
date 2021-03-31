export default passwordValidation = (text) => {
    if(text.length === 0){
        return '';
      }
    else if(text.length < 6){
       return 'Password must be at least 6 characters';
    }
    else{
        return '';
      }
  };