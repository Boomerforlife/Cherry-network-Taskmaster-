import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Title, Card, Paragraph, List, IconButton, Chip, ActivityIndicator, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { tasksAPI } from '../../services/api';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [addVisible, setAddVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState(''); // ISO string optional
  const [creating, setCreating] = useState(false);

  const normalizeTasks = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return [];
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(normalizeTasks(response?.data));
    } catch (e) {
      console.log('Failed to load tasks:', e?.message || e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const handleComplete = async (task) => {
    try {
      await tasksAPI.update(task.id, { status: 'completed' });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'completed' } : t)));
    } catch (e) {
      Alert.alert('Error', 'Failed to mark task as completed');
    }
  };

  const handleDelete = async (task) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await tasksAPI.delete(task.id);
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
          } catch (e) {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
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

  const openAdd = () => {
    setNewTitle('');
    setNewPriority('medium');
    setNewDueDate('');
    setAddVisible(true);
  };

  const closeAdd = () => {
    if (!creating) setAddVisible(false);
  };

  const submitCreate = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Missing title', 'Please enter a task title');
      return;
    }
    setCreating(true);
    try {
      const payload = {
        title: newTitle.trim(),
        priority: newPriority,
        status: 'pending',
      };
      if (newDueDate.trim()) {
        payload.due_date = newDueDate.trim();
      }
      const created = await tasksAPI.create(payload);
      const createdTask = created?.data;
      if (createdTask) {
        setTasks((prev) => [createdTask, ...prev]);
      }
      setAddVisible(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to create task. Use ISO date like 2025-12-31T12:00:00Z for Due Date.');
    } finally {
      setCreating(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.item}>
      <Card.Content>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Title style={styles.title}>{item.title}</Title>
            {item.description ? (
              <Paragraph style={styles.description}>{item.description}</Paragraph>
            ) : null}
            <View style={styles.metaRow}>
              <Chip mode="outlined" style={[styles.chip, { borderColor: getPriorityColor(item.priority) }]} textStyle={{ color: getPriorityColor(item.priority) }}>
                {item.priority}
              </Chip>
              {item.category?.name ? (
                <Chip mode="outlined" style={styles.chip}>{item.category.name}</Chip>
              ) : null}
              {item.due_date ? (
                <Chip mode="outlined" style={styles.chip}>Due: {new Date(item.due_date).toLocaleDateString()}</Chip>
              ) : null}
              <Chip mode="outlined" style={styles.chip}>{item.status}</Chip>
            </View>
          </View>
          <View style={styles.actions}>
            {item.status !== 'completed' && (
              <IconButton icon="check-circle" onPress={() => handleComplete(item)} accessibilityLabel="Complete" />
            )}
            <IconButton icon="delete" onPress={() => handleDelete(item)} accessibilityLabel="Delete" />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title>My Tasks</Title>
            <Paragraph>No tasks yet. Pull to refresh or add one.</Paragraph>
          </Card.Content>
        </Card>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <Portal>
        <Modal visible={addVisible} onDismiss={closeAdd} contentContainerStyle={styles.modal}>
          <Title style={{ marginBottom: 12 }}>Create Task</Title>
          <TextInput
            label="Title"
            value={newTitle}
            onChangeText={setNewTitle}
            mode="outlined"
            style={{ marginBottom: 12 }}
          />
          <Paragraph style={{ marginBottom: 6 }}>Priority</Paragraph>
          <View style={styles.priorityRow}>
            {['low','medium','high','urgent'].map((p) => (
              <Chip
                key={p}
                mode={newPriority === p ? 'flat' : 'outlined'}
                selected={newPriority === p}
                onPress={() => setNewPriority(p)}
                style={[styles.priorityChip, newPriority === p && { backgroundColor: '#eee' }]}
              >
                {p}
              </Chip>
            ))}
          </View>
          <TextInput
            label="Due Date (ISO, optional)"
            value={newDueDate}
            onChangeText={setNewDueDate}
            placeholder="e.g. 2025-12-31T12:00:00Z"
            mode="outlined"
            style={{ marginTop: 12, marginBottom: 16 }}
          />
          <View style={styles.modalActions}>
            <Button onPress={closeAdd} disabled={creating}>
              Cancel
            </Button>
            <Button mode="contained" onPress={submitCreate} loading={creating}>
              Create
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB style={styles.fab} icon="plus" onPress={openAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
  },
  item: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    opacity: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  chip: {
    marginRight: 6,
    marginTop: 6,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200EE',
  },
  modal: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
}); 