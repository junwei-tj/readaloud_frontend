import React, {useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
} from 'react-native';

import {UserContext} from '../App';
import {StackActions, CommonActions} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {FONTS, COLORS} from '../constants/theme';

export default function SettingsScreen({navigation}) {

  const {setSignedIn, userInfo, setUserInfo, notifications} = useContext(UserContext);

  // Signs the user out
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setSignedIn(false);
      setUserInfo(null);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes:[
            {name: "HomeScreenStack"}
          ]
        })
      )
    } catch (error) {
      console.error(error);
    }
  };

  //Returns uri of default photo if userInfo is null
  function renderPhotoSource() {
    const photoSource = userInfo
      ? userInfo.user.photo
      : 'https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png';
    return photoSource;
  }

  // Renders notifications by pushing Views with the notification text into the ScrollView 
  function renderNotifications() {
    if (notifications.notifications?.length) {
      let viewArray = [];
      for (let i = 0; i < notifications.notifications.length; i++) {
        viewArray.push(
          <View key={i}>
            <View style={styles.innerNotificationContainer}>
              <Text style={styles.notificationTextStyle}>{notifications.notifications[i]}</Text>
            </View>
          </View>,
        );
      }
      return viewArray;
    } else {
      return (
        <View style={styles.innerNotificationContainer}>
            <Text style={styles.notificationTextStyle}>No new notifications!</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar barStyle="dark-content" />
      <Image
        source={{uri: renderPhotoSource()}}
        style={styles.profilePic}
      />

      <Text style={styles.name}>{userInfo ? userInfo.user.name : null} </Text>
      <Text style={styles.notificationTitleSyle}>New Notifications</Text>

      <ScrollView style={styles.outerNotificationContainer}>
        {
          notifications ? renderNotifications() : 
          <View style={styles.innerNotificationContainer}>
              <Text style={styles.notificationTextStyle}>No new notifications!</Text>
          </View>
        }
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={signOut}
          title="LogOut"
          color="red"
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.offblack,
  },
  icon: {
    marginTop: 100,
    color: COLORS.white,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.blue,
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
    borderWidth: 5,
    borderColor: 'white',
    alignSelf: 'center',
    marginTop: 50
  },
  outerNotificationContainer: {
    marginTop: 10,
    padding: 20,
    height: '50%',
  },
  innerNotificationContainer: {
    borderWidth: 3,
    borderColor: 'grey',
    borderRadius: 10,
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
