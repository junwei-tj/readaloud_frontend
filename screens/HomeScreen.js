import React, { useContext } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  View,
  useColorScheme,
} from 'react-native';

import { UserContext } from '../App';

export default function HomeScreen({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const { setSignedIn, userInfo, setUserInfo } = useContext(UserContext);
  console.log(userInfo);

  return (
    
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <View style={{ alignItems: 'center' }}>
        <Text>Home Screen</Text>
        <Button
            title="Play Audio"
            onPress={() => navigation.navigate('PlayAudioScreen')}
        />
        <Text>Hello {userInfo ? userInfo.user.name : ""}</Text>
        
      </View>
    </SafeAreaView>
  );
}