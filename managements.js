import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, FlatList, Switch, ImageBackground } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HeaderButtons, } from 'react-navigation-header-buttons';
import { BarChart, } from "react-native-chart-kit";
import * as firebase from 'firebase';
import Sche from './schedule';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// import * as Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';

var firebaseConfig = {
  apiKey: "AIzaSyALHh1hMM3BCqJ3c7SR_6XLVtwuwjc27sU",
  authDomain: "myproject-13f98.firebaseapp.com",
  databaseURL: "https://myproject-13f98.firebaseio.com",
  projectId: "myproject-13f98",
  storageBucket: "myproject-13f98.appspot.com",
  messagingSenderId: "665863113151",
  appId: "1:665863113151:web:d6d7e346ca299e0cd0390a",
  measurementId: "G-ZVTYSDJX51"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


// class for receiving data from firebase
class User {
  constructor(fullName, email, phone, userName) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.userName = userName;
  }

  get getFullName() {
    return this.fullName.toString();
  }

  get getEmail() {
    return this.email.toString();
  }

  get getPhone() {
    return this.phone.toString();
  }

  get getUserName() {
    return this.userName.toString();
  }
}


let navi;
let user;
var roomDataOfUser = [];
var DBulbs = [];
var DSchedules = [];
var DListRoomOfUser = [];
var DListhistory = [];
var DListIdRoom = [];
var idRoom = [];
var DSystemHistory = [], listSystemHistory = [], arrayDate = [], arrayLevelLight = [];

// function data() {

// }

function ReadUserData(id) {
  //=====================================Get temporary user have ID 1, please pass ID of user =====================
  firebase.database().ref('users/' + id).on('value', function (snapshot) { 
    user = new User(snapshot.val().fullname,
                    snapshot.val().email,
                    snapshot.val().phone,
                    snapshot.val().username);

    //=============================Get list room of user ============================
    DListRoomOfUser = Object.entries(snapshot.val().listRooms);
    DListIdRoom = DListRoomOfUser.map(item => item[0]);
    DListNameRoom = DListRoomOfUser.map(item => item[1].roomsName);
    idRoom = DListIdRoom[0];
    
    DListhistory = Object.entries(DListRoomOfUser.map(item => item[1])[DListIdRoom.indexOf(idRoom)].listUserHistory).map(item => item[1]);
    // console.log("==========This is history of user in room ===============")
    // console.log(DListhistory);
  });

 
  firebase.database().ref('listRooms/').on('value', function (snap) {
    
    // setUsersData(Object.entries(snap.val()).map(item => item[1]));
    // setUsersData(Object.entries(snap.val()));
    roomDataOfUser = Object.entries(snap.val());
    // listRoomIDName = roomDataOfUser.map(item => [item[1].roomsID, item[1].roomsName]);
    DBulbs = roomDataOfUser.map((item) => {
      for(var name of DListNameRoom){
        if(item[1].roomsName == name){
          return [item[1].roomsID, item[1].roomsName, item[1].listBulbs];
        }
      }
      return null;
    });
    DBulbs = DBulbs.filter(function (obj) {
      return obj != null;
    });
    //------------------------------------------------------------------------------------
    DSchedules = roomDataOfUser.map((item) => { 
      for(var name of DListNameRoom){
        if(item[1].roomsName == name){
          return [item[1].roomsID, item[1].roomsName, item[1].listSchedules == undefined? {}: item[1].listSchedules];
        }
      }
      return null;
    });
    DSchedules = DSchedules.filter(function (obj) {
      return obj != null;
    });
    //-----------------------------------------------------------------------------------
    DSystemHistory = roomDataOfUser.map((item) => { 
      for(var name of DListNameRoom){
        if(item[1].roomsName == name){
          return item[1].listSystemHistory;
        }
      }
      return null;
    });
    DSystemHistory = DSystemHistory.filter(function (obj) {
      return obj != null;
    });
    listSystemHistory = Object.entries(DSystemHistory[DListIdRoom.indexOf(idRoom)]).map(item => item[1]);
    for(var sys of listSystemHistory){
      arrayDate.push(sys.dateTime);
    }
    for(var sys of listSystemHistory){
      arrayLevelLight.push(sys.levelLight);
    }
    // console.log('===============aa============');
    // for(var sys of arrayDate){
    //   console.log(sys);
    // }
    //console.log(Object.entries(DSystemHistory[DListIdRoom.indexOf(idRoom)]).map(item => item[1]));
  });

  // for(var i =0;i<listroomID.length;i=i+1){
  //   firebase.database().ref('listRooms/' + listroomID[i]).on('value', function (snap) {
  //     roomDataOfUser = Object.entries(snap.val());
  //     listroomID = roomDataOfUser.map(item => item[0]);
      
  //   });
  // }
}


