import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Card, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });

      // Support both shapes: { access, refresh } or { tokens: { access, refresh } }
      const tokens = response?.data?.tokens || response?.data || {};
      const access = tokens.access;
      const refresh = tokens.refresh;

      if (access) {
        await AsyncStorage.setItem('access_token', access);
        if (refresh) {
          await AsyncStorage.setItem('refresh_token', refresh);
        }
        navigation.replace('Main');
      } else {
        Alert.alert('Error', 'Unexpected login response from server.');
      }
    } catch (error) {
      console.error('Login error:', error?.response?.data || error?.message || error);
      if (error.response?.status === 400) {
        const detail = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data?.detail || error.response.data?.non_field_errors?.[0] || 'Invalid request.';
        Alert.alert('Login Failed', detail);
      } else if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Invalid username or password');
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>TaskMaster</Title>
        <Text style={styles.subtitle}>Intelligent Task Manager</Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              disabled={loading}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              disabled={loading}
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {loading && (
              <ActivityIndicator style={styles.loader} color="#6200EE" />
            )}

            <Button
              mode="outlined"
              onPress={handleDemoLogin}
              style={styles.demoButton}
              disabled={loading}
            >
              Demo Login (Skip Authentication)
            </Button>

            <Text style={styles.demoText}>
              Use your Django superuser credentials or demo login
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200EE',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    opacity: 0.9,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  demoButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
  demoText: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
    fontSize: 12,
  },
}); 