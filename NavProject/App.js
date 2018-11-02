import React from "react";
import { createRootNavigator } from "./app/router/route";
// import { isSignedIn } from "./auth";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
    };
  }

componentDidMount() {
}

  render() {
    const { signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}