//===============================================================================================

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
//----------------------------------------------MainScreen----------------------------------------------
function MainScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>

      <Image
        source={require('./assets/home.png')}
        style={{
          resizeMode: 'contain',
          width: '90%'
        }}
      />



    </View>
  );
}
function StackMain() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Home"
        component={MainScreen}
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontWeight: 'bold', color: '#404040', fontSize: 20 }}>Home </Text></Text>
          ),

          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerRight: () => (

            <HeaderButtons>
              <TouchableOpacity style={styles.touchable}>
                <Image
                  source={require('./assets/notifi.png')}
                  style={styles.notification} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchable}>
                <Image
                  source={require('./assets/back.png')}
                  style={styles.logout} />
              </TouchableOpacity>
            </HeaderButtons>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
//----------------------------------------------RoomScreen----------------------------------------------

function VDevice({ item }) {
  // const [count, setCount] = useState(item.stateB=="1"? 1: 0);
  if (item.status == true) {
    return (
      <View style={{
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ImageBackground
          source={require('./assets/bulb.png')}
          style={{
            resizeMode: 'contain',
            width: 30,
            height: 30,
          }}
        >
        </ImageBackground>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'google-bold',
            color: '#404040'
          }}
        >{item.bulbsName}</Text>

      </View >
    );
  }
  else {
    return (
      <View style={{
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#e7e6e6',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ImageBackground
          source={require('./assets/buldOff.png')}
          style={{
            resizeMode: 'contain',
            width: 30,
            height: 30,
          }}
        >
        </ImageBackground>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'google-bold',
            color: '#404040'
          }}
        >{item.bulbsName}</Text>

      </View >
    );
  }
}

