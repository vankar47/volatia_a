import {getRequest, postWithParams} from '../../services/request';
import {getData, removeData, storeData} from '../../store/storage';

import {
  loadingAssignData,
  setAssignData,
  AssignDataError,
} from '../assignTo/assignReducer';

export const getAssignTo = (value) => {
  return async (dispatch, getState) => {
    const accessToken = await getData('AccessToken');

    try {
      dispatch(loadingAssignData(true));
      // console.log('this is assign value', value);
      const res = await getRequest(
        '/api/Interpreters/GetClientInterpreters',
        accessToken,
        {languageId: value},
      );

      // console.log(res);
      const response = res.result.data;
      // console.log(
      //   'this is response params',
      //   res.result.config.params.languageId,
      // );

      // console.log('this is assign response', response);

      if (res.result.config.params.languageId === undefined) {
        const firstAssign = [
          {
            name: 'Network',
            id: null,
          },
        ];

        // console.log('this is new firs asign data', firstAssign);

        dispatch(setAssignData(firstAssign));

        dispatch(loadingAssignData(false));
      } else {
        const allData = response.map((item) => {
          return {
            name: item.FullName,
            id: item.UserID,
          };
        });

        const firstAssign = {
          name: 'Network',
          id: null,
        };

        const modifiedData = allData.unshift(firstAssign);

        console.log('this is new modified data', allData);

        dispatch(setAssignData(allData));

        dispatch(loadingAssignData(false));
      }
    } catch (err) {
      dispatch(AssignDataError(err.message));
      console.log(err);
    }
  };
};
