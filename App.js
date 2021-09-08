import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import PlayAudioScreen from './screens/PlayAudioScreen';



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
