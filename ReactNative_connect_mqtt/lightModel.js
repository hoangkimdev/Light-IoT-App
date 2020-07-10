// const { database } = require('firebase');
var FirebaseDatabase = require('./index');
var database = FirebaseDatabase.database;



function lightModel(obj) {
    
    var ref = database.ref('sensors/').push().set({
        device_id: obj.device_id,
        value: obj.values
    });
    
    // function writeSensorData(obj) {

    //     //var sensorRef = ref.push();

    //     //var sensorRefKey = sensorRef.key;

    //     //console.log(sensorRefKey);

    //     ref.push().set({
    //         device_id: obj.device_id,
    //         value: obj.values
    //     });
    // }
    
    // writeSensorData(obj);
}

module.exports = { lightModel };