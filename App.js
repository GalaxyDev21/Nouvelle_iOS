import React ,{Component} from 'react';
import { StyleSheet, View} from 'react-native';
import {createStackNavigator,createAppContainer, createSwitchNavigator} from 'react-navigation';
import { fromRight, fadeIn } from 'react-navigation-transitions';
import GlobalFont from 'react-native-global-font';
import AskQuestion from './Component/HomeScreen/AskQuestion' ;
import ContractorRegistrationForm from './Component/Registration/contractorRegistration' ;
import HostRegistrationForm from './Component/Registration/hostRegistration' ;
import EmailVerification from './Component/Registration/emailVerification/verification';
import HostLoginForm from './Component/Login/HostLoginForm' ;
import ContractorLoginForm from './Component/Login/contractorLoginForm' ;
import AskQuestionForRegister from './Component/HomeScreen/AskQuestionForReg' ;
import ForgotPassword from './Component/ForgotPassword/forgetPassword' ;
import ResetPassword from './Component/ForgotPassword/resetPassword' ;
import VerificationForPassword from './Component/ForgotPassword/verificationForPassword' ;
import Contractors from './Component/matches_contractors/contractors' ;
import CreateJob_Screen1 from './Component/Create_Job/screen1' ;
import CreateJob_Screen2 from './Component/Create_Job/screen2' ;
import CreateJob_Screen3 from './Component/Create_Job/screen3' ;
import CreateJob_Screen4 from './Component/Create_Job/screen4' ;
import CreateJob_Screen5 from './Component/Create_Job/screen5' ;
import CreateJob_Screen6 from './Component/Create_Job/screen6' ;
import ContractorsDetails from './Component/matches_contractors/cntractors_Details';
import ChatScreen from './Component/Chat/chat';
import Inbox from './Component/Chat/inbox';
import ContractorsProfileDetails from './Component/Contractor_Profile/contractorProfileDetail';
import ExistingPropertyScreen from './Component/Create_Job/ExistingProperty' ;
import NewPropertyScreen from './Component/Create_Job/addNewProperty' ;
import HostDashBoard from './Component/DashBoard/hostDashboard' ;
import ContractorDashBoard from './Component/DashBoard/contractorDashboard';
import Step1 from './Component/Invite_Contractor/step1';
import Step2 from './Component/Invite_Contractor/step2';
import Step3_Email from './Component/Invite_Contractor/step3_Email';
import Step3_SMS from './Component/Invite_Contractor/step3_SMS';
import InviteContractorsButton from './Component/Invite_Contractor/inviteButton' ;
import MessageBarAlert from 'react-native-message-bar/MessageBar';
import MessageBarManager from 'react-native-message-bar/MessageBarManager';
import {Provider} from 'react-redux' ;
import store from './Redux/store' ;
import * as Font from 'expo-font';
import AddPropertyScreen1 from './Component/add_property/addPropertyScreen1';
import AddPropertyScreen2 from './Component/add_property/addPropertyScreen2';
import MyPropertyList from './Component/add_property/myPropertyList' ;
import CalenderInEditProperty from './Component/Edit_Property/calenderInEditProperty';
import TeamsInProperty from './Component/Edit_Property/TeamsInEditPropert/teamsDetails';
import CheckIn_CheckOut from './Component/Edit_Property/checkIn_ckeckOut';
import EditPropertyDetails from './Component/Edit_Property/editPropertyDetailsScreen';
import CheckListsInEditProperty from './Component/Edit_Property/checklists';
import FirstTimeAppRun from './Component/App_start/firstTimeAppRun';
import ScheduleCalendar from './Component/Schedules/calender';
import Teams from './Component/Team/teamList';
import ReviewContractor from './Component/Review/reviewContractor' ;
import InvitationList from './Component/Invitations/invitationPending'; 
import MyCheckLists1 from './Component/checklists/my_checklist_1';
import MyCheckLists2 from './Component/checklists/my_checklist_2';
import TabViewOfChecklist from './Component/checklists/tabView';
import AddNewChecklist from './Component/checklists/addNewChecklist';
import SampleChecklistDetail from './Component/checklists/sampleChecklistDetail';
import ManualPayment from './Component/Host_Payment/manuaPayment';
//import AllBids from './Component/All_Bids/bids';
//import BidForThisJob from './Component/All_Bids/bidForJob';
import HostMyJobsList from './Component/MY_Jobs/myJobsList';
import TabViewOfJobDetails from './Component/MY_Jobs/allJobDetailsTabView';
import ResetPasswordInContractorProfile from './Component/Contractor_Profile/resetPassword';
import HostProfile from './Component/host_profile/profileSeting';
import ContractorMyJobsList from './Component/My_Jobs_In_ContractorDashBoard/myJobsList';
import TabViewOfJobDetailsInContracrtor from './Component/My_Jobs_In_ContractorDashBoard/allJobDetailsTabView';
import ScheduleCalendarInContractor from './Component/Contractor_Schedule/scheduleScreen';
import TermsOfUse from './Component/terms_conditions/termsOfUse';
import PrivacyAndPolicy from './Component/terms_conditions/privacyPolice';
import ViewPropertyDetails from './Component/Invite_Contractor/viewPropertyDetails';
import FindJobs from './Component/find_jobs_by_contractor/find_jobs';
import FindCoHost from './Component/Find_CoHost/coHostList';
import SmallRoom from './Component/Team/smallRoom';
import TabViewOfContractorFindJob from './Component/find_jobs_by_contractor/allTabView';
import CoHostDetails from './Component/Find_CoHost/details';
import CoHost_Details from './Component/Find_CoHost/tabViewOfDetails';
import TabViewOfPasswordAndPassport from './Component/Password_and_passport/tabView';
import Invite_Step1 from './Component/Invitations/invite_step1';
import Invite_Step2_SMS from './Component/Invitations/invite_step2_SMS';
import Invite_Step2_Email from './Component/Invitations/invite_step2_Email';
import HostStats from './Component/Dashboard_Stats/hostStats';
import ContractorStats from './Component/Dashboard_Stats/contractorStats';
import MyCoHost from './Component/My_CoHost/coHostList';
import MyHost from './Component/My_Hosts/hostList';
import ContractorPayment from './Component/Contractor_Payment/payment';
import AcceptBid from './Component/MY_Jobs/AcceptBid';
import Cleaners from './Component/Team/cleaners';


