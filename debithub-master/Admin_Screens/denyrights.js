import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  ScrollView
} from 'react-native';

import {styles} from '../Styles/StyleSheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FormItem } from 'react-native-form-component';
import { Picker } from 'react-native-form-component';
import { red } from 'react-native-reanimated/src/reanimated2/Colors';
import { color } from 'react-native-reanimated';

export default function Denyrights({navigation}){
  const options = [
    {id: 1, label: "Football"},
    {id: 2, label: "Basketball"},
    {id: 3, label: "Volleyball"},
    {id: 4, label: "Handball"},
  ];
    const [name, setname] = useState("");
    const [password, setpassword] = useState("");
    const [selected, setselected] = useState('first');
    const [number, setNumber] = useState(1);
    const [nameerror, setnameerror]= useState("");

    return(
       <LinearGradient colors={['#780206','#061161']} style={{flex: 1, justifyContent: 'center'}}>
           {/*<View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={styles.header}>Deny Rights</Text>
    </View>*/}
           <View style={{flex: 7, justifyContent: 'center'}}>
              <FormItem
                label="Username:  "
                style={{marginLeft: 20, marginRight: 20, backgroundColor: 'transparent'}}
                labelStyle={{marginLeft: 20, color: 'white', fontSize: 18,}}
                textInputStyle={styles.textinputstyles}
                isRequired
                placeholder='e.g huzaifi0604'
                value={name}
                onChangeText={(name) => setname(name)}
                errorBorderColor= 'red'
                asterik
              />

                <Picker
                  items={[
                    { label: "User tried to access Someone's account", value: 1 },
                    { label: "User is Involved in Malicious Activity", value: 2 },
                    { label: "User hasn't payed his Account Dues", value: 3 },
                    { label: "User has Deactivated his Account ", value: 4 }
                  ]}
                  label="Reason:  "
                  asterik
                  labelStyle= {{marginLeft: 20, color: 'white', fontSize: 18,}}
                  selectedValueStyle={{color: 'red', fontWeight: 'bold', fontSize: 16}}
                  iconWrapperStyle= 'right'
                  buttonStyle={styles.pickerstyle}
                  selectedValue={number}
                  onSelection={(item) => setNumber(item.value)}
                  
                />
                <FormItem
                label="Password:  "
                style={{marginLeft: 20, marginRight: 20, backgroundColor: 'transparent'}}
                labelStyle={{marginLeft: 20, color: 'white', fontSize: 18,}}
                textInputStyle={styles.textinputstyles}
                placeholder="e.g huzaifa0604"
                isRequired
                value={password}
                onChangeText={(password) => setpassword(password)}
                errorBorderColor= 'red'
                asterik
              />
                <Text style={{color: 'white', marginLeft: 21, fontSize: 20, fontWeight: 'bold'}}>Others: </Text>
                <TextInput
                multiline 
                style={[styles.multilineinput]}
                placeholder= "Enter if you reasons above were not sufficient"
                placeholderTextColor='white'
                //onChangeText={(val) => setusername(val)}
                />
           </View>
           <View style={{flexDirection: 'row'}}>  
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#780206'}}>
                  
                  <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                      <Icon name="home" size={30} color="#fff"/>
                      <Text style= {{textAlign: 'center', color: 'white'}}>Home</Text>
                  </TouchableOpacity>
                
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#780206'}}>
                
                  <TouchableOpacity onPress={() => Alert.alert("Button Pressed")}>
                    <Icon name="gear" size={30} color="#fff" />
                    <Text style= {{textAlign: 'center', color: 'white'}}>Settings</Text>
                  </TouchableOpacity>
                
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#780206'}}>
                
                  <TouchableOpacity onPress={() => Alert.alert("Button Pressed")}>
                    <Icon name="bars" size={30} color="#fff"/>
                    <Text style= {{textAlign: 'center', color: 'white'}}>Menu</Text>
                  </TouchableOpacity>
                  
                </View>
                
                <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: '#780206'}}>
                
                  <TouchableOpacity onPress={() => navigation.navigate('Starting Page')}>
                    <Icon name="sign-out" size={30} color="#fff"/>
                    <Text style= {{color: 'white'}}>Logout</Text>
                  </TouchableOpacity>
                  
                </View>
              </View>
       </LinearGradient>
    );
}