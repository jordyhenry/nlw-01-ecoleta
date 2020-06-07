/*
  TODO:
  - Implement any Select component for the firts screen
  - Load map in the select city on the second screen
  - Optimize the points search (cache all points from that uf and city, and show based on seleted items, avoiding api calls)

*/

import React from 'react';
import { AppLoading } from 'expo'
import { StatusBar } from 'react-native';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto'
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu'

import Routes from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular, 
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );
}