const HostAppScreen = createStackNavigator({ 
  HostDashBoard : {screen : HostDashBoard},
  CreateJob_Screen1 : {screen : CreateJob_Screen1},
  ExistingPropertyScreen : {screen : ExistingPropertyScreen},
  NewPropertyScreen : {screen : NewPropertyScreen},
  CreateJob_Screen2 : {screen : CreateJob_Screen2},
  CreateJob_Screen3 : {screen : CreateJob_Screen3},
  CreateJob_Screen4 : {screen : CreateJob_Screen4},
  CreateJob_Screen5 : {screen : CreateJob_Screen5},
  CreateJob_Screen6 : {screen : CreateJob_Screen6},
  ContractorsScreen : {screen : Contractors},
  ContractorsDetails : {screen : ContractorsDetails}, 
  HostProfile : {screen : HostProfile},
  ResetPasswordInContractorProfile : {screen : ResetPasswordInContractorProfile},
  ChatScreen : {screen : ChatScreen},
  Inbox : {screen : Inbox},
  InviteContractorsButton : {screen : InviteContractorsButton} ,
  Step1 : {screen : Step1},
  Step2 : {screen : Step2},
  Step3_Email : {screen : Step3_Email},
  Step3_SMS : {screen : Step3_SMS},
  AddPropertyScreen1 : {screen : AddPropertyScreen1},
  AddPropertyScreen2 : {screen : AddPropertyScreen2},
  MyPropertyList : {screen : MyPropertyList},
  EditPropertyDetails : {screen : EditPropertyDetails},
  CalenderInEditProperty : {screen : CalenderInEditProperty},
  TeamsInProperty : {screen : TeamsInProperty},
  CheckIn_CheckOut : {screen : CheckIn_CheckOut},
  CheckListsInEditProperty : {screen : CheckListsInEditProperty},
  MyCheckLists1 : {screen : MyCheckLists1},
  MyCheckLists2 : {screen : MyCheckLists2},
  TabViewOfChecklist : {screen : TabViewOfChecklist},
  AddNewChecklist : {screen : AddNewChecklist},
  SampleChecklistDetail : {screen : SampleChecklistDetail},
  Teams : {screen : Teams},
  ReviewContractor : {screen : ReviewContractor},
  ScheduleCalendar : {screen : ScheduleCalendar},
  ManualPayment : {screen : ManualPayment},
  //AllBids : {screen : AllBids},
  //BidForThisJob : {screen : BidForThisJob},
  HostMyJobsList : {screen : HostMyJobsList},
  TabViewOfJobDetails : {screen : TabViewOfJobDetails},
  TermsOfUse : {screen : TermsOfUse},
  PrivacyAndPolicy : {screen : PrivacyAndPolicy},
  ViewPropertyDetails : {screen : ViewPropertyDetails},
  FindCoHost : {screen : FindCoHost},
  SmallRoom : {screen : SmallRoom},
  CoHost_Details : {screen : CoHost_Details},
  CoHostDetails : {screen : CoHostDetails},
  MyCoHost : {screen : MyCoHost},
  MyHost : {screen : MyHost},
  TabViewOfPasswordAndPassport : {screen : TabViewOfPasswordAndPassport},
  HostStats : {screen : HostStats},
  ContractorStats : {screen : ContractorStats},
  AcceptBid : {screen : AcceptBid},
  Cleaners : {screen : Cleaners},
  ContractorMyJobsList : {screen : ContractorMyJobsList},
},
{
  headerMode: 'none',
  transitionConfig: () => fromRight(),
  initialRouteName: 'HostDashBoard'
},
);

