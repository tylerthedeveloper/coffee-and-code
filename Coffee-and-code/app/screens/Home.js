import React, { Component } from "react";
import {
    ScrollView,
    Text,
    Linking,
    View,
    Alert,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { Card, Button } from "react-native-elements";

import {} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Marker, ProviderPropType } from "react-native-maps";
import { Constants, Location, Permissions } from "expo";

const { width, height } = Dimensions.get("window");

// TODO: Constants
const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -86.523;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

const images = [
    {
        key: 1,
        name: "Nathan Anderson"
        // image: require("../images/1.jpg"),
        // url: "https://unsplash.com/photos/C9t94JC4_L8"
    },
    {
        key: 2,
        name: "Jamison McAndie"
        // image: require("../images/2.jpg"),
        // url: "https://unsplash.com/photos/waZEHLRP98s"
    },
    {
        key: 3,
        name: "Alberto Restifo"
        // image: require("../images/3.jpg"),
        // url: "https://unsplash.com/photos/cFplR9ZGnAk"
    },
    {
        key: 4,
        name: "John Towner"
        // image: require("../images/4.jpg"),
        // url: "https://unsplash.com/photos/89PFnHKg8HE"
    }
];

// TODO: change id to this.state.markers.length

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
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            markers: []
        };
    }

    onMapPress(e) {
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: e.nativeEvent.coordinate,
                    key: id++,
                    color: randomColor()
                }
            ]
        }).catch(error => {
            console.log("Api call error");
            alert(error.message);
        });
        // console.log(e.nativeEvent.coordinate);
    }

    resetInit() {
        curlatitude = this.state.markers[0].coordinate.latitude;
        curlongitude = this.state.markers[0].coordinate.longitude;
        curcoordinate = this.state.markers[0].coordinate;
        (id = 0),
            this.setState({
                region: {
                    latitude: curlatitude,
                    longitude: curlongitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                },
                // TODO: REMOVE
                markers: [
                    {
                        coordinate: curcoordinate,
                        key: id++,
                        color: this.currentLocationColor(),
                        name: "Tony Stark",
                        git_username: "starktony",
                        bio: "Ironman - Mechanic"
                    }
                ]
            }).catch(error => {
                console.log("Api call error");
                alert(error.message);
            });
    }

    // TODO: verify exuction order
    componentWillMount() {
        // TODO: Combine like promises
        this._getLocationAsync();
        this._preLoadUsers();
    }

    _getLocationAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            // TODO: re-request for location permission
            throw new Error("Location permission not granted");
        } else {
            const location = await Location.getCurrentPositionAsync({}); // {enableHighAccuracy: true}
            id = 0;
            this.setState({
                region: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                },
                markers: [
                    {
                        coordinate: location.coords,
                        key: id++,
                        color: this.currentLocationColor(),
                        name: "Tony Stark",
                        git_username: "starktony",
                        bio: "Ironman - Mechanic"
                    }
                ]
            });
        }
    };

    _preLoadUsers = async () => {
        try {
            let response = await fetch(
                // TODO: CONST API SITE
                "https://coffee-and-code.azurewebsites.net/users"
            );
            let responseJson = await response.json();
            //   console.log(responseJson.rows);
            let userInfoJson = responseJson.rows;
            id = 1;
            //   console.log(userInfoJson)
            {
                userInfoJson.map(user =>
                    this.setState({
                        markers: [
                            ...this.state.markers,
                            {
                                coordinate: {
                                    latitude: user.current_latitude,
                                    longitude: user.current_longitude
                                },
                                key: id++,
                                color: this.randomColor(),
                                name: user.name,
                                git_username: user.git_username,
                                bio: user.bio
                            }
                        ]
                    })
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const { region } = this.props;
        // console.log(
        //     `latitude ${this.state.region.latitude} longitude ${
        //         this.state.region.longitude
        //     }`
        // );
        return (
            <View style={styles.container}>
                <View style={styles.maps}>
                    <MapView
                        provider={this.props.provider}
                        style={styles.map}
                        initialRegion={this.state.region}
                        // onPress={e => this.onMapPress(e)}
                    >
                        {this.state.markers.map(marker => (
                            // console.log(marker.coordinate),
                            <Marker
                                key={marker.key}
                                coordinate={marker.coordinate}
                                description="Information"
                                pinColor={marker.color}
                            />
                        ))}
                    </MapView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => this.resetInit()}
                            style={styles.bubble}
                        >
                            <Text>Tap to create a marker of random color</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* TODO: EXTRACT OUT INTO PersonList COMPONENT */}
                <View style={styles.cards}>
                    <ScrollView>
                        {this.state.markers.map(marker => (
                            <Card key={marker.key}>
                                <Text style={{ marginBottom: 10 }}>
                                    {" "}
                                    NAME: {marker.name}{" "}
                                </Text>
                                <Text style={{ marginBottom: 10 }}>
                                    {" "}
                                    USERNAME: {marker.git_username}{" "}
                                </Text>
                                <Text style={{ marginBottom: 10 }}>
                                    {" "}
                                    BIO: {marker.bio}{" "}
                                </Text>
                            </Card>
                        ))}
                    </ScrollView>
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
        // justifyContent: "flex-end",
        // alignItems: "center"
        flex: 1,
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
        // height: 400,
        flex: 0.67
    },
    cards: {
        flex: 0.33
    }
});
