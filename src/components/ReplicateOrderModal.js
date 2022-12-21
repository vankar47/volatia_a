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
import * as yup from 'yup';
import moment from 'moment';

import {Formik, Field, ErrorMessage} from 'formik';
import {useSelector, useDispatch} from 'react-redux';

import Colors from '../constants/Colors';
import DatePicker from 'react-native-datepicker';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {getData} from '../store/storage';
import {postRequestForm} from '../services/request';
// import PickerSelect from '../components/PickerSelect';

function ModalTester({visible, closeModal}) {
  // const [isModalVisible, setModalVisible] = useState(true);

  const [primaryColor, setPrimaryColor] = useState('#00b7ff');
  const [accentColor, setSecondaryColor] = useState('#d3dbdb');

  // const [orientation, setOrientation] = useState('');

  useEffect(() => {
    (async () => {
      const color = await getData('AllColors');
      const output = JSON.parse(color);
      setPrimaryColor(output.primaryColor);
      setSecondaryColor(output.secondaryColor);
    })();
  }, []);

  const workOrderlist = useSelector(
    (state) => state.workOrder.getWorkOrders.list,
  );

  const {
    CostCenterID,
    Address2,
    Subject,
    FacilityID,
    ServiceID,
    LanguageToID,
    InterpreterPreference,
    MRN,

    Provider,
    ProviderEmail,
    AssignedTo,
    ClientComments,
  } = workOrderlist;

  return (
    <>
      <Modal
        backdropOpacity={0}
        isVisible={visible}
        style={{
          borderRadius: 20,
          width: 350,
          marginHorizontal: 32,
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
              height: 200,
            }}>
            <View
              style={{
                // margin: 15,
                flex: 0.6,
                backgroundColor: primaryColor,
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
                  marginHorizontal: 30,
                  fontFamily: 'Montserrat-Bold',
                }}>
                Replicate Work Order
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
            <View
              style={{
                width: '100%',
              }}>
              <View style={{padding: 5, marginHorizontal: 20, marginTop: 4}}>
                <Text
                  style={{
                    color: 'black',
                    marginHorizontal: 5,
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  Replicate Work Order Date
                </Text>

                <Formik
                  initialValues={{
                    Start: '',
                  }}
                  // validationSchema={ReviewSchema}
                  onSubmit={async (value) => {
                    console.log('this isi value', value);
                    const accessToken = await getData('AccessToken');

                    try {
                      const res = await postRequestForm(
                        '/api/WorkOrders/Create',
                        accessToken,
                        {
                          ...value,
                          CostCenterID,
                          Address2,
                          Subject,
                          FacilityID,
                          ServiceID,
                          LanguageToID,
                          InterpreterPreference,
                          MRN,
                          Provider,
                          ProviderEmail,

                          ClientComments,
                        },
                      );

                      console.log('response', res);
                      if (res.result.status === 200) {
                        Alert.alert(
                          'Thank you',
                          'Your Work Order Has Been Submitted!!',
                          [
                            {
                              text: 'Ok',
                              onPress: () => closeModal(),
                            },
                          ],
                          {cancelable: false},
                        );
                      } else {
                        alert('Please enter valid information');
                      }
                      resetForm();
                    } catch (err) {
                      alert(err.message);
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
                      <View style={{width: '100%'}}>
                        <DatePicker
                          style={{
                            width: '100%',
                            color: '#fff',
                          }}
                          getDateStr={(date) => {
                            const momentDate = moment(date).format(
                              'MM/DD/YYYY h:mm a',
                            );

                            // return date.toLocaleString('en-US', options);
                            return momentDate;
                          }}
                          customStyles={{
                            dateInput: {
                              borderRadius: 10,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              // borderColor: primaryColor,
                              alignItems: 'flex-start',
                              paddingLeft: 10,
                            },
                            dateText: {
                              color: 'black',
                            },
                            placeholderText: {
                              color: 'black',
                            },
                            datePicker: {
                              // backgroundColor: '#d1d3d8',
                              justifyContent: 'center',
                            },
                          }}
                          showIcon={false}
                          is24Hour={false}
                          placeholder="Select Date"
                          mode="datetime"
                          date={values.Start}
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          onDateChange={(itemValue) => {
                            const utcDate = moment(Date.parse(itemValue))
                              .format()
                              .slice(0, 16);

                            console.log('this is item value', utcDate);
                            setFieldValue('Start', utcDate);
                          }}
                        />

                        <View
                          style={{
                            width: '40%',
                            // paddingHorizontal: 15,
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: 90,
                            marginTop: 40,
                          }}>
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              height: 40,
                              backgroundColor: primaryColor,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 5,
                            }}
                            onPress={handleSubmit}>
                            <Text style={styles.fieldTextStyle}>Save</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    // marginTop: 4,
  },
  searchpicker: {},
  errorText: {
    color: 'red',
  },

  errorConatiner: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  filtersContainer: {
    flex: 1,
    padding: 5,
  },
  tabletHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  menuBtnContainer: {
    zIndex: 2,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuBtn: {
    width: 25,
    height: 25,
  },
  logoWrapper: {},
  logoStyle: {
    width: 230,
    height: 60,
  },
  listContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  listItemStyle: {
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 50,
    marginHorizontal: 5,
  },

  listItemText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  fieldTextStyle: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    fontWeight: 'bold',
  },

  mainsomeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Medium',
  },

  pickerText: {
    width: '100%',
    marginHorizontal: 15,
    padding: 5,
  },
  pickerContainer: {
    width: '85%',
  },

  newPickerStyles: {
    backgroundColor: Colors.primaryColor,
  },

  someTextWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  someText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  selectStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000000',
    shadowRadius: 5,
    shadowOffset: {height: 10},
    shadowOpacity: 0.3,
  },
  selectLabelTextStyle: {
    color: 'white',
    width: '100%',
  },

  submitButtonContainer: {},
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 190,
    height: 50,
    borderRadius: 50,
    alignSelf: 'center',

    backgroundColor: '#DBDADA',
  },

  textinputContainer: {
    width: '85%',
    height: 40,
    borderRadius: 50,
    borderColor: 'grey',
    borderWidth: 1,
  },

  textAreaContainer: {
    borderWidth: 1,
    padding: 5,

    borderColor: 'grey',
    width: '100%',
    borderRadius: 17,
    // marginHorizontal: 30,
  },
  textArea: {
    height: 250,

    justifyContent: 'center',
  },
  textinput: {
    paddingTop: 10,
    paddingHorizontal: 10,
    padding: 5,
  },
  workHeading: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  // workText: {
  //   fontSize: 20,
  //   fontFamily: 'Montserrat-Medium',
  //   color: Colors.primaryColor,
  // },
  workSiteAddress: {
    // marginHorizontal: 2,
  },
});

export default ModalTester;
