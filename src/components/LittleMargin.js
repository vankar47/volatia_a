import React from 'react';
import {View} from 'react-native';
const LittleMargin = ({marginTop}) => {
  return <View style={{marginTop: marginTop ? marginTop : 10}} />;
};

export default LittleMargin;
