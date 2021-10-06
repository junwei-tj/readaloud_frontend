import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  Alert,
  View,
  FlatList,
  useColorScheme,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlayCircle,
  faShare,
  faTrashAlt,
  faBookmark,
  faEdit,
  faChevronCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import {COLORS, SIZES, FONTS} from '../constants/theme';
import SimpleModal from '../components/SimpleModal';
import {UserContext} from '../App';

export default function BookOptionsScreen({route, navigation}) {

  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);
  const [option, setOption] = useState("");
  const { bookID, bookTitle, pages, lastProgress } = route.params; // Book selected retrieved from Home Screen
  const [isModalVisible, setIsModalVisible] = useState(false);
  const changeModalVisible = (bool) =>{
    setIsModalVisible(bool);
  }

  const playAudiobook = () => {
    navigation.navigate('PlayAudioScreen', 
                          {
                            bookID: bookID, 
                            bookTitle: bookTitle, 
                            pages: pages, 
                            lastProgress: lastProgress 
                          });
  }


  const playAudiobookBookmark = () => {
    navigation.navigate('PlayAudioScreen', 
                          {
                            bookID: bookID, 
                            bookTitle: bookTitle, 
                            pages: pages, 
                            lastProgress: lastProgress 
                          });
  }

  const shareAudiobook = () => {
    console.log("share audiobook");
  }

  const renameAudiobook = () => {
    console.log("rename audiobook");
    
  }

  const deleteAudiobook = () => {
    Alert.alert(
      "Deleting Audiobook",
      "Are you sure you would like to delete " + bookTitle + "?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            //TODO: Add delete implementation
            //Alert.alert("Delete selected");
          }
        },
      ]
    );
  }

  function renderTopBar(){
    return (
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
    )
  }

  function renderModal(){
    return (
      <Modal
        transparent = {true}
        animationType = 'fade'
        visible = {isModalVisible}
        onRequestClose = {() => changeModalVisible(false)}>
          <SimpleModal
            changeModalVisible={changeModalVisible}
            //setData = {setData}
            renameAudiobook={renameAudiobook}
            shareAudiobook={shareAudiobook}
            bookTitle={bookTitle}
            option={option} />
      </Modal>
    )
  }

  function renderOptionsMenu(){
    return (
      <View style={styles.optionsContainer}>
      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.options2]}
        onPress={() => playAudiobook()}>
        <View style={styles.options}>
          <FontAwesomeIcon icon={faPlayCircle} size={30} color={'white'} />
          <Text style={styles.textStyle}>Play from saved progress</Text>
        </View>
      </Pressable>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.options2]}
        onPress={() => alert('Play from bookmark')}>
        <View style={styles.options}>
          <FontAwesomeIcon icon={faBookmark} size={30} color={'white'} />
          <Text style={styles.textStyle}>Play from bookmark</Text>
        </View>
      </Pressable>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.options2]}
        onPress={() => {
          setOption("share");
          changeModalVisible(true);
        }}>
        <View style={styles.options}>
          <FontAwesomeIcon icon={faShare} size={30} color={'white'} />
          <Text style={styles.textStyle}>Share audiobook</Text>
        </View>
      </Pressable>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.options2]}
        onPress={() => {
          setOption("rename");
          changeModalVisible(true);
        }}>
        <View style={styles.options}>
          <FontAwesomeIcon icon={faEdit} size={30} color={'white'} />
          <Text style={styles.textStyle}>Rename audiobook</Text>
        </View>
      </Pressable>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.options2]}
        onPress={() => deleteAudiobook()}>
        <View style={styles.options}>
          <FontAwesomeIcon icon={faTrashAlt} size={30} color={'white'} />
          <Text style={styles.textStyle}>Delete audiobook</Text>
        </View>
      </Pressable>
    </View>
    )
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {renderTopBar()}
        <View style={styles.innerContainer}>
          <Text style={styles.innerContainerItems}>{bookTitle}</Text>
        </View>
        {renderModal()}
        {renderOptionsMenu()}
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
    height: '50%',
    width: '100%',
    paddingHorizontal: '15%',
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
    height: '40%',
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
  },
  options2: {
    paddingVertical: 5
  }
});
