import {getRequest, postWithParams} from '../../services/request';
import {getData, removeData, storeData} from '../../store/storage';

import {
  loadingLanguages,
  setLanguages,
  languagesError,
} from '../languages/languagesReducer';

export const getLanguageTo = () => {
  return async (dispatch) => {
    const accessToken = await getData('AccessToken');

    try {
      dispatch(loadingLanguages(true));
      const res = await getRequest('/api/Languages', accessToken);
      const response = res.result.data;

      const allData = response.map((item) => {
        return {
          name: item.LanguageName,
          id: item.Id,
        };
      });

      // console.log('this is language', allData);

      // console.log('this is language response', allData);
      dispatch(setLanguages(allData));

      dispatch(loadingLanguages(false));
      // () => console.log('Hogai state update', this.state.year),
    } catch (err) {
      dispatch(languagesError(err.message));
      alert(err.message);
    }
  };
};
