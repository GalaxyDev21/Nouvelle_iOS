import {server} from '../../Redux/server'
export default apiCall = async(formData) => {
    try{
      const res = await axios.post(server+'login', formData);
          if(res.data.code === 201) {
             ShowBar(res.data.message , 'error');
           }
            else if(res.data.code === 200){
              this.moveToDashBoard(res.data.data.roles, res.data.data.co_host, res.data.data.token);
           }
    }
    catch(error){
      console.log(error);
    }
   }