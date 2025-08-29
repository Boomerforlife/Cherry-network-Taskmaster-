import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>TaskMaster</Title>
        <Paragraph style={styles.subtitle}>Intelligent Task Manager</Paragraph>
      </View>
      
      <Drawer.Section>
        <Drawer.Item
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          )}
          label="Dashboard"
          onPress={() => props.navigation.navigate('MainTabs')}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="format-list-checks" color={color} size={size} />
          )}
          label="My Tasks"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Tasks' })}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          )}
          label="Calendar"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Calendar' })}
        />
        <Drawer.Item
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={size} />
          )}
          label="Analytics"
          onPress={() => props.navigation.navigate('MainTabs', { screen: 'Analytics' })}
        />
      </Drawer.Section>
      
      <Drawer.Section>
        <Drawer.Item
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          )}
          label="Profile"
          onPress={() => props.navigation.navigate('Profile')}
        />
      </Drawer.Section>
      
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => props.navigation.navigate('Login')}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#6200EE',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    opacity: 0.9,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
}); 