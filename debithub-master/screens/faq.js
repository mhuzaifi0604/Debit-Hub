
// importing components form react and react native
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'

// importing libraries for database and authentication
import AsyncStorage from '@react-native-async-storage/async-storage';

// main function for FAQs
export default function Faq() {
    // setting and declaring constants 
    const [dark, setDark]=useState(false);

    useEffect(()=>{
        // function fir getting dark mode
        async function getDark(){
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                // setting dark mode
                setDark(JSON.parse(read));
            }
        }
        getDark();
    });
    // function for setting styles and dark and light mode
    function styles(){
        if(dark){
            return stylesDark;
        }
        return stylesLight;
    }
    // array for questions and answers for FAQs
    const [FAQs,setFAQs]=useState([
        { question: 'Are there any charges for using DebitHub Mobile App?',answer:'No, The App can be downloaded for free.',key:'1'},
        { question: 'How do i register for this app?',answer:'User can register using their email and password.',key:'2'},
        { question: 'Is my password saved on device?',answer:'No, your password is never saved on device.',key:'3'},
        { question: 'What should I do if I forget my password?',answer:'You can simply click the "Reset" option on the login screen.',key:'4'},
        { question: 'Is the app safe to use?',answer:'Yes, your information is never stored on your mobile phone and your password is never exposed. ',key:'5'},
        { question: 'Is there a limit?',answer:'No, there is no limit for your digital account.\nHowever, all transactions are monitored by FBR.',key:'6'},
        { question: 'Why does the app ask for permissions to access local storage?',answer:'The app needs permissions to access local storage if you want to download your account statement as PDF.',key:'7'},
        { question: 'Is there a physical branch for DebitHub',answer:'No, DebitHub has little to no carbon footprint and fully operates online.',key:'8'},
    ]);
    // constants for hidden content
    const [hidden, setHidden]=useState([false, false, false, false, false, false, false, false, false]);
    // function for toggling keys fo hidden content
    function toggleAns(key){
        // slicing the content in hidden and in view content
        let x=hidden.slice();
        x[key-1]=!x[key-1];
        setHidden(x);
    }

  return (
      // setting styles === container
    <View style={styles().container}>
        <FlatList
        // setting flatlists data === FAQs array
            data={FAQs}
            // rendering items into the flat list
            renderItem={({ item }) => (
            <View style={styles().item}>
                <View style = {{flex:1,flexDirection:'row'}} >
                    <Text style={[styles().text, {fontWeight:'normal'}]}>Q. {item.question}</Text>  
                    {/* icon toggler for checking hidden content */}
                    <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns(item.key)}>
                        <Text style={[{fontSize:25,fontWeight:'bold'}, dark?{color:'#841851'}:{color:'#801818'}]}>{!hidden[item.key-1]?"\u{25BC}":"\u{25B2}"}</Text>
                    </TouchableOpacity>
                </View>
                {/* hiddencontent in a singlr item of the flatlist */}
                {hidden[item.key-1]?<Text style={[{fontSize:20},dark?{color:'#841851'}:{color:'#801818'}]}>{item.answer}</Text>:<></>}
            </View>        
            )}
        />   
    </View>
  )
}

// creatring stylesheet for differetn features on the screen
const stylesLight=StyleSheet.create({
    // styles for container or say whole present screen
    container:{
        backgroundColor:'#d8cfc4',
        flex:1
    },
    // styles for items in the dark mode
    item:{
        paddingVertical:15,
        borderBottomWidth:1.5,
        borderTopWidth:0,
        borderColor:'#801818',
        paddingHorizontal:10
    },
    // styles for texts in the dark mode
    text:{
        fontSize:20,
        color:'black',
        flex:10
    }
})
const stylesDark=StyleSheet.create({
    // styles for container in the lightmode
    container:{
        backgroundColor:'#1e2127',
        flex:1
    },
    // styles for items in the light mode
    item:{
        paddingVertical:15,
        borderBottomWidth:1.5,
        borderTopWidth:0,
        borderColor:'#801818',
        paddingHorizontal:10
    },
    // styles for texts in the light mode
    text:{
        fontSize:20,
        color:'silver',
        flex:10
    }
})