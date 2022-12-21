import AsyncStorage from '@react-native-community/async-storage';

export const storeData = async (storeKey, storeData) => {
  try {
    await AsyncStorage.setItem(storeKey, storeData);
  } catch (e) {
    // saving error
  }
};
export const getData = async (storedKey) => {
  try {
    const value = await AsyncStorage.getItem(storedKey);
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
  }
};
export const removeData = async (storedKey) => {
  try {
    await AsyncStorage.removeItem(storedKey);
  } catch (e) {}
};

export const store = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
};

const isExpired = (item) => {
  const now = moment(Date.now());
  const storedTime = moment(item.timestamp);
  return now.diff(storedTime, 'minutes') > expiryinMinutes;
};

export const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    const item = JSON.parse(value);

    if (!item) return null;

    if (isExpired(item)) {
      // Command Query Separation (CQS)
      await AsyncStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.log(error);
  }
};
