import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Modal,
  useColorScheme,
  Pressable,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Easing,
  Animated,
} from 'react-native';
import {
  faCloudDownloadAlt,
  faUserFriends,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../App';
import { getAudiobookTitles, getAudiobookText, getAudiobookProgress } from '../components/APICaller';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }) {

  const { userInfo } = useContext(UserContext);
  const [refresh, setRefresh] = useState(true);

  const [savedAudiobooks, setSavedAudiobooks] = useState([]); //Saved audiobook details (including text)

  const [audiobookList, setAudiobookList] = useState([]); //Used for holding list of audiobook titles
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState();//Used for displaying books 

  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("Downloading audiobook text...");

  //=====Animation Settings for spinning of refresh button=====
  const spinValue = new Animated.Value(0);
  const onPressIn = () => Animated.timing( //Called when button is pressed
      spinValue,
    {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true  // To make use of native driver for performance
    }
  ).start()

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg']
  })

  useEffect(() => {
    initialiseAllRequiredData();
    //clearAllLocalStorage();
  }, [userInfo]);

  useFocusEffect( //Reload flatlist data on screen focus
    React.useCallback(() => {
      initialiseAllRequiredData();
    }, [userInfo])
  );

  async function initialiseAllRequiredData() {
    await loadAudiobookList();
  }

  //Function to clear local storage, consider putting in Settings Screen
  async function clearAllLocalStorage() {
    try {
      let keys = [];
        keys = await AsyncStorage.getAllKeys();
        if (keys?.length) { //if there exists keys -> meaning there are saved audiobooks
          await AsyncStorage.multiRemove(keys);
        }
        console.log("All local storage removed.");
    } catch (e) {
      console.log(error.message);
      console.log("Local storage not cleared.")
    }
  }

  // 1) Retrieval of audiobooks under user from the server
  // 2) Retrieval of titles of saved audiobooks
  // 3) Pushing to audiobookList, and marking if book is saved
  async function loadAudiobookList(){
    try {
      // ===== Retrieval of audiobooks under user from the server =====
      let titlesJSON = await getAudiobookTitles(userInfo.user.id); //Can replace with actual user or 110771401644785347942
      let tempRetrievedArray = [];
      titlesJSON["OwnedBooks"].forEach((item) => {
        tempRetrievedArray.push({bookID: item.book_id, bookTitle: item.title, owned: true});
      })

      titlesJSON["SharedBooks"].forEach((item) => {
        tempRetrievedArray.push({bookID: item.book_id, bookTitle: item.title, owned: false});
      })

      // ===== Retrieval of titles of saved audiobooks =====
      let jsonValue = [];
      let keys = [];
        keys = await AsyncStorage.getAllKeys();
        if (keys?.length) { //if there exists keys -> meaning there are saved audiobooks
          jsonValue = await AsyncStorage.multiGet(keys);
            setSavedAudiobooks(jsonValue);
        }

      let savedAudiobookTitles = [];
      let allTempBooks = [];
      for (let i = 0; i < jsonValue.length; i++){
        savedAudiobookTitles.push(jsonValue[i][0]); // Extract saved audiobook titles
      }

      // ===== Pushing to audiobookList, and marking if book is saved =====
      for (let i = 0; i < tempRetrievedArray.length; i++){
        if (!savedAudiobookTitles.includes(tempRetrievedArray[i].bookID)){
          allTempBooks.push({bookID: tempRetrievedArray[i].bookID, bookTitle: tempRetrievedArray[i].bookTitle, saved: false, owned: tempRetrievedArray[i].owned})
        } else {
          allTempBooks.push({bookID: tempRetrievedArray[i].bookID, bookTitle: tempRetrievedArray[i].bookTitle, saved: true, owned: tempRetrievedArray[i].owned})
        }
      }
      setAudiobookList(allTempBooks);
      setFilteredBooks(allTempBooks);
    } catch (e){
      console.log(e);
    }
  }

  const downloadAudiobook = async (bookID) => {
    setModalVisible(true)
    let audiobookText = await getAudiobookText(bookID); //to replace with bookID or "61516bd4fa5f2e4fe410d358"
    try {
      const jsonValue = JSON.stringify(audiobookText);
      await AsyncStorage.setItem(bookID, jsonValue); //to replace with bookID
      initialiseAllRequiredData();
      setTimeout(function() {
        setModalText("Audiobook has been downloaded!");
      }, 1200);
    } catch (e) {
      alert('Saving of audiobook failed, please try again!');
    }
  }

  const searchFilter = (text) => {
    if (text) {
      const newData = audiobookList.filter((item) => {
        const itemData = item.bookTitle ? item.bookTitle.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
      });
      setFilteredBooks(newData);
      setSearchTerm(text);
    }
    else {
      setFilteredBooks(audiobookList);
      setSearchTerm(text);
    }
  }

  const selectBook = async (bookID, bookTitle) => {
    //Retrieve book's text
      let pages;
      let lastProgress;
      let bookObject;
      for (let i = 0; i < savedAudiobooks.length; i++){
        if (savedAudiobooks[i][0] == bookID){
          bookObject = JSON.parse(savedAudiobooks[i][1]);
          pages = bookObject[0];
          lastProgress = await getAudiobookProgress(bookID, userInfo.user.id); //to replace with userID or "61516bd4fa5f2e4fe410d358"
          break;
       }
      }
      navigation.navigate('BookOptionsScreen', 
                          {
                            bookID: bookID, 
                            bookTitle: bookTitle, 
                            pages: pages, 
                            lastProgress: lastProgress 
                          });
  }

  function renderHeader(userInfo){
    return (
      <>
        <View style={styles.header}>
          <View style= {{flex:1, flexDirection: "row"}}>
            <Text style={styles.whiteFont}>
              Good Day {""} 
            </Text>
            <Text style={styles.saffronFont}>
              {userInfo ? userInfo.user.name : null}
            </Text>
            <Text style={styles.whiteFont}>
              {" "}!
            </Text>
          </View>
        </View>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search for audiobook!"
          underlineColorAndroid="transparent"
          value={searchTerm}
          onChangeText={(text) => searchFilter(text)}
        />
      </>
    )
  }

  function renderBody(){

    const SavedBook = ({ bookID, bookTitle, owned }) => (
      <TouchableOpacity style={styles.savedBook}
        onPress = {() => selectBook(bookID, bookTitle)} >
        <View style={{alignItems:"center"}}>
          <Text style={styles.bookText}>{bookTitle}</Text>
        </View>
        { !owned ? 
          <FontAwesomeIcon 
            icon={faUserFriends} 
            size={25} 
            color={'white'}
            style={{position:"absolute", bottom: 10, right: 10, alignSelf:"flex-end"}} /> : null
        }
      </TouchableOpacity>
    )

    const UnsavedBook = ({ bookID, bookTitle, owned }) => (
      <TouchableOpacity style={styles.unsavedBook}
        onPress = {() => Alert.alert(
          "Download of Audiobook Text",
          "Audiobook text needs to be downloaded from the server. Proceed to download to local storage?",
          [
            {
              text: "No",
              onPress: () => console.log("not downloaded"),
              style: "cancel"
            },
            {
              text: "OK!",
              onPress: () => {
                downloadAudiobook(bookID);
              }
            }
          ]
        )} >
        <View style={{flex: 1, alignItems:"center"}}>
          <Text style={styles.bookText}>{bookTitle}</Text> 
        </View>
        <FontAwesomeIcon 
          icon={faCloudDownloadAlt} 
          size={25} 
          color={'white'}
          style={{position:"absolute", bottom: 10, left: 10}} />
        { !owned ? 
        <FontAwesomeIcon 
          icon={faUserFriends} 
          size={25} 
          color={'white'}
          style={{position:"absolute", bottom: 10, right: 10, alignSelf:"flex-end"}} /> : null
        }
      </TouchableOpacity>
    )
  
    const renderItem = ({ item }) => { 
      if (item.saved) {
        return <SavedBook bookID={item.bookID} bookTitle={item.bookTitle} owned={item.owned}/>
      } else {
        return <UnsavedBook bookID={item.bookID} bookTitle={item.bookTitle} owned={item.owned}/>
      }
    }

    return (
      <View style={{ flex: 1 }}>
          <View style={styles.body}>
            <Text style={styles.whiteFont}>My Books</Text>
            <View style={{alignItems:"center", justifyContent: "center"}}>
              <Pressable onPress={async() => {
                  onPressIn();
                  initialiseAllRequiredData();
                }}>
                <Animated.View style={{transform: [{rotate: spin}] }}> 
                  <FontAwesomeIcon 
                    icon={faSyncAlt} 
                    size={20}
                    color={'white'} />
                  </Animated.View>
              </Pressable>
            </View>
          </View>

          <View style={styles.booklist}>
            { !filteredBooks ? 
              <ActivityIndicator
                size = "large"
                color = {COLORS.saffron}
                /> : (filteredBooks?.length) ? 
                
              <FlatList
                  data={filteredBooks}
                  renderItem={renderItem}
                  keyExtractor={item => `${item.bookID}`}
                  numColumns={2}
                  columnWrapperStyle={{justifyContent: "space-between"}}
                  extraData = {refresh}
              /> : 
              <View
              style= {{alignItems: "center", paddingTop: SIZES.height/3.8, paddingHorizontal: SIZES.padding2}}>
              <Text 
                style={[{ textAlign: "center"}, styles.saffronFont]}>
                No audiobooks!
              </Text>
              </View>
            }
          </View>
      </View>
    )
  }

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
            <Text style={styles.modalText}>{modalText}</Text>
            {
              modalText !== "Downloading audiobook text..." ? 
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setModalText("Downloading audiobook text...")
                }}>
                <Text style={styles.textStyle}>Yay!</Text>
              </Pressable> : null
            }
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle='dark-content' />
        <View style={{height:120}}>
          {renderHeader(userInfo)}
        </View> 
        {renderBody()}
        {renderModal()}
    </SafeAreaView>
  );
}

