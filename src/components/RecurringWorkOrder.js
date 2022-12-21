import React, {useState, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Colors from '../constants/Colors';
import * as yup from 'yup';

import {Formik, Field, ErrorMessage} from 'formik';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {getData} from '../store/storage';

import RNPickerSelect from 'react-native-picker-select';
import DaySlot from './DaySlot';
import {useSelector, useDispatch} from 'react-redux';
import {
  getRecurringFrequency,
  getRecurringFrequencyTypes,
} from '../store/api/workOrderPicker';
import {
  postRequestForm,
  postRequest,
  postWithParams,
} from '../services/request';

function ModalTester({
  isVisible,
  workOrder,
  serviceType,
  languages,
  selectedDate,
  interperator,
  assignToText,
  closeModal,
  costCenterId,
  department,
  recipientName,
  recipientID,
  provider,
  providerEmail,
  comments,
  facilityId,
  closeModalWithNavigation,
}) {
  // const [isModalVisible, setModalVisible] = useState(true);

  const [selectedDays, setSelectedDays] = useState([]);

  // function setDaySelector(days) {
  //   console.log('Called every time on press');
  //   setSelectedDays(days);
  // }
  const [weekPicker, setWeekPicker] = useState([{label: '', value: ''}]);
  const [dayPicker, setDayPicker] = useState([{label: '1', value: '1'}]);
  const [frequency, setFreuency] = useState('');
  const [frequencyType, setFreuencyType] = useState('');
  const [dateStart, setDateStart] = useState(selectedDate.slice(0, 10));
  const [dateEnd, setDateEnd] = useState('');
  const [weekDays, setWeekDays] = useState('');

  const frequencies = useSelector((state) => state.workOrder.frequencies.list);
  const frequenciesTypes = useSelector(
    (state) => state.workOrder.frequencyTypes.list,
  );

  const workOrderData = useSelector(
    (state) => state.workOrder.getWorkOrders.list,
  );

  const workOrderToSend = {};

  workOrderToSend.Id = 0;
  // workOrderToSend.ClientID = 0;

  workOrderToSend.AssignedTo = assignToText;
  workOrderToSend.ClientComments = comments;
  workOrderToSend.Address2 = department;
  workOrderToSend.CostCenterID = costCenterId;
  workOrderToSend.FacilityID = facilityId;
  workOrderToSend.InterpreterPreference = interperator;
  workOrderToSend.MRN = recipientID;
  workOrderToSend.Provider = provider;
  workOrderToSend.ProviderEmail = providerEmail;
  workOrderToSend.ServiceID = serviceType;
  workOrderToSend.Start = selectedDate;
  workOrderToSend.Subject = recipientName;
  workOrderToSend.LanguageToID = languages;

  const getFrequencies = frequencies.map((data) => {
    return {label: data, value: data};
  });

  const getFrequenciesTypes = frequenciesTypes.map((data) => {
    return {label: data, value: data};
  });

  const splicedFrequecy = getFrequencies.shift();
  const splicedFrequecyTypes = getFrequenciesTypes.shift();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(getRecurringFrequency());
      dispatch(getRecurringFrequencyTypes());
      setFreuency(1);
      setFreuencyType('week');
    })();
  }, []);

  //Should Call API in this use effect

  const ReviewSchema = yup.object({
    RecurringStartDate: yup.string().required(),
    RecurringEndDate: yup.string().required(),
    // RecurringWeekdays: yup.string().required(),
  });

  useEffect(() => {
    setDateStart(selectedDate.slice(0, 10));
  }, [selectedDate]);

  return (
    <>
      <Modal
        backdropOpacity={0}
        isVisible={isVisible}
        style={{
          borderRadius: 20,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              // height: '0%',
              width: '100%',
              //   backgroundColor: 'green',
              borderRadius: 8,
              borderWidth: 0.4,
              backgroundColor: 'white',
              height: 500,
            }}>
            <View
              style={{
                // margin: 15,
                flex: 0.4,
                backgroundColor: Colors.primaryColor,
                // padding: 15,
                borderRadius: 4,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',

                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  marginHorizontal: 20,
                  fontFamily: 'Montserrat-Bold',
                }}>
                Repeat Work Order
              </Text>
              <TouchableOpacity
                style={{marginTop: -2, marginHorizontal: 20}}
                onPress={closeModal}>
                <Ionicons
                  name="close"
                  size={20}
                  style={{
                    marginTop: -2,
                  }}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                RecurringStartDate: selectedDate.slice(0, 10),
                RecurringEndDate: '',
                RecurringFrequency: '1',
                RecurringFrequencyType: 'week',
                RecurringWeekdays: [],
              }}
              validationSchema={ReviewSchema}
              enableReinitialize={true}
              onSubmit={async (value) => {
                const accessToken = await getData('AccessToken');

                try {
                  const res = await postRequestForm(
                    '/api/WorkOrders/CreateRecurring',
                    accessToken,
                    {
                      WorkOrder: {
                        ...workOrderToSend,
                      },
                      ...value,
                      RecurringRequestedBy: '',
                      RecurringRequestedEmail: '',
                      RecurringRequestedPhone: '',
                    },
                  );

                  console.log('response', res);
                  if (res.result.status === 200) {
                    Alert.alert(
                      'Thank you',
                      'Your Recurring Work Orders Have Been Created!',
                      [
                        {
                          text: 'Ok',
                          onPress: () => {
                            closeModalWithNavigation();
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  } else {
                    alert('Please enter valid information');
                  }
                } catch (err) {
                  alert('Please enter values again');
                }
              }}
              validateOnBlur={true}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
                isSubmitting,
                dirty,
                isValid,
                errors,
                touched,
              }) => (
                <>
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <View
                      style={{
                        padding: 5,
                        marginHorizontal: 20,
                        marginTop: 4,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          marginHorizontal: 5,
                          fontFamily: 'Montserrat-Bold',
                        }}>
                        Start
                      </Text>

                      <View style={styles.pickerContainer}>
                        <DatePicker
                          style={{
                            width: '100%',
                            color: '#fff',
                          }}
                          // getDateStr={(date) => {
                          //   const momentDate = moment(date).format(
                          //     'MM/DD/YYYY h:mm a',
                          //   );

                          //   // return date.toLocaleString('en-US', options);
                          //   return momentDate;
                          // }}
                          customStyles={{
                            dateInput: {
                              borderRadius: 10,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              // borderColor: Colors.primaryColor,
                              alignItems: 'flex-start',
                              paddingLeft: 10,
                            },
                            dateText: {
                              color: 'black',
                            },
                            placeholderText: {
                              color: 'black',
                              fontFamily: 'Montserrat-Regular',
                            },
                            datePicker: {
                              // backgroundColor: '#d1d3d8',
                              justifyContent: 'center',
                            },
                          }}
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          showIcon={false}
                          is24Hour={false}
                          placeholder="Select Date"
                          mode="date"
                          date={values.RecurringStartDate}
                          onDateChange={(itemValue) => {
                            setDateStart(itemValue);
                            setFieldValue('RecurringStartDate', itemValue);
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        left: 320,
                        top: 30,
                        position: 'absolute',
                      }}>
                      <Ionicons
                        name="calendar"
                        size={20}
                        color={Colors.accentColor}
                        style={{
                          marginTop: 2,
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      width: '100%',
                    }}>
                    <View
                      style={{padding: 5, marginHorizontal: 20, marginTop: 4}}>
                      <Text
                        style={{
                          color: 'black',
                          marginHorizontal: 5,
                          fontFamily: 'Montserrat-Bold',
                        }}>
                        End
                      </Text>

                      <View style={styles.pickerContainer}>
                        <DatePicker
                          style={{
                            width: '100%',
                            color: '#fff',
                          }}
                          customStyles={{
                            dateInput: {
                              borderRadius: 10,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              // borderColor: Colors.primaryColor,
                              alignItems: 'flex-start',
                              paddingLeft: 12,
                              left: 3,
                            },
                            dateText: {
                              color: 'black',
                            },
                            placeholderText: {
                              color: 'black',
                              fontFamily: 'Montserrat-Regular',
                            },
                            datePicker: {
                              // backgroundColor: '#d1d3d8',
                              justifyContent: 'center',
                            },
                          }}
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          showIcon={false}
                          is24Hour={false}
                          placeholder="Select Date"
                          date={values.RecurringEndDate}
                          onDateChange={(itemValue) => {
                            setDateEnd(itemValue);
                            setFieldValue('RecurringEndDate', itemValue);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          left: 300,
                          top: 30,
                          position: 'absolute',
                        }}>
                        <Ionicons
                          name="calendar"
                          size={20}
                          color={Colors.accentColor}
                          style={{
                            marginTop: 2,
                          }}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{marginTop: 6}}>
                    <Text
                      style={{
                        color: 'black',
                        marginHorizontal: 30,
                        fontFamily: 'Montserrat-Bold',
                      }}>
                      Repeat Every
                    </Text>
                    <View
                      style={{
                        // flex: 1,
                        // justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: 5,
                      }}>
                      <View
                        style={{
                          width: '30%',

                          height: 40,
                          marginHorizontal: 20,
                          justifyContent: 'center',
                          borderRadius: 10,
                          borderWidth: 0.7,
                          borderColor: 'grey',
                        }}>
                        <RNPickerSelect
                          style={{
                            inputAndroid: {
                              color: 'black',
                              fontFamily: 'Montserrat-Regular',
                              left: 20,
                              minHeight: 40,
                            },
                            placeholder: {
                              color: 'black',
                            },
                            inputIOS: {
                              color: 'black',
                              fontFamily: 'Montserrat-Regular',
                              left: 20,
                              minHeight: 40,
                            },
                            iconContainer: {
                              right: 5,
                            },
                          }}
                          onValueChange={(value) => {
                            setFreuency(value);
                            setDayPicker(value);
                            setFieldValue('RecurringFrequency', value);
                          }}
                          placeholder={{label: '1', value: '1'}}
                          value={dayPicker}
                          useNativeAndroidPickerStyle={false}
                          items={getFrequencies}
                          Icon={() => {
                            return (
                              <View style={{top: 12}}>
                                <Ionicons
                                  name="caret-down"
                                  size={14}
                                  color={Colors.accentColor}
                                />
                              </View>
                            );
                          }}
                        />
                      </View>

                      <View
                        style={{
                          width: '54%',

                          height: 40,
                          // marginHorizontal: 20,
                          justifyContent: 'center',
                          borderRadius: 10,
                          borderWidth: 0.7,
                          borderColor: 'grey',
                        }}>
                        <RNPickerSelect
                          style={{
                            inputAndroid: {
                              color: 'black',
                              fontFamily: 'Montserrat-Regular',
                              left: 20,
                              minHeight: 40,
                            },
                            placeholder: {
                              color: 'black',
                            },
                            inputIOS: {
                              color: 'black',
                              fontFamily: 'Montserrat-Regular',
                              left: 20,
                              minHeight: 40,
                            },
                            iconContainer: {
                              right: 5,
                            },
                          }}
                          placeholder={{label: 'week', value: 'week'}}
                          onValueChange={(value) => {
                            setFreuencyType(value);
                            setWeekPicker(value);
                            setFieldValue('RecurringFrequencyType', value);
                          }}
                          value={weekPicker}
                          items={getFrequenciesTypes}
                          Icon={() => {
                            return (
                              <View style={{top: 13}}>
                                <Ionicons
                                  name="caret-down"
                                  size={14}
                                  color={Colors.accentColor}
                                />
                              </View>
                            );
                          }}
                        />
                      </View>
                    </View>

                    <View style={{marginTop: 12}}>
                      <DaySlot
                        onSelect={(days) => {
                          const showtimesAsString = days.join(', ');

                          setSelectedDays(showtimesAsString);
                          setFieldValue('RecurringWeekdays', days);
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        // width: 50,

                        // marginHorizontal: 4,
                        marginHorizontal: 28,
                        marginTop: 10,
                        height: 60,
                      }}>
                      <Text style={{fontFamily: 'Montserrat-Regular'}}>
                        Occurs Every{' '}
                      </Text>
                      <Text
                        style={{
                          color: Colors.primaryColor,
                          fontWeight: 'bold',
                          fontSize: 12,
                          marginTop: 1,
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {frequency && frequency + '\u00a0'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {frequencyType && frequencyType + '(s)' + '\u00a0'}on{' '}
                      </Text>
                      <Text
                        style={{
                          color: Colors.primaryColor,
                          fontWeight: 'bold',
                          fontSize: 12,
                          fontFamily: 'Montserrat-Regular',
                          marginTop: 2,
                        }}>
                        {selectedDays && selectedDays + '\u00a0'}
                      </Text>
                      <Text style={{fontFamily: 'Montserrat-Regular'}}>
                        from{' '}
                      </Text>
                      <Text
                        style={{
                          color: Colors.primaryColor,
                          fontWeight: 'bold',
                          fontSize: 13,
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {dateStart && dateStart}{' '}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        untill{' '}
                      </Text>
                      <Text
                        style={{
                          color: Colors.primaryColor,
                          fontWeight: 'bold',
                          fontSize: 13,
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {dateEnd && dateEnd}{' '}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '50%',
                        // paddingHorizontal: 15,
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 88,
                        // marginBottom: 30,
                      }}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          height: 40,
                          backgroundColor: Colors.primaryColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                          marginTop: 65,
                        }}
                        style={
                          !isValid
                            ? {
                                flex: 1,
                                height: 40,
                                backgroundColor: '#DBDADA',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginTop: 65,
                              }
                            : {
                                flex: 1,
                                height: 40,
                                backgroundColor: Colors.primaryColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginTop: 65,
                              }
                        }
                        disabled={!isValid}
                        onPress={handleSubmit}>
                        <Text style={styles.fieldTextStyle}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </>
  );
}

function onDaysSelect(days) {
  console.log('\nThese are the selected days', days);
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    // marginTop: 4,
  },
  errorText: {
    color: 'black',
  },
  errorConatiner: {
    // flex: 1,
    // backgroundColor: 'black',
  },
  buttonContainer: {},
  searchpicker: {},
  fieldTextStyle: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ModalTester;