const ContractorsAppScreen = createStackNavigator({ 
  ContractorDashBoard : {screen : ContractorDashBoard},
  ContractorsDetails : {screen : ContractorsDetails},
  ContractorsProfileDetails : {screen : ContractorsProfileDetails}, 
  ChatScreen : {screen : ChatScreen},
  Inbox : {screen : Inbox},
  ReviewContractor : {screen : ReviewContractor},
  InvitationList : {screen : InvitationList},
  ScheduleCalendarInContractor : {screen : ScheduleCalendarInContractor},
  //AllBids : {screen : AllBids},
  //BidForThisJob : {screen : BidForThisJob},
  TabViewOfJobDetails : {screen : TabViewOfJobDetails},
  ResetPasswordInContractorProfile : {screen : ResetPasswordInContractorProfile},
  ContractorMyJobsList : {screen : ContractorMyJobsList},
  TabViewOfJobDetailsInContracrtor : {screen : TabViewOfJobDetailsInContracrtor},
  SampleChecklistDetail : {screen : SampleChecklistDetail},
  FindJobs : {screen : FindJobs},
  TabViewOfContractorFindJob : {screen : TabViewOfContractorFindJob},
  TabViewOfPasswordAndPassport : {screen : TabViewOfPasswordAndPassport},
  Invite_Step1 : {screen : Invite_Step1},
  Invite_Step2_SMS : {screen : Invite_Step2_SMS},
  Invite_Step2_Email : {screen : Invite_Step2_Email},
  ContractorStats : {screen : ContractorStats},
  ContractorPayment : {screen : ContractorPayment},
},
{
  headerMode: 'none',
  transitionConfig: () => fromRight(),
  initialRouteName: 'ContractorDashBoard'
},
);

