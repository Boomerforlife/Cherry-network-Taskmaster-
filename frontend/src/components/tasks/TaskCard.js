import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { theme } from '../../theme';

const TaskCard = ({ task, onPress, onComplete, onSnooze, compact = false }) => {
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    category,
    progress,
    isOverdue,
    remainingTime,
  } = task;

  const getPriorityColor = () => {
    const colors = {
      low: theme.colors.priorityLow,
      medium: theme.colors.priorityMedium,
      high: theme.colors.priorityHigh,
      urgent: theme.colors.priorityUrgent,
    };
    return colors[priority] || theme.colors.gray;
  };

  const getStatusColor = () => {
    const colors = {
      pending: theme.colors.statusPending,
      in_progress: theme.colors.statusInProgress,
      completed: theme.colors.statusCompleted,
      cancelled: theme.colors.statusCancelled,
      overdue: theme.colors.statusOverdue,
    };
    return colors[status] || theme.colors.gray;
  };

  const getCategoryIcon = () => {
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

  const getCategoryColor = () => {
    const colors = {
      work: theme.colors.categoryWork,
      personal: theme.colors.categoryPersonal,
      study: theme.colors.categoryStudy,
      health: theme.colors.categoryHealth,
      finance: theme.colors.categoryFinance,
      other: theme.colors.categoryOther,
    };
    return colors[category] || theme.colors.gray;
  };

  const formatDueDate = () => {
    if (!dueDate) return 'No due date';
    
    const now = moment();
    const due = moment(dueDate);
    const diffDays = due.diff(now, 'days');
    const diffHours = due.diff(now, 'hours');
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      if (diffHours < 0) {
        return 'Overdue today';
      } else if (diffHours < 1) {
        return 'Due within an hour';
      } else {
        return `Due in ${diffHours} hours`;
      }
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    } else {
      return due.format('MMM DD, YYYY');
    }
  };

  const getPriorityLabel = () => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusLabel = () => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      overdue: 'Overdue',
    };
    return labels[status] || status;
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task);
    }
  };

  const handleSnooze = () => {
    if (onSnooze) {
      onSnooze(task);
    }
  };

  const isCompleted = status === 'completed';
  const isOverdueTask = isOverdue || (dueDate && moment(dueDate).isBefore(moment()));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
        style={[
          styles.card,
          compact && styles.compactCard,
          isOverdueTask && styles.overdueCard,
          isCompleted && styles.completedCard,
        ]}
        elevation={compact ? 2 : 4}
      >
        <Card.Content style={styles.cardContent}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.title,
                  isCompleted && styles.completedTitle,
                  compact && styles.compactTitle,
                ]}
                numberOfLines={compact ? 1 : 2}
              >
                {title}
              </Text>
              {description && !compact && (
                <Text style={styles.description} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
            
            {/* Priority Badge */}
            <Chip
              mode="outlined"
              textStyle={[styles.priorityText, { color: getPriorityColor() }]}
              style={[styles.priorityChip, { borderColor: getPriorityColor() }]}
              compact
            >
              {getPriorityLabel()}
            </Chip>
          </View>

          {/* Category and Status */}
          <View style={styles.metaRow}>
            <View style={styles.categoryContainer}>
              <Icon
                name={getCategoryIcon()}
                size={16}
                color={getCategoryColor()}
                style={styles.categoryIcon}
              />
              <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
                {category?.charAt(0).toUpperCase() + category?.slice(1)}
              </Text>
            </View>
            
            <Chip
              mode="outlined"
              textStyle={[styles.statusText, { color: getStatusColor() }]}
              style={[styles.statusChip, { borderColor: getStatusColor() }]}
              compact
            >
              {getStatusLabel()}
            </Chip>
          </View>

          {/* Due Date and Progress */}
          <View style={styles.bottomRow}>
            <View style={styles.dueDateContainer}>
              <Icon
                name="clock-outline"
                size={16}
                color={isOverdueTask ? theme.colors.error : theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.dueDateText,
                  isOverdueTask && styles.overdueText,
                ]}
              >
                {formatDueDate()}
              </Text>
            </View>
            
            {!isCompleted && progress !== undefined && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{progress}%</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%`, backgroundColor: getPriorityColor() },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {!compact && !isCompleted && (
            <View style={styles.actionRow}>
              <IconButton
                icon="check-circle-outline"
                size={24}
                iconColor={theme.colors.success}
                onPress={handleComplete}
                style={styles.actionButton}
              />
              <IconButton
                icon="snooze"
                size={24}
                iconColor={theme.colors.warning}
                onPress={handleSnooze}
                style={styles.actionButton}
              />
              <IconButton
                icon="pencil"
                size={24}
                iconColor={theme.colors.primary}
                onPress={onPress}
                style={styles.actionButton}
              />
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  compactCard: {
    marginVertical: 4,
    marginHorizontal: 0,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: theme.colors.lightGray,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 0,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  priorityChip: {
    backgroundColor: 'transparent',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  overdueText: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
    paddingTop: 12,
  },
  actionButton: {
    margin: 0,
    marginLeft: 8,
  },
});

export default TaskCard; 