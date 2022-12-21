import WorkOrderReducer from './workOrderReducer';
import GetWorkOrderReducer from './getWorkOrder';
import GetRecurringFrequency from './getRecurringFrequency';
import GetRecurringFrequencyTypes from './getRecurringFrequencyTypes';
import GetClientComments from './getClientComments';

import {combineReducers} from 'redux';

export default combineReducers({
  workOrderPicker: WorkOrderReducer,
  getWorkOrders: GetWorkOrderReducer,
  frequencies: GetRecurringFrequency,
  frequencyTypes: GetRecurringFrequencyTypes,
  clientComments: GetClientComments,
});
