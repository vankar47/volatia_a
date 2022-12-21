import {NativeModules,requireNativeComponent, NativeEventEmitter} from 'react-native';

const {BoostlingoSdk} = NativeModules;
export default BoostlingoSdk;
export const BLVideoView = requireNativeComponent('BLVideoView');
export const BLEventEmitter = new NativeEventEmitter(BoostlingoSdk);