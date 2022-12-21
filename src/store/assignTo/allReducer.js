import AssignReducers from './assignReducer';

import {combineReducers} from 'redux';

export default combineReducers({
  allAssignTo: AssignReducers,
});
