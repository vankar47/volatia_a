import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Table, Rows, Row, Col} from 'react-native-table-component';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {SearBar} from 'react-native-elements';

import ScreenWrapper from './../components/ScreenWrapper';
import PickerSelect from '../components/PickerSelect';
import SearchInput from './../components/SearchInput';
import Loader from './../components/Loader';

import Colors from '../constants/Colors';
import Images from '../constants/Images';

import {getData, removeData, storeData} from '../store/storage';

import {getRequest, postWithParams} from '../services/request';

const {height, width} = Dimensions.get('screen');

class ReportCenterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      primaryColor: '#00b7ff',
      secondaryColor: '#d3dbdb',

      LogoImg: '',
      orientation: '',
      isTablet: false,
      accessToken: '',
      showLoader: false,
      filterData: {
        year: [{label: 'Year', value: 'all'}],
        month: [{label: 'Month', value: 'all'}],
      },
      year: [],
      month: [
        {label: 'January', value: 1},
        {label: 'February', value: 2},
        {label: 'March', value: 3},
        {label: 'April', value: 4},
        {label: 'May', value: 5},
        {label: 'June', value: 6},
        {label: 'July', value: 7},
        {label: 'August', value: 8},
        {label: 'September', value: 9},
        {label: 'October', value: 10},
        {label: 'November', value: 11},
        {label: 'December', value: 12},
      ],

      selectedMenu: 1,
      searchText: '',
      filteredSearch: [],

      tableData: {
        label: '',
        description: '',
        widthArr: [200],
        tableHead: [],
        tableData: [],
      },

      fixedColumn: {
        columnData: [],
        widthArr: [],
        columnHead: [],
      },

      menuList: [
        {
          id: 1,
          label: 'Rate',
          onPress: this._GetRateSummary,
        },
        {
          id: 2,
          label: 'Bill',
          onPress: this.onBillPress,
          description: 'The chart below shows all of your past invoices.',
        },
        {
          id: 3,
          label: 'Language',
          onPress: this.onLanguagePress,
          filters: true,
        },
        {
          id: 4,
          label: 'Division Summary',
          onPress: this.onDivPress,
          filters: true,
        },
        {
          id: 5,
          label: 'Facility Summary',
          onPress: this.onFacilityPress,
          filters: true,
        },
        {
          id: 6,
          label: 'Cost Summary',
          onPress: this.onCostPress,
          filters: true,
        },
      ],
    };
  }

  componentDidMount = async () => {
    const isTablet = DeviceInfo.isTablet();
    let orientation;
    if (isTablet) {
      if (height > width) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    }
    this.setState({isTablet, orientation});
    const result = await getData('AllColors');
    const output = JSON.parse(result);
    this.setState({
      primaryColor: output.primaryColor,
      secondaryColor: output.secondaryColor,
      LogoImg: output.logoUrl,
    });
    this._GetRateSummary(1);
    ///// setting year dropdown
    const currentYear = new Date().getFullYear();

    const starting = 1900;

    const year = [];

    for (let i = currentYear; i >= starting; --i) {
      year.push({
        label: `${i}`,
        value: i,
      });
    }
    this.setState({year});
  };

  _GetRateSummary = async (selectedMenu) => {
    this.setState({selectedMenu});
    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        label: '',
        description:
          'The following chart provides a summary of current language service billing rates.',
        widthArr: [200, 200, 200, 200, 200, 200, 200],
        heightArr: [20, 20, 20, 20, 20, 20, 20, 20],
        tableHead: [
          'Tier',
          'Service',
          'Units',
          'Rate',
          'EffectiveDate',
          'ExpirationDate',
          'Minimum',
          'Increment',
        ],
        firtColumnHead: ['Tier'],
        firstColumnData: [],
        tableData: [],
      };

      this.setState({showLoader: true, tableData});
      const res = await postWithParams(
        '/api/Reporting/ClientReports/RateSummary',
        accessToken,
      );
      const rateResponse = res.result.data;

      const allData = rateResponse.map((item) => {
        const {
          Tier,
          Service,
          Units,
          Rate,
          EffectiveDate,
          ExpirationDate,
          Minimum,
          Increment,
        } = item;
        return [
          Tier,
          Service,
          Units,
          Rate,
          EffectiveDate,
          ExpirationDate,
          Minimum,
          Increment,
        ];
      });

      tableData.tableData = allData;

      this.setState({tableData, showLoader: false});
    } catch (err) {
      this.setState({showLoader: false});
    }
  };

  onBillPress = async (selectedMenu) => {
    this.setState({selectedMenu});

    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        description: 'The chart below shows all of your past invoices.',
        widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        tableHead: [
          'Invoice Number',
          'Client ID',
          'Client',
          'Bill Date',
          'Due Date',
          'Total',
          'Hours',
          'Orders',
          'Languages',
          'Amount Paid',
          'Balance Due',
        ],
        tableData: [],
      };

      this.setState({showLoader: true, tableData});
      const res = await postWithParams(
        '/api/Reporting/ClientReports/InvoiceHistory',
        accessToken,
      );
      const billResponse = res.result.data;

      const allData = billResponse.map((item) => {
        const {
          InvoiceNumber,
          ClientID,
          Client,
          BillDate,
          DueDate,
          Total,
          Hours,
          Orders,
          Languages,
          AmountPaid,
          BalanceDue,
        } = item;
        return [
          InvoiceNumber,
          ClientID,
          Client,
          BillDate,
          DueDate,
          Total,
          Hours,
          Orders,
          Languages,
          AmountPaid,
          BalanceDue,
        ];
      });

      tableData.tableData = allData;

      this.setState({tableData, showLoader: false});
    } catch (err) {
      this.setState({showLoader: false});
    }
  };

  onLanguagePress = async (
    selectedMenu,
    filteredData = {
      year: 'all',
      month: 'all',
    },
  ) => {
    const stateData = {selectedMenu};

    if (filteredData) stateData.filterData = filteredData;
    this.setState(stateData);

    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        label: '',
        description:
          'The Recipients columns shows the number of all unique recipients for that language.\nThe Facilities column shows the number of different work site facilities that required services for that language.\nThe Total Hours column shows the total number of hours devoted to that language.',

        widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200],
        tableHead: [
          'Language',
          'Client ID',
          'Client',
          'Language ID',
          'Orders',
          'Recipients',
          'Billable Minutes',
          'Facilities',
          'Hours',
          'Total',
        ],
        tableData: [],
      };
      const paramData = {};
      if (filteredData) {
        if (filteredData.year) paramData.year = filteredData.year;
        if (filteredData.month) paramData.month = filteredData.month;
      }
      this.setState({showLoader: true, tableData});

      const res = await postWithParams(
        '/api/Reporting/ClientReports/LanguageSummary',
        accessToken,
        paramData,
      );
      const languageResponse = (res.result && res.result.data) || [];

      const allData = languageResponse.map((item) => {
        const {
          Language,
          ClientID,
          Client,
          LanguageID,
          Orders,
          Recipients,
          BillableMinutes,
          Facilities,
          Hours,
          Total,
        } = item;
        return [
          Language,
          ClientID,
          Client,
          LanguageID,
          Orders,
          Recipients,
          BillableMinutes,
          Facilities,
          Hours,
          Total,
        ];
      });
      tableData.tableData = allData;

      this.setState({tableData, showLoader: false});
    } catch (err) {
      this.setState({showLoader: false});
      console.log('ERR', err);
      alert('Err');
    }
  };

  onDivPress = async (
    selectedMenu,
    filteredData = {
      year: '',
      month: '',
    },
  ) => {
    const stateData = {selectedMenu};
    if (filteredData) stateData.filterData = filteredData;
    this.setState(stateData);
    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        label: 'Rate',
        description:
          'The following chart provides a statistical summary of division services segmented by division.\nThe Work Order column shows the number of all unique work orders for that division.\nThe Recipients columns shows the number of all unique recipients for that division.\nThe Facilities column shows the number of different work site facilities that required services for that division.\nThe Total Hours column shows the total number of hours devoted to that division.',
        widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200],
        tableHead: [
          'Division',
          'Client ID',
          'Client',
          'Division ID',
          'Orders',
          'Recipients',
          'Facilities',
          'Languages',
          'Hours',
          'Total',
        ],
        tableData: [],
      };
      const paramData = {};
      if (filteredData) {
        if (filteredData.year) paramData.year = filteredData.year;
        if (filteredData.month) paramData.month = filteredData.month;
      }

      this.setState({showLoader: true, tableData});
      const res = await postWithParams(
        '/api/Reporting/ClientReports/DivisionSummary',
        accessToken,
        paramData,
      );
      const rateResponse = (res.result && res.result.data) || [];
      // console.log('rate response', res);

      const allData = rateResponse.map((item) => {
        const {
          Division,
          ClientID,
          Client,
          DivisionID,
          Orders,
          Recipients,
          Facilities,
          Languages,
          Hours,
          Total,
        } = item;
        return [
          Division,
          ClientID,
          Client,
          DivisionID,
          Orders,
          Recipients,
          Facilities,
          Languages,
          Hours,
          Total,
        ];
      });

      tableData.tableData = allData;
      this.setState({tableData, showLoader: false});
    } catch (err) {
      this.setState({showLoader: true});
      alert(err);
    }
  };

  onFacilityPress = async (
    selectedMenu,
    filteredData = {
      year: '',
      month: '',
    },
  ) => {
    const stateData = {selectedMenu};
    if (filteredData) stateData.filterData = filteredData;
    this.setState(stateData);
    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        description:
          'The following chart provides a statistical summary of language services segmented by work site facility.\nThe Work Order column shows the number of all unique work orders for that facility.\nThe Recipients columns shows the number of all unique recipients for that facility.\nThe Languages column shows the number of unique languages requested for that facility.\nThe Total Hours column shows the total number of hours devoted to that facility.',
        widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        tableHead: [
          'Facility',
          'Client ID',
          'Client',
          'Facility ID',
          'Facility Map Address',
          'Division',
          'Orders',
          'Languages',
          'Recipients',
          'Facilities',
          'Minutes',
          'Hours',
          'Total',
        ],
        tableData: [],
      };
      const paramData = {};
      if (filteredData) {
        if (filteredData.year) paramData.year = filteredData.year;
        if (filteredData.month) paramData.month = filteredData.month;
      }

      this.setState({showLoader: true, tableData});
      const res = await postWithParams(
        '/api/Reporting/ClientReports/FacilitySummary',
        accessToken,
        paramData,
      );
      const rateResponse = (res.result && res.result.data) || [];
      // console.log('this is facility', rateResponse);

      const allData = rateResponse.map((item) => {
        const {
          Facility,
          ClientID,
          Client,
          FacilityID,
          FacilityMapAddress,
          Division,
          Orders,
          Languages,
          Recipients,
          Facilities,
          Minutes,
          Hours,
          Total,
        } = item;
        return [
          Facility,
          ClientID,
          Client,
          FacilityID,
          FacilityMapAddress,
          Division,
          Orders,
          Languages,
          Recipients,
          Facilities,
          Minutes,
          Hours,
          Total,
        ];
      });

      tableData.tableData = allData;

      this.setState({tableData, showLoader: false});
    } catch (err) {
      this.setState({showLoader: false});
    }
  };

  onCostPress = async (
    selectedMenu,
    filteredData = {
      year: '',
      month: '',
    },
  ) => {
    const stateData = {selectedMenu};
    if (filteredData) stateData.filterData = filteredData;
    this.setState(stateData);
    const accessToken = await getData('AccessToken');

    try {
      const tableData = {
        description:
          'The following chart provides a statistical summary of cost center services segmented by cost center.\nThe Work Order column shows the number of all unique work orders for that cost center. The Recipients columns shows the number of all unique recipients for that cost center.\nThe Facilities column shows the number of different work site facilities that required services for that cost center.\nThe Total Hours column shows the total number of hours devoted to that cost center.',
        widthArr: [200, 200, 200, 200, 200, 200, 200, 200],
        tableHead: [
          'Cost Center',
          'Client ID',
          'Client',
          'Orders',
          'Recipients',
          'Facilities',
          'Languages',
          'Hours',
          'Total',
        ],
        tableData: [],
      };
      const paramData = {};
      if (filteredData) {
        if (filteredData.year) paramData.year = filteredData.year;
        if (filteredData.month) paramData.month = filteredData.month;
      }

      this.setState({showLoader: true, tableData});
      const res = await postWithParams(
        '/api/Reporting/ClientReports/CostCenterSummary',
        accessToken,
        paramData,
      );

      const rateResponse = (res.result && res.result.data) || [];
      // console.log('this is Cost', rateResponse);

      const allData = rateResponse.map((item) => {
        const {
          CostCenter,
          ClientID,
          Client,
          Orders,
          Recipients,
          Facilities,
          Languages,
          Hours,
          Total,
        } = item;
        return [
          CostCenter,
          ClientID,
          Client,
          Orders,
          Recipients,
          Facilities,
          Languages,
          Hours,
          Total,
        ];
      });

      tableData.tableData = allData;

      this.setState({tableData, showLoader: false});
    } catch (err) {
      this.setState({showLoader: false});
    }
  };

  handleSearch = (searchText) => {
    this.setState({searchText: searchText});

    let filteredData = this.state.tableData.filter((item) => {
      return item.description.includes(searchText);
    });
    this.setState({filteredSearch: filteredData});
  };

  render() {
    const {
      isTablet,
      orientation,
      filterData,
      month,
      year,
      menuList,
      selectedMenu,
      tableData,
      showLoader,
      searchText,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
            style={{flex: 1}}>
            <View style={styles.container}>
              {isTablet ? (
                <View style={styles.headerWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.menuBtnContainer}
                    onPress={() => this.props.navigation.openDrawer()}>
                    {/* <Image
                            source={Images.MenuIcon}
                            style={styles.menuBtn}
                            resizeMode="contain"
                          /> */}
                    <Ionicons
                      name="log-out-outline"
                      size={30}
                      color={this.state.secondaryColor}
                      style={{
                        marginTop: 2,
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      // paddingH: 20,
                      // flex: 1,
                      // justifyContent: 'center',
                      // alignItems: 'center',
                      // width: '100%',
                      // textAlign: 'center',
                      // position: 'absolute',
                      // left: 0,
                      // right: 0,
                      // alignSelf: 'center',
                      // justifyContent: 'center',
                      alignItems: 'center',
                      paddingRight: 20,
                      flex: 1,
                    }}>
                    <Image
                      source={{uri: this.state.LogoImg}}
                      style={{width: 270, height: 60}}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.headerWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.menuBtnContainer}
                    onPress={() => this.props.navigation.openDrawer()}>
                    {/* <Image
                      source={Images.MenuIcon}
                      style={styles.menuBtn}
                      resizeMode="contain"
                    /> */}
                    <Ionicons
                      name="log-out-outline"
                      size={30}
                      color={this.state.secondaryColor}
                      style={{
                        marginTop: 2,
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      // paddingH: 20,
                      // flex: 1,
                      // justifyContent: 'center',
                      // alignItems: 'center',
                      // width: '100%',
                      // textAlign: 'center',
                      // position: 'absolute',
                      // left: 0,
                      // right: 0,
                      // alignSelf: 'center',
                      // justifyContent: 'center',
                      alignItems: 'center',
                      paddingRight: 30,
                      flex: 1,
                    }}>
                    <Image
                      source={{uri: this.state.LogoImg}}
                      style={{width: 270, height: 60}}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
              {/* {!isTablet && (
                <SearchInput
                  handleSearch={(item) => this.handleSearch(item)}
                  value={this.state.searchText}
                  placeholder="Search"
                />
              )} */}
              <View style={styles.listContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{padding: 15}}>
                  {menuList.map((item, key) => {
                    return (
                      <TouchableOpacity
                        key={item.id.toString()}
                        activeOpacity={0.3}
                        onPress={() => item.onPress(item.id)}
                        style={
                          item.id === selectedMenu
                            ? styles.selectedListItemStyle(
                                this.state.primaryColor,
                              )
                            : styles.listItemStyle
                        }>
                        <Text
                          style={[
                            styles.listItemText,
                            {
                              color:
                                item.id === selectedMenu ? 'white' : 'black',
                            },
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={[styles.listContainer, {alignItems: 'flex-start'}]}>
                <View style={styles.someTextWrapper}>
                  <Text style={styles.someText}>{tableData.description}</Text>
                </View>
              </View>
              {menuList[selectedMenu - 1].filters && (
                <View
                  style={[
                    styles.listContainer,
                    {
                      justifyContent: isTablet ? 'flex-start' : 'space-around',
                      zIndex: 2,
                    },
                  ]}>
                  <PickerSelect
                    wrapperStyle={styles.selectStyle}
                    offStyle={true}
                    inputColor={this.state.primaryColor}
                    selectedValue={filterData.year}
                    placeholderColor="black"
                    list={this.state.year}
                    value={filterData.year}
                    placeholder={{label: 'Year', value: 'all'}}
                    onSelectChange={(value) => {
                      filterData.year = value;
                      // this.setState({filterData});
                      const currentMenu = menuList.find((menu) => {
                        return menu.id === selectedMenu;
                      });
                      if (currentMenu && currentMenu.onPress)
                        currentMenu.onPress(selectedMenu, {
                          year: value,
                          month: filterData.month,
                        });
                    }}
                  />
                  <PickerSelect
                    wrapperStyle={styles.selectStyle}
                    offStyle={true}
                    inputColor={this.state.primaryColor}
                    list={this.state.month}
                    value={filterData.month}
                    placeholder={{label: 'Month', value: 'all'}}
                    placeholderColor="black"
                    onSelectChange={(value) => {
                      filterData.month = value;
                      // this.setState({filterData});
                      const currentMenu = menuList.find((menu) => {
                        return menu.id === selectedMenu;
                      });
                      if (currentMenu && currentMenu.onPress)
                        currentMenu.onPress(selectedMenu, {
                          year: filterData.year,
                          month: value,
                        });
                    }}
                  />
                </View>
              )}
              {showLoader ? (
                <Loader />
              ) : (
                <>
                  <View style={styles.tableContainer}>
                    <View>
                      <Table
                        borderStyle={{
                          borderWidth: 1,
                        }}>
                        <Row
                          data={[tableData.tableHead[0]]}
                          widthArr={[tableData.widthArr[0]]}
                          style={styles.tableHeader}
                          textStyle={[styles.tableText, {paddingVertical: 15}]}
                        />
                      </Table>
                      <View style={styles.tableDataWrapper}>
                        <Table borderStyle={{borderWidth: 1}}>
                          <Rows
                            data={tableData.tableData.map((data) => [data[0]])}
                            widthArr={[200]}
                            textStyle={styles.tableText}
                          />
                        </Table>
                      </View>
                    </View>
                    <ScrollView horizontal={true} style={{marginRight: 21}}>
                      <View>
                        <Table
                          borderStyle={{
                            borderWidth: 1,
                            borderRightColor: 'white',
                          }}>
                          <Row
                            data={tableData.tableHead.slice(1)}
                            widthArr={tableData.widthArr}
                            style={styles.tableHeader}
                            textStyle={[
                              styles.tableText,
                              {paddingVertical: 15},
                            ]}
                          />
                        </Table>
                        <View style={styles.tableDataWrapper}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                            }}>
                            <Rows
                              data={tableData.tableData.map((obj) => {
                                obj.shift();
                                return obj;
                              })}
                              widthArr={tableData.widthArr}
                              textStyle={styles.tableText}
                              style={{minWidth: 200}}
                            />
                          </Table>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginTop: 5,
    paddingHorizontal: 10,
  },
  tabletHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    // paddingHorizontal: 10,
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
  logoWrapper: {
    // height: 60,
  },
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
  selectedListItemStyle: (primaryColor) => {
    return {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
      borderWidth: 1,
      padding: 10,
      paddingHorizontal: 24,
      borderRadius: 50,
      marginHorizontal: 5,
      elevation: 5,
      shadowColor: primaryColor,
      shadowRadius: 5,
      shadowOffset: {height: 10},
      shadowOpacity: 0.5,
    };
  },
  listItemText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  someTextWrapper: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 10,
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
  // firstTableContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignSelf: 'flex-start',
  //   flexWrap: 'nowrap',
  //   margin: 10,
  //   width: '100%',
  //   height: '100%',
  // },

  tableContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    margin: 10,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  tableHeader: {
    backgroundColor: Colors.tableHeader,
    width: '100%',
    // height: '100%',
    // left: 200,
  },
  tableDataWrapper: {
    marginTop: -1,
    width: '100%',
  },
  firstTable: {},
  tableText: {
    paddingVertical: 15,
    textAlign: 'center',
    // paddingVertical: 15,
    flex: 1,
    fontFamily: 'Montserrat-Medium',
    minHeight: 70,
    maxHeight: 'auto',
    fontSize: 11.2,
  },
});
export default ReportCenterScreen;