function RoomScreen({ route, navigation }) {
  const [serialRoom, setSerialRoom] = useState(0);
  const numcol = 4;
  let loadpage = false;
  const [nameRoom, setNameRoom] = useState(DBulbs[0][1]);
  const [isEnabled, setIsEnabled] = useState(false);
  // const [acount, setAcount] = useState(false);
  const [bulb, setBulb] = useState(Object.entries(DBulbs[0][2]).map(item => item[1]));
  const [togglebulb, setTogglebulb] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const changeRoomLeft = () => {
    if (serialRoom > 0) {
      setNameRoom(DBulbs[serialRoom - 1][1]);
      setBulb(Object.entries(DBulbs[serialRoom - 1][2]).map(item => item[1]));
      setSerialRoom(serialRoom - 1);
    }
  };
  const changeRoomRight = () => {
    if (serialRoom < (DBulbs.length - 1)) {
      setNameRoom(DBulbs[serialRoom + 1][1]);
      setBulb(Object.entries(DBulbs[serialRoom + 1][2]).map(item => item[1]));
      setSerialRoom(serialRoom + 1);
    }
  };
  ////////////////ReLoad Schedule to update data from databse//////////////
  if (route.params != undefined) {
    if (route.params.item == 1) {
      route.params.item = 0;
      navigation.navigate('Schedule', { item: DSchedules[serialRoom] });
    }
  }
  return (
    <View style={{ flex: 1, padding: 40, paddingLeft: '5%', backgroundColor: '#f5f5f5' }}>

      <View style={styles.header1}>
        <TouchableOpacity
          // onPress={() => setToogle(!toogle)}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#e7e6e6',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            marginStart: 170
          }}>
          <Image
            source={require('./assets/refresh.png')}
            resizeMode='contain'
            style={{ width: '50%' }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{
          width: 40,
          height: 40,
          backgroundColor: '#e7e6e6',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          marginStart: 10
        }}>
          <Image
            source={require('./assets/notifi.png')}
            resizeMode='contain'
            style={{ width: '40%' }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            roomDataOfUser = [];
            DBulbs = [];
            DSchedules = [];
            DListRoomOfUser = [];
            DListhistory = [];
            DListIdRoom = [];
            idRoom = [];
            DSystemHistory = [];
            listSystemHistory = [];
            arrayDate = [];
            arrayLevelLight = [];
            navi.navigate('Home');
          }}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#e7e6e6',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            marginStart: 10
          }}>
          <Image
            source={require('./assets/logout.png')}
            resizeMode='contain'
            style={{ width: '50%' }}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={require('./assets/manageRoom.png')}
        resizeMode='contain'
        style={{ width: '70%' }}
      />

      <View
        style={styles.titleR}
      >
        <View style={[styles.titleC, { alignItems: 'center' }]}>
          <Text
            style={{ fontSize: 22, fontFamily: 'google-bold', color: '#404040' }}
          >  ID: {serialRoom + 1} </Text>
        </View>
        <View style={[styles.titleC, { alignItems: 'center' }]}>
          <Text
            style={{ fontSize: 16, fontFamily: 'google-bold', color: '#808080' }}
          >by handwork</Text>
        </View>
      </View>
      <View
        style={{ marginTop: '2%', alignItems: 'center' }}
      >
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f5"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {/* <View
        style={styles.Viewdevice}
      >
        <FlatList
          keyExtractor={item => item.idevice}
          data={bulb}
          style={[styles.ItemDevicesList]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (isEnabled) {
                  item.status = !(item.status);
                  loadpage = !togglebulb;
                  let bulbsRef = firebase.database().ref('listRooms/' + DBulbs[serialRoom][0] + '/listBulbs/' + item.bulbsID);
                  bulbsRef.update({ status: item.status }).then().catch();
                  setTogglebulb(loadpage);
                }
              }}
              style={styles.ItemDevice}
            >
              <VDevice item={item} />
            </TouchableOpacity>

          )}
          numColumns={numcol}
        />
      </View> */}

      <View style={styles.boxOne}>
        <FlatGrid
          itemDimension={60}
          data={bulb}
          style={styles.gridFlat}
          // staticDimension={300}
          // fixed
          spacing={10}
          renderItem={({ item }) => (
            <View >
              <TouchableOpacity
                onPress={() => {
                  if (isEnabled) {
                    item.status = !(item.status);
                    loadpage = !togglebulb;
                    let bulbsRef = firebase.database().ref('listRooms/' + DBulbs[serialRoom][0] + '/listBulbs/' + item.bulbsID);
                    bulbsRef.update({ status: item.status }).then().catch();
                    setTogglebulb(loadpage);
                  }
                }}
                style={styles.ItemDevice}
              >
                <VDevice item={item} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <View style={styles.boxTwo0}>
        <TouchableOpacity
          style={styles.buttonschedule}
          onPress={() =>
            navigation.navigate('Schedule', { item: DSchedules[serialRoom] })
          }
        >
          <Image
            source={require('./assets/schedule.png')}
            style={{ resizeMode: 'contain', width: '50%', height: '50%' }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.transroom}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold', color: '#404040' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
      </View>
    </View >
  );
}

function stackRoomScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Room Management"
        component={RoomScreen}
        options={{
          // headerTitle: () => (
          //   <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontWeight: 'bold', color: '#404040', fontSize: 20 }}>Room </Text> Management</Text>
          // ),

          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
          // headerRight: () => (

          // <HeaderButtons>
          //   <TouchableOpacity style={styles.touchable}>
          //     <Image
          //       // source={require('./assets/notifi.png')}
          //       style={styles.notification} />
          //   </TouchableOpacity>
          //   <TouchableOpacity style={styles.touchable}>
          //     <Image
          //       source={require('./assets/back.png')}
          //       style={styles.logout} />
          //   </TouchableOpacity>
          // </HeaderButtons>
          // ),
        }}
      />

      <Stack.Screen
        name="Schedule"
        component={Sche}
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, color: 'red' }}> <Text style={{ fontFamily: 'google-bold', color: '#404040', fontSize: 20 }}>Schedule </Text></Text>
          ),

          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </Stack.Navigator>
  )
}

