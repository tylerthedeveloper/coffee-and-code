import React, {Component} from 'react';
import { ScrollView, Text, Linking, View, Alert, Platform, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
// import { Card, Button } from "react-native-elements";
import { } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Marker, ProviderPropType } from 'react-native-maps';
import { Constants, Location, Permissions } from 'expo';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 39.1834026;
const LONGITUDE = -106.523;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;


function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const images = [
  {
    key: 1,
    name: "Nathan Anderson",
    // image: require("../images/1.jpg"),
    // url: "https://unsplash.com/photos/C9t94JC4_L8"
  },
  {
    key: 2,
    name: "Jamison McAndie",
    // image: require("../images/2.jpg"),
    // url: "https://unsplash.com/photos/waZEHLRP98s"
  },
  {
    key: 3,
    name: "Alberto Restifo",
    // image: require("../images/3.jpg"),
    // url: "https://unsplash.com/photos/cFplR9ZGnAk"
  },
  {
    key: 4,
    name: "John Towner",
    // image: require("../images/4.jpg"),
    // url: "https://unsplash.com/photos/89PFnHKg8HE"
  }
];

export default class Home extends Component<Props> {
  constructor(props) {
    super(props)
    // this.state = {
    //   response: null
    // }
    // const networkInterface = new ApolloClient({
    //   link: new HttpLink({ uri: 'http://localhost:8080/graphql' })
    // });
    // this.client = new ApolloClient({
    //   networkInterface,
    //   dataIdFromObject: r => r.id,
    // });
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
    };
  }

  onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor(),
        },
      ],
    });
    console.log(e.nativeEvent.coordinate);
  }

  componentWillMount() {
    this._getLocationAsync();
  }


  _getLocationAsync = async () => {  
      let location = await Location.getCurrentPositionAsync({});

      this.setState({
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        markers: [],
      });
  }

  render() {
    const { region } = this.props;
    console.log("latitude " + this.state.region.latitude + " longitude " + this.state.region.longitude);
    return (
        <View style={styles.container}>
            <MapView
              provider={this.props.provider}
              style={styles.map}
              initialRegion={this.state.region}
              onPress={(e) => this.onMapPress(e)}
            >
              {this.state.markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  description={"Information"}
                  pinColor={marker.color}
                />
              ))}
            </MapView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.setState({ markers: [] })}
                style={styles.bubble}
              >
                <Text>Tap to create a marker of random color</Text>
              </TouchableOpacity>
            </View>
        </View>
      );
  }
}

Home.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
