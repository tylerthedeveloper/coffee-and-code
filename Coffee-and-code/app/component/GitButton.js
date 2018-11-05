import * as React from 'react';
import { FontAwesome as Icon } from '@expo/vector-icons';
import {View} from 'react-native';

export default class GithubButton extends React.PureComponent {
  render() {
    return (
    <div>
      <Icon.Button name="github" color="black" backgroundColor="transparent" onPress={this.props.onPress} font-size="50px">
        Sign In with Github
      </Icon.Button>
    </div>
    );
  }
}
