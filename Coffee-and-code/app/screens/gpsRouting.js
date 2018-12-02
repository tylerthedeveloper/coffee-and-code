import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker, ProviderPropType, Callout } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import getDirections from "react-native-google-maps-directions";

const coords = [
    {
        latitude: 39.176465,
        longitude: -86.513689
    },
    {
        latitude: 39.168755,
        longitude: -86.499885
    }
];
const GOOGLE_MAPS_APIKEY = "AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y";
export default class App extends React.Component {
    state = {
        nearbyLocations: []
    };

    handleGetDirections = () => {
        const data = {
            source: {
                latitude: -33.8356372,
                longitude: 18.6947617
            },
            destination: {
                latitude: -33.8600024,
                longitude: 18.697459
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
        };
        const restaurantPromise = fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
                coords[0].latitude
            },${
                coords[0].longitude
            }&radius=1000&type=cafe&key=AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                    // TODO: Credentials / accesstoken
                }
            }
        );

        restaurantPromise
            .then(res => res.json())
            .then(resData => {
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
            })
            .then(() => getDirections(data));
    };

    render() {
        console.log(this.state.nearbyLocations);
        return (
            <View style={styles.container}>
                <View style={styles.maps}>
                    <MapView
                        initialRegion={{
                            latitude: 39.176465,
                            longitude: -86.499885,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }}
                        style={styles.map}
                    >
                        <Marker coordinate={coords[0]} pinColor="red" />
                        <Marker coordinate={coords[1]} pinColor="blue" />
                        {this.state.nearbyLocations.map(rest => (
                            <Marker coordinate={rest.coords} pinColor="blue" />
                        ))}
                        <MapViewDirections
                            origin={coords[0]}
                            destination={coords[1]}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="steelblue"
                            mode="driving"
                        />
                    </MapView>
                </View>
                <Button
                    onPress={this.handleGetDirections}
                    title="Get Directions"
                />
            </View>
        );
    }
}

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
    maps: {
        flex: 1
    }
});
