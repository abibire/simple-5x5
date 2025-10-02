import { StyleSheet } from 'react-native';

export const plateStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  totalWeight: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2563eb',
  },
  platesLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  plateDisplay: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barbell: {
    width: 80,
    height: 20,
    backgroundColor: '#9ca3af',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barbellText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  platesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plate: {
    width: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  plateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  barOnlyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});