const RegistrationAndLoginScreens = createStackNavigator({
  AskQuestion:{screen: AskQuestion},
  ContractorReg: {screen: ContractorRegistrationForm},
  HostReg : {screen : HostRegistrationForm},
  HostLogin : {screen : HostLoginForm},
  EmailVerification : {screen : EmailVerification},
  ContractorLogin : {screen : ContractorLoginForm},
  AskQuestionForRegister : {screen : AskQuestionForRegister},
  ForgotPasswordScreen : {screen : ForgotPassword},
  ResetPasswordScreen : {screen : ResetPassword},
  VerificationForPasswordScreen : {screen : VerificationForPassword},
},
{
headerMode: 'none',
navigationOptions: {
  headerVisible: false,
},
transitionConfig: () => fromRight(),  
}
);

const AppNavigator = createSwitchNavigator({
  RegistrationAndLoginScreens: RegistrationAndLoginScreens,
  HostAppScreen : HostAppScreen,
  ContractorsAppScreen : ContractorsAppScreen,
  FirstTimeAppRun : FirstTimeAppRun, 
},
{
  initialRouteName: 'FirstTimeAppRun'
});

const Navigation = createAppContainer(AppNavigator);

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      fontLoaded: false,
      notification : ''
    }
  }
  async componentDidMount() {
    //this.getPermissions();
    await Font.loadAsync({
      'Raleway-Black': require('./assets/fonts/Raleway-Black.ttf'),
      'Raleway-BlackItalic': require('./assets/fonts/Raleway-BlackItalic.ttf'),
      'Raleway-Bold': require('./assets/fonts/Raleway-Bold.ttf'),
      'Raleway-BoldItalic': require('./assets/fonts/Raleway-BoldItalic.ttf'),
      'Raleway-ExtraBold': require('./assets/fonts/Raleway-ExtraBold.ttf'),
      'Raleway-ExtraBoldItalic': require('./assets/fonts/Raleway-ExtraBoldItalic.ttf'),
      'Raleway-ExtraLight': require('./assets/fonts/Raleway-ExtraLight.ttf'),
      'Raleway-ExtraLightItalic': require('./assets/fonts/Raleway-ExtraLightItalic.ttf'),
      'Raleway-Light': require('./assets/fonts/Raleway-Light.ttf'),
      'Raleway-LightItalic': require('./assets/fonts/Raleway-LightItalic.ttf'),
      'Raleway-Medium': require('./assets/fonts/Raleway-Medium.ttf'),
      'Raleway-MediumItalic': require('./assets/fonts/Raleway-MediumItalic.ttf'),
      'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
      'Raleway-RegularItalic': require('./assets/fonts/Raleway-RegularItalic.ttf'),
      'Raleway-SemiBold': require('./assets/fonts/Raleway-SemiBold.ttf'),
      'Raleway-SemiBoldItalic': require('./assets/fonts/Raleway-SemiBoldItalic.ttf'),
      'Raleway-Thin': require('./assets/fonts/Raleway-Thin.ttf'),
      'Raleway-ThinItalic': require('./assets/fonts/Raleway-ThinItalic.ttf'),
    });
    GlobalFont.applyGlobal('Raleway-SemiBold');
    MessageBarManager.registerMessageBar(this.refs.alert);
    this.setState({ fontLoaded: true });
  }
  // getPermissions = async() =>{
  //   const enabled = await messaging().hasPermission();
  //   if (enabled) {
  //     messaging().subscribeToTopic('Hello');
  //   } 
  //   else {
  //     await messaging().requestPermission();
  //   }
  // }
  render(){
    return (
      <View style={styles.container} >
        <Provider store={store}>
        {
          this.state.fontLoaded &&  <Navigation/>
        }
        <MessageBarAlert ref = 'alert'/>
        </Provider>
      </View>
    );
  } 
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});