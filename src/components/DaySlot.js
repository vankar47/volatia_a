import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import DayButton from './DayButton';

const days = [
  {letter: 'M', word: 'Monday'},
  {letter: 'T', word: 'Tuesday'},
  {letter: 'W', word: 'Wednesday'},
  {letter: 'T', word: 'Thursday'},
  {letter: 'F', word: 'Friday'},
  {letter: 'S', word: 'Saturday'},
  {letter: 'S', word: 'Sunday'},
];

function BookingSlot({onSelect}) {
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    onSelect(selectedDays);
  }, [selectedDays]);

  function onDaySelect(selectedDay) {
    let tmp = [...selectedDays];
    tmp.push(selectedDay);
    setSelectedDays(tmp);
  }
  function onDayUnselect(selectedDay) {
    let tmp = [...selectedDays];
    let index = tmp.findIndex((day) => day == selectedDay);
    tmp.splice(index, 1);
    setSelectedDays(tmp);
  }

  return (
    <View style={styles.timeSlot}>
      {days.map((day, index) => {
        return (
          <View key={index} style={styles.container}>
            <DayButton
              day={day}
              onDaySelect={onDaySelect}
              onDayUnselect={onDayUnselect}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  timeSlot: {
    flexDirection: 'row',
    // flexWrap:s "wrap",
    justifyContent: 'center',
    // width: 320
  },
});

export default BookingSlot;
