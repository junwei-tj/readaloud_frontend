import React, {useState, useEffect, createContext} from 'react';
import { Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import BuildConfig from 'react-native-build-config';

import HomeScreen from './screens/HomeScreen';
import PlayAudioScreen from './screens/PlayAudioScreen';
import BookOptionsScreen from './screens/BookOptionsScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import PDFUploadScreen from './screens/PDFUploadScreen';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const UserContext = createContext();

function HomeScreenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PlayAudioScreen"
        component={PlayAudioScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookOptionsScreen"
        component={BookOptionsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      ...Platform.select({ // client ID of type WEB for your server (needed to verify user ID and offline access)
        ios: {
          webClientId: BuildConfig.webClientId, // for iOS
        },
        android: {
          webClientId: BuildConfig.CLIENT_SERVER_ID, // for Android
        }
      })
    });

    // check if user is signed in
    const isSignedIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        const currentUser = await GoogleSignin.getCurrentUser();
        setSignedIn(true);
        setUserInfo(currentUser);
      }
    };
    isSignedIn();
  }, []);

  return (
    <UserContext.Provider
      value={{signedIn, setSignedIn, userInfo, setUserInfo, notifications, setNotifications}}>
      <NavigationContainer>
        {!signedIn ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        ) : (
          <Tab.Navigator
            initialRouteName="HomeScreen"
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
            barStyle={{backgroundColor: '#992999'}}
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Home') {
                  // wk 0030 29Sep21 update: original code iconName = focused ? faHome : 'home';
                  iconName = faHome;
                } else if (route.name === 'PDFUpload') {
                  iconName = faPlusCircle;
                } else if (route.name === 'Settings') {
                  iconName = faUserCircle;
                }
                return (
                  <FontAwesomeIcon icon={iconName} size={25} color={'black'} />
                );
              },
              tabBarActiveTintColor: 'black',
              tabBarActiveBackgroundColor: 'lightgrey',
              tabBarInactiveTintColor: 'gray',
              tabBarShowLabel: false,
              tabBarHideOnKeyboard: true,
            })}>
            <Tab.Screen
              name="Home"
              component={HomeScreenStack}
              options={{headerShown: false}}
            />
            <Tab.Screen
              name="PDFUpload"
              component={PDFUploadScreen}
              options={{headerShown: false}}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{headerShown: false}}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </UserContext.Provider>
  );
}
