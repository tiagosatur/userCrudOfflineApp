import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
    Home,
} from './screens';

const AppNavigator = createStackNavigator({
    Home: {
        screen: (props) => <Home {...props} />,
        // navigationOptions: { header: null }
    },
    
},
{
    initialRouteName: 'Home',
    headerMode: 'none',
});

export default createAppContainer(AppNavigator);