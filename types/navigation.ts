import { SCREEN_NAMES } from '@/constants/screenNames';

export type RootStackParamList = {
  [SCREEN_NAMES.TASK_LIST]: undefined;
  [SCREEN_NAMES.TASK_DETAILS]: { taskId: number };
};
