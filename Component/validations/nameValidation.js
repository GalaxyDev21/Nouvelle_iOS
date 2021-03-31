 export default nameValidation =  (text) => {
        if(text.length === 0){
          return '';
        }
      else if(text.includes(' ')){
          return 'Name should not have spaces';
      }
      else{
        return '';
        }
    }