//--------------------------------------------------AccountScreen----------------------------------------------------------
function Account() {
  //use for update info
  const [username, setUsername] = useState(user.getUserName);
  const [fullname, setFullname] = useState(user.getFullName);
  const [email, setEmail] = useState(user.getEmail);
  const [phone, setPhone] = useState(user.getPhone);

  const UpdateUserData = () => {
    firebase.database().ref('users/1').update({
      fullname: fullname,
      email: email,
      phone: phone,
      username: username,
    });
  }
  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'red', }}>
      <View style={styles.container}>

        <View style={styles.header1}>
          <TouchableOpacity
            // onPress={() => setToogle(!toogle)}
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#e7e6e6',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
              marginStart: 170
            }}>
            <Image
              source={require('./assets/refresh.png')}
              resizeMode='contain'
              style={{ width: '50%' }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 40,
            height: 40,
            backgroundColor: '#e7e6e6',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            marginStart: 10
          }}>
            <Image
              source={require('./assets/notifi.png')}
              resizeMode='contain'
              style={{ width: '40%' }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              roomDataOfUser = [];
              DBulbs = [];
              DSchedules = [];
              DListRoomOfUser = [];
              DListhistory = [];
              DListIdRoom = [];
              idRoom = [];
              DSystemHistory = [];
              listSystemHistory = [];
              arrayDate = [];
              arrayLevelLight = [];
              navi.navigate('Home')
            }}
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#e7e6e6',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
              marginStart: 10
            }}>
            <Image
              source={require('./assets/logout.png')}
              resizeMode='contain'
              style={{ width: '50%' }}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={require('./assets/manageAccount.png')}
          resizeMode='contain'
          style={{ width: '70%' }}
        />

        <Image
          source={require('./assets/avatar.png')}
          style={styles.avatar}
          resizeMode='center' />

        <View style={styles.boxOne1}>
          <View style={styles.boxTwo}>
            <Image
              source={require('./assets/users.png')}
              style={styles.imageStyle}
            />
            <TextInput
              style={styles.input}
              placeholder='Name'
              defaultValue={fullname}
              onChangeText={(val) => setFullname(val)}
              keyboardType='default'
              style={styles.textInput}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.boxTwo}>
            <Image
              source={require('./assets/interface.png')}
              style={styles.imageStyle}
            />
            <TextInput
              onChangeText={(val) => setEmail(val)}
              value={email}
              keyboardType='email-address'
              style={styles.textInput}
              placeholder="Email"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.boxTwo}>
            <Image
              source={require('./assets/touch-screen.png')}
              style={styles.imageStyle}
            />
            <TextInput
              onChangeText={(val) => setPhone(val)}
              value={phone}
              keyboardType='phone-pad'
              style={styles.textInput}
              placeholder="Phone"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.boxTwo}>
            <Image
              source={require('./assets/man-avatar.png')}
              style={styles.imageStyle}
            />
            <TextInput
              onChangeText={(val) => setUsername(val)}
              value={username}
              keyboardType='default'
              style={styles.textInput}
              placeholder="Username"
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity
            onPress={UpdateUserData}
            style={{
              backgroundColor: '#f4a05b',
              width: '25%',
              height: 45,
              margin: 10,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center'
            }}
          >
            <Text style={{
              fontFamily: 'google-bold',
              fontSize: 18,
              color: '#f5f5f5'
            }}>save</Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
function stackAccountScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Account Management"
        component={Account}
        options={{
          //   headerTitle: () => (
          //     <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontWeight: 'bold', color: '#404040', fontSize: 20 }}>Account </Text> Management</Text>
          //   ),

          //   headerStyle: {
          //     backgroundColor: '#f5f5f5',
          //   },
          //   headerRight: () => (

          //     <HeaderButtons>
          //       <TouchableOpacity style={styles.touchable}>
          //         <Image
          //           source={require('./assets/notifi.png')}
          //           style={styles.notification} />
          //       </TouchableOpacity>
          //       <TouchableOpacity style={styles.touchable}>
          //         <Image
          //           source={require('./assets/back.png')}
          //           style={styles.logout} />
          //       </TouchableOpacity>
          //     </HeaderButtons>
          //   ),
        }}
      />
    </Stack.Navigator>
  )
}

//----------------------------------------------------HistoryScreen------------------------------------------------------------
const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#E7E7E7",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(92, 92, 92, ${opacity})`,
  barPercentage: 0.5,
};
var data = {
  labels: arrayDate,
  datasets: [
    {
      data: arrayLevelLight
    }
  ]
};
const styleBarChart = {
  paddingTop: 10,
  marginVertical: '2%',
  borderRadius: 16
}

