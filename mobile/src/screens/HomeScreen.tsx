import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = () => {
  const { user, logout } = useAuth();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.name}!</Text>
        <Text style={styles.roleBadge}>{user?.role}</Text>
      </View>
      
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Main application features will be built here.</Text>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f5f9' },
  header: { marginTop: 40, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 18, color: '#64748b', marginTop: 5 },
  roleBadge: { alignSelf: 'flex-start', backgroundColor: '#e0e7ff', color: '#4338ca', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 12, fontWeight: 'bold', marginTop: 10, overflow: 'hidden' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#94a3b8', fontSize: 16, textAlign: 'center' },
  logoutButton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
