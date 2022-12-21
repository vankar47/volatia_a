import ServicesReducer from './serviceReducer';
import loginReducer from './loginReducer';

import {combineReducers} from 'redux';

export default combineReducers({
  allServicesReducer: ServicesReducer,
  allLoginReducer: loginReducer,
});
