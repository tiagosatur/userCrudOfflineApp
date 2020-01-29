import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
    Home,
} from './screens';

const AppNavigator = createStackNavigator({
    Home: {
        screen: (props) => <Home {...props} />,
        headerShown: false
    },
}, {
    initialRouteName: 'Home'
});

export default createAppContainer(AppNavigator);