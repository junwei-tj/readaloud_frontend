import React, {useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  View,
  useColorScheme,
} from 'react-native';

import {UserContext} from '../App';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {COLORS} from '../constants/theme';
import {tsModuleDeclaration} from '@babel/types';

export default function SettingsScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setSignedIn(false);
      setUserInfo(null); // Remember to remove the user from your app's state as well
      //navigation.replace("Login")
    } catch (error) {
      console.error(error);
    }
  };

  console.log(userInfo);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{alignItems: 'center'}}>
        {/* <Text>Settings Screen</Text> */}

        <FontAwesomeIcon
          style={styles.icon}
          icon={faUserCircle}
          size={100}
          // color={'black'}
        />
        <Text style={styles.name}>{userInfo.user.name}</Text>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} title="bookmarks" color="tomato" />
          <Button
            style={styles.button}
            onPress={signOut}
            title="LogOut"
            color="red"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: COLORS.offblack,
  },

  icon: {
    marginTop: 100,
    color: COLORS.white,
  },
  name: {
    color: COLORS.saffron,
    fontSize: 20,
    fontWeight: 'bold',
  },

  buttonContainer: {
    marginTop: 150,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    width: 200,
    height: 200,

    flexDirection: 'column',
    position: 'relative',
  },

  button: {
    color: 'tomato',
  },
  // input: {
  //   height: 40,
  //   margin: 12,
  //   width: '80%',
  //   borderWidth: 1,
  //   padding: 10,
  // },
});
