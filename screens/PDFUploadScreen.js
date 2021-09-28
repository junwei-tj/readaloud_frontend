import React, {useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import {UserContext} from '../App';
import UploadButton from '../components/UploadButton';

export default function PDFUploadScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);

  console.log(userInfo);

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={{alignItems: 'center'}}>
        <Text>PDF Upload Screen</Text>
        <UploadButton />
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
