import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function SimpleModal(props) {

  const [input, setInput] = useState();
  
  const leftCloseModal = (bool, data) => {
    props.changeModalVisible(bool);
  }

  const rightCloseModal = (bool, data) => {
    props.changeModalVisible(bool); 
    props.option === "share" ? props.shareAudiobook(input) : props.renameAudiobook(input);
  }

  return (
      
    <TouchableOpacity
        disabled = {true}
        style = {styles.container}
    >
      <View style = {styles.modal}>
        <View style={styles.textView}>
          {props.option === "share" ?
          <Text style = {styles.text}>Who would you like to share {props.bookTitle} with:</Text> :
          <Text style = {styles.text}>What would you like to rename {props.bookTitle} to:</Text> }
          {props.option === "share" ?
            <TextInput
              style = {styles.input}
              placeholder = "Enter email of person to share to"
              onChangeText = {(val) => setInput(val)}/> :
            <TextInput
              style = {styles.input}
              placeholder = "Enter new name of audiobook"
              onChangeText = {(val) => setInput(val)}/>}
          <View style ={styles.buttonsView}>
            <TouchableOpacity 
              style = {styles.activeButton}
              onPress={() => leftCloseModal(false,"Cancel")}
            >
            <Text style = {[styles.text, {color: "red"}]}>Cancel</Text> 
            </TouchableOpacity>
            <TouchableOpacity 
              style = {!Boolean(input) ? styles.inactiveButton : styles.activeButton}
              onPress = {() => rightCloseModal(false,"Ok")}
              disabled = {!Boolean(input)}>
              {props.option === "share" === true ?<Text style = {[styles.text, {color: "blue"}]}>Share</Text> :
            <Text style = {[styles.text, {color: "blue"}]}>Rename</Text> }
            </TouchableOpacity>
          </View>
        </View>
      </View>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  modal:{
      height: 170,
      width: SIZES.width - 80,
      paddingTop:10,
      backgroundColor:"white",
      borderRadius: 10
  },
  textView:{
    flex: 1,
    alignItems:'center'
  },
  text:{
    margin: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row"
  },
  activeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center"
  },
  inactiveButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    opacity: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10, 
    width: 200,
  }
});
