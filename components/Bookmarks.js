import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { Dimensions } from 'react-native';

import { COLORS, SIZES, FONTS } from '../constants/theme';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    height: 0.65*windowHeight,
    width: '100%',
    backgroundColor: COLORS.offblack,
    borderTopColor: COLORS.saffron,
    borderTopWidth: 1,
  },
  bookmarkContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.saffron,
  },
  bookmarkText: {
    ...FONTS.h2,
    color: COLORS.white,
    padding: 16,
  },
  addRow: {
    flexDirection: 'row',
    width: '100%',
  },
  addBookmarkInput: {
    width: '90%',
    backgroundColor: 'dimgray',
    color: COLORS.white,
    ...FONTS.body3,
    paddingHorizontal: 8,
  },
  inputError: {
    borderColor: 'crimson',
    borderWidth: 1,
  },
  addBookmarkButton: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.saffron,
  },
  plusText: {
    ...FONTS.h1,
    color: COLORS.offblack,
  },
});

// component to display in FlatList
const Bookmark = ({ name, page }) => {
  return (
    <View style={styles.bookmarkContainer}>
      <Text style={styles.bookmarkText}>{name}</Text>
      <Text style={styles.bookmarkText}>{page+1}</Text>
    </View>
  )
}

// main component to render
export const Bookmarks = ({ bookmarks, onBookmarkPressed, addNewBookmark, removeOldBookmark, refresh }) => {  
  const [newBookmarkName, setNewBookmarkName] = useState("");
  const [addBookmarkError, setAddBookmarkError] = useState(false);
  const textInputRef = useRef(null);

  // item to render in a FlatList
  const renderItem = ({ item }) => (
    <Pressable 
      onPress={() => onBookmarkPressed(item.page)} 
      onLongPress={() => onBookmarkLongPress(item._id, item.name)}
      android_ripple={{color: 'dimgray'}}
    >
      <Bookmark name={item.name} page={item.page} />
    </Pressable>
  )

  // function to add bookmark
  const onAddPressed = () => {
    if (newBookmarkName !== "") {
      addNewBookmark(newBookmarkName);
      setAddBookmarkError(false);
      textInputRef.current.clear();
    } else {
      setAddBookmarkError(true);
    }
  }

  // function to remove bookmark
  const onBookmarkLongPress = (bookmarkID, bookmarkName) => {
    Alert.alert(
      bookmarkName, // alert title
      "Are you sure you want to delete this bookmark?", // alert message
      [ // array of buttons
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => removeOldBookmark(bookmarkID),
          style: "default",
        }
      ],
      { cancelable: true }, // options (android only)
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        extraData={refresh}
      />
      <View style={styles.addRow}>
        <TextInput 
          ref={textInputRef}
          style={[ styles.addBookmarkInput, addBookmarkError ? styles.inputError : {} ]} 
          placeholder="Bookmark this page"
          placeholderTextColor="darkgray"
          maxLength={64}
          onChangeText={setNewBookmarkName}
        />
        <Pressable 
          onPress={onAddPressed} 
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1}, styles.addBookmarkButton]}
        >
          <Text style={styles.plusText}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}