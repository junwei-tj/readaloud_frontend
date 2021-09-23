import React, { useContext } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  View,
  useColorScheme,
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { UserContext } from '../App';

export default function HomeScreen({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const { setSignedIn, userInfo, setUserInfo } = useContext(UserContext);
  console.log(userInfo);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setSignedIn(false);
      setUserInfo(null); // Remember to remove the user from your app's state as well
      navigation.replace("Login")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <View style={{ alignItems: 'center' }}>
        <Text>Home Screen</Text>
        <Button
            title="Play Audio"
            onPress={() => navigation.navigate('PlayAudio')}
        />
        <Text>Hello {userInfo ? userInfo.user.name : ""}</Text>
        <Button
          onPress={signOut}
          title="LogOut"
          color="red"
        />
      </View>
    </SafeAreaView>
  );
}