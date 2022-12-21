import {getRequest, postWithParams} from '../../services/request';
import {getData, removeData, storeData} from '../../store/storage';

import {
  loadingInterprator,
  setInterperator,
  InterperatorError,
} from '../interperator/interperatorReducer';

export const getInterpratorFacility = () => {
  return async (dispatch, getState) => {
    const accessToken = await getData('AccessToken');

    try {
      dispatch(loadingInterprator(true));
      const res = await getRequest(
        '/api/Options/GetInterpreterPreferences',
        accessToken,
      );
      const response = res.result.data;

      const allData = response.map((item) => {
        return {
          name: item,
          id: item,
        };
      });

      // const modifiedData = [...allData];
      // modifiedData[0].label = 'Network';

      // console.log('modified daata', allData);

      dispatch(setInterperator(allData));

      dispatch(loadingInterprator(false));
      // () => console.log('Hogai state update', this.state.year),
    } catch (err) {
      dispatch(InterperatorError(err.message));
      alert(err.message);
    }
  };
};
