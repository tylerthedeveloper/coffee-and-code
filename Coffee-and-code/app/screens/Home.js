import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Card } from "react-native-elements";
import CustomCallout from "./CustomCallout";
import MapView, { Marker, ProviderPropType, Callout } from "react-native-maps";
import { Location, Permissions } from "expo";
import PersonList from "../component/PersonList";

// import { SERVER_API } from "app/constants";

const { width, height } = Dimensions.get("window");

// TODO: Constants
const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -106.523;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

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
            markers: [],
            popup: true
        };
    }

    // TODO: verify exuction order
    componentWillMount() {
        this._initMap();
    }

    _initMap = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            // TODO: re-request for location permission
            throw new Error("Location permission not granted");
        } else {
            const location = await Location.getCurrentPositionAsync({}); // {enableHighAccuracy: true}
            const { latitude, longitude } = location.coords;
            const markers = [];
            this.setState({
                region: {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });

            console.log("");
            const response = await fetch(
                // TODO: CONST API SITE
                // TODO: Shouldnt this be query or is it already ???
                "https://code-and-coffee2.azurewebsites.net/users"
            );
            // TODO: test need for double await
            let responseJson = await response.json();
            let userInfoJson = responseJson.rows;

            // TODO: Push logged in user
            markers.push({
                coordinate: location.coords,
                key: id++,
                color: this.currentLocationColor(),
                name: "Tony Stark",
                git_username: "starktony",
                bio: "Ironman - Mechanic"
            });

            userInfoJson.map(user =>
                markers.push({
                    coordinate: {
                        latitude: user.current_latitude,
                        longitude: user.current_longitude
                    },
                    key: id++,
                    color: this.randomColor(),
                    name: user.name,
                    git_username: user.git_username,
                    bio: user.bio
                })
            );
            this.setState({
                markers
            });
        }
    };

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

                {/* TODO: EXTRACT OUT INTO PersonList COMPONENT */}

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
        flex: 0.67
    },
    cards: {
        flex: 0.33
    },
    customView: {
        flex: 4
    }
});
