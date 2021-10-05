import React, { useContext } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  useColorScheme,
  StyleSheet,
  Image,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { UserContext } from '../App';
import { loginUser } from '../components/APICaller';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '25%',
    resizeMode: 'contain',
  },
  title: {
    // fontFamily: 'sans-serif-light',
    // fontWeight: 'bold',
    // fontSize: 48,
    ...Platform.select({
      ios: { fontFamily: 'helvetica',fontWeight: 'bold',fontSize: 48, }, 
      android: { fontFamily: 'sans-serif-light',fontWeight: 'bold',fontSize: 48, }
 })
  },
  caption: {
    fontStyle: 'italic',
    fontSize: 24,
  },
  signInButton: { 
    width: '60%', 
    height: 48,
    marginTop: 128, 
  }
});

GoogleSignin.configure(); // mandatory to call this method before attempting to call signIn() and signInSilently()

export default function Login({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const { setSignedIn, setUserInfo } = useContext(UserContext);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let res = await loginUser(userInfo.user); //send API call to server to login
      setUserInfo(userInfo);
      setSignedIn(true);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../images/audiobook.png")} />
        <Text style={styles.title}>ReadAloud</Text>
        <Text style={styles.caption}>Audiobooks Made Easy</Text>
        <GoogleSigninButton
          style={styles.signInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => signIn(navigation)}
        />        
      </View>
    </SafeAreaView>
  );
}
