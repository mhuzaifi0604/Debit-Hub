import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {styles} from '../Styles/StyleSheet';
import {Formik} from 'formik';

export default function Form() {
    return (
        <View>
            <Formik
                initialValues={{Username: '', Password: ''}}
                onSubmit={(values) => {

                }}
             >
                {(properties) => (
                  <View>
                      <Text style={{color: 'white', marginLeft: 20, fontSize: 18}}>Username:</Text>
                      <TextInput 
                      style={styles.denyinputs}
                      placeholder= "e.g Huzaifi0604"
                      placeholderTextColor='white'
                      onChangeText={properties.handleChange('Username')}
                      value={properties.values.Username}
                      />

                      <Text style={{color: 'white', marginLeft: 20, fontSize: 18}}>Your Password:</Text>
                      <TextInput 
                      style={styles.denyinputs}
                      placeholder= "e.g 123456"
                      placeholderTextColor='white'
                      onChangeText={properties.handleChange('Password')}
                      value={properties.values.Password}
                      />
                      <TouchableOpacity
                      style={styles.Touchables}
                      onPress={() => properties.handleSubmit()}
                      >
                          <Text style={{color: 'white', textAlign: 'center',fontWeight: 'bold', fontSize: 15}}>Deny Rights</Text>
                      </TouchableOpacity>
                </View>
            )}
        </Formik>
        </View>
        
    );
}