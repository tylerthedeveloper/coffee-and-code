import getDirections from "react-native-google-maps-directions";

export const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const currentLocationColor = () => {
  return `#${Math.floor(1 * 16777215).toString(16)}`;
};

// TODO: Calculate difference ... function
export const shouldUpdateLocation = (storedLocation, location) => {
  return false;
};

export const onRecommendLocations = coordinate => {
  const restaurantPromise = fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
      coordinate.latitude
    },${
      coordinate.longitude
    }&radius=2000&type=cafe&key=AIzaSyAPaNuHNAHk4NSk4TLnN_ngI8Dgm-_W74Y`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json"
        // TODO: Credentials / accesstoken
      }
    }
  );
  return restaurantPromise.then(res => res.json()).then(resData => {
    const nearbyLocations = resData.results.map(res => {
      return {
        name: res.name,
        coordinate: {
          latitude: res.geometry.location.lat,
          longitude: res.geometry.location.lng
        },
        icon: res.icon
      };
    });
    return nearbyLocations;
    // this.setState({
    //     visibleModal: null,
    //     nearbyLocations: allRestaurants
    // });
  });
};

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

export const handleGetDirections = (source, destination) => {
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
  // this.setState({ visibleModal: null });
  getDirections(data);
};

// getRest = destination => {
//     let current_location = {
//         latitude: this.state.region.latitude,
//         longitude: this.state.region.longitude
//     };
//     this.handleGetDirections(current_location, destination);
// };
