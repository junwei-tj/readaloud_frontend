import React, {useState, useRef, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Alert,
  View,
  FlatList,
  useColorScheme,
  StyleSheet,
  Modal,
  TextInput,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteAudiobookFile, updateAudiobookName, shareAudiobookFile } from '../components/APICaller';
import SimpleModal from '../components/SimpleModal';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {UserContext} from '../App';

export default function BookOptionsScreen({route, navigation}) {

  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);
  const { bookID, bookTitle, pages, lastProgress } = route.params; // Book selected retrieved from Home Screen
  const [currentBookTitle, setCurrentBookTitle] = useState(bookTitle);

  // For bookmarks
  const panelRef = useRef(null);
  const [bookmarks, setBookmarks] = useState(lastProgress.bookmarks);

  // States required for modal
  const [option, setOption] = useState("");
  const [input, setInput] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  //const [modalText, setModalText] = useState("Downloading audiobook text...");
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const changeModalVisible = (bool) =>{
  //   setIsModalVisible(bool);
  // }

  function renderModal(){
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          {option === "share" ?
          <>
            <Text style = {styles.modalText}>
              Who would you like to share {bookTitle} with:
            </Text>
            <TextInput 
              style = {styles.input}
              placeholder = "Enter email of person to share to"
              onChangeText = {(val) => setInput(val)} 
            />
          </> : <>
            <Text style = {styles.modalText}>
              What would you like to rename {bookTitle} to:
            </Text> 
            <TextInput 
            style = {styles.input}
            placeholder = "Enter new name of audiobook"
            onChangeText = {(val) => setInput(val)} 
            />
          </>}
            <View style ={styles.buttonsView}>
            <Pressable
              style = {styles.activeButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                setInput(null);
              }}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style = {!Boolean(input) ? styles.inactiveButton : styles.activeButton}
              onPress={() => {
                option === "share" ? shareAudiobook(input) : renameAudiobook(input);
                setModalVisible(!modalVisible);
                setInput(null);
              }}
              disabled = {!Boolean(input)}
            >
              <Text>Confirm</Text>
            </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }


  //Bookmark rendered in Flatlist
  const Bookmark = ({ name, page }) => {
    return (
      <View style={styles.bookmarkContainer}>
        <Text style={styles.bookmarkText}>{name}</Text>
        <Text style={styles.bookmarkText}>{page}</Text>
      </View>
    )
  }

  // Rendering of bookmark
  const renderItem = ({ item }) => (
    <Pressable 
      style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}
      onPress={() => playAudiobookFromBookmark(item)} 
      android_ripple={{color: 'dimgray'}}
    >
      <Bookmark name={item.name} page={item.page} />
    </Pressable>
  )

  //COMPLETED
  const playAudiobook = () => {
    navigation.navigate('PlayAudioScreen', 
                          {
                            bookID: bookID, 
                            bookTitle: currentBookTitle, 
                            pages: pages, 
                            lastProgress: lastProgress 
                          });
  }

  //COMPLETED
  const playAudiobookFromBookmark = (item) => {
    panelRef.current.hide();
    setTimeout(function() {
      navigation.navigate('PlayAudioScreen', 
                          {
                            bookID: bookID, 
                            bookTitle: currentBookTitle, 
                            pages: pages, 
                            lastProgress: {
                              ...lastProgress,
                              currentSentence: 1,
                              currentPage: item.page,
                            }
                          });
    }, 800);
  }

  //COMPLETED
  const shareAudiobook = async(emailToShareTo) => {
    let response = await shareAudiobookFile(userInfo.user.id, bookID, emailToShareTo);

    if (response){ //Share successful
      Alert.alert(
        bookTitle,
        "Sharing of audiobook was successful!",
        [
          {
            text: "Yay!",
            style: "cancel",
          }
        ],
      );
    } else { //Share unsuccessful
      Alert.alert(
        bookTitle,
        "Sharing of audiobook was unsuccessful, email might be invalid or user might have access to the audiobook already!",
        [
          {
            text: "Back",
            style: "cancel",
          }
        ],
      );
    }
  }

  //COMPLETED
  const renameAudiobook = async(newName) => {
    let response = await updateAudiobookName(bookID, userInfo.user.id, newName);
    if (response){ //Rename successful
      Alert.alert(
        newName,
        "Rename of audiobook was successful!",
        [
          {
            text: "Yay!",
            style: "cancel",
          }
        ],
      );
      setCurrentBookTitle(newName);
    } else { // Rename unsuccessful
      Alert.alert(
        "Oh No!", 
        "Rename of audiobook was not successful, please try again!", 
        [
          {
            text: "Back",
            style: "cancel",
          }
        ],
      );
    }
  }

  //COMPLETED
  const deleteAudiobook = async() => {
    Alert.alert(
      bookTitle,
      "Are you sure you would like to delete this audiobook?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Delete from Server",
          onPress: async() => {
            let response = await deleteAudiobookFile(bookID, userInfo.user.id);
            if (response === 204){ //Delete successful
              await AsyncStorage.removeItem(bookID);
              Alert.alert(
                bookTitle,
                "Deleting of audiobook from server was successful!",
                [
                  {
                    text: "Yay!",
                    style: "cancel",
                  }
                ],
              );
              navigation.goBack();
            } else { //Delete unsuccessful
              Alert.alert(
                bookTitle,
                "Deleting of audiobook was unsuccessful, please try again!",
                [
                  {
                    text: "Back",
                    style: "cancel",
                  }
                ],
              );
            }
          }
        },
        {
          text: "Delete Locally",
          onPress: async() => {
              await AsyncStorage.removeItem(bookID);
              Alert.alert(
                bookTitle,
                "Deleting of audiobook locally was successful!",
                [
                  {
                    text: "Yay!",
                    style: "cancel",
                  }
                ],
              );
              navigation.goBack();
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

  // function renderModal(){
  //   return (
  //     <Modal
  //       transparent = {true}
  //       animationType = 'fade'
  //       visible = {isModalVisible}
  //       onRequestClose = {() => changeModalVisible(false)}>
  //         <SimpleModal
  //           changeModalVisible={changeModalVisible}
  //           isModalVisible={isModalVisible}
  //           //setData = {setData}
  //           renameAudiobook={renameAudiobook}
  //           shareAudiobook={shareAudiobook}
  //           bookTitle={bookTitle}
  //           option={option} />
  //     </Modal>
  //   )
  // }

  function renderBookmarks(){
    return (
      <SlidingUpPanel 
        ref={panelRef}
        draggableRange={{top: 0.65*SIZES.height, bottom: 0}}
        friction={0.50}
      >
        <View style={styles.container2}>
          <FlatList 
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          />
        </View>
      </SlidingUpPanel>
    );
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
        onPress={() => panelRef.current.show()}>
        <View style={styles.options}>
          <FontAwesomeIcon icon={faBookmark} size={30} color={'white'} />
          <Text style={styles.textStyle}>Play from bookmark</Text>
        </View>
      </Pressable>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.options2]}
        onPress={() => {
          setOption("share");
          setModalVisible(true);
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
          setModalVisible(true);
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
          <Text style={styles.innerContainerItems}>{currentBookTitle}</Text>
        </View>
        {/* {renderModal()} */}
        {renderOptionsMenu()}
        {renderBookmarks()}
      </View>
      {renderModal()}
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
  },
  bookmarkText: {
    ...FONTS.h2,
    color: COLORS.white,
    padding: 16,
  },
  bookmarkContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.saffron,
  },
  container2: {
    height: 0.65*SIZES.height,
    width: '100%',
    backgroundColor: COLORS.offblack,
    borderTopColor: COLORS.saffron,
    borderTopWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10, 
    width: 250,
    marginBottom: 20,
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row"
  },
  activeButton: {
    marginHorizontal: 30,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  inactiveButton: {
    marginHorizontal: 30,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: COLORS.grey,
    opacity: 0.7,

  },
});
