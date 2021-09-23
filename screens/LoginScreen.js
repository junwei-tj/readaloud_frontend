import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  View,
  useColorScheme,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { UserContext } from '../App';

GoogleSignin.configure(); // mandatory to call this method before attempting to call signIn() and signInSilently()

export default function Login({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const { setSignedIn, setUserInfo } = useContext(UserContext);
  const [signingIn, setSigningIn] = useState(false);


  const signIn = async (navigation) => {
    try {
      await GoogleSignin.hasPlayServices();
      setSigningIn(true);
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setSignedIn(true);
      setSigningIn(false);
      console.log(userInfo);
      navigation.replace("Home")
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={{ alignItems: 'center' }}>
        <Text>Login Screen</Text>
        <GoogleSigninButton
          style={{ width: 256, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => signIn(navigation)}
          disabled={signingIn}
        />        
      </View>
    </SafeAreaView>
  );
}
