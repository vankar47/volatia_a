import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import WorkOrderMain from './workOrder/allReducer';
import InterpratorMain from './interperator/allReducer';
import ServicesMain from './serviceType/allReducer';
import LanguageMain from './languages/allReducer';
import AssignMain from './assignTo/allReducer';

import {combineReducers} from 'redux';

const combinedReducers = combineReducers({
  workOrder: WorkOrderMain,
  inteperatorPreferance: InterpratorMain,
  ServicesType: ServicesMain,
  LanguageTo: LanguageMain,
  AssignTo: AssignMain,
});

const store = configureStore({
  reducer: combinedReducers,
});
export default store;
