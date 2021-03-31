import { USER_TOKEN,
    STORE_ROLE_ID_USERNAME,
    PROPERTY_TYPE,  
    NEW_PROPERTY, 
    CHOOSE_SERVICE, 
    CHOOSE_DATE, 
    CHOOSE_TIME, 
    CHOOSE_AREA, 
    INFO_ABOUT_JOB,
    GET_JOB_SERVICE,
    GET_USER_DETAILS,
    DELETE_PROPERTY,
    EDIT_SPECIFIC_PROPERTY,
    EDIT_PROPERTY_DETAILS,
    GET_PROPERTY_CALENDAR_URL,
    GET_COUNTRIES_STATES,
    PUT_NEW_PROEPRTY_IN_EXISTING_LIST,
    FALSE_DELETE_FLAG,
    CHANGE_EDIT_PROPERTY_DETAILS_IN_EXISTING_LIST,
    COPY_NEW_CHECKLIST_IN_EXISTING_CHECKLIST,
    DELETE_SELECTED_CHECKLIST_FROM_EXISTING_CHECKLIST,
    STORE_NEW_CHECKLIST_IN_EXISTING_CHECKLIST,
    GET_PROFILE_DETAILS,
    UPLOAD_IMAGE,
    GET_UPLOADED_IMAGES,
    STORE_UPLOADED_IMAGES,
    GET_HOST_WORKSPACE,
    GET_SAMPLE_WORK_OF_CONTRACTOR,
    GET_REVIEWS_FOR_CONTRACTOR,
    IS_MORE_CONTRACTORS_LOADED,
    IS_MORE_FIND_JOBS_LOADED,
    GET_CONTRACTOR_WORKSPACE,
    GET_PAYMENT_DETAILS,
    GET_SPECIFIC_CHECKLIST_DETAIL,
    EDIT_CHECKLIST_TITLE,
    GET_PASSPORT_IMAGES,
    GET_DASHBOARD_STATS,
    RESET_CHECKLIST_NOT_DELETED_FLAG,
    DELETE_JOB,
    DELETE_PENDING_INVITATION,
    RESET_DELETE_PROPERTY_FLAG
} from './actionType';
import ShowBar from '../../Component/validations/messageBar' ;
import {server} from '../server';

