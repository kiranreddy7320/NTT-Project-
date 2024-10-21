import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">FAQ</ThemedText>
      </ThemedView>
      <Collapsible title="What is this app?">
        <ThemedText>
          This app is a simple GitHub repository search app. You can search for a GitHub user and view their repositories.
        </ThemedText>
      </Collapsible>
      <Collapsible title="How to search for a user?">
        <ThemedText>
          Enter the GitHub username in the search box and press the search button. The app will fetch the repositories of the user.
        </ThemedText>
      </Collapsible>
      <Collapsible title="What can I do with the repositories?">
        <ThemedText>
          You can view the repositories of the user. Tap on a repository to view more details about it.
        </ThemedText>
      </Collapsible>      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
