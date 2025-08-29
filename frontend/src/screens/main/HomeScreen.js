import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';
import { selectAuth } from '../../store/slices/authSlice';
import TaskCard from '../../components/tasks/TaskCard';
import ProgressChart from '../../components/charts/ProgressChart';
import PriorityDistribution from '../../components/charts/PriorityDistribution';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Mock data - replace with actual API calls
    setStats({
      totalTasks: 24,
      completedTasks: 18,
      pendingTasks: 6,
      overdueTasks: 2,
      completionRate: 75,
    });

    setUrgentTasks([
      {
        id: '1',
        title: 'Complete Project Proposal',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        category: 'work',
        status: 'pending',
      },
      {
        id: '2',
        title: 'Review Code Changes',
        priority: 'high',
        dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
        category: 'work',
        status: 'pending',
      },
    ]);

    setTodayTasks([
      {
        id: '3',
        title: 'Team Meeting',
        priority: 'medium',
        dueDate: new Date(),
        category: 'work',
        status: 'pending',
      },
      {
        id: '4',
        title: 'Gym Session',
        priority: 'low',
        dueDate: new Date(),
        category: 'health',
        status: 'pending',
      },
    ]);

    setSmartSuggestions([
      {
        type: 'overdue',
        message: 'You have 2 overdue tasks that need immediate attention',
        action: 'View Overdue Tasks',
        priority: 'high',
      },
      {
        type: 'productivity',
        message: 'Focus on high-priority work tasks first',
        action: 'View Work Tasks',
        priority: 'medium',
      },
      {
        type: 'schedule',
        message: 'You have 3 tasks due today',
        action: 'View Today\'s Tasks',
        priority: 'medium',
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  const handleViewAllTasks = () => {
    navigation.navigate('Tasks');
  };

  const handleViewCalendar = () => {
    navigation.navigate('Calendar');
  };

  const handleViewAnalytics = () => {
    navigation.navigate('Analytics');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: theme.colors.priorityLow,
      medium: theme.colors.priorityMedium,
      high: theme.colors.priorityHigh,
      urgent: theme.colors.priorityUrgent,
    };
    return colors[priority] || theme.colors.gray;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: 'briefcase',
      personal: 'account-heart',
      study: 'school',
      health: 'heart-pulse',
      finance: 'wallet',
      other: 'tag',
    };
    return icons[category] || 'tag';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Greeting */}
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.first_name || user?.username || 'User'}!</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="account-circle" size={40} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalTasks}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.completedTasks}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.completionRate}%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Progress Overview */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Progress Overview</Title>
            <ProgressChart
              completed={stats.completedTasks}
              total={stats.totalTasks}
              size={120}
            />
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressLabel}>Pending</Text>
                <Text style={styles.progressValue}>{stats.pendingTasks}</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressLabel}>Overdue</Text>
                <Text style={[styles.progressValue, { color: theme.colors.error }]}>
                  {stats.overdueTasks}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Urgent Tasks */}
        {urgentTasks.length > 0 && (
          <Card style={styles.urgentCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>🚨 Urgent Tasks</Title>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Tasks', { filter: 'urgent' })}
                  textColor={theme.colors.primary}
                >
                  View All
                </Button>
              </View>
              {urgentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                  compact
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <Card style={styles.todayCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>📅 Today's Tasks</Title>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Tasks', { filter: 'today' })}
                  textColor={theme.colors.primary}
                >
                  View All
                </Button>
              </View>
              {todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                  compact
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Smart Suggestions */}
        <Card style={styles.suggestionsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>💡 Smart Suggestions</Title>
            {smartSuggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Icon
                  name={
                    suggestion.type === 'overdue' ? 'alert-circle' :
                    suggestion.type === 'productivity' ? 'lightbulb' : 'calendar-clock'
                  }
                  size={20}
                  color={getPriorityColor(suggestion.priority)}
                  style={styles.suggestionIcon}
                />
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionText}>{suggestion.message}</Text>
                  <Button
                    mode="text"
                    onPress={() => {
                      if (suggestion.action.includes('Overdue')) {
                        navigation.navigate('Tasks', { filter: 'overdue' });
                      } else if (suggestion.action.includes('Work')) {
                        navigation.navigate('Tasks', { filter: 'work' });
                      } else if (suggestion.action.includes('Today')) {
                        navigation.navigate('Tasks', { filter: 'today' });
                      }
                    }}
                    textColor={theme.colors.primary}
                    compact
                  >
                    {suggestion.action}
                  </Button>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleCreateTask}
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                icon="plus"
              >
                New Task
              </Button>
              <Button
                mode="outlined"
                onPress={handleViewCalendar}
                style={styles.actionButton}
                icon="calendar"
              >
                Calendar
              </Button>
              <Button
                mode="outlined"
                onPress={handleViewAnalytics}
                style={styles.actionButton}
                icon="chart-line"
              >
                Analytics
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreateTask}
        color={theme.colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: theme.colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  profileButton: {
    padding: 5,
  },
  statsContainer: {
    marginTop: -20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 16,
    elevation: 8,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.lightGray,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.textPrimary,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  urgentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  todayCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  suggestionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginVertical: 8,
    minWidth: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HomeScreen; 