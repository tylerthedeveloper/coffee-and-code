import React, { Component } from "react";
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Dimensions,
    AsyncStorage,
    TouchableHighlight,
    Button
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BottomSheet from "react-native-js-bottom-sheet";
import { Card } from "react-native-elements";
import CustomCallout from "../component/CustomCallout";
import { Marker, ProviderPropType, Callout } from "react-native-maps";
import { MapView, Location, Permissions } from "expo";
import PersonList from "../component/PersonList";
import MapViewDirections from "react-native-maps-directions";
import getDirections from "react-native-google-maps-directions";
import {
    getLoggedinUserName,
    updateLocationAndGetLocalUsers,
    getLocalUsers
} from "../services/user-service";
import Entypo from "react-native-vector-icons/Entypo";
import geolib from "geolib";

// import { SERVER_API } from "app/constants";

const { width, height } = Dimensions.get("window");

// TODO: Constants
const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -106.523;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let modal_visibility = false;
let popup_visibility = false;
const GOOGLE_MAPS_APIKEY = "AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y";
console.log("popup_visibility ", popup_visibility);
export default class Home extends Component<Props> {
    randomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    currentLocationColor() {
        return `#${Math.floor(1 * 16777215).toString(16)}`;
    }

    constructor(props) {
        super(props);
        this.state = {
            nearbyLocations: [],
            git_username: "",
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            current_coords: {
                latitude: LATITUDE,
                longitude: LONGITUDE
            },
            markers: [],
            filtered_markers: [],
            popup: true,
            popup_visibility: popup_visibility,
            bottomsheet: {
                picture_url: "",
                name: "",
                location_data: {
                    source: {
                        latitude: 0.0,
                        longitude: 0.0
                    },
                    destination: {
                        latitude: 0.0,
                        longitude: 0.0
                    },
                    params: [
                        {
                            key: "travelmode",
                            value: "driving" // may be "walking", "bicycling" or "transit" as well
                        },
                        {
                            key: "dir_action",
                            value: "navigate" // this instantly initializes navigation using the given travel mode
                        }
                    ]
                }
            }
        };
        console.log(
            "Constructor is called popup_visibility: ",
            this.state.popup_visibility
        );
    }

    componentWillMount() {
        this._initMap();
    }

    setModalVisible(visible) {
        console.log(this.state.modalVisible);
        this.setState({ modalVisible: visible });
    }

    // TODO: Calculate difference ... function
    shouldUpdateLocation(storedLocation, location) {
        return false;
    }

    // TODO: Add refresh button
    async refreshMap() {
        const storedLocation = JSON.parse(
            await AsyncStorage.getItem("location")
        );
        const location = null;
        // await Location.getCurrentPositionAsync({enableHighAccuracy: true });
        // {enableHighAccuracy: true}

        /*
        if (this.shouldUpdateLocation(storedLocation, location)) {
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
        */

        // TODO: MOVE TO FILTER
        // console.log('before sklls');
        // this.state.markers.forEach(marker => console.log(marker.git_username));

        const skillsQuery = ["React-Native"];
        const filtered_markers = new Set();
        this.state.markers.map(marker => {
            skillsQuery.forEach(skill => {
                const _marker = Object.keys(marker.skills).some(
                    _skill => skill === _skill
                );
                if (_marker) {
                    filtered_markers.add(marker);
                    return;
                }
            });
        });
        this.setState({ filtered_markers: [...filtered_markers] });
    }

    setMapMarkers(coords, localUsers) {
        const markers = localUsers.map(localUser => ({
            coordinate: {
                latitude: localUser.latitude,
                longitude: localUser.longitude
            },
            key: localUser.git_username,
            color: this.randomColor(),
            name: localUser.name,
            git_username: localUser.git_username,
            bio: localUser.bio,
            // isCurrentFriend: localUser.isCurrentFriend,
            // isFriendRequest: localUser.isFriendRequest,
            skills: localUser.skills,
            picture_url: localUser.picture_url
        }));
        // TODO: Push logged in user
        console.log("Markers are: ", markers);
        markers.push({
            coordinate: coords,
            key: this.state.git_username,
            color: this.currentLocationColor(),
            name: "Tony Stark",
            git_username: "starktony",
            bio: "Ironman - Mechanic"
        });

        this.setState({
            markers,
            filtered_markers: markers
        });
    }