function statusToImage(status) {
  var imagePath = '';
  if (status.toLowerCase() == 'on') {
    imagePath = require('./assets/interface(5).png');
  }
  else {
    imagePath = require('./assets/interface(6).png');
  }

  return imagePath;
}

const CustomRow = ({ title, description, image_path, room }) => (
  <View style={styles.container1}>
    <Image source={image_path} style={styles.photo} />
    <Text style={styles.room}>{room}</Text>
    <View style={styles.container_text}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  </View>
);

const CustomListview = ({ itemList }) => (
  <View style={styles.container2}>
    <FlatList
      data={itemList}
      renderItem={({ item }) => <CustomRow
        title={item.dateTime}
        description={item.action}
        image_path={statusToImage(item.status)}
        room={item.room}
      />}
      keyExtractor={(item, index) => index.toString()}
    />

  </View>
);

function History() {
  const [serialRoom, setSerialRoom] = useState(0);
  const [nameRoom, setNameRoom] = useState(DBulbs[0][1]);
  const changeRoomLeft = () => {
    if (serialRoom > 0) {
      idRoom = DBulbs[serialRoom - 1][0];
      setNameRoom(DBulbs[serialRoom - 1][1]);
      setSerialRoom(serialRoom - 1);

      DListhistory = Object.entries(DListRoomOfUser.map(item => item[1])[DListIdRoom.indexOf(idRoom)].listUserHistory).map(item => item[1]);
      //----------------------------------------------------------------------------------------------------
      listSystemHistory = Object.entries(DSystemHistory[DListIdRoom.indexOf(idRoom)]).map(item => item[1]);
      arrayDate.length = 0;
      arrayLevelLight.length = 0;
      for (var sys of listSystemHistory) {
        arrayDate.push(sys.dateTime);
      }
      for (var sys of listSystemHistory) {
        arrayLevelLight.push(sys.levelLight);
      }
      data = {
        labels: arrayDate,
        datasets: [
          {
            data: arrayLevelLight
          }
        ]
      };
    }
  };
  const changeRoomRight = () => {
    if (serialRoom < (DBulbs.length - 1)) {
      idRoom = DBulbs[serialRoom + 1][0];
      setNameRoom(DBulbs[serialRoom + 1][1]);
      setSerialRoom(serialRoom + 1);

      DListhistory = Object.entries(DListRoomOfUser.map(item => item[1])[DListIdRoom.indexOf(idRoom)].listUserHistory).map(item => item[1]);
      //------------------------------------------------
      listSystemHistory = Object.entries(DSystemHistory[DListIdRoom.indexOf(idRoom)]).map(item => item[1]);
      arrayDate.length = 0;
      arrayLevelLight.length = 0;

      for (var sys of listSystemHistory) {
        arrayDate.push(sys.dateTime);
      }
      for (var sys of listSystemHistory) {
        arrayLevelLight.push(sys.levelLight);
      }
      data = {
        labels: arrayDate,
        datasets: [
          {
            data: arrayLevelLight
          }
        ]
      };
      // for(var sys of arrayLevelLight){
      //   console.log(sys);
      // }
      //console.log(data);
    }
  };
  return (
    <View style={styles.container}>

      <View style={styles.header1}>
        <TouchableOpacity
          // onPress={() => setToogle(!toogle)}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#e7e6e6',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            marginStart: 170
          }}>
          <Image
            source={require('./assets/refresh.png')}
            resizeMode='contain'
            style={{ width: '50%' }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{
          width: 40,
          height: 40,
          backgroundColor: '#e7e6e6',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          marginStart: 10
        }}>
          <Image
            source={require('./assets/notifi.png')}
            resizeMode='contain'
            style={{ width: '40%' }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            roomDataOfUser = [];
            DBulbs = [];
            DSchedules = [];
            DListRoomOfUser = [];
            DListhistory = [];
            DListIdRoom = [];
            idRoom = [];
            DSystemHistory = [];
            listSystemHistory = [];
            arrayDate = [];
            arrayLevelLight = [];
            navi.navigate('Home');
          }}
          style={{
            width: 40,
            height: 40,
            backgroundColor: '#e7e6e6',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
            marginStart: 10
          }}>
          <Image
            source={require('./assets/logout.png')}
            resizeMode='contain'
            style={{ width: '50%' }}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={require('./assets/manageHistory.png')}
        resizeMode='contain'
        style={{ width: '70%' }}
      />

      <Text style={styles.titleName}>statistics</Text>
      <BarChart
        style={styleBarChart}
        data={data}
        width={screenWidth * 0.9}
        height={160}
        //yAxisSuffix="%"
        chartConfig={chartConfig}
      />
      <Text style={styles.titleName}>tasks</Text>
      <Text style={{ fontSize: 10 }}></Text>

      <View style={{
        height: 110
      }}>
        <CustomListview style={styles.customList}
          itemList={DListhistory}
        />
      </View>
      {/* <View style={styles.changeHistory}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'gray'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'gray'} size={30} />
        </TouchableOpacity>
      </View> */}

      <View style={{
        marginTop: 8,
        marginStart: -15,
        marginBottom: 0,
        width: 400,
        height: 65,
        alignItems: 'center',
        // justifyContent: 'center',
        marginStart: 50,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
      }}>
        <TouchableOpacity
          onPress={changeRoomLeft}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-left-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 25, fontFamily: 'google-bold', color: '#404040' }}

        > {nameRoom} </Text>
        <TouchableOpacity
          onPress={changeRoomRight}
          style={styles.btnleftright}
        >
          <MaterialCommunityIcons name="arrow-right-drop-circle" color={'#808080'} size={30} />
        </TouchableOpacity>
      </View>

    </View>
  );
}


