import React, {useState} from 'react';
import {Button, View} from 'react-native';
import {StyleSheet} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import {SafeAreaView} from 'react-native-safe-area-context';

// 0200 26Sep21 : 2 fn so far log and selectFile
// log change to uploading file
// selectFile is to assign a file 'singleFile'
/* 
    1) work on user feed back after user chose PDF file 
    2) styling (stylesheet)
*/

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
    <View>
      <View style={styles.wkTest}>
        <Button title="wk choosefilebtn" onPress={selectFile} />
        <Button title="log() -> upload file" onPress={log} />
      </View>
      <Button title="test api" onPress={APICall} />
    </View>
  );
}

const styles = StyleSheet.create({
  wkTest: {
    flexDirection: 'row',
    position: 'relative',
    top: 350,
    width: 400,
    justifyContent: 'space-evenly',
  },
});
