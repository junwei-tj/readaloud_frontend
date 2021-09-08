import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  Button,
  View,
  useColorScheme,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  
    const isDarkMode = useColorScheme() === 'dark';
  
    // const backgroundStyle = {
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };
    return (
      
      <SafeAreaView>
        <StatusBar barStyle='dark-content' />
        <View style={{ alignItems: 'center' }}>
                <Text>Home Screen</Text>
                <Button
                    title="Play Audio"
                    onPress={() => navigation.navigate('PlayAudio')}
                />
        </View>
      </SafeAreaView>
    );
  }