import { styles } from './styles';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
export const getRepButtonStyle = (reps: number) => {
  if (reps > -1) return styles.repButtonComplete;
  return styles.repButtonEmpty;
};

export const getRepButtonTextStyle = (reps: number) => {
  if (reps > -1) return styles.repButtonTextComplete;
  return styles.repButtonTextEmpty;
};