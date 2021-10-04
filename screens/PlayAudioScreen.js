import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Pressable,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronCircleLeft, faPlayCircle, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

import Tts from 'react-native-tts';
import HighlightText from '@sanar/react-native-highlight-text';

import { book } from '../testBeeMovie'; // REMOVE AFTER INCORPORATING API
import { progress } from '../testBookProgress'; // REMOVE AFTER INCORPORATING API

Tts.setDucking(true); // Enable lowering other applications output level while speaking (also referred to as "ducking").

const sentenceRegex = /[^.?!]+[.!?]+[\])'"`’”]*|.+$/g; // used to split text into sentences

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
        overflow: 'hidden',
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
        width: '80%'
    },
    controlIcons: {
        width: 64,
        height: 56,
        borderRadius: 24,
        // backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function PlayAudioScreen({ navigation }) {

    const [isPlaying, setIsPlaying] = useState(false);    

    const [page, setPage] = useState({
        sentenceNum: 30,
        pageText: book[0].page[progress.currentPage].body,
        sentences: book[0].page[progress.currentPage].body.match(sentenceRegex),
        pageNum: progress.currentPage,
    })

    // function to increment slider position every second
    const onPlayPressed = () => {
        setIsPlaying(!isPlaying); // because updating state has a lag, we do it at the end to ensure lag doesn't affect anything
    }

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
                // play(0, book[0].page[prev.pageNum+1].body.match(sentenceRegex));
                Tts.speak(book[0].page[prev.pageNum+1].body.match(sentenceRegex)[0].trim());
                return ({
                    sentenceNum: 0,
                    pageText: book[0].page[prev.pageNum+1].body,
                    sentences: book[0].page[prev.pageNum+1].body.match(sentenceRegex),
                    pageNum: prev.pageNum+1,
                });
            });
        }
    }

    useEffect(() => {
        Tts.removeAllListeners('tts-finish');
        Tts.addEventListener('tts-finish', advance);
    }, [page]);

    useEffect(() => {
        if (isPlaying) {
            Tts.speak(page.sentences[page.sentenceNum].trim());
        } else {
            Tts.stop();
        }
    }, [isPlaying]);
  
    return (
        <SafeAreaView>
            <StatusBar barStyle='dark-content' />
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.backIcon}>
                        <Pressable onPress={() => navigation.navigate("HomeScreen")} android_ripple={{color: 'gray', borderless: true}}>
                            <FontAwesomeIcon icon={faChevronCircleLeft} size={36} color={COLORS.offblack} style={{margin: -1}}/>
                        </Pressable>
                    </View>
                    <Text style={FONTS.h1}>Title of Book</Text>
                </View>
                <ScrollView style={styles.textReader}>
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
                                <FontAwesomeIcon icon={faPlayCircle} size={48} color={'black'} />
                            </Pressable>
                        </View>
                        <View style={styles.controlIcons}>   
                            <Pressable onPress={() => console.log("pressed book options!")} android_ripple={{color: 'gray', borderless: true}}>
                                <FontAwesomeIcon icon={faBookmark} size={42} color={'black'}/>
                            </Pressable>
                        </View>                        
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const sampleText =  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum aliquet malesuada turpis quis ullamcorper." + 
                    "Donec pharetra dignissim massa id scelerisque. Nunc viverra volutpat sapien ut pulvinar. Pellentesque at luctus nibh," + 
                    " nec vulputate erat. Cras suscipit nibh eget quam faucibus pharetra. Nullam id neque tempus, efficitur justo vitae, pharetra nisl." + 
                    " Nam et augue sed ligula mollis aliquam consectetur id orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
                    " Curabitur eu blandit augue. Phasellus fringilla feugiat venenatis. Curabitur nec accumsan mauris. Aliquam pretium massa "+ 
                    "vel nunc congue ultrices. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas." +
                    " Pellentesque sed imperdiet massa. Suspendisse lacinia, nibh nec dictum facilisis, quam tellus posuere magna, eget rhoncus" + 
                    " enim lectus nec risus. Vestibulum sit amet sollicitudin lacus, in pulvinar dolor. Sed ullamcorper tellus et lacus vulputate," + 
                    " sit amet dictum tortor placerat. Pellentesque mollis urna sit amet risus placerat porta. Cras mi odio, commodo a tellus eget," +
                    " consectetur gravida augue. Ut et dignissim enim. Sed viverra dui ipsum, nec blandit mauris viverra vitae. Sed metus quam," +
                    " vestibulum sed pulvinar quis, viverra in nunc. Sed mattis sollicitudin quam porta rutrum. Proin molestie, augue in maximus aliquam," + 
                    " velit justo hendrerit mi, nec vehicula nunc libero sit amet sem. Aenean sed odio varius, scelerisque ex in, lacinia arcu." + 
                    " Donec eu nisi ligula. Fusce congue, leo id volutpat dignissim, sem metus bibendum felis, in laoreet quam arcu at ante." +
                    " Morbi non risus ac elit aliquam aliquet. Nunc mi nisl, finibus nec elit et, vulputate porttitor quam. Nullam efficitur semper" +
                    " sodales. Phasellus a elit nulla. Vivamus ullamcorper blandit tempor. Fusce bibendum nisl vel libero sagittis, eget elementum" + 
                    " nisl luctus. Quisque dictum velit ut tincidunt aliquam. Fusce vel sapien quis ex sagittis suscipit a id ligula. Etiam semper" + 
                    " sapien ante, id imperdiet nunc semper a.";

const beeMovie =    "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground." +
                    " The bee, of course, flies anyway because bees don't care what humans think is impossible."