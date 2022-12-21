import {getRequest, postWithParams} from '../../services/request';
import {getData, removeData, storeData} from '../../store/storage';

import {
  loadingWorkOrder,
  setWorkOrder,
  workOrderError,
} from '../workOrder/workOrderReducer';
import {
  loadingGetWorkOrder,
  setGetWorkOrder,
  getworkOrderError,
} from '../workOrder/getWorkOrder';

import {
  loadReccuringFrequecy,
  setRecurringFrequecy,
  frequecyError,
} from '../workOrder/getRecurringFrequency';
import {
  loadReccuringFrequecyTypes,
  setRecurringFrequecyTypes,
  frequecyTypesError,
} from '../workOrder/getRecurringFrequencyTypes';

import {
  loadClientComment,
  setClientComment,
  clientCommentError,
} from '../workOrder/getClientComments';

export const getWorkSiteFacility = () => {
  return async (dispatch, getState) => {
    const accessToken = await getData('AccessToken');

    try {
      dispatch(loadingWorkOrder(true));
      const res = await getRequest('/api/Facilities', accessToken);
      const response = res.result.data;

      // console.log('this is response', response);

      const allData = response.map((item) => {
        return {
          name: item.FacilityName,
          id: item.Id,
        };
      });

      // console.log('this is all data ', allData);

      dispatch(setWorkOrder(allData));

      // () => console.log('Hogai state update', this.state.year),
    } catch (err) {
      dispatch(workOrderError(err.message));
      alert(err.message);
    }
  };
};

export const getWorkOrders = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch(loadingGetWorkOrder(true));
      const accessToken = await getData('AccessToken');
      const res = await getRequest(
        `/api/WorkOrders/Get?id=${id} `,
        accessToken,
      );
      const response = res.result.data;

      dispatch(setGetWorkOrder(response));
      dispatch(loadingGetWorkOrder(false));
    } catch (err) {
      dispatch(getworkOrderError(err.message));
      alert(err.message);
    }
  };
};

export const getRecurringFrequency = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(loadReccuringFrequecy(true));
      const accessToken = await getData('AccessToken');
      const res = await getRequest(
        'api/Options/GetRecurringFrequencies',
        accessToken,
      );
      const response = res.result.data;

      dispatch(setRecurringFrequecy(response));

      dispatch(loadReccuringFrequecy(false));
    } catch (err) {
      dispatch(frequecyError(err.message));
      alert(err.message);
    }
  };
};

export const getRecurringFrequencyTypes = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(loadReccuringFrequecyTypes(true));
      const accessToken = await getData('AccessToken');
      const res = await getRequest(
        '/api/Options/GetRecurringFrequencyTypes',
        accessToken,
      );
      const response = res.result.data;

      dispatch(setRecurringFrequecyTypes(response));

      dispatch(loadReccuringFrequecyTypes(false));
    } catch (err) {
      dispatch(frequecyTypesError(err.message));
      alert(err.message);
    }
  };
};

export const getClientComments = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch(loadClientComment(true));
      const accessToken = await getData('AccessToken');
      const res = await getRequest(
        `/api/WorkOrderComments/GetClientComments?workOrderId=${id} `,
        accessToken,
      );
      const response = res.result.data;
      console.log('this is response of client comments', response);

      dispatch(setClientComment(response));
      dispatch(loadClientComment(false));
    } catch (err) {
      dispatch(clientCommentError(err.message));
      alert(err.message);
    }
  };
};

export const submitComment = (id) => {
  return async (dispatch, getState) => {
    try {
      const accessToken = await postWithParams('AccessToken');
      const res = await getRequest(
        `/api/WorkOrderComments/GetClientComments?workOrderId=${id} `,
        accessToken,
      );
      const response = res.result.data;
      // console.log('this is response of client comments', response);

      dispatch(setClientComment(response));
      dispatch(loadClientComment(false));
    } catch (err) {
      dispatch(clientCommentError(err.message));
      alert(err.message);
    }
  };
};
