import { USER_TOKEN,
         STORE_ROLE_ID_USERNAME,
         PROPERTY_TYPE,
         CHOOSE_SERVICE, 
         CHOOSE_DATE, 
         CHOOSE_TIME, 
         CHOOSE_AREA, 
         INFO_ABOUT_JOB, 
         NEW_PROPERTY, 
         EXISTING_PROPERTY,
         IS_MORE_EXISTING_PROPERTY_LOADED,
         GET_JOB_SERVICE,
         GET_USER_DETAILS,
         DELETE_PROPERTY,
         EDIT_SPECIFIC_PROPERTY,
         EDIT_PROPERTY_DETAILS,
         GET_PROPERTY_TEAM,
         GET_PROPERTY_CALENDAR_URL,
         IS_MORE_PROPERTY_TEAM_LOADED,
         GET_COUNTRIES_STATES,
         PUT_NEW_PROEPRTY_IN_EXISTING_LIST,
         MATCHES_CONTRACTORS,
         FALSE_DELETE_FLAG,
         FALSE_PROPERTY_LIST_FLAG,
         CHANGE_EDIT_PROPERTY_DETAILS_IN_EXISTING_LIST,
         COPY_NEW_CHECKLIST_IN_EXISTING_CHECKLIST,
         DELETE_SELECTED_CHECKLIST_FROM_EXISTING_CHECKLIST,
         STORE_NEW_CHECKLIST_IN_EXISTING_CHECKLIST,
         GET_PROFILE_DETAILS,
         FALSE_PROFILE_DETAILS_FLAG,
         UPLOAD_IMAGE,
         GET_UPLOADED_IMAGES,
         STORE_UPLOADED_IMAGES,
         GET_MY_JOBS,
         FALSE_MY_JOBS_FLAG,
         GET_MATCHES_CONTRACTORS_OF_HOST_JOB,
         IS_MORE_MATCHES_CONTRACTORS_OF_HOST_JOB_LOADED,
         FALSE_GET_MATCHES_CONTRACTORS_OF_HOST_JOB_FLAG,
         GET_THOSE_CONTRTACTORS_WHOSE_BID_ON_JOB,
         GET_HOST_WORKSPACE,
         FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG,
         GET_SAMPLE_WORK_OF_CONTRACTOR,
         GET_REVIEWS_FOR_CONTRACTOR,
         IS_MORE_CONTRACTORS_LOADED,
         GET_ALL_FIND_JOBS_LIST,
         FALSE_ALL_FIND_JOBS_LIST_FLAG,
         IS_MORE_FIND_JOBS_LOADED,
         IS_MORE_BIDDING_CONTRACTORS_LOADED,
         GET_HOST_TEAM,
         FALSE_HOST_TEAM_LOADER,
         IS_MORE_HOST_TEAM_LOADED,
         GET_CONTRACTOR_MY_JOBS,
         FALSE_CONTRACTOR_MY_JOB_LOADER,
         IS_MORE_CONTRACTOR_MY_JOB_LOADED,
         GET_CONTRACTOR_WORKSPACE,
         GET_PAYMENT_DETAILS,
         FALSE_HOST_CHECKLISTS_FLAG,
         IS_MORE_HOST_CHECKLISTS_LOADED,
         GET_HOST_CHECKLISTS,
         GET_HOST_SAMPLE_CHECKLISTS,
         IS_MORE_HOST_SAMPLE_CHECKLISTS_LOADED,
         GET_SPECIFIC_CHECKLIST_DETAIL,
         IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED,
         EDIT_CHECKLIST_TITLE,
         FALSE_CO_HOST_LOADER,
         IS_MORE_CO_HOST_LOADED,
         GET_CO_HOST,
         GET_PROPERTY_CHECKLIST,
         IS_MORE_PROPERTY_CHECKLIST_LOADED,
         GET_PASSPORT_IMAGES,
         FASLE_GET_PASSPORT_IMAGES_FLAG,
         FALSE_DASHBOARD_STATS_FLAG,
         GET_DASHBOARD_STATS,
         FALSE_FILTER_LOADER,
         FALSE_FIND_JOB_FILTER_LOADER,
         FALSE_MY_CO_HOST_LOADER,
         GET_MY_CO_HOST,
         IS_MORE_MY_CO_HOST_LOADED,
         RESET_CHECKLIST_NOT_DELETED_FLAG,
         DELETE_JOB,
         GET_PENDING_INVITATION,
         FALSE_PENDING_INVITATION_FLAG,
         IS_MORE_PENDING_INVITATION_LOADED,
         DELETE_PENDING_INVITATION,
         RESET_DELETE_PROPERTY_FLAG,
         FALSE_CLEANERS_LIST_FLAG,
         GET_CLEANERS_LIST,
         IS_MORE_CLEANERS_LOADED
         } from './actionType';
         import moment from 'moment-timezone';

