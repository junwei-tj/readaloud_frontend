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
import { Dimensions, BackHandler, Platform } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faChevronCircleLeft, 
  faPlayCircle, 
  faPauseCircle, 
  faStopCircle, 
  faBookmark, 
  faArrowLeft, 
  faArrowRight, 
  faCog } from '@fortawesome/free-solid-svg-icons';
import Tts from 'react-native-tts';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { COLORS, FONTS } from '../constants/theme';
import { Bookmarks } from '../components/Bookmarks';
import { UserContext } from '../App';
import { addBookmark, removeBookmark, updateAudiobookProgress } from '../components/APICaller';
import TextReader from '../components/TextReader';
import PlayOptionsModal from '../components/PlayOptionsModal';

Tts.setDucking(true); // Enable lowering other applications output level while speaking (also referred to as "ducking").

const sentenceRegex = /[^.?!]+[.!?]+[\])'"`’”]*|.+$/g; // used to split text into sentences
const windowHeight = Dimensions.get('window').height;

export default function PlayAudioScreen({ navigation, route }) { 
  const bookID = route.params.bookID;
  const bookPages = route.params.pages.page; // pages is an object with page (an array of the individual pages' text in a book)

  // ========== States that track data ==========
  const [bookmarks, setBookmarks] = useState(route.params.lastProgress.bookmarks);
  const [page, setPage] = useState({ // page holds all info relevant to the current page 
    sentenceNum: route.params.lastProgress.currentSentence, // sentence number starts from 1
    pageText: bookPages[route.params.lastProgress.currentPage-1].body,
    sentences: bookPages[route.params.lastProgress.currentPage-1].body.match(sentenceRegex),
    pageNum: route.params.lastProgress.currentPage, // pageNum starts from 1
  });  
  const [chosenPage, setChosenPage] = useState(0); // for tracking page number input
  const [ttsOptions, setTtsOptions] = useState({
    voice: Platform.OS === 'ios' ? "com.apple.ttsbundle.Samantha-compact" : "en-US-language",
    rate: 0.5,
    pitch: 1.0,
  }); 

  // ========== States that act as flags ==========
  const [isPlaying, setIsPlaying] = useState(false);  
  const [saving, setSaving] = useState(false); // for showing saving progress overlay
  const [showPageModal, setShowPageModal] = useState(false); // for showing modal to specify page number to go to
  const [pageInputError, setPageInputError] = useState(false); // for showing user page number is invalid
  const [refresh, setRefresh] = useState(false); // for refreshing bookmark list when bookmarks is updated
  const [bookmarksActive, setBookmarksActive] = useState(false); // tracks if bookmarks is opened
  const [showOptionsModal, setShowOptionsModal] = useState(false); // for showing options modal

  const { userInfo } = useContext(UserContext);
  const userID = userInfo.user.id; 

  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  /* 
  * Function to handle exiting of playback screen
  * Stops the TTS and saves user progress back to the server
  * Navigates back to HomeScreen
  */
  const exitScreen = () => { 
    if (bookmarksActive) { return false }; // trigger sliding panel's (bookmarks' list) back action

    setSaving(true);
    if (isPlaying) {
        setIsPlaying(false);
        Tts.stop();
    }
    updateAudiobookProgress(bookID, userID, page.pageNum, page.sentenceNum)
    .then(() => {
      setSaving(false);
      const popAction = StackActions.pop(2);
      navigation.dispatch(popAction);
    })
    .catch((err) => console.log(err));
    return true; // other back actions (including system default) will not execute
  }

  /* 
  * Eventlistener handler to highlight+play next sentence
  * Switches to next page if end of page is reached
  */
  const advance = () => { 
    // sentence and page numbers start from 1, so don't +1 for array indexing
    if (page.sentences[page.sentenceNum] !== undefined) {
      // go to next sentence            
      setPage(prev => {
        Tts.speak(prev.sentences[prev.sentenceNum].trim());
        return ({
          ...prev,
          sentenceNum: prev.sentenceNum+1,
        })
      });
    } else {
      // advance to next page, if user is not currently at the last page
      if (page.pageNum !== bookPages.length) {
        goToPage(page.pageNum+1);
      } else {
        setIsPlaying(false);
      }
    }
  }

  // Add required listeners
  useEffect(() => { 
    let ttsHandler = Tts.addEventListener('tts-finish', advance);
    // overwrite Android's default back behaviour
    let backHandler = BackHandler.addEventListener('hardwareBackPress', exitScreen);

    return function cleanup() { // remove old listeners whenever the dependencies update
      if (ttsHandler !== null) ttsHandler.remove();
      if (backHandler !== null) backHandler.remove();
    }
  }, [page, isPlaying, bookmarksActive]);

  // Function to handle user selecting play/pause
  const onPlayPressed = () => {
    if (!isPlaying && page.sentences) { // if not previously playing, play audio
      Tts.speak(page.sentences[page.sentenceNum-1].trim()); // sentence number starts from 1
      setIsPlaying(true); // do this at the end because updating state has a lag
    } else { // if previously playing audio, stop audio
      Tts.stop();
      setIsPlaying(false); // do this at the end because updating state has a lag
    }
  }

  /* 
  * Function to handle user selecting stop
  * Stops TTS and reset progress in page to the first sentence
  */ 
  const onStopPressed = () => { 
    setIsPlaying(false);
    setPage(prev => ({
      ...prev,
      sentenceNum: 1, // sentence number starts from 1
    }));
    Tts.stop();
    scrollRef.current.scrollTo({y: 0}); // scroll back to top
  }

  const onBookmarksOpen = () => {
    panelRef.current.show();
    setBookmarksActive(true);
  }

  /* 
  * Helper function to go to a specific page
  * used in prev/next page buttons, bookmarked page and select page
  */
  const goToPage = (pageNumber) => {
    /** 
    * @param {number} pageNumber page number to go to
    */

    if (isPlaying) {
      Tts.stop(); // stop current playback
    }
    setPage(prev => { // go to chosen page
      const chosenPageText = bookPages[pageNumber-1].body;
      const newSentences = chosenPageText.match(sentenceRegex);
      if (!newSentences) setIsPlaying(false);
      else if (isPlaying) Tts.speak(newSentences[0].trim()); // play chosen page if user was alr playing and if page is not blank
      return ({
        ...prev,
        sentenceNum: 1,
        pageText: chosenPageText,
        sentences: newSentences,
        pageNum: pageNumber,
      });
    });
    scrollRef.current.scrollTo({y: 0}); // scroll back to top
  }

  // Function to switch to a bookmark's page when a bookmark is selected
  const onBookmarkPressed = (bookmarkedPageNum) => {
    goToPage(bookmarkedPageNum);
    panelRef.current.hide();
  }

  // Function for adding of a new bookmark
  const addNewBookmark = (bookmarkName) => {
    addBookmark(userID, bookID, bookmarkName, page.pageNum)
    .then((data) => {
      setBookmarks(data.bookmarks);
      setRefresh(!refresh);
    })
    .catch((err) => console.log(err));
  }

  // Function for removing of a old bookmark
  const removeOldBookmark = (bookmarkID) => {
    removeBookmark(userID, bookID, bookmarkID)
    .then((data) => {
      setBookmarks(data.bookmarks);
      setRefresh(!refresh);
    })
    .catch((err) => console.log(err));
  }

  // Function to handle user entering a specific page to jump to
  const onPageInputSubmit = () => {
    let chosen = Number.parseInt(chosenPage);
    if (chosen < 1 || chosen > bookPages.length) {
      setPageInputError(true);
    } else {
      goToPage(chosen);
      setShowPageModal(false);
      setPageInputError(false);
    }
  }

  // Functions to handle next/prev page
  const onNextPagePressed = () => page.pageNum+1 <= bookPages.length ? goToPage(page.pageNum+1) : null;
  const onPreviousPagePressed = () => page.pageNum-1 >= 1 ? goToPage(page.pageNum-1) : null;

  // change TTS options 
  useEffect(() => {
    Tts.setDefaultVoice(ttsOptions.voice);
    Tts.setDefaultRate(ttsOptions.rate);
    Tts.setDefaultPitch(ttsOptions.pitch);
  }, [ttsOptions]);
  
  return (
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.backIcon}>
            <Pressable onPress={exitScreen} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
              <FontAwesomeIcon icon={faChevronCircleLeft} size={36} color={COLORS.offblack}/>
            </Pressable>
          </View>
          <Text style={styles.bookTitle} numberOfLines={1}>{route.params.bookTitle}</Text>
          <View style={styles.settingsIcon}>
            <Pressable onPress={() => setShowOptionsModal(true)} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
              <FontAwesomeIcon icon={faCog} size={36} color={COLORS.offblack}/>
            </Pressable>
          </View>
        </View>

        {/* Text Reader (Middle Component) */}
        <ScrollView style={styles.textReader} ref={scrollRef}>
          <TextReader
            text={page.sentences}
            currSentence={page.sentenceNum}
            style={styles.textStyle}
            highlightStyle={{ backgroundColor: COLORS.blue }}
          />
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.pageBar}>
            <View style={styles.controlIcons}>   
              <Pressable onPress={onPreviousPagePressed} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
                <FontAwesomeIcon icon={faArrowLeft} size={42} color={'black'}/>
              </Pressable>
            </View> 
            <Pressable onPress={() => setShowPageModal(true)} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.pageNumButton]}>
              <Text style={styles.pageNumText}>Pg {page.pageNum}</Text>        
            </Pressable>
            <View style={styles.controlIcons}>   
              <Pressable onPress={onNextPagePressed} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
                <FontAwesomeIcon icon={faArrowRight} size={42} color={'black'}/>
              </Pressable>
            </View> 
          </View>
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
              <Pressable onPress={onBookmarksOpen} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}]}>
                <FontAwesomeIcon icon={faBookmark} size={42} color={'black'}/>
              </Pressable>
            </View>                        
          </View>
        </View>
        <SlidingUpPanel 
          ref={panelRef}
          draggableRange={{top: 0.65*windowHeight, bottom: 0}}
          allowDragging={false}
          friction={0.50}
          onBottomReached={() => setBookmarksActive(false)}
        >
          <Bookmarks 
            bookmarks={bookmarks} 
            onBookmarkPressed={onBookmarkPressed} 
            addNewBookmark={addNewBookmark} 
            removeOldBookmark={removeOldBookmark}
            refresh={refresh}
          />
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
                defaultValue={`${page.pageNum}`}
                keyboardType="numeric"
                underlineColorAndroid="black"
              />
              <Text style={styles.pageSelectionText}>{`/ ${bookPages.length}`}</Text>
            </View>
            <Pressable onPress={onPageInputSubmit} style={({ pressed }) => [{ opacity: pressed ? 0.2 : 1}, styles.pageNumButton]}>
              <Text style={styles.pageNumText}>Go To Page</Text>        
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      {showOptionsModal && <View style={styles.savingOverlay}></View>}
      <PlayOptionsModal
        options={ttsOptions}
        setOptions={setTtsOptions}
        show={showOptionsModal}
        setShow={setShowOptionsModal}
      />

      {/* Saving Progress Overlay */}
      {saving && 
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="gray" />
          <Text style={styles.savingText}>Saving progress...</Text>
        </View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: COLORS.offblack,
  },
  // top bar
  topBar: {
    height: '8%',
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',        
    backgroundColor: COLORS.blue,
  },
  backIcon: {
    marginRight: 16,
  },
  settingsIcon: {
    marginLeft: 16,
  },
  bookTitle: {
    ...FONTS.h2, 
    flex: 1,
  },
  // text reader
  textReader: {
    height: '70%',
  },
  textStyle: {
    ...FONTS.body2,
    lineHeight: 32,
    fontSize: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    color: COLORS.white,
  },
  // bottom bar
  bottomBar: {
    height: '20%',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    paddingVertical: 8,
  },
  pageBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pageNumButton: {
    backgroundColor: COLORS.offblack,
    width: 128,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8,
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
    borderRadius: 16,
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
    backgroundColor: COLORS.blue,
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