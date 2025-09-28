import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#dbeafe',
  },
  timerContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  presetButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  presetButtonText: {
    fontSize: 12,
  },
  workoutContainer: {
    backgroundColor: 'white',
  },
  exerciseContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  exerciseWeight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  setsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  setContainer: {
    alignItems: 'center',
  },
  setLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  repButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repButtonEmpty: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  repButtonComplete: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  repButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  repButtonTextEmpty: {
    color: '#9ca3af',
  },
  repButtonTextComplete: {
    color: 'white',
  },
  completeButtonContainer: {
    padding: 16,
  },
  completeButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    backgroundColor: 'white',
  },
  historyHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  historyList: {
    backgroundColor: 'white',
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyWorkoutType: {
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyExercises: {
    gap: 4,
  },
  historyExercise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyExerciseName: {
    fontSize: 12,
  },
  historyExerciseData: {
    fontSize: 12,
  },
  weightsContainer: {
    backgroundColor: 'white',
  },
  weightsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  weightsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  weightsList: {
    padding: 16,
    gap: 8,
  },
  weightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weightName: {
    fontSize: 14,
  },
  weightValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});