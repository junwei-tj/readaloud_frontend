import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { UserContext } from '../App';
import { getAudiobookTitles } from '../components/APICaller';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }) {

  useEffect(() => {
    loadAudiobookTitles();
    setFilteredBooks(bookData); //to replace with retrievedBooks after names added in
  }, [userInfo]);
  
  const { userInfo } = useContext(UserContext);
  const [retreivedBooks, setRetreivedBooks] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(bookData);
  const [selectedBook, setSelectedBook] = useState({audiobookText: "sample text", lastProgress: "sample progress"})

  async function loadAudiobookTitles(){
    let titlesJSON = await getAudiobookTitles("123123123124412");
    setRetreivedBooks(titlesJSON);
  }

  //Temp book data
  const bookData = [{"title": "Once Upon A Time", "id": "id1"}, 
                    {"title": "Kary Had A Little Lamb", "id": "id2"},
                    {"title": "Pokemon", "id": "id3"},
                    {"title": "CZ3002", "id": "id4"},
                    {"title": "CZ4004", "id": "id5"}];

  const searchFilter = (text) => {
    if (text) {
      const newData = bookData.filter((item) => {
        const itemData = item.title ? item.title.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
      });
      setFilteredBooks(newData);
      setSearchTerm(text);
    }
    else {
      setFilteredBooks(bookData);
      setSearchTerm(text);
    }
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

  function renderBody(bookData){

    const Item = ({ title }) => (
      <TouchableOpacity style={styles.book}
        onPress = {() => navigation.navigate('BookOptionsScreen', selectedBook)} >
        <View>
          <Text style={styles.bookText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
      <Item title={item.title} />
    );

    return (
      <View style={{ flex: 1 }}>
          <View style={styles.body}>
              <Text style={styles.whiteFont}>My Books</Text>
          </View>

          <View style={styles.booklist}>
              <FlatList
                  data={filteredBooks}
                  renderItem={renderItem}
                  keyExtractor={item => `${item.id}`}
                  numColumns={2}
                  columnWrapperStyle={{justifyContent: "space-between"}}
              />
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
        {renderBody(bookData)}
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
  book: {
    marginVertical: 5, 
    marginHorizontal: 5, 
    color: COLORS.white, 
    backgroundColor: COLORS.saffron, 
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