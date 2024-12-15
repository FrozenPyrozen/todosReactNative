import { AppState } from '@/types/taskLogicTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'localTasksState';

export const setStoreState = async (appState: AppState) => {
  try {
    const jsonValue = JSON.stringify(appState);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error(`[storeData] error on set state to local storage! e: ${e}`);
  }
};

export const getStoreState = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`[storeData] error on get state from local storage! e: ${e}`);
  }
};
