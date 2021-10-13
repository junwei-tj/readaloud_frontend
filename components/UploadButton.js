import React, {useState, useContext} from 'react';
import {View, Text, TextInput, Pressable, ActivityIndicator, Modal} from 'react-native';
import {StyleSheet} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons';

import {COLORS, FONTS, SIZES} from '../constants/theme';
import {UserContext} from '../App';
import {uploadPDF} from './APICaller';

export default function UploadButton() {

  const {userInfo} = useContext(UserContext);
  const [singleFile, setSingleFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [allowButtonClick, setAllowButtonClick] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  // Creates the PDF object and uploads PDF to the server 
  const uploadFn = async () => {
    if (singleFile != null) {
      if (fileName == '') {
        setModalText("Please enter the desired name for the audiobook!")
        setModalVisible(true);
      } else {
        setAllowButtonClick(false);
        setUploading(true);
        const data = new FormData();
        data.append('id', userInfo.user.id);
        data.append('pdf', singleFile);
        data.append('bookTitle', fileName);

        uploadPDF(data)
          .then(() => {
            setModalText("File has been uploaded to server successfully!")
            setModalVisible(true);
            setSingleFile(null);
            setFileName('');
            setAllowButtonClick(true);
            setUploading(false);
          })
          .catch(e => alert('did not upload file successfully', e));
      }
    } else {
      setModalText("Please select a file first before uploading!")
      setModalVisible(true);
    }
  };

  // Opens Document Picker for selection of PDF file
  const selectFile = async () => {
    setAllowButtonClick(false);
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      //Setting the state to show single file attributes
      setSingleFile(res);
      setModalText(`${res.name} has been selected!`)
      setModalVisible(true);
      setAllowButtonClick(true);

    } catch (err) { // Exception handling any exception
      if (DocumentPicker.isCancel(err)) { //If user canceled the document selection
      } else { //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
      setAllowButtonClick(true);
    }
  };

  // Function to render modal when modal is to be shown
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
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
  
  return (
    <View style={styles.container}>

      <Text style={{fontWeight: 'bold', paddingTop: 10, ...FONTS.h2, textAlign: "center", color: COLORS.white}}>
        Upload PDF
      </Text>
      <Text style={{fontWeight: 'bold', paddingTop: 10, paddingHorizontal: SIZES.padding, ...FONTS.h2, color: COLORS.white}}>
        Using a PDF with a clear scan will result in more accurate conversion results!
      </Text>

      <Pressable
        style= {({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}
        onPress={selectFile}
        disabled = {!allowButtonClick}>
        <View style={styles.selectFile}>
          <FontAwesomeIcon icon={faCloudUploadAlt} size={100} color={COLORS.blue}/>
          <Text style={{...FONTS.h3,  color: "#ebebeb"}}>Select File!</Text>
        </View>
      </Pressable>

      <View style={styles.textContainer}>
        {singleFile ? (
          <View style={styles.chosenFile}>
            <Text 
            style={{...FONTS.h3, 
            color: COLORS.white,
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
                <FontAwesomeIcon icon={faTrash} size={20} color={COLORS.white} />
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
                { 
                  uploading ? 
                  <ActivityIndicator
                    size = "small"
                    color = {COLORS.white}
                  /> : 
                  <Text style={{...FONTS.h2,  color: "#ebebeb"}}>
                    Upload PDF
                  </Text>
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
      {renderModal()}
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
    borderColor: COLORS.blue,
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
    borderColor: COLORS.blue,
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
    backgroundColor: COLORS.blue,
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
});