const initialState = {
  userName : '',
  roleIdUserName : {},
  userLoginToken : '',
  user : {},
  servicesForCreateJobWithId : [],
  existingPropertyCount : 0,
  existingProperty :[],
  isExistingProperty : false,
  isMoreExistingPropertyLoaded : true,
  propertyTeamCount :  0,
  propertyTeam : [],
  ispropertyTeamLoaded : false,
  isMorePropertyTeamLoaded : true,
  propertyCalendarURL : [],
  isPropertyCalendarURLLoaded : false,
  isPropertyDeleted : false,
  isErrorOccuredInDelete : false,
  specificPropertyDetail : {},
  isPropertyDetailLoaded : false,
  countries : [],
  states : [],
  matchesContractors : [],
  isMatchesContractorsLoaded : false,
  editPropertyDetails : {},
  profileDetails : {},
  isProfileDetailsLoaded : false,
  uploadedImages : [],
  isImagesLoaded : false,
  isImageUploaded : false,
  hostCreatedJobCount : 0,
  hostMyJobs : [],
  isHostMyJobsLoaded : false,
  matchesContractorsOfHostJobCount : 0,
  matchesContractorsOfHostJob : [],
  ismatchesContractorsOfHostJobLoaded : false,
  isMoreMatchesContractorsOfHostJobLoaded : true,
  biddingContractorsOfHostJobCount : 0,
  biddingContractorsOfHostJob : [],
  isbiddingContractorsOfHostJobLoaded : false,
  isMoreBiddingContractorsLoaded : true,
  hostWorkSpace : {},
  contractorWorkSpace : {},
  sampleWorkImages : [],
  sampleWorkImagesCount : 0,
  isSampleWorkImagesLoaded : false,
  reviewsForContractor : [],
  isReviewsForContractorLoaded : false,
  isMoreContractorsLoaded : true,
  findJobsListCount : 0,
  findJobsList : [],
  isFindJobListLoaded : false,
  isMoreFindJobsLoaded : true,
  hostTeamCount : 0,
  hostTeam : [],
  isHostTeamLoaded : false,
  isMoreHostTeamLoaded : true,
  hostChecklistCount : 0,
  hostChecklists : [],
  checkListNotDeleted : false,
  isHostChecklistsLoaded : false,
  isMoreHostChecklistsLoaded : true,
  hostSampleChecklistsCount : 0,
  hostSampleChecklists : [],
  isHostSampleChecklistsLoaded : false,
  isMoreHostSampleChecklistsLoaded : true,
  checklistDetail : {},
  ischecklistDetailLoaded : false,
  contractorJobsCount : 0,
  contractorJobList : [],
  isContractorJobListLoaded : false,
  isMoreContractorJobLoaded : true,
  paymentAccoutDetails : {},
  isPaymentAccountDetailsLoaded : false,
  coHostListCount : 0,
  coHostList :[],
  isCoHostListLoaded : false,
  isMoreCoHostListLoaded : true,
  propertyChecklistsCount :  0,
  propertyChecklists : [],
  isPropertyChecklistsLoaded : false,
  isMorePropertyChecklistsLoaded : true,
  passportImages : {},
  isPassportImagesLoaded : false,
  dashboardStats : {},
  isDashboardStatsLoaded : false,
  isCoHostFilterLoaded : false,
  isFindJobFilterLoaded : false,
  myCoHostListCount : 0,
  myCoHostList :  [],
  isMyCoHostListLoaded : false,
  isMoreMYCoHostListLoaded : true,
  pendingInvitationListCount : 0,
  pendingInvitationList : [],
  isPendingInvitationListLoaded : false,
  isMorePendingInvitationListLoaded : true,
  cleanersListCount : 0,
  cleanersList : [],
  isCleanersListLoaded : false,
  isMoreCleanersListLoaded : true,
  jobInformation: {
    date : '' ,
    infoAboutJob : '',
    property : '',
    propertyType : '',
    selectedArea : '',
    serviceDetails : '' ,
    time : [],   
  },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_TOKEN: 
      state.userLoginToken = action.payload ;
      return {
        ...state ,
        userLoginToken : state.userLoginToken
      };
    
    case STORE_ROLE_ID_USERNAME: 
      return {
        ...state ,
        roleIdUserName : action.payload
      };
    case PROPERTY_TYPE: 
      state.jobInformation.propertyType = action.payload;
      return {
        ...state ,
        jobInformation : state.jobInformation
      };
    
    case NEW_PROPERTY: 
      state.jobInformation.property = action.payload;
      return {
        ...state ,
        jobInformation : state.jobInformation
      };
        
    case EXISTING_PROPERTY:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.existingProperty = [...action.payload.res.data.data];
        }
        else{
          state.existingProperty = [... state.existingProperty, ...action.payload.res.data.data]
        } 
      }
      return {
        ...state ,
        existingPropertyCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        existingProperty : action.payload !== 'error' ? state.existingProperty : [],
        isExistingProperty : action.payload === 'error' ? false : true,
      };
    case IS_MORE_EXISTING_PROPERTY_LOADED:
      return{
        ...state,
        isMoreExistingPropertyLoaded : action.payload,
      };

    case GET_PROPERTY_TEAM:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.propertyTeam = [...action.payload.res.data.Data];
        }
        else{
          state.propertyTeam = [... state.propertyTeam, ...action.payload.res.data.Data]
        } 
      }
      return {
        ...state ,
        propertyTeamCount : action.payload !== 'error' ? action.payload.res.data.Count : 0,
        propertyTeam : action.payload !== 'error' ? state.propertyTeam : [],
        ispropertyTeamLoaded : action.payload === 'error' ? false : true,
        isMorePropertyTeamLoaded : action.payload === 'error' ? false : true,
      };
    case IS_MORE_PROPERTY_TEAM_LOADED:
      return{
        ...state,
        isMorePropertyTeamLoaded : action.payload,
      };

    case GET_PROPERTY_CALENDAR_URL:
      return {
        ...state ,
        propertyCalendarURL : action.payload !== 'error' ? action.payload.data : [],
        isPropertyCalendarURLLoaded : action.payload === 'error' ? false : true,
      };
        
    case FALSE_PROPERTY_LIST_FLAG:
      return {
        ...state ,
        isExistingProperty : action.payload,
      };

    case CHANGE_EDIT_PROPERTY_DETAILS_IN_EXISTING_LIST:
      const tempArr = state.existingProperty.slice();
      const index = tempArr.findIndex(checkIndex);
        function checkIndex(obj){
          return obj.ID === action.payload.ID ;
        }
        tempArr[index] = action.payload;
        return {
          ...state ,
          existingProperty : tempArr,
        };
          
    case CHOOSE_SERVICE: 
      state.jobInformation.serviceDetails = action.payload ;
      return {
        ...state ,
        jobInformation : state.jobInformation
      };
          
    case CHOOSE_DATE:
      state.jobInformation.date = action.payload ;
      return {
        ...state,
          jobInformation : state.jobInformation
      };
          
    case CHOOSE_TIME:
      state.jobInformation.time = action.payload
      return {
        ...state,
        jobInformation : state.jobInformation    
      };  
         
    case CHOOSE_AREA:
      state.jobInformation.selectedArea = action.payload ;
        return {
          ...state,
          jobInformation : state.jobInformation      
        };
         
    case INFO_ABOUT_JOB:
      state.jobInformation.infoAboutJob = action.payload ;
        return {
          ...state, 
          jobInformation : state.jobInformation    
        };
          
    case GET_JOB_SERVICE:
      return {
          ...state, 
          servicesForCreateJobWithId : action.payload !== 'error' ? action.payload.data : [],    
      };
          
    case MATCHES_CONTRACTORS:
      return {
        ...state,
        matchesContractors: action.payload !== 'error' ? action.payload : {},
        isMatchesContractorsLoaded : action.payload !== 'error' ? true : false,    
      };
               
    case FALSE_DELETE_FLAG:
      return {
        ...state,
        isMatchesContractorsLoaded: action.payload,   
      };
         
    case GET_USER_DETAILS:
      return{
        ...state,
        user: action.payload.data,
        userLoginToken: action.payload.token,
    };

    case RESET_DELETE_PROPERTY_FLAG:
      return{
        ...state,
        isErrorOccuredInDelete : action.payload
      };
    case DELETE_PROPERTY:
      let tempArr1 = [];
      if(action.payload !== 'error'){
        tempArr1 = state.existingProperty.slice();
        const index = tempArr1.findIndex(checkIndex);
        function checkIndex(obj){
          return obj.ID === action.payload.ID ;
        }
        tempArr1.splice(index, 1);
      }
      return{
        ...state,
        existingProperty: action.payload !== 'error' ? tempArr1 : state.existingProperty,
        isPropertyDeleted : action.payload !== 'error' ? true : false,
        isErrorOccuredInDelete : action.payload === 'error' ? true : false
      };
    case EDIT_SPECIFIC_PROPERTY:
      return{
        ...state,
          specificPropertyDetail : action.payload !== 'error' ? action.payload.data.property : {},
          isPropertyDetailLoaded : action.payload === 'error' ? false : action.payload.code === 200 ? true : false,
          countries : action.payload !== 'error' ? action.payload.data.countries : [],
          states : action.payload !== 'error' ? action.payload.data.states : [],
      };            
    case EDIT_PROPERTY_DETAILS:
      return{
        ...state,
        editPropertyDetails : action.payload
      };
            
    case GET_COUNTRIES_STATES:
      return{
        ...state,
        countries : action.payload !== 'error' ? action.payload.data.countries : [],
        states : action.payload !== 'error' ? action.payload.data.states : []
      };
         
    case PUT_NEW_PROEPRTY_IN_EXISTING_LIST:
      const tempArr2 = state.existingProperty.slice();
      tempArr2.unshift(action.payload);
      return{
        ...state,
        existingProperty : tempArr2
      };

    case COPY_NEW_CHECKLIST_IN_EXISTING_CHECKLIST:
      obj = {
        ID : action.payload.id,
        post_title : action.payload.newItemName,
        post_date : new Date()
      };
      const tempArr3 = state.hostChecklists.slice();
      tempArr3.unshift(obj);
      return{
        ...state,
        hostChecklists: tempArr3,
      };
    case DELETE_SELECTED_CHECKLIST_FROM_EXISTING_CHECKLIST:
      let tempArr4 = [];
      if(action.payload !== 'error'){
        tempArr4 = state.hostChecklists.slice();
        const index = tempArr4.findIndex(checkIndex);
          function checkIndex(obj){
            return obj.ID === action.payload.ID ;
          }
          tempArr4.splice(index, 1);
      }
      return{
        ...state,
        hostChecklists: action.payload !== 'error' ? tempArr4 : state.hostChecklists,
        checkListNotDeleted : action.payload === 'error' ? true : false,
      };
    case RESET_CHECKLIST_NOT_DELETED_FLAG:
      return{
        ...state,
        checkListNotDeleted : action.payload
      };
    case EDIT_CHECKLIST_TITLE:
      const index2 = state.hostChecklists.findIndex(checkIndex2);
      function checkIndex2(obj){
        return obj.ID === action.payload.id ;
      }
     const tempObj ={...state.hostChecklists[index2]};
      tempObj.post_title = action.payload.title ;
      state.hostChecklists[index2] = tempObj ; 
      return{
        ...state,
        hostChecklists : [...state.hostChecklists],
      };
    case STORE_NEW_CHECKLIST_IN_EXISTING_CHECKLIST:
      const tempArr5 = state.allChecklists.slice();
        tempArr5.push(action.payload);
        return{
        ...state,
        allChecklists : tempArr5
        };

    case GET_SPECIFIC_CHECKLIST_DETAIL:
      return{
          ...state,
          checklistDetail : action.payload !== 'error' ? action.payload.data: {},
          ischecklistDetailLoaded : action.payload !== 'error' ? true : false
      };
    case IS_GET_SPECIFIC_CHECKLIST_DETAIL_LOADED:
      return{
          ...state,
          ischecklistDetailLoaded : action.payload 
      };        
    case GET_PROFILE_DETAILS:
      return{
          ...state,
          profileDetails : action.payload !== 'error' ? action.payload: {},
          isProfileDetailsLoaded : action.payload !== 'error' ? true : false
      };
    case FALSE_PROFILE_DETAILS_FLAG:
      return{
        ...state,
        isProfileDetailsLoaded : action.payload,
        isImagesLoaded : false,
        isImageUploaded : false
      };
    //  (Math.max.apply(Math, tempSampleWorks.map(function(o) {return o.id; })))+1
    case UPLOAD_IMAGE:
      let tempSampleWorks = [];
      if(action.payload !== 'error'){{
        tempSampleWorks = [...state.uploadedImages];
        tempSampleWorks.push({id : action.payload.id , url: action.payload.image});
      }}
      return{
        ...state,
        uploadedImages : action.payload !== 'error' ? tempSampleWorks : state.uploadedImages,
        isImageUploaded : action.payload !== 'error' ? true : false
      };
    case GET_UPLOADED_IMAGES:
      return{
        ...state,
        uploadedImages : action.payload !== 'error' ? action.payload: [],
        isImagesLoaded : action.payload !== 'error' ? true : false
      }
    case STORE_UPLOADED_IMAGES:
      tempImgArr = [...state.uploadedImages];
      tempImgArr.push(action.payload);
      return{
        ...state,
        uploadedImages : tempImgArr
      };

    case FALSE_MY_JOBS_FLAG:
      return{
        ...state,
        isHostMyJobsLoaded : false
      };
    case GET_MY_JOBS:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.hostMyJobs = [...action.payload.res.data.data];
        }
        else{
          state.hostMyJobs = [... state.hostMyJobs, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        hostCreatedJobCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        hostMyJobs : action.payload !== 'error' ? state.hostMyJobs : [],
        isHostMyJobsLoaded : action.payload !== 'error' ? true : false,
        isMoreContractorsLoaded : action.payload !== 'error' ? true : false,
      };
    case DELETE_JOB:
      const index3 = state.hostMyJobs.findIndex(checkIndex3);
      function checkIndex3(obj){
        return obj.ID === action.payload ;
      }
      state.hostMyJobs.splice(index3, 1);
      return{
        ...state,
        hostMyJobs : [...state.hostMyJobs],
      };
    case IS_MORE_CONTRACTORS_LOADED:
      return{
        ...state,
        isMoreContractorsLoaded : action.payload,
      };
    case FALSE_GET_MATCHES_CONTRACTORS_OF_HOST_JOB_FLAG:
      return{
        ...state,
        ismatchesContractorsOfHostJobLoaded : action.payload,
        isbiddingContractorsOfHostJobLoaded : action.payload,
        isPropertyChecklistsLoaded : action.payload
      };
    case GET_MATCHES_CONTRACTORS_OF_HOST_JOB:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.matchesContractorsOfHostJob = [...action.payload.res.data.data];
        }
        else{
          state.matchesContractorsOfHostJob = [... state.matchesContractorsOfHostJob, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        matchesContractorsOfHostJobCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        matchesContractorsOfHostJob : action.payload !== 'error' ? state.matchesContractorsOfHostJob : [],
        ismatchesContractorsOfHostJobLoaded : action.payload !== 'error' ? true : false,
        isMoreMatchesContractorsOfHostJobLoaded : action.payload !== 'error' ? true : false,
      };
    case IS_MORE_MATCHES_CONTRACTORS_OF_HOST_JOB_LOADED:
      return{
        ...state,
        isMoreMatchesContractorsOfHostJobLoaded : action.payload,
      };
    case IS_MORE_BIDDING_CONTRACTORS_LOADED:
      return{
        ...state,
        isMoreBiddingContractorsLoaded : action.payload,
      };
    case GET_THOSE_CONTRTACTORS_WHOSE_BID_ON_JOB:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.biddingContractorsOfHostJob = [...action.payload.res.data.data];
        }
        else{
          state.biddingContractorsOfHostJob = [... state.biddingContractorsOfHostJob, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        biddingContractorsOfHostJobCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        biddingContractorsOfHostJob : action.payload !== 'error' ? state.biddingContractorsOfHostJob : [],
        isbiddingContractorsOfHostJobLoaded : action.payload !== 'error' ? true : false,
        isMoreBiddingContractorsLoaded : action.payload !== 'error' ? true : false,
      };

    case GET_HOST_WORKSPACE:
      return{
        ...state,
        hostWorkSpace : action.payload !== 'error' ? action.payload.data : {},
      };
    case GET_CONTRACTOR_WORKSPACE:
      return{
        ...state,
        contractorWorkSpace : action.payload !== 'error' ? action.payload.data : {},
      };

    case FALSE_SAMPLE_WORK_AND_REVIEWS_FLAG:
      return{
          ...state,
          isSampleWorkImagesLoaded : action.payload,
          isReviewsForContractorLoaded : action.payload
      };
    case GET_SAMPLE_WORK_OF_CONTRACTOR:
      return{
        ...state,
        sampleWorkImages : action.payload !== 'error' ? action.payload.data.images : [],
        sampleWorkImagesCount : action.payload !== 'error' ? action.payload.data.count : 0,
        isSampleWorkImagesLoaded : action.payload !== 'error' ? true : false
      };
    case GET_REVIEWS_FOR_CONTRACTOR:
      return{
        ...state,
        reviewsForContractor : action.payload !== 'error' ? action.payload.data.reviews : [],
        isReviewsForContractorLoaded : action.payload !== 'error' ? true : false
      };

    case FALSE_ALL_FIND_JOBS_LIST_FLAG:
      return{
          ...state,
          isFindJobListLoaded : action.payload,
      };
    case IS_MORE_FIND_JOBS_LOADED:
      return{
        ...state,
        isMoreFindJobsLoaded : action.payload,
      };
    case  GET_ALL_FIND_JOBS_LIST:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
        state.findJobsList = [...action.payload.res.data.data];
        }
        else{
        state.findJobsList = [... state.findJobsList, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        findJobsListCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        findJobsList : action.payload !== 'error' ? state.findJobsList : [],
        isFindJobListLoaded : action.payload !== 'error' ? true : false,
        isMoreFindJobsLoaded : action.payload !== 'error' ? true : false,
        isFindJobFilterLoaded : action.payload !== 'error' ? true : false,
      };
    case FALSE_FIND_JOB_FILTER_LOADER:
      return{
          ...state,
          isFindJobFilterLoaded : action.payload,
      };

    case FALSE_HOST_TEAM_LOADER:
      return{
        ...state,
        isFindJobListLoaded : action.payload,
      };
    case IS_MORE_HOST_TEAM_LOADED:
      return{
          ...state,
          isMoreHostTeamLoaded : action.payload,
      };
    case GET_HOST_TEAM:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.hostTeam = [...action.payload.res.data.data];
        }
        else{
          state.hostTeam = [... state.hostTeam, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        hostTeamCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        hostTeam : action.payload !== 'error' ? state.hostTeam : [],
        isHostTeamLoaded : action.payload !== 'error' ? true : false,
      };
      
    case FALSE_HOST_CHECKLISTS_FLAG:
      return{
        ...state,
        isHostChecklistsLoaded : action.payload,
        isHostSampleChecklistsLoaded : action.payload
      };
    case IS_MORE_HOST_CHECKLISTS_LOADED:
      return{
          ...state,
          isMoreHostChecklistsLoaded : action.payload,
      };
    case GET_HOST_CHECKLISTS:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.hostChecklists = [...action.payload.res.data.data];
        }
        else{
          state.hostChecklists = [... state.hostChecklists, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        hostChecklistCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        hostChecklists : action.payload !== 'error' ? state.hostChecklists : [],
        isHostChecklistsLoaded : action.payload !== 'error' ? true : false,
        isMoreHostChecklistsLoaded : action.payload !== 'error' ? true : false,
      };

    case IS_MORE_HOST_SAMPLE_CHECKLISTS_LOADED:
      return{
        ...state,
        isMoreHostSampleChecklistsLoaded : action.payload,
      };
    case GET_HOST_SAMPLE_CHECKLISTS:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.hostSampleChecklists = [...action.payload.res.data.data];
        }
        else{
          state.hostSampleChecklists = [... state.hostSampleChecklists, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        hostSampleChecklistsCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        hostSampleChecklists : action.payload !== 'error' ? state.hostSampleChecklists : [],
        isHostSampleChecklistsLoaded : action.payload !== 'error' ? true : false,
        isMoreHostSampleChecklistsLoaded : action.payload !== 'error' ? true : false,
      };

    case FALSE_CONTRACTOR_MY_JOB_LOADER:
      return{
        ...state,
        isContractorJobListLoaded : action.payload,
      };
    case IS_MORE_CONTRACTOR_MY_JOB_LOADED:
      return{
        ...state,
        isMoreContractorJobLoaded : action.payload,
      };
    case GET_CONTRACTOR_MY_JOBS:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.contractorJobList = [...action.payload.res.data.data];
        }
        else{
          state.contractorJobList = [... state.contractorJobList, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        contractorJobsCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        contractorJobList : action.payload !== 'error' ? state.contractorJobList : [],
        isContractorJobListLoaded : action.payload !== 'error' ? true : false,
        isMoreContractorJobLoaded : action.payload !== 'error' ? true : false,
      };

    case GET_PAYMENT_DETAILS:
      return{
        ...state,
        paymentAccoutDetails : action.payload.code === 200 ? action.payload.data : {},
        isPaymentAccountDetailsLoaded : action.payload.code === 200 ? true : false,
      };
    
    case FALSE_CO_HOST_LOADER:
      return{
        ...state,
        isCoHostListLoaded : action.payload,
      }; 
    case IS_MORE_CO_HOST_LOADED:
      return{
        ...state,
        isMoreCoHostListLoaded : action.payload,
      };
    case GET_CO_HOST:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.coHostList = [...action.payload.res.data.data];
        }
        else{
          state.coHostList = [... state.coHostList, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        coHostListCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        coHostList : action.payload !== 'error' ? state.coHostList : [],
        isCoHostListLoaded : action.payload !== 'error' ? true : false,
        isCoHostFilterLoaded : action.payload !== 'error' ? true : false,
      };
    case FALSE_FILTER_LOADER:
      return{
        ...state,
        isCoHostFilterLoaded : action.payload,
      };

    case FALSE_MY_CO_HOST_LOADER:
      return{
        ...state,
        isMyCoHostListLoaded : action.payload,
      }; 
    case IS_MORE_MY_CO_HOST_LOADED:
      return{
        ...state,
        isMoreMYCoHostListLoaded : action.payload,
      };
    case GET_MY_CO_HOST:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.coHostList = [...action.payload.res.data.data];
        }
        else{
          state.coHostList = [... state.coHostList, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        myCoHostListCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        myCoHostList : action.payload !== 'error' ? state.coHostList : [],
        isMyCoHostListLoaded : action.payload !== 'error' ? true : false,
      };

    case GET_PROPERTY_CHECKLIST:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.propertyChecklists = [...action.payload.res.data.data];
        }
        else{
          state.propertyChecklists = [... state.propertyChecklists, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        propertyChecklistsCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        propertyChecklists : action.payload !== 'error' ? state.propertyChecklists : [],
        isPropertyChecklistsLoaded : action.payload !== 'error' ? true : false,
        isMorePropertyChecklistsLoaded : action.payload !== 'error' ? true : false,
      };
    case IS_MORE_PROPERTY_CHECKLIST_LOADED:
      return{
          ...state,
          isMorePropertyChecklistsLoaded : action.payload,
      };
      
    case FASLE_GET_PASSPORT_IMAGES_FLAG:
      return{
        ...state,
        isPassportImagesLoaded : action.payload,
      };
    case GET_PASSPORT_IMAGES:
      return{
        ...state,
        passportImages : action.payload.message === 'success' ? action.payload.data : {},
        isPassportImagesLoaded : action.payload.message === 'success' ? true : false,
      };

    case FALSE_DASHBOARD_STATS_FLAG:
      return{
        ...state,
        isDashboardStatsLoaded : action.payload,
      };
    case GET_DASHBOARD_STATS:
      return{
        ...state,
        dashboardStats : action.payload.code === 200 ? action.payload.data : {},
        isDashboardStatsLoaded : action.payload.code === 200 ? true : false,
      };

    case GET_PENDING_INVITATION:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.pendingInvitationList = [...action.payload.res.data.data];
        }
        else{
          state.pendingInvitationList = [... state.pendingInvitationList, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        pendingInvitationListCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        pendingInvitationList : action.payload !== 'error' ? state.pendingInvitationList : [],
        isPendingInvitationListLoaded : action.payload !== 'error' ? true : false,
        isMorePendingInvitationListLoaded : action.payload !== 'error' ? true : false,
      };
    case FALSE_PENDING_INVITATION_FLAG:
      return{
        ...state,
        isPendingInvitationListLoaded : action.payload,
      }; 
    case IS_MORE_PENDING_INVITATION_LOADED:
      return{
        ...state,
        isMorePendingInvitationListLoaded : action.payload,
      };
    case DELETE_PENDING_INVITATION:
      const deleteInvitaionIndex = state.pendingInvitationList.findIndex(checkDeleteInvitaionIndex);
      function checkDeleteInvitaionIndex(obj){
        return obj.comment_ID === action.payload ;
      }
      state.pendingInvitationList.splice(deleteInvitaionIndex, 1);
      return{
        ...state,
        pendingInvitationList : [...state.pendingInvitationList],
      };

    case GET_CLEANERS_LIST:
      if(action.payload !== 'error'){
        if(action.payload.offset === 0){
          state.cleanersList = [...action.payload.res.data.data];
        }
        else{
          state.cleanersList = [... state.cleanersList, ...action.payload.res.data.data]
        } 
      }
      return{
        ...state,
        cleanersListCount : action.payload !== 'error' ? action.payload.res.data.count : 0,
        cleanersList : action.payload !== 'error' ? state.cleanersList : [],
        isCleanersListLoaded : action.payload !== 'error' ? true : false,
        isMoreCleanersListLoaded : action.payload !== 'error' ? true : false,
      };
    case FALSE_CLEANERS_LIST_FLAG:
      return{
        ...state,
        isCleanersListLoaded : action.payload,
      }; 
    case IS_MORE_CLEANERS_LOADED:
      return{
        ...state,
        isMoreCleanersListLoaded : action.payload,
      };
    default:
      return state;
    }
  }
