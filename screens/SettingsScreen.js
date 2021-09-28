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
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={{alignItems: 'center'}}>
        <Text>Settings Screen</Text>

        <Text>{userInfo.user.email}</Text>
        <Button onPress={signOut} title="LogOut" color="red" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: '80%',
    borderWidth: 1,
    padding: 10,
  },
});
