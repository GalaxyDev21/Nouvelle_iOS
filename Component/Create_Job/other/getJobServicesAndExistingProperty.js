import ShowBar from '../../validations/messageBar' ;
export default getAvailableServices =async (url, token, message) => {
    await fetch(url, { 
       method: 'get', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token,
        })
      }).then((response) => response.json())
        .then((res)=>{
          if(res.code === 201){
            ShowBar(message , 'warning');
          }
          else if(res.code === 200){
            return res.content;
          }
        });
  }
//   const mapStateToProps = state => ({
//     userToken : state.createJob.userLoginToken ,
//     });
//     export default connect(mapStateToProps, {storeServiceForCreateJob})(getAvailableServices);