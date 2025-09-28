import { styles } from './styles';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
export const getRepButtonStyle = (reps: number) => {
  if (reps === 5) return styles.repButtonSuccess;
  if (reps > 0) return styles.repButtonPartial;
  if (reps === 0) return styles.repButtonFailure;
  return styles.repButtonEmpty;
};

export const getRepButtonTextStyle = (reps: number) => {
  if (reps === 5) return styles.repButtonTextSuccess;
  if (reps > 0) return styles.repButtonTextPartial;
  if (reps === 0) return styles.repButtonTextFailure;
  return styles.repButtonTextEmpty;
};