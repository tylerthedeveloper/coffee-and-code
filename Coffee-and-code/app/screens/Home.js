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
import { MapView, Location, Permissions } from "expo";
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

// TODO: Constants
const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -106.523;
const LATITUDE_DELTA = 0.03; // 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = "AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y";
import Modal from "react-native-modal";

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

    componentWillMount() {
        this._initMap();
    }

    // TODO: make generic
    filterUsers(skillsQuery) {
        console.log("skillsQuery: ", skillsQuery);
        // const skillsQuery = ["React-Native"];
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
        // console.log("Markers are: ", markers);
        // markers.push({
        //     skills: this.state.profile.skills,
        //     coordinate: coords,
        //     key: this.state.profile.git_username,
        //     color: currentLocationColor(),
        //     name: this.state.profile.name,
        //     git_username: this.state.profile.git_username,
        //     bio: this.state.profile.bio
        // });

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
            // await getLoggedinUserName().then(git_username =>
            await getLoggedinUserProfile().then(profile => {
                console.log("profile: ", profile);
                this.setState({
                    git_username: profile.git_username,
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

    // getRest = destination => {
    //     let current_location = {
    //         latitude: this.state.region.latitude,
    //         longitude: this.state.region.longitude
    //     };
    //     this.handleGetDirections(current_location, destination);
    // };

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
        return (
            <Modal
                isVisible={this.state.visibleModal === 1}
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
                            borderColor: "black"
                        }}
                        source={{
                            uri: this.state.selectedMarker.picture_url
                        }}
                    />
                    <Text>{this.state.selectedMarker.git_username}</Text>
                    {this.renderButton("Profile", () =>
                        this.onModalPressed("Profile")
                    )}
                    {this.renderButton("Get Directions", () =>
                        this.onModalPressed("Directions")
                    )}
                    // TODO:
                    {this.renderButton("Show Path", () =>
                        this.onModalPressed("Path")
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

    // async getLocationImage = photoReference => {
    //     const photoPromise = fetch(
    //         `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference${photoReference}&key=AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 "Content-type": "application/json"
    //                 // TODO: Credentials / accesstoken
    //             }
    //         }
    //     );
    //     return photoPromise.then(res => {
    //         return res.url;
    //     });
    // };

    renderRecommendationModal() {
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
                            borderColor: "black"
                        }}
                        source={{
                            uri: this.state.selectedMarker.icon
                        }}
                    />
                    <Text>{this.state.selectedMarker.name}</Text>
                    // TODO:
                    {this.renderButton("Show Path", () =>
                        this.onModalPressed("Path")
                    )}
                    {this.renderButton("Get Directions", () =>
                        this.onModalPressed("Directions")
                    )}
                    {this.renderButton("Close", () =>
                        this.onModalPressed("Close")
                    )}
                </View>
            </Modal>
        );
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        console.log("Selected item:", selectedItems);
    };

    onConfirm = () => {
        // Need Help value added on confirm button
        currentHelpItem = this.state.selectedItems;
        console.log("Current Item:", currentHelpItem);
        AsyncStorage.setItem("CurrItem", JSON.stringify(currentHelpItem));
        this.setState({ visibleModal: null });
        // this.filterUsers(currentHelpItem);
    };

    onToggle(isOn) {
        console.log("Its on");
    }

    renderFilterModal() {
        return (
            <Modal
                isVisible={this.state.visibleModal === 2}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                onBackdropPress={() => this.setState({ visibleModal: null })}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <Card style={styles.card}>
                            <Text style={styles.welcome}>Need Help</Text>

                            <ToggleSwitch
                                isOn={this.state.isOnDefaultToggleSwitch}
                                onToggle={isOnDefaultToggleSwitch => {
                                    this.setState({ isOnDefaultToggleSwitch });
                                    this.onToggle(isOnDefaultToggleSwitch);
                                }}
                            />
                            <SectionedMultiSelect
                                items={items}
                                uniqueKey="name"
                                subKey="children"
                                selectText="Choose any Language"
                                showDropDowns={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={
                                    this.onSelectedItemsChange
                                }
                                selectedItems={this.state.selectedItems}
                                //onConfirm={this.onConfirm}
                            />
                        </Card>

                        <Card
                            style={{
                                padding: 150,
                                color: "powderblue",
                                flexDirection: "row"
                            }}
                        >
                            <Text style={styles.welcome}>Willing To Help</Text>

                            <ToggleSwitch
                                isOn={this.state.isOnDefaultToggleSwitch}
                                onToggle={isOnDefaultToggleSwitch => {
                                    this.setState({ isOnDefaultToggleSwitch });
                                    this.onToggle(isOnDefaultToggleSwitch);
                                }}
                            />
                            <SectionedMultiSelect
                                items={items}
                                uniqueKey="name"
                                subKey="children"
                                selectText="Choose any Language"
                                showDropDowns={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={
                                    this.onSelectedItemsChange
                                }
                                selectedItems={this.state.selectedItems}
                                onConfirm={this.onConfirm}
                            />
                        </Card>

                        <Card
                            style={{
                                padding: 150,
                                color: "powderblue",
                                flexDirection: "row"
                            }}
                        >
                            <Text style={styles.welcome}>
                                Let's Make A Team
                            </Text>

                            <ToggleSwitch
                                isOn={this.state.isOnDefaultToggleSwitch}
                                onToggle={isOnDefaultToggleSwitch => {
                                    this.setState({ isOnDefaultToggleSwitch });
                                    this.onToggle(isOnDefaultToggleSwitch);
                                }}
                            />
                            <SectionedMultiSelect
                                items={items}
                                uniqueKey="name"
                                subKey="children"
                                selectText="Choose any Language"
                                showDropDowns={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={
                                    this.onSelectedItemsChange
                                }
                                selectedItems={this.state.selectedItems}
                                onConfirm={this.onConfirm}
                            />
                        </Card>
                    </ScrollView>

                    <Button
                        style={styles.saveButton}
                        // styleDisabled={{color: 'red'}}
                        onPress={() => this.onConfirm()}
                        title="Save"
                    >
                        Save
                    </Button>
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
                                onPress={() => this.openModal(1, marker)}
                            />
                        ))}
                        {this.state.nearbyLocations.map(rest => (
                            <Marker
                                key={rest.coords.longitude}
                                coordinate={rest.coords}
                                pinColor="blue"
                                image={{ uri: rest.icon }}
                                onPress={() => this.openModal(3, rest)}
                            >
                                <Callout
                                // TODO:
                                // onPress={() => this.getRest(rest.coords)}
                                >
                                    <Text>{rest.name}</Text>
                                </Callout>
                            </Marker>
                        ))}
                        {/* TODO */}
                        <View>{this.getPath()}</View>
                    </MapView>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.push("List")}
                        style={styles.bubble}
                    >
                        <Text>Filter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.refreshMap()}
                        style={styles.bubble}
                    >
                        <Text>Refresh Location</Text>
                    </TouchableOpacity>
                </View>
                <View>{this.renderUserProfileModal()}</View>
                {/* <View>{this.renderFilterModal()}</View> */}
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
    },
    TouchableButton: {
        shadowColor: "rgba(0,0,0, .4)", // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: "#fff",
        elevation: 2, // Android
        height: 50,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    button: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    }
});