export const StoreTokenNumber = (tokenNo) => ({
    type: USER_TOKEN,
    payload: tokenNo
});
export const store_Role_Id_And_Name = (obj) => ({
    type: STORE_ROLE_ID_USERNAME,
    payload: obj
});
export const SetPropertyType = (propertyType) => ({
    type: PROPERTY_TYPE,
    payload: propertyType
});
export const AddProperty = (newProperty) => ({
    type: NEW_PROPERTY,
    payload: newProperty
});
export const ChooseService = (service) => ({
    type: CHOOSE_SERVICE,
    payload: service
});
export const ChooseDate = (date) => ({
    type: CHOOSE_DATE,
    payload: date
});  
export const ChooseTime = (times) => ({
    type: CHOOSE_TIME,
    payload: times
});
export const ChooseArea = (area) => ({
    type: CHOOSE_AREA,
    payload: area
});
export const MoreInfoAboutJob = (info) => ({
    type: INFO_ABOUT_JOB,
    payload: info
});
export const EditPropertyDetail = (details) => ({
    type: EDIT_PROPERTY_DETAILS,
    payload: details
});
export const AddNewPropertyInExistngArray = (propertyObj) => ({
    type: PUT_NEW_PROEPRTY_IN_EXISTING_LIST,
    payload: propertyObj
});
export const FalseDeleteFlag = () => ({
    type: FALSE_DELETE_FLAG,
    payload: false
});
export const FalseLoader = (actionType) => ({
    type: actionType,
    payload: false
});
export const ChangeDetailsInExistingPropertyList = (details) => ({
    type: CHANGE_EDIT_PROPERTY_DETAILS_IN_EXISTING_LIST,
    payload: details
});
export const CopyNewChecklistInAllChecklistData = (newItemName, id)  => ({
    type: COPY_NEW_CHECKLIST_IN_EXISTING_CHECKLIST,
    payload: {newItemName, id}
});
export const EditChecklistTitle = (title, id)  => ({
    type: EDIT_CHECKLIST_TITLE,
    payload: {title , id}
});
export const ResetCheckListNotDeletedFlag = ()  => ({
    type: RESET_CHECKLIST_NOT_DELETED_FLAG,
    payload: false
});
export const DeleteSelectedChecklistFromAllChecklistData = (token, formData , id)  => async dispatch => {
    await fetch(server+'delete_check_list', { 
        method: 'post', 
         headers: new Headers({
           'Authorization': 'Bearer '+ token, 
         }),
          body : formData
       }).then((response) => response.json())
         .then((res)=>{
             if(res.code === 201){
                ShowBar('Sorry, Unable to delete checklist' , 'error');
                dispatch({
                    type: DELETE_SELECTED_CHECKLIST_FROM_EXISTING_CHECKLIST,
                    payload: 'error'
                })
             }
             else{
                ShowBar('Your Checklist has been deleted successfully' , 'success');
                dispatch({
                    type: DELETE_SELECTED_CHECKLIST_FROM_EXISTING_CHECKLIST,
                    payload: {Res : res , ID : id}
                })
             }     
         }).catch(error=>{
            dispatch({
                type : DELETE_SELECTED_CHECKLIST_FROM_EXISTING_CHECKLIST,
                payload : 'error'
            })
       })
};
export const GetSpecificChecklistDetails = (token, formData) => async dispatch  => {
    await fetch(server+'get_check_list_details',{
        method: 'post', 
        headers: new Headers({
            'Authorization': 'Bearer '+ token, 
        }),
          body : formData
        })
        .then((response) => response.json())
        .then((res)=>{
            dispatch({
                type: GET_SPECIFIC_CHECKLIST_DETAIL,
                payload: res
            }) 
        }).catch(error=>{
            dispatch({
                type : GET_SPECIFIC_CHECKLIST_DETAIL,
                payload : 'error'
            })
    })
};
export const StoreNewChecklistInAllChecklistData = (obj) => ({
    type: STORE_NEW_CHECKLIST_IN_EXISTING_CHECKLIST,
    payload: obj
});
export const StoreUploadedImages = (image) => ({
    type: STORE_UPLOADED_IMAGES,
    payload: image
});
export const GetJobService = () => async dispatch  => {
    await fetch(server+'get_job_services',{
        method: 'post',
       })
         .then((response) => response.json())
         .then((res)=>{
                dispatch({
                    type: GET_JOB_SERVICE,
                    payload: res
                })
         }).catch(error=>{
            dispatch({
                type : GET_JOB_SERVICE,
                payload : 'error'
            })
       })
};
export const GetPropertyCalenderURL = (token, formData) => async dispatch  => {
    await fetch(server+'get_calendar_url', { 
        method: 'post', 
         headers: new Headers({
           'Authorization': 'Bearer '+ token, 
         }),
         body : formData
       }).then((response) => response.json())
         .then((res)=>{
            if(res.code === 200){
                dispatch({
                    type: GET_PROPERTY_CALENDAR_URL,
                    payload: res
                })
               }
            else if(res.code === 201){
              ShowBar('no calendar url found' , 'warning');
            }
         }).catch(error=>{
            dispatch({
                type : GET_PROPERTY_CALENDAR_URL,
                payload : 'error'
            })
       })
};
export const getUserDetails = (token) => async dispatch => {
  await fetch(server+'get_user', { 
        method: 'POST', 
        headers: new Headers({
          'Authorization': 'Bearer '+token, 
        })
      }).then((response) => response.json())
      .then((res)=>{
        dispatch({
            type: GET_USER_DETAILS,
            payload: {data:res, token: token}
        })
      }).catch(error=>{
           dispatch({
               type:GET_USER_DETAILS,
               payload: 'error'
           })
      });
};
export const DeleteProperty = (token, formData , id) => async dispatch  => {
    await fetch(server+'delete_property', { 
        method: 'post', 
         headers: new Headers({
           'Authorization': 'Bearer '+ token, 
         }),
          body : formData
       }).then((response) => response.json())
         .then((res)=>{
             console.log(res);
             if(res.code === 201){
                ShowBar('Sorry, Unable to delete property' , 'error');
                dispatch({
                    type: DELETE_PROPERTY,
                    payload: 'error'
                })
             }
             else{
                dispatch({
                    type: DELETE_PROPERTY,
                    payload: {Res : res , ID : id}
                })
             }     
         }).catch(error=>{
            dispatch({
                type : DELETE_PROPERTY,
                payload : 'error'
            })
        })
};
export const ResetDeletePropertyFlag = () => ({
    type : RESET_DELETE_PROPERTY_FLAG,
    payload : false
});
export const GetPropertyDetails = (token , formData) => async dispatch  => {
    await fetch(server+'property_details',{ 
        method: 'post', 
         headers: new Headers({
           'Authorization': 'Bearer '+ token, 
         }),
         body :  formData
       }).then((response) => response.json())
         .then((res)=>{
            //  console.log(' Get property details ');
            //  console.log(res);
                dispatch({
                    type: EDIT_SPECIFIC_PROPERTY,
                    payload: res
                })
         }).catch(error=>{
            dispatch({
                type : EDIT_SPECIFIC_PROPERTY,
                payload : 'error'
            })
       })
};
export const GetCountriesAndStates = () => async dispatch  => {
    await fetch(server+'get_country_state',{
        method: 'get',
       })
         .then((response) => response.json())
         .then((res)=>{
                dispatch({
                    type: GET_COUNTRIES_STATES,
                    payload: res
                })
         }).catch(error=>{
            dispatch({
                type : GET_COUNTRIES_STATES,
                payload : 'error'
            })
       })
};
export const GetProfileDetails = (token) => async dispatch  => {
    await fetch(server+'get_profile_details',{
        method: 'post', 
        headers: new Headers({
            'Authorization': 'Bearer '+ token, 
        })
        })
        .then((response) => response.json())
        .then((res)=>{
            dispatch({
                type: GET_PROFILE_DETAILS,
                payload: res
            }) 
        }).catch(error=>{
            dispatch({
                type : GET_PROFILE_DETAILS,
                payload : 'error'
            })
    })
};
export const UploadImage = (token, file, image) => async dispatch  => {
    await fetch(server+'upload_profile_picture', {
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : file
    })
    .then((response) => response.json())
    .then(res => {
        if(res.code === 200){
            ShowBar('Image Uploaded Successfully' , 'success');
            dispatch({
                type: UPLOAD_IMAGE,
                payload: {image, id: res.data.Image_id}
            });
        }
        else{
            dispatch({
                type: UPLOAD_IMAGE,
                payload: 'error'
            })  
        }
    }).catch(error => {
        dispatch({
            type : UPLOAD_IMAGE,
            payload : 'error'
        })
    })
};
export const GetUploadImages = (token) => async dispatch  => {
    await fetch(server+'get_profile_pictures',{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
      })
        .then((response) => response.json())
        .then((res)=>{
            dispatch({
                type: GET_UPLOADED_IMAGES,
                payload: res.data
            })
        }).catch(error=>{
            dispatch({
                type : GET_UPLOADED_IMAGES,
                payload : 'error'
            })
    })
};
export const moreContractorsLoaded = () => ({
    type: IS_MORE_CONTRACTORS_LOADED,
    payload: false
});
export const GetHostWorkSpace = (token, formData) => async dispatch  => {
    await fetch(server+'workspace_host',{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : formData
      })
        .then((response) => response.json())
        .then((res)=>{
                dispatch({
                    type: GET_HOST_WORKSPACE,
                    payload: res
                })
        }).catch(error=>{
            dispatch({
                type : GET_HOST_WORKSPACE,
                payload : 'error'
            })
    })
};
export const GetContractorWorkSpace = (token, formData) => async dispatch  => {
    await fetch(server+'workspace_contractor',{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : formData
      })
        .then((response) => response.json())
        .then((res)=>{
                dispatch({
                    type: GET_CONTRACTOR_WORKSPACE,
                    payload: res
                })
        }).catch(error=>{
            dispatch({
                type : GET_CONTRACTOR_WORKSPACE,
                payload : 'error'
            })
    })
};
export const GetSampleWorkImages = (token, formData) => async dispatch  => {
    await fetch(server+'get_sample_work',{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : formData
      })
        .then((response) => response.json())
        .then((res)=>{
            dispatch({
                type: GET_SAMPLE_WORK_OF_CONTRACTOR,
                payload: res
            })
        }).catch(error=>{
            dispatch({
                type : GET_SAMPLE_WORK_OF_CONTRACTOR,
                payload : 'error'
            })
    })
};
export const GetContractorsReviews = (token, formData) => async dispatch  => {
    await fetch(server+'get_reviews',{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : formData
      })
        .then((response) => response.json())
        .then((res)=>{
            dispatch({
                type: GET_REVIEWS_FOR_CONTRACTOR,
                payload: res
            })
        }).catch(error=>{
            dispatch({
                type : GET_REVIEWS_FOR_CONTRACTOR,
                payload : 'error'
            })
    })
};
export const moreFindJobsLoaded = () => ({
    type: IS_MORE_FIND_JOBS_LOADED,
    payload: false
});
export const GetData = (api, actionType, token, formData) => async dispatch  => {
    const offset = formData._parts[0][1];
    await fetch(server+api,{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : formData
      })
        .then((response) => response.json())
        .then((res)=> {
            dispatch({
                type: actionType,
                payload: {res, offset}
            })
        }).catch(error=>{
            dispatch({
                type : actionType,
                payload : 'error'
            })
    })
};
export const getPaymentAccountDetails = (token, formData) => async dispatch  => {
    await fetch(server+'check_accept_bid', {
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
        body : formData
    })
    .then((response) => response.json())
    .then((res)=>{
        dispatch({
            type: GET_PAYMENT_DETAILS,
            payload: res
        })
    }).catch(error => {
        dispatch({
            type : GET_PAYMENT_DETAILS,
            payload : 'error'
        })
    })
};
export const GetPassportImages = (token) => async dispatch  => {
    await fetch(server+'get_passport_images',{
        method: 'post', 
        headers: new Headers({
          'Authorization': 'Bearer '+ token, 
        }),
      })
        .then((response) => response.json())
        .then((res)=>{
            dispatch({
                type: GET_PASSPORT_IMAGES,
                payload: res
            })
        }).catch(error=>{
            dispatch({
                type : GET_PASSPORT_IMAGES,
                payload : 'error'
            })
    })
};
export const GetDashboardStats = (token) => async dispatch  => {
    await fetch(server+'get_dashboard_stats',{
        method: 'post', 
        headers: new Headers({
            'Authorization': 'Bearer '+ token, 
        })
    })
    .then((response) => response.json())
    .then((res)=>{
        dispatch({
            type: GET_DASHBOARD_STATS,
            payload: res
        }) 
    }).catch(error=>{
        dispatch({
            type : GET_DASHBOARD_STATS,
            payload : 'error'
        })
    })
};
export const DeleteJob = (id) => ({
    type : DELETE_JOB,
    payload : id
});
export const DeleteInvitation = (id) => ({
    type : DELETE_PENDING_INVITATION,
    payload : id
});

//   await fetch(server+'get_profile_pictures',{
            //     method: 'post', 
            //     headers: new Headers({
            //     'Authorization': 'Bearer '+ token, 
            //     }),
            //   })
            //    .then((response) => response.json())
            //    .then((res)=>{
            //      ShowBar('Image Uploaded Successfully' , 'success');
            //      dispatch({
            //        type: UPLOAD_IMAGE,
            //        payload: res.data
            //      });
            //    })