import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tasksAPI } from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const normalizeTasks = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return [];
  };

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      const tasks = normalizeTasks(response?.data);

      const total = tasks.length;
      const completed = tasks.filter(task => task.status === 'completed').length;
      const pending = total - completed;
      const overdue = tasks.filter(task =>
        new Date(task.due_date) < new Date() && task.status !== 'completed'
      ).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        overdueTasks: overdue,
        completionRate: completionRate,
      });

      const urgent = tasks.filter(task =>
        task.priority === 'urgent' || task.priority === 'high'
      ).slice(0, 2);

      const today = tasks.filter(task => {
        const taskDate = new Date(task.due_date);
        const today = new Date();
        return taskDate.toDateString() === today.toDateString();
      }).slice(0, 2);

      setUrgentTasks(urgent);
      setTodayTasks(today);

    } catch (error) {
      console.log('Using mock data - API not accessible:', error?.message || error);
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
          due_date: '2 hours',
          category: 'work',
        },
        {
          id: '2',
          title: 'Review Code Changes',
          priority: 'high',
          due_date: '6 hours',
          category: 'work',
        },
      ]);

      setTodayTasks([
        {
          id: '3',
          title: 'Team Meeting',
          priority: 'medium',
          due_date: 'Today',
          category: 'work',
        },
        {
          id: '4',
          title: 'Gym Session',
          priority: 'low',
          due_date: 'Today',
          category: 'health',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
      urgent: '#9C27B0',
    };
    return colors[priority] || '#757575';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: 'briefcase',
      personal: 'heart',
      study: 'book-open-variant',
      health: 'medical-bag',
      finance: 'currency-usd',
    };
    return icons[category] || 'checkbox-blank-circle';
  };

  const formatDueDate = (dueDate) => {
    if (typeof dueDate === 'string' && dueDate.includes('hours')) {
      return dueDate;
    }

    try {
      const date = new Date(dueDate);
      const now = new Date();
      const diffTime = date - now;
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

      if (diffHours < 0) return 'Overdue';
      if (diffHours === 0) return 'Due now';
      if (diffHours < 24) return `${diffHours} hours`;
      if (diffHours < 48) return 'Tomorrow';
      return date.toLocaleDateString();
    } catch {
      return dueDate;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Stats */}
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Welcome to TaskMaster</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{stats.totalTasks}</Title>
              <Paragraph style={styles.statLabel}>Total Tasks</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{stats.completedTasks}</Title>
              <Paragraph style={styles.statLabel}>Completed</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{stats.completionRate}%</Title>
              <Paragraph style={styles.statLabel}>Success Rate</Paragraph>
            </View>
          </View>
        </View>

        {/* Urgent Tasks */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              <MaterialCommunityIcons name="alert" size={20} color="#F44336" /> Urgent Tasks
            </Title>
            {urgentTasks.length > 0 ? (
              urgentTasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskHeader}>
                    <Title style={styles.taskTitle}>{task.title}</Title>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getPriorityColor(task.priority) }}
                      style={[styles.priorityChip, { borderColor: getPriorityColor(task.priority) }]}
                    >
                      {task.priority}
                    </Chip>
                  </View>
                  <View style={styles.taskDetails}>
                    <View style={styles.categoryContainer}>
                      <MaterialCommunityIcons
                        name={getCategoryIcon(task.category)}
                        size={16}
                        color="#666"
                      />
                      <Paragraph style={styles.taskCategory}>
                        {task.category}
                      </Paragraph>
                    </View>
                    <Paragraph style={styles.taskDueDate}>
                      Due: {formatDueDate(task.due_date)}
                    </Paragraph>
                  </View>
                </View>
              ))
            ) : (
              <Paragraph style={styles.noTasks}>No urgent tasks</Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Today's Tasks */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              <MaterialCommunityIcons name="calendar-today" size={20} color="#2196F3" /> Today's Tasks
            </Title>
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskHeader}>
                    <Title style={styles.taskTitle}>{task.title}</Title>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getPriorityColor(task.priority) }}
                      style={[styles.priorityChip, { borderColor: getPriorityColor(task.priority) }]}
                    >
                      {task.priority}
                    </Chip>
                  </View>
                  <View style={styles.taskDetails}>
                    <View style={styles.categoryContainer}>
                      <MaterialCommunityIcons
                        name={getCategoryIcon(task.category)}
                        size={16}
                        color="#666"
                      />
                      <Paragraph style={styles.taskCategory}>
                        {task.category}
                      </Paragraph>
                    </View>
                    <Paragraph style={styles.taskDueDate}>
                      Due: {formatDueDate(task.due_date)}
                    </Paragraph>
                  </View>
                </View>
              ))
            ) : (
              <Paragraph style={styles.noTasks}>No tasks due today</Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>
              <MaterialCommunityIcons name="flash" size={20} color="#FF9800" /> Quick Actions
            </Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Tasks')}
                style={styles.actionButton}
                icon="format-list-checks"
              >
                View All Tasks
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Calendar')}
                style={styles.actionButton}
                icon="calendar"
              >
                Open Calendar
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => Alert.alert('Create Task', 'Task creation coming soon!')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#6200EE',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    opacity: 0.9,
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  priorityChip: {
    height: 24,
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCategory: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 4,
  },
  taskDueDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  noTasks: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE',
  },
}); 