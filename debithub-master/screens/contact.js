
import { Text, StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native'
import React, {useState, useEffect} from 'react'
import { Linking } from 'react-native'

import Loader from './loading';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Contact() {
    const [dark, setDark]=useState(false);
    const [feedback, setFeedback]=useState("");
    const [loading, setLoading]=useState(false);

    useEffect(()=>{
        async function getDark(){
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                setDark(JSON.parse(read));
            }
        }
        getDark();
    });

    function styles(){
        if(dark){
            return stylesDark;
        }
        return stylesLight;
    }

    async function sendFeedback(){
        setLoading(true);
        const subscriber=await firestore()
        .collection('Admin').doc('Feedback').get().then(doc=>{
            const data=doc.data();
            const fd=data.Feedback;
            fd.push({Complaint:feedback, User:auth().currentUser.email});
            const userDocument=firestore().collection('Admin').doc('Feedback')
            .set({
                Feedback:fd
            }).then(setLoading(false));
        });
        setLoading(false);

    }

    return(
        <KeyboardAvoidingView
            style={{flexGrow:1}}
            behavior='height'
            keyboardVerticalOffset={10}
        >
        <View style={{flex:1}}>
            <View style={styles().top}>
            <Loader animating={loading} />
                <Text style={[styles().text, {fontWeight:'bold', fontSize:25}]}>Feedback/Complaint</Text>
                <TextInput
                    placeholder="Write to us..."
                    style={styles().input}
                    textAlignVertical="top"
                    multiline={true}
                    placeholderTextColor={dark?"white":"black"}
                    onChangeText={setFeedback}
                >
                </TextInput>
                <TouchableOpacity
                    onPress={sendFeedback}
                    style={styles().btn}
                >
                    <Text style={[styles().text, {fontWeight:'bold', fontSize:18}, !dark?{color:'white'}:{}]}>Submit</Text>
                </TouchableOpacity>
            </View>
            <View style={styles().bottom}>
                <Text style={[styles().text, dark?{color:'#841851'}:{color:'#801818'}, {textAlign:'center'}]}>We will try to get back to you as soon as possible. Please keep checking your notifications.</Text>
                <View style={{position:'absolute', bottom:4}}>
                    <Text style={[styles().text, {textAlign:'center', fontWeight:'bold'}]}>Contact Us</Text>
                    <TouchableOpacity
                        onPress={()=>Linking.openURL('mailto:support@dhl.com')}
                    >
                        <Text style={[styles().text, {textAlign:'center', fontSize:14}]}>support@dhl.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>Linking.openURL('tel:${111345345}')}
                    >
                        <Text style={[styles().text, {textAlign:'center', fontSize:14}]}>111-345-345</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </KeyboardAvoidingView>
    )
}

const stylesDark=StyleSheet.create({
    top:{
        justifyContent:'center',
        alignItems:'center',
        flex:8,
        backgroundColor:'#1e2127',
    },
    bottom:{
        flex:4,
        backgroundColor:'#1e2127',
        alignItems:'center',
    },
    text:{
        fontSize:20,
        color:'silver',
    },
    input:{
        width:'80%',
        height:'50%',
        borderWidth:5,
        borderRadius:15,
        borderColor:'#841851',
        backgroundColor:'#2e3137',
        justifyContent:"space-between",
        color:'silver',
        marginVertical:10,
        padding:15,
    },
    btn:{
        backgroundColor:'#841851',
        borderRadius:12,
        alignItems:'center',
        width:'40%',
        padding:10,
    }
});

const stylesLight=StyleSheet.create({
    top:{
        justifyContent:'center',
        alignItems:'center',
        flex:8,
        backgroundColor:'#d8cfc4',
    },
    bottom:{
        flex:4,
        backgroundColor:'#d8cfc4',
        alignItems:'center',
    },
    text:{
        fontSize:20,
        color:'black',
    },
    input:{
        width:'80%',
        height:'50%',
        borderWidth:5,
        borderRadius:15,
        borderColor:'#801818',
        backgroundColor:'#978282',
        justifyContent:"space-between",
        color:'black',
        marginVertical:10,
        padding:15,
    },
    btn:{
        backgroundColor:'#801818',
        borderRadius:12,
        alignItems:'center',
        width:'40%',
        padding:10,
    }
});