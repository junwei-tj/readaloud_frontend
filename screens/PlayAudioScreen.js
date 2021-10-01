import React, { useState, useEffect, } from 'react';
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
import { faChevronCircleLeft, faPlayCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    topBar: {
        height: '10%',
        width: '100%',
        padding: 16,
        backgroundColor: 'grey',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        borderRadius: 32,
        width: 32,
        height: 32, 
        overflow: 'hidden',
        marginRight: 16,
    },
    textReader: {
        height: '70%',
        backgroundColor: 'blue',
    },
    bottomBar: {
        height: '20%',
        backgroundColor: 'green',
        alignItems: 'center',
    },
    bookTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    textStyle: {
        fontSize: 24,
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    slider: {
        width: '90%', 
        height: 40,
    },
});

export default function PlayAudioScreen({ navigation }) {

    const [sliderValue, setSliderValue] = useState(0); // to change to user's last saved position
    const [maxSliderValue, setMaxSliderValue] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalObj, setIntervalObj] = useState(null);

    // function to increment slider position every second
    // const updateSlider

    const onPlayPressed = () => {
        if (!isPlaying) {
            if (sliderValue === maxSliderValue) { // restart audio
                setSliderValue(0);
            }
            setIntervalObj(setInterval(() => {
                setSliderValue(prevValue => prevValue + 1);
            }, 1000));
        } else {
            clearInterval(intervalObj);
            console.log("stopped!");
        }
        setIsPlaying(!isPlaying); // because updating state has a lag, we do it at the end to ensure lag doesn't affect anything
    }

    useEffect(() => {
        if (sliderValue === maxSliderValue) {
            clearInterval(intervalObj);
            setIsPlaying(false);
        }
    }, [sliderValue])
  
    return (
        <SafeAreaView>
            <StatusBar barStyle='dark-content' />
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.iconContainer}>
                        <Pressable onPress={() => navigation.navigate("HomeScreen")} android_ripple={{color: 'lightgray'}}>
                            <FontAwesomeIcon icon={faChevronCircleLeft} size={32} color={'black'} />
                        </Pressable>
                    </View>
                    <View style={styles.bookTitleContainer}>
                        <Text style={{fontSize: 32}}>Title of Book</Text>
                    </View>                    
                </View>
                <ScrollView style={styles.textReader}>
                    <Text style={styles.textStyle}>
                        {sampleText}
                    </Text>
                </ScrollView>
                <View style={styles.bottomBar}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={maxSliderValue}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        value={sliderValue}
                    />
                    <View style={styles.iconContainer}>
                        <Pressable onPress={onPlayPressed} android_ripple={{color: 'lightgray'}}>
                            <FontAwesomeIcon icon={faPlayCircle} size={32} color={'black'} />
                        </Pressable>
                    </View>
                    <View style={styles.iconContainer}>
                        <Pressable onPress={() => console.log("pressed book options!")} android_ripple={{color: 'lightgray'}}>
                            <FontAwesomeIcon icon={faBars} size={32} color={'black'} />
                        </Pressable>
                    </View>
                    <Text>
                        {sliderValue}
                    </Text>
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