import validator from 'validator';
export default EmailValidation = (text) => {
    if(text.length === 0){
       return '' ;
     }
    else if(validator.isEmail(text)){
        return '';
    }
    else{
        return 'Invalid Email';
    }
  }
