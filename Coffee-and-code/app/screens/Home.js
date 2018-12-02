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
import {
    handleGetDirections,
    onRecommendLocations,
    getRandomColor,
    currentLocationColor,
    shouldUpdateLocation,
    renderModal
} from "../services/map-service";

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
import Modal from "react-native-modal";

export default class Home extends Component<Props> {
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
            selectedMarker: {},
            visibleModal: null
        };
    }

    componentWillMount() {
        this._initMap();
    }

    // TODO: make generic
    filterUsers() {
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

    // TODO: Add refresh button
    async refreshMap() {
        const storedLocation = JSON.parse(
            await AsyncStorage.getItem("location")
        );
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

    setMapMarkers(coords, localUsers) {
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
            picture_url: localUser.picture_url
        }));
        // TODO: Push logged in user
        console.log("Markers are: ", markers);
        markers.push({
            coordinate: coords,
            key: this.state.git_username,
            color: currentLocationColor(),
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
                    },
                    // TODO: MAKE SURE THIS IS PERSISTED
                    current_coords: {
                        latitude: latitude,
                        longitude: longitude
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

    // getPath = (user_coords, destination_coords) => {
    //     return (
    //         <MapViewDirections
    //             origin={user_coords}
    //             destination={destination_coords}
    //             apikey={GOOGLE_MAPS_APIKEY}
    //             strokeWidth={3}
    //             strokeColor="steelblue"
    //             mode="driving"
    //         />
    //     );
    // };

    // getRest = destination => {
    //     let current_location = {
    //         latitude: this.state.region.latitude,
    //         longitude: this.state.region.longitude
    //     };
    //     this.handleGetDirections(current_location, destination);
    // };

    openModal(markerData) {
        console.log(markerData);
        this.setState({
            selectedMarker: markerData,
            visibleModal: 1
        });
    }

    renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text>{text}</Text>
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
                handleGetDirections(
                    this.state.current_coords,
                    marker.coordinate
                );
                break;
            case "Recommendations":
                onRecommendLocations(marker.coordinate).then(res =>
                    callback(res)
                );
                break;
            default:
                return;
        }
    }

    renderModal() {
        return (
            <Modal
                isVisible={this.state.visibleModal === 1}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                onBackdropPress={() => this.setState({ visibleModal: null })}
            >
                <View style={styles.modalContent}>
                    <Text>{this.state.selectedMarker.git_username}</Text>
                    {this.renderButton("Profile", () =>
                        this.onModalPressed("Profile")
                    )}
                    {this.renderButton("Get Directions", () =>
                        this.onModalPressed("Directions")
                    )}
                    {this.renderButton("Get Recommendations", () =>
                        this.onModalPressed("Recommendations", allRestaurants =>
                            this.setState({
                                visibleModal: null,
                                nearbyLocations: allRestaurants
                            })
                        )
                    )}
                    {this.renderButton("Close", () =>
                        this.onModalPressed("Close")
                    )}
                </View>
            </Modal>
        );
    }

    render() {
        const { navigation } = this.props;
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
                                onPress={() => this.openModal(marker)}
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
                                // TODO:
                                // onPress={() => this.getRest(rest.coords)}
                                >
                                    <Text>{rest.name}</Text>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                </View>
                <View>
                    {/* <TouchableOpacity onPress={() => this.refreshMap()}>
                        <Text>RefershLocation</Text>
                    </TouchableOpacity> */}
                    {this.renderModal()}
                </View>
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
    }
});
