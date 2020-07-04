import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Alert, Modal, FlatList, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import DropDownItem from 'react-native-drop-down-item';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import uuid from 'react-native-uuid';
import { set } from 'react-native-reanimated';

const getFonts = () => Font.loadAsync({
    'google-bold': require('./assets/font/ProductSans-Black.ttf'),
});

export default function AddDeviceRoom({ navigation }) {

    const [fontLoaded, setFontLoaded] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [toogle, setToogle] = useState('false');
    const [bulbsName, setBulbsName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [sensorID, setSensorID] = useState('');

    useEffect(() => {
        firebase.database().ref('/listRooms').once('value', (snap) => {
            if (snap.val() != null) {
                setRooms(Object.entries(snap.val()).map(item => item[1].roomsName));
            }
        });
    }, []);

    const [resBulb, setResBulb] = useState([]);

    const addRoomData = (roomNameParam, sensorIDParam, id) => {
        // let id = uuid.v4();
        firebase.database().ref('/listRooms/' + id).set({
            levelLight: '5',
            lightSensorID: sensorIDParam,
            roomsID: id,
            roomsName: roomNameParam

        });
    };

    const addBulbData = (bulbsNameParam, node) => {
        let id = uuid.v1();
        firebase.database().ref('/listRooms/' + node + '/listBulbs/' + id).set({
            bulbsID: id,
            bulbsName: bulbsNameParam,
            status: false
        })
    }

    if (fontLoaded) {
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    onPress={() => navigation.navigate('ManageDevice')}
                >
                    <Image
                        source={require('./assets/back.png')}
                        resizeMode='contain'
                        style={{ width: '7%' }}
                    />
                </TouchableOpacity>

                <View style={styles.boxTwo}>
                    <Text
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#404040'
                        }}
                    >Room informations</Text>
                </View>

                <View style={styles.boxThree}>
                    <TextInput
                        keyboardType={'numbers-and-punctuation'}
                        placeholder={'Room name'}
                        style={styles.textInput}
                        onChangeText={(val) => setRoomName(val)}
                    />
                    <TextInput
                        keyboardType={'decimal-pad'}
                        placeholder={'Sensor ID'}
                        style={styles.textInput}
                        onChangeText={(val) => setSensorID(val)}
                    />
                </View>

                <Text style={{ fontSize: 10 }}></Text>

                <View style={styles.boxTwo}>
                    <Text
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#404040'
                        }}
                    >Device informations</Text>
                </View>

                <View style={styles.boxThree}>
                    <TextInput
                        keyboardType={'decimal-pad'}
                        placeholder={'Bulb name'}
                        onChangeText={(val) => setBulbsName(val)}
                        value={bulbsName}
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            width: 300,
                            height: 45,
                            backgroundColor: '#e7e6e6',
                            borderRadius: 12,
                            color: '#404040',
                            textAlign: 'center',
                            margin: 10
                        }}
                    />
                </View>

                <View style={styles.boxThree}>
                    <TouchableOpacity
                        onPress={() => {
                            if (bulbsName != '' && !resBulb.includes('B' + bulbsName)) {
                                let tmp = resBulb;
                                tmp.push('B' + bulbsName);
                                setResBulb(tmp);
                                setToogle(!toogle);
                                setBulbsName('');
                            }

                        }}
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            width: 300,
                            height: 45,
                            backgroundColor: '#f4a05b',
                            borderRadius: 12,
                            color: '#404040',
                            textAlign: 'center',
                            margin: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#f5f5f5'
                        }}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.boxOne]}>
                    <FlatGrid
                        itemDimension={60}
                        data={(toogle) ? resBulb : resBulb}
                        style={styles.gridFlat}
                        // staticDimension={300}
                        // fixed
                        spacing={10}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity
                                    style={styles.on}
                                >
                                    <Image
                                        source={require('./assets/bulb.png')}
                                        style={{
                                            resizeMode: 'contain',
                                            width: 30,
                                            height: 30,
                                            justifyContent: 'center',
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'google-bold',
                                            fontSize: 11,
                                            color: '#808080'
                                        }}
                                    >{item}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.boxThree}>
                    <TouchableOpacity
                        onPress={() => {
                            if (roomName == '' || sensorID == '') Alert.alert('OOPS', 'Enter your room name and sensor id');
                            else {
                                let id = uuid.v4();
                                addRoomData(roomName, 'S' + sensorID, id);
                                resBulb.map(item => addBulbData(item, id));
                                navigation.navigate('ManageDevice')
                            }
                        }}
                        style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            width: 300,
                            height: 45,
                            backgroundColor: '#f4a05b',
                            borderRadius: 12,
                            color: '#404040',
                            textAlign: 'center',
                            margin: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{
                            fontFamily: 'google-bold',
                            fontSize: 20,
                            color: '#f5f5f5'
                        }}>Save</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    } else {
        return (
            <AppLoading
                startAsync={getFonts}
                onFinish={() => setFontLoaded(true)}
            />
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 40,
        paddingLeft: '5%'
    },
    boxOne: {
        // flex: 1,
        width: 320,
        height: 150,
        backgroundColor: '#f5f5f5',
        // paddingTop: 30,

    },
    boxTwo: {
        padding: 20,
        width: '100%',
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxThree: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        alignItems: 'center'
    },
    textInput: {
        fontFamily: 'google-bold',
        fontSize: 20,
        width: 140,
        height: 45,
        backgroundColor: '#e7e6e6',
        borderRadius: 15,
        color: '#404040',
        textAlign: 'center',
        margin: 10
    },
    on: {
        flex: 1,
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gridFlat: {
        marginStart: 0
    },
})