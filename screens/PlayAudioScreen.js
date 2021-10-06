import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Pressable,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Dimensions, BackHandler } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronCircleLeft, faPlayCircle, faPauseCircle, faStopCircle, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Tts from 'react-native-tts';
import HighlightText from '@sanar/react-native-highlight-text';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { book } from '../testBeeMovie'; // REMOVE AFTER INCORPORATING API
import { progress } from '../testBookProgress'; // REMOVE AFTER INCORPORATING API
import { Bookmarks } from '../components/Bookmarks';
import { UserContext } from '../App';
import { addBookmark, removeBookmark } from './APICaller';

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
  pageText: {
    fontSize: 24,
    marginTop: 8,
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
});

export default function PlayAudioScreen({ navigation, route }) {
  const [isPlaying, setIsPlaying] = useState(false);    
  const [bookmarks, setBookmarks] = useState(progress.bookmarks);
  const [page, setPage] = useState({
    sentenceNum: 30,
    pageText: book[0].page[progress.currentPage].body,
    sentences: book[0].page[progress.currentPage].body.match(sentenceRegex),
    pageNum: progress.currentPage,
  });

  const { userInfo } = useContext(UserContext);

  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  // overwrite Android's default back behaviour
  useEffect(() => { 
    BackHandler.addEventListener('hardwareBackPress', () => {
      exitScreen();
      return true; // other back actions (including system default) will not execute
    });
  }, []);

  // function to handle exiting playback screen
  // will need to stop TTS and save user progress
  const exitScreen = () => { 
      if (isPlaying) {
          setIsPlaying(false);
          Tts.stop();
      }
      navigation.goBack();
      // TODO: save user progress
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
        const newSentences = book[0].page[prev.pageNum+1].body.match(sentenceRegex);
        Tts.speak(newSentences[0].trim());
        return ({
          sentenceNum: 0,
          pageText: book[0].page[prev.pageNum+1].body,
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
  const onBookmarkPressed = (page) => {
    const currPlaying = isPlaying;
    if (currPlaying) {
      Tts.stop(); // stop current playback
    }
    setPage(prev => { // go to chosen page
      const newSentences = book[0].page[page].body.match(sentenceRegex);
      if (currPlaying) Tts.speak(newSentences[0].trim()); // play chosen page
      return ({
        ...prev,
        sentenceNum: 0,
        pageText: book[0].page[page].body,
        sentences: newSentences,
        pageNum: page,
      })
    });
    scrollRef.current.scrollTo({y: 0}); // scroll back to top
    panelRef.current.hide();
  }

  const addNewBookmark = (bookmarkName) => {
    setBookmarks(prev => [...prev, {
      _id: Math.floor(Math.random() * 1000), // generate temp random id to add to bookmark flatlist
      name: bookmarkName,
      page: page.pageNum
    }]);
    // addBookmark(userInfo.user.id, book._id, bookmarkName, page.pageNum)
    // .then(() => {
    //   setBookmarks(prev => [...prev, {
    //     _id: Math.floor(Math.random() * 1000), // generate temp random id to add to bookmark flatlist
    //     name: bookmarkName,
    //     page: page.pageNum
    //   }]);
    // })
    // .catch((err) => console.log(err));
  }

  const removeOldBookmark = (bookmarkID) => {
    let index = 0;
    for (let i=0; i < bookmarks.length; i++) {
      if (bookmarks[i]._id === bookmarkID) {
        index = i;
        break;
      }
    }
    // correct bookmarkID will always be found
    setBookmarks([...bookmarks.slice(0, index), ...bookmarks.slice(index+1, bookmarks.length)]);
    // removeBookmark(userInfo.user.id, book._id, bookmarkID)
    // .then(() => {
    //   let index = 0;
    //   for (let i=0; i < bookmarks.length; i++) {
    //     if (bookmark._id === bookmarkID) {
    //       index = i;
    //       break;
    //     }
    //   }
    //   setBookmarks([...bookmarks.slice(0, index), ...bookmarks.slice(index+1, bookmarks.length)]);
    // })
  }
  
  return (
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.backIcon}>
            <Pressable onPress={exitScreen} android_ripple={{color: 'gray', borderless: true}}>
              <FontAwesomeIcon icon={faChevronCircleLeft} size={36} color={COLORS.offblack}/>
            </Pressable>
          </View>
          <Text style={FONTS.h1}>Title of Book</Text>
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
          <Text style={FONTS.h2}>Pg {page.pageNum}</Text>            
          <View style={styles.controlBar}>   
            <View style={styles.controlIcons}>   
              <Pressable onPress={onPlayPressed} android_ripple={{color: 'gray', borderless: true}}>
                  <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlayCircle} size={48} color={'black'} />
              </Pressable>
            </View>
            <View style={styles.controlIcons}>   
              <Pressable onPress={onStopPressed} android_ripple={{color: 'gray', borderless: true}}>
                <FontAwesomeIcon icon={faStopCircle} size={48} color={'black'} />
              </Pressable>
            </View>
            <View style={styles.controlIcons}>   
              <Pressable onPress={() => panelRef.current.show()} android_ripple={{color: 'gray', borderless: true}}>
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
    </SafeAreaView>
  );
}

