import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Pressable,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';
import { Dimensions, BackHandler } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronCircleLeft, faPlayCircle, faPauseCircle, faStopCircle, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Tts from 'react-native-tts';
import HighlightText from '@sanar/react-native-highlight-text';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { COLORS, SIZES, FONTS } from '../constants/theme';
// import { book } from '../testBeeMovie'; // REMOVE AFTER INCORPORATING API
// import { progress } from '../testBookProgress'; // REMOVE AFTER INCORPORATING API
import { Bookmarks } from '../components/Bookmarks';
import { UserContext } from '../App';
import { addBookmark, removeBookmark, updateAudiobookProgress } from '../components/APICaller';

Tts.setDucking(true); // Enable lowering other applications output level while speaking (also referred to as "ducking").
const sentenceRegex = /[^.?!]+[.!?]+[\])'"`’”]*|.+$/g; // used to split text into sentences
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: COLORS.offblack,
  },
  // top bar
  topBar: {
    height: '10%',
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',        
    backgroundColor: COLORS.saffron,
  },
  backIcon: {
    borderRadius: 16,
    marginRight: 16,
  },
  // text reader
  textReader: {
    height: '70%',
  },
  textStyle: {
    ...FONTS.body1,
    fontSize: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    color: COLORS.white,
  },
  // bottom bar
  bottomBar: {
    height: '20%',
    alignItems: 'center',
    backgroundColor: COLORS.saffron,
    paddingVertical: 8,
  },
  // pageText: {
  //   fontSize: 24,
  //   marginTop: 8,
  // },
  pageNumButton: {
    backgroundColor: COLORS.offblack,
    width: 128,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
  },
  pageNumText: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  slider: {
    width: '90%', 
    height: 40,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '80%',
    marginTop: 16,
  },
  controlIcons: {
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  // saving overlay
  savingOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.offblack,
    opacity: 0.75,
    position: 'absolute',
  },
  savingText: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  // choose page modal
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageModal: {
    width: 256,
    height: 128,
    backgroundColor: COLORS.saffron,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageInputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pageSelectionText: {
    ...FONTS.h2,
    color: COLORS.offblack,
  },
  inputError: {
    borderColor: 'crimson',
    borderWidth: 1,
  },
});

