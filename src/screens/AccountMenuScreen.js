import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';

import ScreenWrapper from './../components/ScreenWrapper';
import Input from './../components/Input';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';

class OPI_VRIFilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        id: '',
        name: '',
        sector: '',
        physicalAddress: '',
        billingAddress: '',
        phone: '',
        location: '',
      },
    };
  }

  render() {
    const {profile} = this.state;
    return (
      <ScreenWrapper>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity
              activeOpacity={0.3}
              style={styles.crossBtnContainer}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={Images.CancelIcon}
                style={styles.crossBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.fieldsContainer}>
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Client ID"
                onChangeText={(text) => {
                  profile.id = text;
                  this.setState({profile});
                }}
              />
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Client Name"
                onChangeText={(text) => {
                  profile.name = text;
                  this.setState({profile});
                }}
              />
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Sector"
                onChangeText={(text) => {
                  profile.sector = text;
                  this.setState({profile});
                }}
              />
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Physical Address"
                onChangeText={(text) => {
                  profile.physicalAddress = text;
                  this.setState({profile});
                }}
              />
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Billing Address"
                onChangeText={(text) => {
                  profile.billingAddress = text;
                  this.setState({profile});
                }}
              />
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Phone"
                onChangeText={(text) => {
                  profile.phone = text;
                  this.setState({profile});
                }}
              />
              <Input
                inputWrapperStyle={styles.fieldStyle}
                placeholder="Location"
                onChangeText={(text) => {
                  profile.location = text;
                  this.setState({profile});
                }}
              />
            </View>
            <CustomButton text="Save" />
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  crossBtnContainer: {
    alignSelf: 'flex-end',
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossBtn: {
    width: 20,
    height: 20,
  },
  fieldsContainer: {
    width: '85%',
    marginBottom: 10,
  },
  fieldStyle: {
    justifyContent: 'center',
    borderWidth: 1,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  fieldTextStyle: {
    marginLeft: 5,
    fontFamily: 'Montserrat-Regular',
  },
  fieldIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 15,
  },
});
export default OPI_VRIFilterScreen;
