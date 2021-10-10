import React, {useState, useContext} from 'react';
import {View, Text, TextInput, Pressable, ActivityIndicator} from 'react-native';
import {StyleSheet} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons';

import {COLORS, FONTS, SIZES} from '../constants/theme';
import {UserContext} from '../App';
import {uploadPDF} from './APICaller';

export default function UploadButton() {
  const {setSignedIn, userInfo, setUserInfo} = useContext(UserContext);
  const [singleFile, setSingleFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [allowButtonClick, setAllowButtonClick] = useState(true);
  const [uploading, setUploading] = useState(false);

  const uploadFn = async () => {
    if (singleFile != null) {
      if (fileName == '') {
        alert('Please enter the name to give to the audiobook!');
      } else {
        //console.log(singleFile); singleFile obj = {fileCopyUri, name, size, type, uri}
        console.log('uploading file');
        setAllowButtonClick(false);
        setUploading(true);
        // FormData object
        // data.append(k,v)       // key for server to process
        // fetch(url, [options] )
        // options = { method: "POST", body: formData }
        const data = new FormData();
        data.append('id', userInfo.user.id);
        data.append('pdf', singleFile);
        data.append('bookTitle', fileName);

        uploadPDF(data)
          .then(() => {
            alert('file uploaded');
            setSingleFile(null);
            setFileName('');
            setAllowButtonClick(true);
            setUploading(false);
          })
          .catch(e => alert('did not upload file successfully', e));
      }
    } else {
      alert('Please select a File');
    }
  };

  const selectFile = async () => {
    //Opening Document Picker for selection of one file
    setAllowButtonClick(false);
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
      alert(`${res.name} has been selected!`);
      setAllowButtonClick(true);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        //alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
      setAllowButtonClick(true);
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

  const Log = async fileName => {
    // getAudiobookTitles(userId)
    //   .then(data => alert(data[0]['_id']))
    //   .catch(e => console.log('testapi, error', e));
    console.log(fileName);
    alert(fileName);
  };
  
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold', paddingTop: 10, ...FONTS.h2, textAlign: "center", color: COLORS.offwhite}}>
        Upload PDF
      </Text>
      <Text style={{fontWeight: 'bold', paddingTop: 10, paddingHorizontal: SIZES.padding, ...FONTS.h2, color: COLORS.offwhite}}>
        Using a PDF with a clear scan will result in more accurate conversion results!
      </Text>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}
        onPress={selectFile}
        disabled = {!allowButtonClick}>
        <View style={styles.selectFile}>
          <FontAwesomeIcon icon={faCloudUploadAlt} size={100} color={COLORS.saffron}/>
          <Text style={{...FONTS.h3,  color: "#ebebeb"}}>Select File!</Text>
        </View>
      </Pressable>

      <View style={styles.textContainer}>
        {singleFile ? (
          <View style={styles.chosenFile}>
            <Text 
            style={{...FONTS.h3, 
            color: COLORS.offwhite,
            paddingRight: 10,
            maxHeight: SIZES.height/12}}> {singleFile.name} </Text>
            <Pressable
              style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1, alignSelf: "center"}]}
              onPress={() => {
              setSingleFile(null);
              setFileName('');
            }}
            disabled = {!allowButtonClick}>
              <View>
                <FontAwesomeIcon icon={faTrash} size={20} color={COLORS.offwhite} />
              </View>
            </Pressable>
          </View>
        ) : (
          <Text> {''} </Text>
        )}
      </View>

      <View style={styles.bottomHalf}>
        {singleFile ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter Name of Audiobook"
              onChangeText={setFileName}
              value={fileName}
            />
            <Pressable
              style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}
              onPress={uploadFn}>
              <View style={styles.uploadButton}>
              { uploading ? 
                <ActivityIndicator
                  size = "small"
                  color = {COLORS.white}
                /> : <Text style={{...FONTS.h2,  color: "#ebebeb"}}>Upload PDF</Text>
              }
                
              </View>
            </Pressable>
          </View>   
        ) : (
          <View>
            <Pressable
              style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}
              onPress={uploadFn}>
              <View style={styles.uploadButton}>
                <Text style={{...FONTS.h2,  color: "#ebebeb"}}>Upload PDF</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grey,
    width: SIZES.width/1.1,
    height: SIZES.height/1.3,
    alignItems: 'center',
    borderRadius: 10,
  },
  textContainer: {
    width: SIZES.width/1.4,
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
    backgroundColor: COLORS.grey,
  },
  input: {
    height: 40,
    minWidth: SIZES.width/1.5,
    borderWidth: 3,
    paddingLeft: SIZES.padding,
    borderColor: COLORS.saffron,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  chosenFile: {
    flexDirection: 'row',
    top: 30,
    justifyContent: 'space-between',
  },
  bottomHalf: {
    top: 70,
  },
  uploadButton: {
    top: 20,
    width: 250,
    marginLeft: 5,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.saffron,
  }
});