    async _initMap() {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            // TODO: re-request for location permission
            throw new Error("Location permission not granted");
        } else {
            let location = {
                coords: {
                    latitude: 39.168718,
                    longitude: -86.499862
                }
            };
            // const location = await Location.getCurrentPositionAsync({enableHighAccuracy: true }); // {enableHighAccuracy: true}
            // location.then(res => console.log(res))
            AsyncStorage.setItem("location", JSON.stringify(location.coords));
            console.log("setlocation ", location);
            const { latitude, longitude } = location.coords;
            await getLoggedinUserName().then(git_username =>
                this.setState({
                    git_username,
                    region: {
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                })
            );
            const coords = location.coords;
            await updateLocationAndGetLocalUsers({
                git_username: this.state.git_username,
                location: coords
            }).then(localUsers => this.setMapMarkers(coords, localUsers));
        }
    }

    popup() {
        console.log("Printed");
    }

    renderModal() {
        console.log("in render method");
        modal_visibility = true;
        console.log("visibility", modal_visibility);
    }

    navigateToProfile(marker) {
        console.log("Navigating to profile");
        this.props.navigation.push("Profile", {
            git_username: marker.git_username,
            isCurrentFriend: marker.isCurrentFriend,
            isFriendRequest: marker.isFriendRequest,
            current_user: false
        });
    }

    onPressButton = (name, coordinate, picture) => {
        let bottomsheet_refresh = { ...this.state.bottomsheet };
        bottomsheet_refresh.name = name;
        bottomsheet_refresh.location_data.destination = coordinate;
        bottomsheet_refresh.picture_url = picture;
        bottomsheet_refresh.location_data.source = this.state.markers[
            this.state.markers.length - 1
        ].coordinate;
        this.setState({ bottomsheet: bottomsheet_refresh });
        this.bottomSheet.open();
    };

    onRecommendLocations = source => {
        const restaurantPromise = fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
                source.latitude
            },${
                source.longitude
            }&radius=2000&type=cafe&key=AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                    // TODO: Credentials / accesstoken
                }
            }
        );

        restaurantPromise.then(res => res.json()).then(resData => {
            const allRestaurants = resData.results.map(res => {
                return {
                    name: res.name,
                    coords: {
                        latitude: res.geometry.location.lat,
                        longitude: res.geometry.location.lng
                    },
                    icon: res.icon
                };
            });
            this.setState({ nearbyLocations: allRestaurants });
        });
    };

    getPath = (user_coords, destination_coords) => {
        return (
            <MapViewDirections
                origin={user_coords}
                destination={destination_coords}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="steelblue"
                mode="driving"
            />
        );
    };

    handleGetDirections = (source, destination) => {
        const data = {
            source: source,
            destination: destination,
            params: [
                {
                    key: "travelmode",
                    value: "driving" // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate" // this instantly initializes navigation using the given travel mode
                }
            ]
        };
        getDirections(data);
    };

    getRest = destination => {
        let current_location = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
        };
        this.handleGetDirections(current_location, destination);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.maps}>
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
                                description="Information"
                                pinColor={marker.color}
                                onPress={() =>
                                    this.onPressButton(
                                        marker.name,
                                        marker.coordinate,
                                        marker.picture_url
                                    )
                                }
                            />
                        ))}
                        {this.state.nearbyLocations.map(rest => (
                            <Marker
                                key={rest.coords.longitude}
                                coordinate={rest.coords}
                                pinColor="blue"
                                image={{ uri: rest.icon }}
                            >
                                <Callout
                                    onPress={() => this.getRest(rest.coords)}
                                >
                                    <Text>{rest.name}</Text>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>

                    <BottomSheet
                        ref={(ref: BottomSheet) => {
                            this.bottomSheet = ref;
                            //   console.log("ref: ", ref);
                        }}
                        itemDivider={3}
                        backButtonEnabled={true}
                        coverScreen={false}
                        title="Create"
                        options={[
                            {
                                title: this.state.bottomsheet.name,
                                onPress: e => {
                                    e.preventDefault();
                                }
                            },
                            {
                                title: "Get Directions",
                                icon: (
                                    <Entypo
                                        name="spreadsheet"
                                        color="#43a047"
                                        size={24}
                                    />
                                ),
                                onPress: () =>
                                    this.handleGetDirections(
                                        this.state.bottomsheet.location_data
                                            .source,
                                        this.state.bottomsheet.location_data
                                            .destination
                                    )
                            },
                            {
                                title: "Get Recommended Locations to Meet",
                                icon: (
                                    <MaterialCommunityIcons
                                        name="folder"
                                        color="grey"
                                        size={24}
                                    />
                                ),
                                onPress: () => {
                                    this.onRecommendLocations(
                                        this.state.bottomsheet.location_data
                                            .destination
                                    );
                                }
                            }
                        ]}
                        isOpen={false}
                    />
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.refreshMap()}>
                        <Text>RefershLocation</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.cards}>
          <PersonList markers={this.state.filtered_markers} />
        </View> */}
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
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent"
    },
    maps: {
        flex: 1
    },
    cards: {
        flex: 0.33
    },
    customView: {
        flex: 4
    }
});
