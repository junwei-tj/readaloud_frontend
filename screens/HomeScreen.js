import React, { useContext, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  useColorScheme,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { UserContext } from '../App';
import { getAudiobookTitles } from '../components/APICaller';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }) {

  // useEffect(() => {
  //   bookData = getAudiobookTitles(userInfo.user.id);
  //   console.log("user");
  //   console.log(userInfo.user.id);
  // }, [userInfo.user.id])

  const { setSignedIn, userInfo, setUserInfo } = useContext(UserContext);

  //To replace with real book data
  const bookData = [{"title": "Once Upon A Time", "id": "id1"}, 
                    {"title": "Kary Had A Little Lamb", "id": "id2"},
                    {"title": "Pokemon", "id": "id3"},
                    {"title": "CZ3002", "id": "id4"}];


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
          placeholder="Search for audiobook..." 
        />
      </>
      
    )
  }

  function renderBody(bookData){

    const Item = ({ title }) => (
      <TouchableOpacity
        onPress = {() => navigation.navigate('PlayAudioScreen')} >
        <View style={styles.book}>
          <Text style={styles.whiteFont}>{title}</Text>
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
                  data={bookData}
                  renderItem={renderItem}
                  keyExtractor={item => `${item.id}`}
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

        <ScrollView>
          <View>
            {renderBody(bookData)}
          </View>
        </ScrollView>

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
  },
  book: {
    paddingHorizontal: 20, 
    paddingVertical: 40, 
    marginVertical: 10, 
    marginHorizontal: 15, 
    color: COLORS.white, 
    backgroundColor: COLORS.saffron, 
    borderRadius: 10
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