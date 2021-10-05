import React, {useState, useEffect, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import BuildConfig from 'react-native-build-config';

import HomeScreen from './screens/HomeScreen';
import PlayAudioScreen from './screens/PlayAudioScreen';
import SongOptionsScreen from './screens/SongOptionsScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import PDFUploadScreen from './screens/PDFUploadScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        name="SongOptionsScreen"
        component={SongOptionsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: BuildConfig.CLIENT_SERVER_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      //  webClientId: BuildConfig.webClientId, // use this webClientId for ios
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
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
      value={{signedIn, setSignedIn, userInfo, setUserInfo}}>
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

                // You can return any component that you like here!
                // return <Ionicons name={iconName} size={size} color={color} />;
                return (
                  <FontAwesomeIcon icon={iconName} size={25} color={'black'} />
                );
              },

              tabBarActiveTintColor: 'black',
              tabBarActiveBackgroundColor: 'lightgrey',
              tabBarInactiveTintColor: 'gray',
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
