export default phoneValidation = (text) => {
    if(text.length === 0){
        return '';
     }
     else if(text.match(/[^0-9]+/)){
        return 'Invalid Character';                 
       }
      else if(text.length < 9){
        return 'Phone number must be at least 9 characters';
      }
         else{
           return '';
         }
     };