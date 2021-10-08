import React, { useRef, useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  useColorScheme,
  StyleSheet,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { UserContext } from '../App';
import { loginUser } from '../components/APICaller';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offblack
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
      ios: { fontFamily: 'helvetica',fontWeight: 'bold',fontSize: 48, color: COLORS.white}, 
      android: { fontFamily: 'sans-serif-light',fontWeight: 'bold',fontSize: 48, color: COLORS.white}
 })
  },
  caption: {
    fontStyle: 'italic',
    fontSize: 24,
    color: COLORS.white
  },
  signInButton: { 
    width: '60%', 
    height: 48,
    marginTop: 100, 
  }
});

GoogleSignin.configure(); // mandatory to call this method before attempting to call signIn() and signInSilently()

export default function Login({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const { setSignedIn, setUserInfo, setNotifications } = useContext(UserContext);
  const [loadSplash, setLoadSplash] = useState(false);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let res = await loginUser(userInfo.user); //send API call to server to login
      if (res){
        setNotifications(res);
      }
      setUserInfo(userInfo);
      setLoadSplash(!loadSplash);
      // Allow user info to finish loading before setting signedIn to true
      setTimeout(function() {
        setSignedIn(true);
      }, 4000);
      
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

  const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  
    useEffect(() => {
      if(loadSplash == true){
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }
        ).start();
      }
    }, [loadSplash])
  
    return (
      <Animated.View
        style={{
          ...props.style,
          opacity: fadeAnim,
        }}
      >
        {props.children}
      </Animated.View>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../images/audiobook.png")} />
        <Text style={styles.title}>ReadAloud</Text>
        <Text style={styles.caption}>Audiobooks Made Easy</Text>
        <FadeInView style={{width: 250, height: 150, backgroundColor: COLORS.offblack, paddingTop: 40}}>
          <ActivityIndicator
            size = "large"
            color = {COLORS.saffron}
          />
          <Text style={styles.caption}>Loading, please wait......</Text>
        </FadeInView>
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
