import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
} from 'react-native';


function HomeScreen({ navigation }) {
  
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  return (
    
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>Test</Text>
      <Button
        title="Play Audio"
        onPress={() => navigation.navigate('PlayAudio')}
      />
    </SafeAreaView>
  );
}

function PlayAudioScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>PlayAudio Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"ReadAloud"}}/>
        <Stack.Screen name="PlayAudio" component={PlayAudioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};
