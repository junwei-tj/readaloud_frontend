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
import { COLORS } from '../constants/theme';

export default function PDFUploadScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
    backgroundColor: COLORS.offblack,
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
