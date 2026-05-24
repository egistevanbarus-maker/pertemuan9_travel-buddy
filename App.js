import React, { useState, createContext, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// 1. --- CONTEXT API (Penyimpanan Global Favorit) ---
const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  
  const toggleFavorite = (destination) => {
    if (favorites.find(item => item.id === destination.id)) {
      setFavorites(favorites.filter(item => item.id !== destination.id));
    } else {
      setFavorites([...favorites, destination]);
    }
  };

  const isFavorite = (id) => favorites.some(item => item.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// --- DATA ---
const DESTINATIONS = [
  { id: '1', name: 'Raja Ampat', location: 'Papua', price: 'Rp 2.000.000', image: 'https://images.unsplash.com/photo-1516690553959-71a414d6b9b6', description: 'Surga bawah laut dunia.' },
  { id: '2', name: 'Mount Bromo', location: 'Jawa Timur', price: '$1.500.000', image: 'https://images.unsplash.com/photo-1602154663343-89fe0bf541ab', description: 'Sunrise terbaik di Indonesia.' },
  { id: '3', name: 'Nusa Penida', location: 'Bali', price: '$4.000.000', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392', description: 'Tebing ikonik Kelingking.' },
  { id: '4', name: 'Komodo Park', location: 'NTT', price: '$3.000.000', image: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca', description: 'Rumah Komodo.' },
  { id: '5', name: 'Danau Toba', location: 'Sumut', price: '$2.800.000', image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647', description: 'Danau vulkanik terbesar.' },
  { id: '6', name: 'Borobudur', location: 'Jateng', price: '$2.500.000', image: 'https://images.unsplash.com/photo-1584820927498-cafe6c1c8a5a', description: 'Candi Buddha terbesar.' },
  { id: '7', name: 'Tana Toraja', location: 'Sulsel', price: '$1.500.000', image: 'https://images.unsplash.com/photo-1592395679502-861058097561', description: 'Budaya unik leluhur.' },
  { id: '8', name: 'Ubud', location: 'Bali', price: '$1.000.000', image: 'https://images.unsplash.com/photo-1538645062751-246e7f7b3a7a', description: 'Hutan monyet yang asri.' },
];

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- SCREENS ---
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Explore</Text>
      <FlatList
        data={DESTINATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { destination: item })}>
            <Image source={{ uri: item.image }} style={styles.cardImg} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardLoc}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function DetailScreen({ route }) {
  const { destination } = route.params;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const isFav = isFavorite(destination.id);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: destination.image }} style={styles.hero} />
      <View style={styles.padding}>
        <Text style={styles.title}>{destination.name}</Text>
        <Text style={styles.price}>{destination.price}</Text>
        <Text style={styles.desc}>{destination.description}</Text>
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(destination)}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={30} color="#00b894" />
          <Text style={{ color: '#00b894', marginLeft: 10 }}>{isFav ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const filtered = DESTINATIONS.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search destination..." value={query} onChangeText={setQuery} style={styles.searchInput} />
      <FlatList 
        data={filtered} 
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.searchItem} onPress={() => navigation.navigate('Detail', { destination: item })}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function FavoritesScreen({ navigation }) {
  const { favorites } = useContext(FavoritesContext);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Favorites</Text>
      <FlatList 
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Home', { screen: 'Detail', params: { destination: item } })}>
            <Image source={{ uri: item.image }} style={styles.cardImg} />
            <Text style={{ padding: 10, fontWeight: 'bold' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ padding: 20, textAlign: 'center' }}>No favorites yet!</Text>}
      />
    </SafeAreaView>
  );
}

// --- NAVIGATORS ---
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeList" component={HomeScreen} options={{ title: 'Travel Buddy', headerShown: false }} />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#00b894' }}>
          <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: (p) => <Ionicons name="home" {...p}/> }} />
          <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: (p) => <Ionicons name="search" {...p}/> }} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarIcon: (p) => <Ionicons name="heart" {...p}/> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', margin: 16 },
  card: { margin: 16, backgroundColor: '#f9f9f9', borderRadius: 12, overflow: 'hidden' },
  cardImg: { width: '100%', height: 200 },
  cardInfo: { padding: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardLoc: { color: '#666' },
  hero: { width: '100%', height: 300 },
  padding: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, color: '#00b894', marginVertical: 10 },
  desc: { color: '#444', lineHeight: 22 },
  favBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  searchInput: { borderWidth: 1, borderColor: '#ddd', padding: 10, margin: 16, borderRadius: 8, marginTop: 50 },
  searchItem: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' }
});