import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Dialog } from "react-native-simple-dialogs";
import CoHostIntro from "./Intro";
import MessageAndInvite from "./buttons";
import { connect } from "react-redux";
import StatusBar from "../InputFields/statusBar";
import moment from "moment";

class CoHostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogsuccess: false,
      popupImage: null,
      role: "",
      details: this.props.navigation.getParam("details", ""),
    };
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          title="Profile"
          isIconDisplay={true}
          navigation={this.props.navigation}
          marginValue={hp("0%")}
        />
        <CoHostIntro details={this.state.details} />
        <Details details={this.state.details} />
        {this.props.roleIdUserName.coHost === "no" && (
          <MessageAndInvite
            navigation={this.props.navigation}
            details={this.state.details}
            roleIdUserName={this.props.roleIdUserName}
          />
        )}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  userToken: state.createJob.userLoginToken,
  roleIdUserName: state.createJob.roleIdUserName,
});
export default connect(mapStateToProps)(CoHostDetails);

class Details extends Component {
  render() {
    return (
      <View style={{ flex: 1, padding: hp("2%"), backgroundColor: "#f4f4f4" }}>
        <Info
          heading="Reviews: "
          value={this.props.details.reviews}
          style={{ marginBottom: hp("4%"), backgroundColor: "red" }}
        />
        <Info
          heading="years in business: "
          value={this.props.details.et_experience}
        />
        <Info
          heading="jobs worked: "
          value={this.props.details.total_projects_worked}
        />
        {this.props.details.state !== null && (
          <Info heading="State: " value={this.props.details.state.name} />
        )}
        <Info heading="Zip code: " value={this.props.details.et_zipcode} />
        <Info
          heading="Project Category: "
          value={this.props.details.project_category}
        />
        <Info
          heading="Work Experience: "
          value={this.props.details.work_experience}
        />
        <Info
          heading="Description: "
          value={
            this.props.details.description === ""
              ? "No description added"
              : this.props.details.description.replace(/(<([^>]+)>)/g, "")
          }
        />
      </View>
    );
  }
}

function Info(props) {
  return (
    <View style={{ flexDirection: "row", marginBottom: hp("1%") }}>
      <Image
        source={require("../../assets/point_icon.png")}
        style={{ height: hp("2%"), width: hp("2%"), resizeMode: "contain" }}
      />
      {/* <View style={{flexDirection : 'row', alignItems : 'center'}}> */}
      <Text style={{ color: "#0071bc", fontSize: 18, marginLeft: wp("2%") }}>
        {props.heading}
      </Text>
      <Text
        style={{
          color: "#292929",
          fontSize: 16,
          marginLeft: wp("2%"),
          flex: 1,
          flexWrap: "wrap",
        }}
      >
        {props.heading === "Project Category: " ||
        props.heading === "Work Experience: "
          ? props.value.map((item) => item.name + ", ")
          : props.value === ""
          ? ""
          : props.value}
      </Text>
      {/* </View> */}
    </View>
  );
}
