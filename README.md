# Light-IoT-Application
@Twoteam @192 @HCMUT  

## Database - Google Firebase

listAdmins  
  * - adminID*   
  * - username  
  * - password  
  * - name  
  * - sex  
  * - phone  
  * - email  
	
listRooms  
  * - roomsID*   
  * - roomName  
  * - levelLight  
  * - lightSensorID  
  * listBulbs  
    * - bulbsID*   
    * - bulbsName  
    * - status  
    * - valueF  
    * - valueS      
  * listSchedules   
    * - schedulesID*   
    * - timeFrom  
    * - timeTo  
  * listReport  
    * - reportID*   
    * - dateTime  
    * - content  
	
listSensors  
  * - device_id  
  * - values  
  * sensorHistory   
    * [date]:  
      * -[time]: [values-of-sensor]  

listUsers  
  * - userID*   
  * - username  
  * - password  
  * - fullname  
  * - email  
  * listRooms  
    * - roomsName   
      * listUserHistory  
        * - userHistoryID*   
        * - dateTime  
        * - action  
        * - status  

## Data format

### Input_Device_Topics_Name_Format:
Device 6 -> Topic/Light  
User subcribe vào các topic input để lấy dữ liệu về xử lý. Format trả về của dữ liệu sẽ là:  
Device 6:  
[  
  {  
	"device_id": "Light",
    "values": ["200"]  
  }  
]  

### Output_Device_Topics_Name_Format:
Device 8 -> Topic/LightD  
Sau khi xử lý xong, user sẽ publish dữ liệu vào các topic ứng với các thiết bị output để điều khiển các thiết bị. Format dữ liệu gửi đến topic của các thiết bị output sẽ là:  
Device 8:  
[  
  {  
	"device_id": "LightD",  
    "values": ["1", "100"]  
  }  
]  
[  
  {   "device_id": "LightD",  
    "values": ["0", "0"]  
  }  
]  
Miền giá trị độ sáng của đèn: [0, 255]


