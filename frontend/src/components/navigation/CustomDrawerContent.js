import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Avatar, Divider, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../theme';
import { logoutUser, selectAuth } from '../../store/slices/authSlice';

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector(selectAuth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Navigation will be handled by the auth state change
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'home',
      onPress: () => props.navigation.navigate('MainTabs', { screen: 'Home' }),
    },
    {
      title: 'My Tasks',
      icon: 'format-list-checks',
      onPress: () => props.navigation.navigate('MainTabs', { screen: 'Tasks' }),
    },
    {
      title: 'Calendar',
      icon: 'calendar',
      onPress: () => props.navigation.navigate('MainTabs', { screen: 'Calendar' }),
    },
    {
      title: 'Analytics',
      icon: 'chart-line',
      onPress: () => props.navigation.navigate('MainTabs', { screen: 'Analytics' }),
    },
    {
      title: 'My Profile',
      icon: 'account',
      onPress: () => props.navigation.navigate('Profile'),
    },
    {
      title: 'Settings',
      icon: 'cog',
      onPress: () => props.navigation.navigate('Settings'),
    },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        {/* User Profile Section */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <Avatar.Text
                size={60}
                label={user?.first_name?.[0] || user?.username?.[0] || 'U'}
                style={styles.avatar}
                color={theme.colors.white}
                backgroundColor={theme.colors.primary}
              />
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.userStats}>
                <Text style={styles.statText}>
                  {profile?.default_priority || 'Medium'} Priority
                </Text>
                <Text style={styles.statText}>
                  {profile?.default_category || 'Personal'} Focus
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={theme.colors.textSecondary}
                  style={styles.menuIcon}
                />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => props.navigation.navigate('CreateTask')}
          >
            <Icon name="plus" size={20} color={theme.colors.primary} />
            <Text style={styles.quickActionText}>Create New Task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => props.navigation.navigate('MainTabs', { screen: 'Tasks', params: { filter: 'urgent' } })}
          >
            <Icon name="alert" size={20} color={theme.colors.error} />
            <Text style={styles.quickActionText}>View Urgent Tasks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => props.navigation.navigate('MainTabs', { screen: 'Tasks', params: { filter: 'today' } })}
          >
            <Icon name="calendar-today" size={20} color={theme.colors.info} />
            <Text style={styles.quickActionText}>Today's Tasks</Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.divider} />

        {/* Support Section */}
        <View style={styles.supportSection}>
          <TouchableOpacity style={styles.supportButton}>
            <Icon name="help-circle" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.supportText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportButton}>
            <Icon name="information" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.supportText}>About TaskMaster</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  userSection: {
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  divider: {
    backgroundColor: theme.colors.lightGray,
    height: 1,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  quickActionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginLeft: 12,
    fontWeight: '500',
  },
  supportSection: {
    padding: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  supportText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 12,
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.error + '10',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: theme.colors.error,
    marginLeft: 12,
    fontWeight: '600',
  },
});

export default CustomDrawerContent; 