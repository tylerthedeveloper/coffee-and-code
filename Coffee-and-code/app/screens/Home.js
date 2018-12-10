import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  TouchableHighlight,
  Button,
  ScrollView
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "react-native-elements";
import CustomCallout from "../component/CustomCallout";
import { Marker, ProviderPropType, Callout } from "react-native-maps";
import { MapView, Location, Permissions, Notifications } from "expo";
import PersonList from "../component/PersonList";
import MapViewDirections from "react-native-maps-directions";
import getDirections from "react-native-google-maps-directions";
import {
  getLoggedinUserName,
  getLoggedinUserProfile,
  updateLocationAndGetLocalUsers,
  getLocalUsers
} from "../services/user-service";
import Entypo from "react-native-vector-icons/Entypo";
import geolib from "geolib";
import {
  handleGetDirections,
  onRecommendLocations,
  getRandomColor,
  currentLocationColor,
  shouldUpdateLocation
} from "../services/map-service";
import ToggleSwitch from "toggle-switch-react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
const { width, height } = Dimensions.get("window");
import * as firebase from "firebase";

// TODO: Constants
const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -106.523;
const LATITUDE_DELTA = 0.03; // 0.0922;
// const LATITUDE_DELTA = 0.006; // 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = "AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y";
import Modal from "react-native-modal";

import { addNewUserExpoNotiToken } from "../services/user-service";

const items = [
  {
    name: "Front End",
    id: 0,
    children: [
      {
        name: "React-Native",
        id: 10
      },
      {
        name: "HTML",
        id: 17
      },
      {
        name: "CSS",
        id: 13
      }
    ]
  },
  {
    name: "Back End",
    id: 1,
    children: [
      {
        name: "Java",
        id: 20
      },
      {
        name: "PHP",
        id: 21
      }
    ]
  }
];

