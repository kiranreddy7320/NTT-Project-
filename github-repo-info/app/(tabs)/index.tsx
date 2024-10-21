import { ImageBackground, StyleSheet, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onPressSearch = () => {
    if (loading) return; // Avoid multiple requests
    setLoading(true);
    fetch(`https://api.github.com/users/${username}/repos?per_page=10&page=1`)
      .then(response => {
        if (response.status === 403) {
          // Check if the rate limit was exceeded
          const rateLimitReset:any = response.headers.get('X-RateLimit-Reset');
          const resetTime = new Date(rateLimitReset * 1000); // Convert to human-readable time
          setError(`Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}.`);
          throw new Error('Rate limit exceeded');
        }
        setLoading(false);
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          router.push({ pathname: '/details', params: { username, repos: JSON.stringify(data) } });
        } else {
          setIsDataEmpty(true);
          setError('No repositories found');
        }
        setLoading(false);
      })
      .catch(error => {
        if (!error.message.includes('Rate limit exceeded')) {
          console.error(error);
          setError('Error fetching repositories');
        }
        setLoading(false);
      });
  };
  
  return (
    <GestureHandlerRootView>
      <ImageBackground
        source={{ uri: 'https://images.ctfassets.net/wfutmusr1t3h/2sX2KYqfnGuZTqWIDUUdEI/5e36aaaab860a3bd4e026fa52d597d87/og-image-24.jpg' }} // GitHub image URL
        style={styles.background}
        resizeMode="cover"
      >
    <SafeAreaView>
      {/* Input button for user name and search button below */}
      <View style={styles.main}>
        <TextInput
          style={styles.input}
          onChangeText={text => setUsername(text)}
          value={username}
          placeholder="Search by username"
          placeholderTextColor="white"
        />
        <TouchableOpacity style={styles.button} onPress={onPressSearch}>
          <ThemedText style={styles.buttonText}>{loading ? "Loading ..." : "Search"}</ThemedText>
        </TouchableOpacity>
        {error ? <ThemedText>{error}</ThemedText> : null}
        {isDataEmpty ? <ThemedText>
          Note : Username might be incorrect or user has no repositories
        </ThemedText> : null}
      </View>
    </SafeAreaView>
    </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    borderColor: '#d3d3d3',
    color: 'white',
  },
  button: {
    backgroundColor: '#4681f4',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  background: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
