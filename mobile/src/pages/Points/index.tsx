import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'
import api from '../../services/api'

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface Point {
  id: number,
  name: string,
  image: string,
  image_url: string,
  location_lat: number,
  location_lng: number,
  items: string
}

interface Params {
  uf: string,
  city: string
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [visiblePoints, setVisiblePoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const navigation = useNavigation()
  const route = useRoute()

  const routeParams = route.params as Params

  //Load all the points from the city passed as Param
  useEffect(() => {
    api.get('points_filtered', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: ''
      }
    }).then(response => {
      setPoints(response.data)
    })
  }, [])

  //Used to load the items buttons and to cache the selected items
  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, [])

  //put all the items as selected by default
  useEffect(() => {
    setSelectedItems(items.map(item => (Number(item.id))))
  }, [items])

  //if the city has at least one point, recenter the map for the city
  //else recenter the map for the user location
  useEffect(() => {
    if(points.length > 0 )
    {
      setInitialPosition([Number(points[0].location_lat), Number(points[0].location_lng)])
      return
    }

    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if(status !== 'granted')
      {
        Alert.alert('Oooops...', 'Precisamos da sua posição para obter a sua localização !')
        navigation.goBack()
        return
      }

      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords

      setInitialPosition([
        latitude,
        longitude
      ])
    }
    
    loadPosition()
  }, [points])

  //filter the points to be visible and update the visible points
  useEffect(() => {
    const filteredPoints = points.filter(point => (
      selectedItems.filter(item => (
        point.items.includes(String(item)))
      ).length > 0
    ))
    
    setVisiblePoints(filteredPoints)
  }, [selectedItems])
  

  function handleNavigateHome() {
    navigation.goBack()
  }

  function handleNavigateToDetail(id: number)
  {
    navigation.navigate('Detail', { point_id: id })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item == id)

    if(alreadySelected >= 0)
    {
      const filteredItems = selectedItems.filter(item => item != id)
      setSelectedItems(filteredItems)
    }
    else
    {
      setSelectedItems([...selectedItems, id])
    } 
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateHome}>
          <Icon name="arrow-left"  size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem-vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
             <MapView 
             style={styles.map} 
             initialRegion={{
               latitude : initialPosition[0],
               longitude: initialPosition[1],
               latitudeDelta: 0.014,
               longitudeDelta: 0.014
             }}
           >
             {visiblePoints.map(point => (
               <Marker
                key={String(point.id)}
                style={styles.mapMarker}
                onPress={() => {handleNavigateToDetail(point.id)}}
                coordinate={{
                  latitude: point.location_lat,
                  longitude: point.location_lng
                }} 
              >
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                  <Text style={styles.mapMarkerTitle}> {point.name} </Text>
                </View>
              </Marker>
             ))}
           </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity 
              key={String(item.id)} 
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]} 
              onPress={() => { handleSelectItem(item.id)}}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url}/>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points