import React, { useState, useEffect, createContext } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import BuildConfig from 'react-native-build-config';

import HomeScreen from './screens/HomeScreen';
import PlayAudioScreen from './screens/PlayAudioScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

export const UserContext = createContext();

export default function App() {

  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: BuildConfig.CLIENT_SERVER_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
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
    <UserContext.Provider value={{ signedIn, setSignedIn, userInfo, setUserInfo }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={signedIn ? "Home" : "Login"}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'ReadAloud'}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="PlayAudio" component={PlayAudioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
