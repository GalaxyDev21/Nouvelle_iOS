export default ZipCodeValidation = (text) => {
    if(text.length === 0){
        return '';
     }
     else if(text.match(/[^0-9]+/)){
        return 'invalid Character';                 
       }
      else if(text.length < 5){
        return 'zip code must be at least 5 characters';
      }
         else{
           return '';
         }
     };