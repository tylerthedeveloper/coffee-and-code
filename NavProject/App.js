import React from "react";
import { createRootNavigator } from "./router/route";
// import { isSignedIn } from "./auth";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
    };
  }

  componentDidMount() {
    
    // isSignedIn()
    //   .then(res => this.setState({ signedIn: res}))
    //   .catch(err => alert("An error occurred"));
  }

  render() {
    const { signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}