import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import RepeatWorkOrderModal from '../components/RepeatWorkOrderModal';
import AddCommentModal from '../components/AddCommentModal';
import ReplicateModal from '../components/ReplicateOrderModal';
import {getData} from '../store/storage';
import {useIsFocused} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

import Images from '../constants/Images';
import Colors from '../constants/Colors';

export default function MyTabBar({state, descriptors, navigation}) {
  const [commentsVisible, setCommentVisible] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [repeatVisible, setRepeatVisible] = useState(false);

  const closeModal = () => {
    setVisible(false);
  };

  const closeCommentModal = () => {
    setCommentVisible(false);
  };

  const closeReplicateModal = () => {
    setRepeatVisible(false);
  };

  useEffect(() => {}, []);

  return (
    <>
      <RepeatWorkOrderModal visible={isVisible} closeModal={closeModal} />
      <AddCommentModal
        visible={repeatVisible}
        closeModal={closeReplicateModal}
      />
      <ReplicateModal
        visible={commentsVisible}
        closeModal={closeCommentModal}
      />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.primaryColor,
          height: 70,
          // marginBottom: 2,
          // borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            setVisible(true);
          }}
          style={{flex: 1, alignItems: 'center', marginBottom: 10, left: 10}}>
          <Image
            style={{height: 20, width: 20}}
            resizeMode="contain"
            source={Images.RecurringWhite}
          />

          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-Regular',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            Set as Recurring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            setCommentVisible(true);
          }}
          style={{flex: 1, alignItems: 'center', marginBottom: 10, left: 10}}>
          <Image
            style={{height: 20, width: 20}}
            resizeMode="contain"
            source={Images.ReplicateIconWhite}
          />

          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-Regular',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            Replicate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            setRepeatVisible(true);
          }}
          style={{flex: 1, alignItems: 'center', marginBottom: 10, left: 10}}>
          <Image
            style={{height: 20, width: 20}}
            resizeMode="contain"
            source={Images.CommentsIconWhite}
          />

          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-Regular',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            Comments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            navigation.navigate('WorkOrderEdit');
          }}
          style={{flex: 1, alignItems: 'center', marginBottom: 10, left: 7}}>
          <MaterialCommunityIcons
            name="edit"
            size={22}
            style={{bottom: 2}}
            color="white"
          />

          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-Regular',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            Edit
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 20,
                        width: 70,
                        height: 40,
                        borderRadius: 5,

                        backgroundColor: this.state.Colors.primaryColor,
                      }}
                      onPress={() => {
                        this.props.navigation.navigate('WorkOrderEdit');
                      }}>
                      <View>
                        <Text style={{color: 'white', fontSize: 11}}>Edit</Text>
                      </View>
                    </TouchableOpacity> */}
      </View>
    </>
  );
}
