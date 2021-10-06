import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  useColorScheme,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../App';
import { getAudiobookTitles, getAudiobookText, getAudiobookProgress } from '../components/APICaller';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }) {

  useEffect(() => {
    initialiseAllRequiredData();
  }, [userInfo]);
  
  const { userInfo } = useContext(UserContext);
  const [refresh, setRefresh] = useState(true);

  const [retreivedBooks, setRetreivedBooks] = useState(); //All audiobook details
  const [savedAudiobooks, setSavedAudiobooks] = useState([]); //Saved audiobook details (including text)

  const [audiobookList, setAudiobookList] = useState([]); //Used for holding list of audiobook titles
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState();//Used for displaying books 

  async function initialiseAllRequiredData() {
    await loadAudiobookList();
  }

  // 1) Retrieval of audiobooks under user from the server
  // 2) Retrieval of titles of saved audiobooks
  // 3) Pushing to audiobookList, and marking if book is saved
  async function loadAudiobookList(){
    try {
      console.log("running loadAudiobookList");
      // ===== Retrieval of audiobooks under user from the server =====
      let titlesJSON = await getAudiobookTitles("123123123124412"); //Can replace with actual user
      let tempRetrievedArray = [];
      titlesJSON.forEach((item) => {
        //console.log(item);
        tempRetrievedArray.push({bookID: item.book_id, bookTitle: item.book_title});
      })
      setRetreivedBooks(tempRetrievedArray);

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
          allTempBooks.push({bookID: tempRetrievedArray[i].bookID, bookTitle: tempRetrievedArray[i].bookTitle, saved: false})
        } else {
          allTempBooks.push({bookID: tempRetrievedArray[i].bookID, bookTitle: tempRetrievedArray[i].bookTitle, saved: true})
        }
      }
      setAudiobookList(allTempBooks);
      setFilteredBooks(allTempBooks);
    } catch (e){
      console.log(e);
    }
  }

  const downloadAudiobook = async (bookID) => {
    let audiobookText = await getAudiobookText(bookID); //to replace with bookID or "61516bd4fa5f2e4fe410d358"
    try {
      const jsonValue = JSON.stringify(audiobookText);
      await AsyncStorage.setItem(bookID, jsonValue); //to replace with bookID
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
          lastProgress = await getAudiobookProgress(bookID, "123123123124412"); //to replace with userID or "61516bd4fa5f2e4fe410d358"
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

    const SavedBook = ({ bookID, bookTitle }) => (
      <TouchableOpacity style={styles.savedBook}
        // onPress = {() => navigation.navigate('BookOptionsScreen', {bookID: bookID, bookTitle: bookTitle})} >
        onPress = {() => selectBook(bookID, bookTitle)} >
        <View>
          <Text style={styles.bookText}>{bookTitle}</Text>
          <Text style={styles.bookText}>{bookID}</Text>
        </View>
      </TouchableOpacity>
    )

    const UnsavedBook = ({ bookID, bookTitle }) => (
      <TouchableOpacity style={styles.unsavedBook}
        onPress = {() => Alert.alert(
          "Download of Audiobook Text",
          "Would you like to download the audiobook text to your phone?",
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
                initialiseAllRequiredData();
                setRefresh(!refresh);
              }
            }
          ]
        )} >
        <View>
          <Text style={styles.bookText}>{bookTitle}</Text>
          <Text style={styles.bookText}>{bookID}</Text>
        </View>
      </TouchableOpacity>
    )
  
    const renderItem = ({ item }) => { 
      if (item.saved) {
        return <SavedBook bookID={item.bookID} bookTitle={item.bookTitle} />
      } else {
        return <UnsavedBook bookID={item.bookID} bookTitle={item.bookTitle} />
      }
    }

    return (
      <View style={{ flex: 1 }}>
          <View style={styles.body}>
              <Text style={styles.whiteFont}>My Books</Text>
          </View>

          <View style={styles.booklist}>
            { !filteredBooks ? 
              <ActivityIndicator
                size = "large"
                color = {COLORS.saffron}
              /> :
              <FlatList
                  data={filteredBooks}
                  renderItem={renderItem}
                  keyExtractor={item => `${item.bookID}`}
                  numColumns={2}
                  columnWrapperStyle={{justifyContent: "space-between"}}
                  extraData = {refresh}
              /> 
            }
          </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle='dark-content' />
        <View style={{height:120}}>
          {renderHeader(userInfo)}
        </View> 
        {renderBody()}
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
    ...FONTS.h2, 
    color: COLORS.white,
    padding: 10,
  },
  whiteFont:{
    ...FONTS.h2, 
    color: COLORS.white
  },
  saffronFont:{
    ...FONTS.h2, 
    color: COLORS.saffron,
  }
})