export default function PlayAudioScreen({ navigation, route }) { 
  const bookID = route.params.bookID;
  const bookPages = route.params.pages.page; // pages is an object with page (an array of the individual pages' text in a book), which is what I only need

  const [isPlaying, setIsPlaying] = useState(false);    
  const [bookmarks, setBookmarks] = useState(route.params.lastProgress.bookmarks);
  const [page, setPage] = useState({ // page holds all info relevant to the current page 
    sentenceNum: 0,
    pageText: bookPages[route.params.lastProgress.currentPage].body,
    sentences: bookPages[route.params.lastProgress.currentPage].body.match(sentenceRegex),
    pageNum: route.params.lastProgress.currentPage, // pageNum starts from 0
  });
  const [saving, setSaving] = useState(false); // for showing saving progress overlay
  const [showPageModal, setShowPageModal] = useState(false); // for showing modal to specify page number to go to
  const [chosenPage, setChosenPage] = useState(0); // for tracking page number input
  const [pageInputError, setPageInputError] = useState(false); // for showing user page number is invalid
  // const [page, setPage] = useState({
  //   sentenceNum: 30,
  //   pageText: book[0].page[progress.currentPage].body,
  //   sentences: book[0].page[progress.currentPage].body.match(sentenceRegex),
  //   pageNum: progress.currentPage,
  // });

  const { userInfo } = useContext(UserContext);
  const userID = "123123123124412"; // to replace with userInfo.user.id

  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  // overwrite Android's default back behaviour
  // useEffect(() => { 
  //   BackHandler.addEventListener('hardwareBackPress', () => {
  //     exitScreen();
  //     return true; // other back actions (including system default) will not execute
  //   });
  // }, []);

  // function to handle exiting playback screen
  // will need to stop TTS and save user progress
  const exitScreen = () => { 
    setSaving(true);
    if (isPlaying) {
        setIsPlaying(false);
        Tts.stop();
    }
    console.log("current progress:", page.pageNum);
    updateAudiobookProgress(bookID, userID, page.pageNum)
    .then(() => {
      setSaving(false);
      navigation.goBack();
    })
    .catch((err) => console.log(err));
    return true; // other back actions (including system default) will not execute
  }

  // eventlistener handler to highlight+play next sentence, and switch to next page if end of page is reached
  const advance = () => { 
    if (page.sentences[page.sentenceNum+1] !== undefined) {
      // go to next sentence            
      setPage(prev => {
        Tts.speak(prev.sentences[prev.sentenceNum+1].trim());
        return ({
          ...prev,
          sentenceNum: prev.sentenceNum+1,
        })
      });
    } else {
      // advance to next page
      setPage(prev => {
        const nextPage = bookPages[prev.pageNum+1].body;
        const newSentences = nextPage.match(sentenceRegex);
        Tts.speak(newSentences[0].trim()); 
        return ({
          sentenceNum: 0,
          pageText: nextPage,
          sentences: newSentences,
          pageNum: prev.pageNum+1,
        });
      });
      scrollRef.current.scrollTo({y: 0}); // scroll back to top
    }
  }

  // need to re-add listener because eventlistener depends on current state, so cannot pass empty dependency 
  // so this useeffect will run multiple times, but we technically only want the eventlistener to only be added once, hence the removal + add back
  useEffect(() => { 
    Tts.removeAllListeners('tts-finish');
    Tts.addEventListener('tts-finish', advance);
    // overwrite Android's default back behaviour
    BackHandler.removeEventListener('hardwareBackPress', exitScreen);
    BackHandler.addEventListener('hardwareBackPress', exitScreen);
  }, [page]);

  // function to handle play/pause
  const onPlayPressed = () => {
    if (!isPlaying) { // if not previously playing, play audio
      Tts.speak(page.sentences[page.sentenceNum].trim());
    } else { // if previously playing audio, stop audio
      Tts.stop();
    }
    setIsPlaying(!isPlaying); // do this at the end because updating state has a lag
  }

  // function for stop button. stops TTS and reset progress in page to the first sentence
  const onStopPressed = () => { 
    setIsPlaying(false);
    setPage(prev => ({
      ...prev,
      sentenceNum: 0,
    }));
    Tts.stop();
    scrollRef.current.scrollTo({y: 0}); // scroll back to top
  }

  // function to switch to a bookmark's page
  const onBookmarkPressed = (bookmarkedPageNum) => {
    if (isPlaying) {
      Tts.stop(); // stop current playback
    }
    setPage(prev => { // go to chosen page
      const bookmarkedPage = bookPages[bookmarkedPageNum].body;
      const newSentences = bookmarkedPage.match(sentenceRegex);
      if (isPlaying) Tts.speak(newSentences[0].trim()); // play chosen page if user was alr playing 
      return ({
        ...prev,
        sentenceNum: 0,
        pageText: bookmarkedPage,
        sentences: newSentences,
        pageNum: bookmarkedPageNum,
      })
    });
    scrollRef.current.scrollTo({y: 0}); // scroll back to top
    panelRef.current.hide();
  }

  const addNewBookmark = (bookmarkName) => {
    // setBookmarks(prev => [...prev, {
    //   _id: Math.floor(Math.random() * 1000), // generate temp random id to add to bookmark flatlist
    //   name: bookmarkName,
    //   page: page.pageNum
    // }]);
    addBookmark(userInfo.user.id, book._id, bookmarkName, page.pageNum)
    .then((data) => {
      setBookmarks(data);
    })
    .catch((err) => console.log(err));
  }

  const removeOldBookmark = (bookmarkID) => {
    // let index = 0;
    // for (let i=0; i < bookmarks.length; i++) {
    //   if (bookmarks[i]._id === bookmarkID) {
    //     index = i;
    //     break;
    //   }
    // }
    // // correct bookmarkID will always be found
    // setBookmarks([...bookmarks.slice(0, index), ...bookmarks.slice(index+1, bookmarks.length)]);
    removeBookmark(userInfo.user.id, book._id, bookmarkID)
    .then((data) => setBookmarks(data))
    .catch((err) => console.log(err));
  }

  // function to go to user's chosen page
  const goToChosenPage = () => {
    let chosen = Number.parseInt(chosenPage) - 1; // -1 because actual page number starts from 0
    if (chosen < 0 || chosen >= bookPages.length) {
      setPageInputError(true);
    } else {
      if (isPlaying) {
        Tts.stop(); // stop current playback
      }
      setPage(prev => { // go to chosen page
        const chosenPageText = bookPages[chosen].body;
        const newSentences = chosenPageText.match(sentenceRegex);
        if (isPlaying) Tts.speak(newSentences[0].trim()); // play chosen page if user was alr playing 
        return ({
          ...prev,
          sentenceNum: 0,
          pageText: chosenPageText,
          sentences: newSentences,
          pageNum: chosen,
        });
      });
      scrollRef.current.scrollTo({y: 0}); // scroll back to top
      setShowPageModal(false);
    }
  }
  
  return (
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.backIcon}>
            <Pressable onPress={exitScreen} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
              <FontAwesomeIcon icon={faChevronCircleLeft} size={36} color={COLORS.offblack}/>
            </Pressable>
          </View>
          <Text style={FONTS.h1}>{route.params.bookTitle}</Text>
        </View>
        <ScrollView style={styles.textReader} ref={scrollRef}>
          <HighlightText 
            style={styles.textStyle}
            highlightStyle={{ backgroundColor: COLORS.saffron }}
            searchWords={[page.sentences[page.sentenceNum].trim()]}
            textToHighlight={page.pageText}
          />
        </ScrollView>
        <View style={styles.bottomBar}>
          <Pressable onPress={() => setShowPageModal(true)} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.pageNumButton]}>
            <Text style={styles.pageNumText}>Pg {page.pageNum+1}</Text>        
          </Pressable>
          <View style={styles.controlBar}>   
            <View style={styles.controlIcons}>   
              <Pressable onPress={onPlayPressed} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
                <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlayCircle} size={48} color={'black'} />
              </Pressable>
            </View>
            <View style={styles.controlIcons}>   
              <Pressable onPress={onStopPressed} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
                <FontAwesomeIcon icon={faStopCircle} size={48} color={'black'} />
              </Pressable>
            </View>
            <View style={styles.controlIcons}>   
              <Pressable onPress={() => panelRef.current.show()} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
                <FontAwesomeIcon icon={faBookmark} size={42} color={'black'}/>
              </Pressable>
            </View>                        
          </View>
        </View>
        <SlidingUpPanel 
          ref={panelRef}
          draggableRange={{top: 0.65*windowHeight, bottom: 0}}
          friction={0.50}
        >
          <Bookmarks bookmarks={bookmarks} onBookmarkPressed={onBookmarkPressed} addNewBookmark={addNewBookmark} removeOldBookmark={removeOldBookmark}/>
        </SlidingUpPanel>
      </View>
      {/* Select Page Number Modal */}
      {showPageModal && <View style={styles.savingOverlay}></View>}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPageModal}
        onRequestClose={() => setShowPageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pageModal}>
            <View style={styles.pageInputRow}>
              <TextInput
                style={[ styles.pageSelectionText, pageInputError ? styles.inputError : {} ]}
                onChangeText={setChosenPage}
                defaultValue={`${page.pageNum+1}`}
                keyboardType="numeric"
                underlineColorAndroid="black"
              />
              <Text style={styles.pageSelectionText}>{`/ ${bookPages.length}`}</Text>
            </View>
            <Pressable onPress={goToChosenPage} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.pageNumButton]}>
              <Text style={styles.pageNumText}>Go To Page</Text>        
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Saving Progress Overlay */}
      {saving && 
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="gray" />
          <Text style={styles.savingText}>Saving progress...</Text>
        </View>}
    </SafeAreaView>
  );
}