const styles= StyleSheet.create({
  background: {
    flex: 1, 
    backgroundColor: COLORS.offblack,
  },
  header: {
    flex: 1, 
    flexDirection:"row", 
    paddingTop: SIZES.padding, 
    paddingLeft: SIZES.padding,
    alignItems: "center",
  },
  searchBar: {
    height: 40,
    borderWidth: 3,
    paddingLeft: SIZES.padding,
    marginHorizontal: 15,
    borderColor: COLORS.saffron,
    borderRadius: 20,
    backgroundColor:COLORS.white,
  },
  body: {
    paddingHorizontal: SIZES.padding, 
    paddingTop: SIZES.padding, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  booklist: {
    flex: 1, 
    marginTop: SIZES.padding,
    marginLeft: 10,
    marginRight: 10
  },
  savedBook: {
    marginVertical: 5, 
    marginHorizontal: 5, 
    color: COLORS.white, 
    backgroundColor: COLORS.saffron, 
    borderRadius: 10,
    flex: 0.5,
    height: SIZES.height / 3.5,
  },
  unsavedBook: {
    marginVertical: 5, 
    marginHorizontal: 5, 
    color: COLORS.white, 
    backgroundColor: COLORS.grey, 
    borderRadius: 10,
    flex: 0.5,
    height: SIZES.height / 3.5,
  },
  bookText: {
    ...FONTS.body2, 
    color: COLORS.white,
    padding: 10,
    height:SIZES.height / 4.2,
  },
  whiteFont:{
    ...FONTS.h2, 
    color: COLORS.white
  },
  saffronFont:{
    ...FONTS.h2, 
    color: COLORS.saffron,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})