function stackHistoryScreen() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="History Management"
        component={History}
        options={{
          // headerTitle: () => (
          //   <Text style={{ fontSize: 18, color: '#6E6E6E' }}> <Text style={{ fontFamily: 'google-bold', color: '#404040', fontSize: 20 }}>History </Text> Management</Text>
          // ),
          // headerStyle: {
          //   backgroundColor: '#f5f5f5',
          // },
          // headerRight: () => (

          //   <HeaderButtons>
          //     <TouchableOpacity style={styles.touchable}>
          //       <Image
          //         source={require('./assets/notifi.png')}
          //         style={styles.notification} />
          //     </TouchableOpacity>
          //     <TouchableOpacity style={styles.touchable}>
          //       <Image
          //         source={require('./assets/back.png')}
          //         style={styles.logout} />
          //     </TouchableOpacity>
          //   </HeaderButtons>
          // ),
        }}
      />
    </Stack.Navigator>
  );
}

//---------------------------------------------Tabs for room, account and history------------------------------------------------------------
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="MainScreen"
      tabBarOptions={{
        style: {
          height: '8%',
          backgroundColor: 'white',
        },
        activeTintColor: '#F4A05C',
        tabStyle: {
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelStyle: {
          fontFamily: 'google-bold',
          fontSize: 15,
          margin: 0,
          padding: 0,
        },

      }}
    >
      <Tab.Screen
        name="MainScreen"
        component={StackMain}
        options={{
          tabBarLabel: 'home',
          backgroundColor: '#F5F5F5',
        }}
      />
      <Tab.Screen
        name="Room"
        component={stackRoomScreen}
        options={{
          tabBarLabel: 'rooms',
          backgroundColor: '#f5f5f5',
        }}
      />
      <Tab.Screen
        name="Account"
        component={stackAccountScreen}
        options={{
          tabBarLabel: 'account',
          backgroundColor: '#F5F5F5',
        }}
      />
      <Tab.Screen
        name="History"
        component={stackHistoryScreen}
        options={{
          tabBarLabel: 'history',
          backgroundColor: '#F5F5F5',

        }}
      />
    </Tab.Navigator>
  );
}

//=======================================Function to export=========================================

const getFonts = () => Font.loadAsync({
  'google-bold': require('./assets/font/ProductSans-Black.ttf'),
});

const setNavi = (naviParam) => {
  navi = naviParam;
}

export default function ManagementView({ navigation }) {

  const [fontLoaded, setFontLoaded] = useState(false);
  setNavi(navigation);
  ReadUserData(navigation.getParam('root'));

  if (fontLoaded) {
    return (
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontLoaded(true)}
      />
    )
  }

}

