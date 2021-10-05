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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>PDF Upload Screen</Text>

      <View style={styles.uploadComponent}>
        <UploadButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c3d5de',
  },
  title: {
    top: 0,
    bottom: 100,
    fontWeight: 'bold',
    fontSize: 20,
  },

  uploadComponent: {
    top: 100,
    left: 50,
    height: '100%',
    width: '100%',
  },

  // input: {
  //   height: 40,
  //   margin: 12,
  //   width: '80%',
  //   borderWidth: 1,
  //   padding: 10,
  // },
});
