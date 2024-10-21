import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RepositoryDetailsScreen() {
  const { repo } = useLocalSearchParams();
  const repoDetails = JSON.parse(repo as any); // Parse the repo details passed

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{repoDetails.name}</Text>
      <Text style={styles.description}>{repoDetails.description || 'No description available'}</Text>
      <Text style={styles.detail}>Language: {repoDetails.language || 'N/A'}</Text>
      <Text style={styles.detail}>Forks: {repoDetails.forks_count}</Text>
      <Text style={styles.detail}>Stars: {repoDetails.stargazers_count}</Text>
      <Text style={styles.detail}>Watchers: {repoDetails.watchers_count}</Text>
      <Text style={styles.detail}>Open Issues: {repoDetails.open_issues_count}</Text>
      <Text style={styles.detail}>Created At: {new Date(repoDetails.created_at).toLocaleDateString()}</Text>
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  detail: {
    fontSize: 14,
    marginBottom: 10,
  },
});
