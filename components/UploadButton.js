import React, {useState} from 'react';
import {Button, View, Text, TouchableHighlight} from 'react-native';
import {StyleSheet} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {faFolderOpen} from '@fortawesome/free-solid-svg-icons';

import { COLORS, FONTS } from '../constants/theme';

export default function UploadButton() {
  const [singleFile, setSingleFile] = useState(null);

  //   const selectFile = () => {
  //     setSingleFile(5);
  //   };

  const log = async () => {
    if (singleFile != null) {
      //console.log(singleFile); singleFile obj = {fileCopyUri, name, size, type, uri}
      console.log('uploading file');

      // FormData object
      // data.append(k,v)       // key for server to process
      // fetch(url, [options] )
      // options = { method: "POST", body: formData }
      const data = new FormData();
      data.append('file_attachment', singleFile);

      // testing fetch
      //   const url = 'https://httpbin.org/post'; // 'http://localhost:3000';
      //   let res = await fetch(url, {
      //     method: 'POST',
      //     body: data,
      //   });
      //   let responseJson = await res.json();
      //   console.log(responseJson);
      //   alert(responseJson);
      // end of fetch test
    } else {
      alert('Please select a File first');
    }
  };

  const selectFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });

      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      setSingleFile(res);
      alert(`${res.name} chosen`);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  /* // testing fetch
      //   const url = 'https://httpbin.org/post'; // 'http://localhost:3000';
      //   let res = await fetch(url, {
      //     method: 'POST',
      //     body: data,
      //   });
      //   let responseJson = await res.json();
      //   console.log(responseJson);
      //   alert(responseJson);
      // end of fetch test
    */

  const APICall = async () => {
    console.log('testing API calls');
    const url = 'https://randomuser.me/api/';
    let res = await fetch(url, {
      method: 'GET',
    });
    let responseJson = await res.json();
    console.log(responseJson);
    alert(responseJson.results[0].email);
  };

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', paddingTop: 10,...FONTS.h2}}> {'Upload Files'} </Text>
      <TouchableHighlight onPress={selectFile}>
        <View style={styles.selectFile}>
          <FontAwesomeIcon
            icon={faFolderOpen}
            size={100}
            color={'orange'}
          />
          <Text>{'Choose files here...'}</Text>
        </View>
      </TouchableHighlight>

      <View style={styles.chosenFile}>
        {singleFile ? (
          <View>
            <Text> {singleFile.name} </Text>
            <Button onPress={() => setSingleFile(null)} title="remove"></Button>
          </View>
        ) : (
          <Text> {''} </Text>
        )}
      </View>

      <View style={styles.uploadBtn}>
        <Button title="Upload PDF" onPress={log} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grey, // change to white, den on main PDFuploadscreen , set background to grey
    width: 300,
    height: 400,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectFile: {
    top: 20,
    width: 200,
    paddingVertical: 10,
    borderWidth: 10,
    borderColor: COLORS.saffron,
    borderWidth: 5,
    borderStyle: 'dotted',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#d6eeff',
  },
  chosenFile: {
    top: 30,
    justifyContent: 'space-between',
  },
  uploadBtn: {
    top: 150,
  },
});
