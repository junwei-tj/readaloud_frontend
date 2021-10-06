import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  View,
  FlatList,
  useColorScheme,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlayCircle,
  faClock,
  faShare,
  faTrash,
  faChevronCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import {COLORS, SIZES, FONTS} from '../constants/theme';
import {UserContext} from '../App';

export default function BookOptionsScreen({route, navigation}) {
  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);

  const { bookID, bookTitle, pages, lastProgress } = route.params; // Book selected retrieved from Home Screen

  const playAudiobook = () => {
    navigation.navigate('PlayAudioScreen', 
                          {
                            bookID: bookID, 
                            bookTitle: bookTitle, 
                            pages: pages, 
                            lastProgress: lastProgress 
                          });
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.backIcon}>
            <Pressable
              onPress={() => navigation.goBack()}
              android_ripple={{color: 'gray', borderless: true}}>
              <FontAwesomeIcon
                icon={faChevronCircleLeft}
                size={36}
                color={COLORS.grey}
                style={{margin: -1}}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.innerContainer}>
          <Text style={styles.innerContainerItems}>Book Title</Text>
        </View>

        <View style={styles.optionsContainer}>
          <Pressable
            onPress={() => playAudiobook()}
            android_ripple={{color: 'gray', borderless: true}}>
            <View style={styles.options}>
              <FontAwesomeIcon icon={faPlayCircle} size={30} color={'white'} />
              <Text style={styles.textStyle}>Play from saved progress</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              alert('Play from bookmark');
            }}
            android_ripple={{color: 'gray', borderless: true}}>
            <View style={styles.options}>
              <FontAwesomeIcon icon={faClock} size={30} color={'white'} />
              <Text style={styles.textStyle}>Play from bookmark</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              alert('Share audiobook');
            }}
            android_ripple={{color: 'gray', borderless: true}}>
            <View style={styles.options}>
              <FontAwesomeIcon icon={faShare} size={30} color={'white'} />
              <Text style={styles.textStyle}>Share audiobook</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              alert('Delete audiobook');
            }}
            android_ripple={{color: 'gray', borderless: true}}>
            <View style={styles.options}>
              <FontAwesomeIcon icon={faTrash} size={30} color={'white'} />
              <Text style={styles.textStyle}>Delete audiobook</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: COLORS.offblack,
  },
  topBar: {
    height: '10%',
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offblack,
  },
  backIcon: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  textStyle: {
    ...FONTS.body1,
    fontSize: 24,
    textAlign: 'center',
    // paddingVertical: 16,
    paddingHorizontal: 20,
    color: COLORS.white,
  },
  innerContainer: {
    height: '60%',
    width: '100%',
    paddingHorizontal: '5%',
    backgroundColor: COLORS.offblack,
  },
  innerContainerItems: {
    ...FONTS.body1,
    padding: '5%',
    height: '100%',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.saffron,
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookTitleStyle: {
    padding: '10%',
    fontSize: 24,
    color: 'white',
    alignItems: 'center',
  },
  optionsContainer: {
    height: '30%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    backgroundColor: COLORS.offblack,
    borderColor: 'white',
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: '2%',
  },
});
