import React, { Component } from "react";
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Dimensions,
    AsyncStorage
} from "react-native";
import { Card } from "react-native-elements";
import CustomCallout from "../component/CustomCallout";
import { Marker, ProviderPropType, Callout } from "react-native-maps";
import { MapView, Location, Permissions } from "expo";
import PersonList from "../component/PersonList";
import {
    getLoggedinUserName,
    updateLocationAndGetLocalUsers,
    getLocalUsers
} from "../services/user-service";

// import { SERVER_API } from "app/constants";

const { width, height } = Dimensions.get("window");

// TODO: Constants
const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -106.523;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
            git_username: "",
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            markers: [],
            popup: true
        };
    }

    componentWillMount() {
        this._initMap();
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
        const location = null; // await Location.getCurrentPositionAsync({enableHighAccuracy: true }); // {enableHighAccuracy: true}
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
            bio: localUser.bio
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
            markers
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
                    latitude: 55.1834026,
                    longitude: 55.523
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.maps}>
                    <MapView
                        provider={this.props.provider}
                        style={styles.map}
                        initialRegion={this.state.region}
                        region={this.state.region}
                    >
                        {this.state.markers.map(marker => (
                            <Marker
                                key={marker.key}
                                coordinate={marker.coordinate}
                                description="Information"
                                pinColor={marker.color}
                            >
                                <Callout tooltip style={styles.customView}>
                                    <CustomCallout>
                                        <Card key={marker.key}>
                                            <Text style={{ marginBottom: 10 }}>
                                                {" "}
                                                NAME: {marker.name}{" "}
                                            </Text>
                                            <Text style={{ marginBottom: 10 }}>
                                                {" "}
                                                USERNAME: {
                                                    marker.git_username
                                                }{" "}
                                            </Text>
                                            <Text style={{ marginBottom: 10 }}>
                                                {" "}
                                                BIO: {marker.bio}{" "}
                                            </Text>
                                        </Card>

                                        {/* {<Text>This is a custom callout bubble view</Text>} */}
                                    </CustomCallout>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.refreshMap()}>
                        <Text>RefershLocation</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cards}>
                    <PersonList markers={this.state.markers} />
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
        flex: 0.67
    },
    cards: {
        flex: 0.33
    },
    customView: {
        flex: 4
    }
});