import * as socketIo from "socket.io-client";
import openSocket from "socket.io-client";
import SocketIOClient from "socket.io-client";

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      nearbyLocations: [],
      git_username: "",
      user_id: -1,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA
      },
      current_coords: {
        latitude: LATITUDE,
        longitude: LONGITUDE
      },
      markers: [],
      filtered_markers: [],
      selectedMarker: {},
      visibleModal: null,
      travelPath: false
    };
  }

  socket;

  componentDidMount() {
    this._initMap().then(() => {
      this.socket = SocketIOClient(
        // "http://192.168.64.17:8080",
        "https://code-and-coffee2.azurewebsites.net:8080",
        {
          query: {
            user_id: this.state.user_id
          }
        }
      );
      this.socket.on("new_local_user", res => {
        console.log("new_local_user", res.data);
        const newMarker = this.makeMarker(res.data);
        this.setState({
          markers: [...this.state.markers, newMarker],
          filtered_markers: [...this.state.filtered_markers, newMarker]
        });
      });
      this.registerForPushNotifications();
      // console.log('did mount');
    });
  }

  registerForPushNotifications = async () => {
    //check for existing permissions
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;

    if (status !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    // console.log("expo token", token);
    // TODO: also store in async storage
    addNewUserExpoNotiToken(this.state.git_username, token);
  };

  // TODO: make generic
  filterUsers(queryObj) {
    console.log("skillsQuery: ", queryObj);
    const filtered_markers = new Set();
    const filterObj = queryObj.finalList;
    console.log(filterObj);
    this.state.markers.map(marker => {
      Object.keys(filterObj).map(preferenceKey => {
        const curObj = filterObj[preferenceKey];
        curObj.map(preference => {
          console.log(preferenceKey, preference);
          const _marker = Object.keys(marker[preferenceKey]).some(
            _preference => preference === _preference
          );
          if (_marker) {
            filtered_markers.add(marker);
            // TODO: early termination
            return;
          }
        });
      });
    });
    this.setState({ filtered_markers: [...filtered_markers] });
  }

  // TODO: Add refresh button
  async refreshMap() {
    const storedLocation = JSON.parse(await AsyncStorage.getItem("location"));
    const location = null;
    // await Location.getCurrentPositionAsync({enableHighAccuracy: true });
    // {enableHighAccuracy: true}

    if (shouldUpdateLocation(storedLocation, location)) {
      const coords = location.coords;
      updateLocationAndGetLocalUsers({
        git_username: this.state.git_username,
        location: coords
      }).then(localUsers => this.setMapMarkers(coords, localUsers));
    } else {
      console.log("storedLocation: ", storedLocation);
      // const coords = storedLocation.coords;
      const coords = storedLocation;
      getLocalUsers({
        git_username: this.state.git_username,
        location: storedLocation
      }).then(localUsers => this.setMapMarkers(coords, localUsers));
    }
  }

  makeMarker(localUser) {
    return {
      coordinate: {
        latitude: localUser.latitude,
        longitude: localUser.longitude
      },
      key: localUser.git_username,
      color: getRandomColor(),
      name: localUser.name,
      git_username: localUser.git_username,
      bio: localUser.bio,
      // TODO:
      // isCurrentFriend: localUser.isCurrentFriend,
      // isFriendRequest: localUser.isFriendRequest,
      skills: localUser.skills,
      picture_url: localUser.picture_url,
      will_help: localUser.will_help || {},
      need_help: localUser.need_help || {},
      will_tutor: localUser.will_tutor || {}
      // looking_for:
    };
  }

  setMapMarkers(coords, localUsers) {
    // TODO: use makeMarker
    const markers = localUsers.map(localUser => ({
      coordinate: {
        latitude: localUser.latitude,
        longitude: localUser.longitude
      },
      key: localUser.git_username,
      color: getRandomColor(),
      name: localUser.name,
      git_username: localUser.git_username,
      bio: localUser.bio,
      // TODO:
      // isCurrentFriend: localUser.isCurrentFriend,
      // isFriendRequest: localUser.isFriendRequest,
      skills: localUser.skills,
      picture_url: localUser.picture_url,
      will_help: localUser.will_help || {},
      need_help: localUser.need_help || {},
      will_tutor: localUser.will_tutor || {}
      // looking_for:
    }));

    this.setState({
      markers,
      filtered_markers: markers
    });
  }

  async _initMap() {
    console.log("inside initMap");
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      // TODO: re-request for location permission
      throw new Error("Location permission not granted");
    } else {
      let location = {
        coords: {
          latitude: 39.173175,
          longitude: -86.523196
        }
      };
      // let location = await Location.getCurrentPositionAsync({
      //   enableHighAccuracy: true
      // }); // {enableHighAccuracy: true}
      TODO: AsyncStorage.setItem("location", JSON.stringify(location.coords));
      console.log("setlocation ", location);
      const { latitude, longitude } = location.coords;
      // await getLoggedinUserName().then(git_username =>
      await getLoggedinUserProfile().then(profile => {
        // console.log("profile: ", profile);

        this.setState({
          git_username: profile.git_username,
          user_id: profile.user_id,
          profile,
          region: {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          // TODO: MAKE SURE THIS IS PERSISTED
          current_coords: {
            latitude: latitude,
            longitude: longitude
          }
        });
      });
      const coords = location.coords;
      await updateLocationAndGetLocalUsers({
        git_username: this.state.git_username,
        location: coords
      }).then(localUsers => this.setMapMarkers(coords, localUsers));
    }
  }

  getPath = destination_coords => {
    return (
      <MapViewDirections
        origin={this.state.current_coords}
        destination={destination_coords}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="steelblue"
        mode="driving"
      />
    );
  };

  openModal(modalNumber, markerData) {
    console.log(markerData);
    //  PROFILE and Recommendation
    if (modalNumber === 1 || modalNumber === 3) {
      this.setState({
        selectedMarker: markerData,
        visibleModal: modalNumber
      });
      // Filter
    } else if (modalNumber === 2) {
      this.setState({
        visibleModal: modalNumber
      });
    }
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.TouchableButton}>
      <View>
        <Text style={{ color: "white", fontWeight: "bold" }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  onModalPressed(action, callback) {
    const marker = this.state.selectedMarker;
    this.setState({ visibleModal: null });
    switch (action) {
      case "Profile":
        this.props.navigation.navigate("Profile", {
          git_username: marker.git_username
          // TODO: Friend stuff ...
        });
        break;
      case "Directions":
        handleGetDirections(this.state.current_coords, marker.coordinate);
        break;
      case "Recommendations":
        onRecommendLocations(marker.coordinate).then(res => callback(res));
        break;
      case "Path":
        this.getPath(marker.coordinate);
        this.setState({ travelPath: true });
        break;

      // case "Close":
      //     this.filterUsers();
      default:
        return;
    }
  }

  renderUserProfileModal() {
    console.log("userProfile marker selected", this.state.selectedMarker);
    return (
      <Modal
        isVisible={this.state.visibleModal === 1}
        animationIn="slideInLeft"
        animationOut="slideOutRight"
        backdropOpacity={0.7}
        onBackdropPress={() => this.setState({ visibleModal: null })}
        backdropColor="black"
      >
        <View style={styles.modalContent}>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderColor: "#4D90FE",
              borderWidth: 2
            }}
            source={{
              uri: this.state.selectedMarker.picture_url
            }}
          />
          <Text />
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>
            {this.state.selectedMarker.name}
          </Text>
          <Text />

          {this.renderButton("Profile", () => this.onModalPressed("Profile"))}
          <Text />
          {this.renderButton("Get Directions", () =>
            this.onModalPressed("Directions")
          )}
          <Text />
          {this.renderButton("Get Recommendations", () =>
            this.onModalPressed("Recommendations", allRestaurants =>
              this.setState({
                visibleModal: null,
                nearbyLocations: allRestaurants
              })
            )
          )}
          <Text />
          {this.renderButton("Close", () => this.onModalPressed("Close"))}
        </View>
      </Modal>
    );
  }

  renderRecommendationModal() {
    console.log(this.state.selectedMarker);
    // const photo_reference = await this.getLocationImage(this.state.selectedMarker.photo_reference);
    return (
      <Modal
        isVisible={this.state.visibleModal === 3}
        animationIn="slideInLeft"
        animationOut="slideOutRight"
        onBackdropPress={() => this.setState({ visibleModal: null })}
      >
        <View style={styles.modalContent}>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderColor: "#4D90FE",
              borderWidth: 2
            }}
            source={{
              uri: this.state.selectedMarker.icon
            }}
          />
          <Text />
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {this.state.selectedMarker.name}
          </Text>
          <Text />
          {this.renderButton("Get Directions", () =>
            this.onModalPressed("Directions")
          )}
          <Text />
          {this.renderButton("Close", () => this.onModalPressed("Close"))}
        </View>
      </Modal>
    );
  }

  setFilters = fitlerObj => {
    console.log(fitlerObj);
  };

  // TODO: ???
  clearFilter() {
    this.setState({ filtered_markers: this.state.markers });
  }

  render() {
    console.log(this.state.region);
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          region={this.state.region}
          showsUserLocation
        >
          {this.state.filtered_markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
              onPress={() => this.openModal(1, marker)}
            />
          ))}
          {this.state.nearbyLocations.map(rest => (
            <Marker
              key={rest.coordinate.longitude}
              coordinate={rest.coordinate}
              pinColor="blue"
              image={{ uri: rest.icon }}
              onPress={() => this.openModal(3, rest)}
            />
          ))}
        </MapView>
        <View
          style={{
            position: "absolute", //use absolute position to show button on top of the map
            top: "90%", //for center align
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.push("List", {
                passProps: {
                  callback: data => this.filterUsers(data)
                }
              })
            }
            style={styles.MapButton}
          >
            <Text>Filter</Text>
          </TouchableOpacity>
          <Text />
          <TouchableOpacity
            onPress={() => this.refreshMap()}
            style={styles.MapButton}
          >
            <Text>Refresh Location</Text>
          </TouchableOpacity>
        </View>

        <View>{this.renderUserProfileModal()}</View>
        <View>{this.renderRecommendationModal()}</View>
      </View>
    );
  }
}

Home.propTypes = {
  provider: ProviderPropType
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 4,
    flexDirection: "column",
    alignItems: "stretch"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  cards: {
    flex: 0.33
  },
  customView: {
    flex: 4
  },
  TouchableButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#4D90FE",
    elevation: 2, // Android
    height: 50,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderColor: "steelblue",
    borderWidth: 3
  },
  button: {
    borderRadius: 30
  },
  MapButton: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "white",
    elevation: 2, // Android
    height: 50,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 3,
    marginLeft: 20
  }
});
