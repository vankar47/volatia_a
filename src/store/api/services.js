import {getRequest, postWithParams} from '../../services/request';
import {getData, removeData, storeData} from '../../store/storage';

import {
  loadingServices,
  setServices,
  ServicesError,
} from '../serviceType/serviceReducer';
import {
  loadingLoginData,
  saveLoginData,
  errorLoginData,
} from '../serviceType/loginReducer';

export const getServicesType = () => {
  return async (dispatch, getState) => {
    const accessToken = await getData('AccessToken');

    try {
      dispatch(loadingServices(true));
      const res = await getRequest('/api/Services', accessToken);
      const response = res.result.data;

      // console.log('this is service response', response);
      const allData = response.map((item) => {
        return {
          name: item.Service,
          id: item.Id,
        };
      });

      // console.log('this is service data', allData);

      dispatch(setServices(allData));

      dispatch(loadingServices(false));
      // () => console.log('Hogai state update', this.state.year),
    } catch (err) {
      dispatch(ServicesError(err.message));
      alert(err.message);
    }
  };
};

export const _getColorsScheme = () => {
  return async (dispatch, getState) => {
    try {
      const color = await getData('ColorResponse');
      const output = JSON.parse(color);
      const result = {
        firstColour: output.primaryColor,
        SecondColor: output.secondaryColor,
      };

      // console.log('firstcolor', firstColour);
      // console.log('function is called');
      dispatch(saveLoginData(result));
      dispatch(loadingLoginData(true));
    } catch (err) {
      dispatch(errorLoginData(err.message));
    }
  };
};
