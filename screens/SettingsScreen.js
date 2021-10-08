import React, {useContext, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  View,
  useColorScheme,
  Image,
  ScrollView,
} from 'react-native';

import {UserContext} from '../App';
import {StackActions} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {FONTS, COLORS} from '../constants/theme';

export default function SettingsScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const {setSignedIn, userInfo, setUserInfo, notifications} =
    useContext(UserContext);

  useEffect(() => {
    console.log('1: ' + notifications);
  }, []);

  console.log('2: ' + notifications);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setSignedIn(false);
      setUserInfo(null); // Remember to remove the user from your app's state as well
      navigation.dispatch(StackActions.popToTop());
    } catch (error) {
      console.error(error);
    }
  };

  //this function returns uri of default photo if userInfo is null
  function renderPhotoSource() {
    const photoSource = userInfo
      ? userInfo.user.photo
      : 'https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png';
    console.log('defaultPhotoSource is: ' + photoSource);
    return photoSource;
  }

  function renderNotification(notifications) {
    console.log('notif obj: ' + JSON.stringify(notifications) + '\n');
    console.log(JSON.stringify(notifications).notifications);
    // if (notifications != null) {
    //   let viewArray = [];
    //   for (let i = 0; i < notifications.length; i++) {
    //     viewArray.push(
    //       <View key={i}>
    //         <View style={styles.innerNotificationContainer}>
    //           <Text style={styles.notificationTextStyle}>viewArray[i]</Text>
    //         </View>
    //       </View>,
    //     );
    //   }
    //   return {viewArray};
    // }

    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <View style={{alignItems: 'center'}}> */}
      <Image
        source={{uri: renderPhotoSource()}}
        style={styles.profilePic}

        // source={{
        //   uri: userInfo.user.photo,
        // }}
        // style={styles.profilePic}
      />

      <Text style={styles.name}>{userInfo ? userInfo.user.name : null} </Text>

      <Text style={styles.notificationTitleSyle}>Notification Centre</Text>

      <ScrollView style={styles.outerNotificationContainer}>
        {/* {renderNotification(userInfo)} */}
        <Text style={styles.innerNotificationContainer}>
          <Text style={styles.notificationTextStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            aliquet malesuada turpis quis ullamcorper.' + 'Donec pharetra
          </Text>
        </Text>

        <Text style={styles.innerNotificationContainer}>
          <Text style={styles.notificationTextStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            aliquet malesuada turpis quis ullamcorper.' + 'Donec pharetra
          </Text>
        </Text>

        <Text style={styles.innerNotificationContainer}>
          <Text style={styles.notificationTextStyle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            aliquet malesuada turpis quis ullamcorper.' + 'Donec pharetra
          </Text>
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={signOut}
          title="LogOut"
          color="red"
        />
      </View>
      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    // alignContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLORS.offblack,
  },

  icon: {
    marginTop: 100,
    color: COLORS.white,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.saffron,
    fontWeight: 'bold',
    paddingTop: 10,
    alignSelf: 'center',
    paddingBottom: 20,
  },

  buttonContainer: {
    flexDirection: 'column',
  },

  button: {
    color: 'tomato',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 10,
    borderColor: 'white',
    alignSelf: 'center',
  },
  outerNotificationContainer: {
    marginTop: 10,
    padding: 20,
    height: '50%',
  },
  innerNotificationContainer: {
    borderWidth: 5,
    borderColor: 'grey',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  notificationTitleSyle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginLeft: 20,
  },
  notificationTextStyle: {
    fontSize: 16,
    color: COLORS.white,
  },
});
