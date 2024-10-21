import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

export default function DetailsScreen() {
  const { username, repos } = useLocalSearchParams();
  const router = useRouter();
  const [repoData, setRepoData] = useState(JSON.parse(repos as any)); // Parse the repos back to JSON
  const [filteredRepos, setFilteredRepos] = useState(repoData); // Stores the filtered repositories
  const [languages, setLanguages] = useState<string[]>([]); // Store the available languages
  const [selectedLanguage, setSelectedLanguage] = useState<string>(''); // User's selected language
  const [page, setPage] = useState(2); // Current page for pagination
  const [loading, setLoading] = useState(false); // To handle the loading indicator
  const [allLoaded, setAllLoaded] = useState(false); // To know when all repos are loaded
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Get unique programming languages from repositories
    const repoLanguages = Array.from(new Set(repoData.map((repo: any) => repo.language).filter(Boolean)));
    setLanguages(repoLanguages as any);
  }, [repoData]);

  const onRepoPress = (repo: any) => {
    // Navigate to RepositoryDetails screen with selected repo details
    router.push({
      pathname: '/repository-details',
      params: { repo: JSON.stringify(repo) },
    });
  };

  useEffect(() => {
    // Ensure the data is parsed correctly and is an array
    const parsedRepos = Array.isArray(repoData) ? repoData : [];
    const repoLanguages = Array.from(new Set(parsedRepos.map((repo: any) => repo.language).filter(Boolean)));
    setLanguages(repoLanguages);
  }, [repoData]);

  // Function to fetch more repositories when reaching the end
  const fetchMoreRepos = () => {
    if (loading || allLoaded) return; // Avoid fetching if already loading or all repos are loaded

    setLoading(true);
    fetch(`https://api.github.com/users/${username}/repos?per_page=10&page=${page + 1}`)
      .then(response => response.json())
      .then(newRepos => {
        if (newRepos.length === 0) {
          setAllLoaded(true); // No more repos to load
        } else {
          const updatedRepos = [...repoData, ...newRepos];
          setRepoData(updatedRepos); // Append new repos to the list
          filterReposByLanguage(selectedLanguage, updatedRepos); // Reapply the filter on new data
          setPage(prevPage => prevPage + 1); // Increment page number
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  // Function to filter repositories by the selected language
  const filterReposByLanguage = (language: string, reposToFilter = repoData) => {
    if (language === '') {
      setFilteredRepos(reposToFilter); // If no language is selected, show all repos
      setErrorMessage('');
    } else {
      const filtered = reposToFilter.filter((repo: any) => repo.language === language);
      setFilteredRepos(filtered);
      if (filtered.length === 0) {
        setErrorMessage('No repository found with the selected language.');
      } else {
        setErrorMessage('');
      }
    }
  };

  const onLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    filterReposByLanguage(language);
  };

  return (
    <View style={styles.container}>
      {/* Display the username */}
      <Text style={styles.title}>Repositories of {username}</Text>

      {/* Dropdown for language selection */}
      <View style={styles.pickerContainer}>
        <Text>Select a language:</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={onLanguageChange}
          style={styles.picker}
        >
          <Picker.Item label="All Languages" value="" />
          {languages.map((lang, index) => (
            <Picker.Item key={index} label={lang} value={lang} />
          ))}
        </Picker>
      </View>

      {/* List the repositories */}
      <GestureHandlerRootView>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <FlatList
            data={filteredRepos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onRepoPress(item)}>
                <View style={styles.repoItem}>
                  <Text style={styles.repoName}>{item.name}</Text>
                  <Text style={styles.repoDescription}>{item.description || 'No description available'}</Text>
                  <Text style={styles.repoLanguage}>Language: {item.language}</Text>
                </View>
              </TouchableOpacity>
            )}
            onEndReached={fetchMoreRepos} // Load more repos when the end is reached
            onEndReachedThreshold={0.5} // Adjust to trigger fetch slightly before the end
            ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null} // Show loading spinner when fetching
          />
        )}
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  repoItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  repoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  repoDescription: {
    fontSize: 14,
    color: '#555',
  },
  repoLanguage: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
