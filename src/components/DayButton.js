import React, {useState, useEffect, useRef} from 'react';
import {Text, View, TouchableWithoutFeedback} from 'react-native';
import {getData} from '../store/storage';

import Colors from '../constants/Colors';

function SlotButton({day, onDaySelect, onDayUnselect}) {
  const [selected, setSelected] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#00b7ff');
  const [accentColor, setSecondaryColor] = useState('#d3dbdb');

  useEffect(() => {
    (async () => {
      const color = await getData('AllColors');
      const output = JSON.parse(color);
      setPrimaryColor(output.primaryColor);
      setSecondaryColor(output.secondaryColor);
    })();
  }, []);

  useEffect(() => {
    console.log('Selected Day Changed:', selected);
    selected ? onDaySelect(day.word) : onDayUnselect(day.word);
  }, [selected]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('Selected Day:', selected);
        selected ? setSelected(false) : setSelected(true);
      }}>
      <View
        style={{
          height: 40,
          width: 40,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: selected ? accentColor : 'white',
          borderRadius: 10,
          borderWidth: 0.5,
          borderColor: selected ? accentColor : 'black',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: selected ? 'white' : 'black',
          }}>
          {day.letter}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SlotButton;