//=========================================Styles===========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    // height: '100%',
    backgroundColor: '#f5f5f5',
    paddingStart: '5%',
  },
  touchable: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#E7E6E6',
    margin: 6,
    paddingLeft: '4%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notification: {
    width: 20,
    height: 20,
  },
  logout: {
    width: 20,
    height: 20,
  },
  // for account
  avatar: {
    // position: 'absolute',
    // top: -40,
    resizeMode: 'contain',
    alignItems: 'center',
    alignSelf: 'center'
    // width: '50%',
  },
  input: {
    flex: 1,
    paddingLeft: 20,
    width: '100%',
    height: 45,
  },
  info: {
    // position: 'absolute',
    // top: '20%',
    height: 45,
    width: '100%',
    // padding: 10,
  },
  buttonSave: {
    // top: '85%',
    width: '30%',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4a05b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 16,
    borderColor: '#f4a05b',
    textAlign: 'left',
    backgroundColor: '#e7e6e6',
    margin: '5%',
    paddingTop: 5,
    paddingBottom: 10,
  },
  icon: {
    paddingTop: 0,
    marginLeft: 25,
  },

  //for list history
  titleName: {
    fontSize: 17,
    fontFamily: 'google-bold',
    textAlign: 'left',
    paddingTop: '3%',
    paddingRight: '70%',
    color: '#404040'
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    //borderRadius: 5,
    backgroundColor: '#f5f5f5',
    //elevation: 2,
    width: '100%',
    height: '40%'
  },
  title: {
    fontSize: 14,
    color: '#404040',
    fontFamily: 'google-bold'
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 120,
    borderBottomLeftRadius: 120,
    paddingLeft: '12%',
    paddingBottom: 12,
    paddingTop: 12,

  },
  description: {
    fontFamily: 'google-bold',
    color: '#808080',
    fontSize: 12,
  },
  photo: {
    marginTop: '4%',
    height: 20,
    width: 20,
  },
  container2: {
    flex: 1,
    width: 340,
    height: 150,
  },
  customList: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    height: '40%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  room: {
    fontFamily: 'google-bold',
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: '5%',
    fontSize: 14,
    color: '#404040',
  },
  boxTwo0: {
    padding: 20,
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonschedule: {
    marginTop: 20,
    width: 50,
    height: 50,
    backgroundColor: '#F4A05B',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonrightheader: {
    width: '30%',
    backgroundColor: '#E7E6E6',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleR: {
    marginTop: 10,
  },
  titleC: {
    marginTop: '5%',
  },
  transroom: {
    marginTop: 20,
    marginStart: -15,
    marginBottom: 0,
    width: 400,
    height: 65,
    alignItems: 'center',
    // justifyContent: 'center',
    marginStart: 50,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  btnleftright: {
    width: '15%',
    height: '40%',
    backgroundColor: '#E7E6E6',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  ItemDevice: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    marginVertical: '3%',
    marginHorizontal: '2%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ItemDevicesList: {
    flex: 1,
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  Viewdevice: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    // marginBottom: 0,
    width: '100%',
    height: '40%',
    // backgroundColor : 'white',
  },

  //---------------------------------
  changeHistory: {
    paddingTop: 30,
    marginTop: '2%',
    marginBottom: 0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 60,
  },
  header1: {
    flexDirection: 'row',
    width: 320,
    height: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOne: {
    // flex: 1,
    width: 320,
    height: 190,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingStart: 10
    // alignItems: 'center',

  },
  boxOne1: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingStart: 10,
    alignItems: 'center',

  },
  gridFlat: {
    marginStart: 0
  },
  // boxOne: {
  //   flex: 1,
  //   backgroundColor: '#f5f5f5',
  //   paddingTop: 20,
  //   alignItems: 'center'
  // },
  boxTwo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7e6e6',
    height: 45,
    width: '100%',
    borderRadius: 30,
    margin: 10
  },
  textTitle: {
    fontFamily: 'google-bold',
    fontSize: 26,
    color: '#404040'
  },
  textInput: {
    flex: 1,
    fontFamily: 'google-bold',
    fontSize: 14,
    color: '#404040',
  },
  imageStyle: {
    padding: 10,
    margin: 15,
    height: 20,
    width: 20,
    resizeMode: 'contain',
    alignItems: 'center'
  },
});

