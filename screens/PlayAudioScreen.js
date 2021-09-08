import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  useColorScheme,
  View,
} from 'react-native';

export default function PlayAudioScreen({ navigation }) {
  
    return (
        <SafeAreaView>
            <StatusBar barStyle='dark-content' />
            <View style={{ alignItems: 'center' }}>
                <Text>PlayAudio Screen</Text>
            </View>
        </SafeAreaView>
      );
  }