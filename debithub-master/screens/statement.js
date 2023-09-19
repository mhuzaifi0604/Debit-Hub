// Importing components from react native
import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,

} from 'react-native';
// Importing libraries from react native
import GestureRecognizer from 'react-native-swipe-gestures';
import { FloatingMenu } from 'react-native-floating-action-menu';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from './loading'
// imported screens from admin screens an screens folder

// Main function for stements of customers
export default function Statement() {
    // setting all constants
    const [dark, setDark]=useState(false);
    const [all, setAll]=useState([]);
    const [sent, setSent]=useState([]);
    const [recieved, setRecieved]=useState([]);
    const [which, setWhich]=useState('');
    const [open, setOpen]=useState(false);
    const [loading, setLoading]=useState(false);
    // Use effect function for setting and waiting for light and darkmode
    useEffect(()=>{
        async function getDark(){
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                setDark(JSON.parse(read));
            }
        }
        getDark();
    });

    // Function for getting data for statements of customer
    async function getData(){
        // setting arrays for data of statements
        const temp=[];
        const temp2=[];
        const tAll=[];
        // constant declared for waiting for firestore
        const subscriber=await firestore()
        // getting account data's collection from firebase
        .collection('AccountData').doc(auth().currentUser.email).get().then(doc=>{
            const data=doc.data();
            var j=0;
            // checking if they arrray sent was empty or not
            if(data.Sent!==undefined){
                // getting length of single elemnet of array
                const length=data.Sent.length
                for(let i=0; i<length; i++){
                    // getting data of the sent array
                    temp.push({key:i, data:data.Sent[i], type:'Sent'});
                    tAll.push({key:j, data:data.Sent[i], type:'Sent'});
                    j++;
                }
            }
            // checking if they arrray sent was empty or not
            if(data.Recieved!==undefined){
                 // getting length of single elemnet of array
                const length2=data.Recieved.length;

                for(let i=0; i<length2; i++){
                    // getting data of the sent array
                    temp2.push({key:i, data:data.Recieved[i], type:'Received'});
                    tAll.push({key:j, data:data.Recieved[i], type:'Received'});
                    j++;
                }
            }
        });
        // setting lading icon on fetching data from database
        setLoading(false);
        // setting sent and recieved arrays
        setSent(temp);
        setRecieved(temp2);
       // console.log(recieved);
        setAll(tAll);
    }

    useEffect(()=>{
        //setting loading and getting data
        setLoading(true);
        
        getData();
    }, []);

    // settings for dark and light styles
    function styles(){
        if(dark){
            return stylesDark;
        }
        return stylesLight;
    }
    function handleToggle(item, index){
        // setting toggle for recieved and sent arrays
        index===0?setWhich('Recieved'):index===1?setWhich('Sent'):setWhich('All');
        setOpen(false);
    }

    const items=[
        //Labels for all notificaions for a statemnet
        {label:'All'},
        {label:'Sent'},
        {label:'Recieved'},
    ]

    return(
        // gesture recognizer for swipping down feature
        <GestureRecognizer                   
            onSwipeDown={(e)=>{
                // what does the app do on swipr down
                // app should get data and set loading = true during the fetch
                setLoading(true);
                getData();
            }}
            style={{flex:1}}
        >
            <View style={[{flex:1, justifyContent:'center', alignItems:'center'}, styles().container]}>
                <View style={{flex:1, width:'100%'}}>
                    <FlatList
                    // style for flatlist
                        contentContainerStyle={{paddingHorizontal:10,}}
                        //settig recieved data equals to the recieved or sent arrays
                        data={which=='All'?all:which=='Recieved'?recieved:sent}
                        // rendering single array element into the flatlist
                        renderItem={({item})=>
                            {
                                    return(
                                        // returning the data on the single element of the flatlist
                                        <View style={[styles().item, {width:'100%'}]}>
                                            <Text style={[styles().text, {fontWeight:'bold',textAlign:'right'}]}>{item.data.Date}</Text>
                                            <Text style={[styles().text]}>{item.data.Bank}{'\n'}{item.data["Account Number"]}</Text>
                                            <Text style={[styles().text, {fontWeight:'normal'}]}>Rs.{item.data.Money}</Text>
                                            <Text style={[styles().text, {fontWeight:'bold',textAlign:'right'}]}>{item.type}</Text>
                                                                                     
                                        </View>
                                    );
                            }
                        }
                    />
                </View>
                {/* setting debit hub loader = true */}
                <Loader animating={loading} />
            </View>
            {/* declaring a floating menu  */}
            <FloatingMenu
            /* setting options for floating menu */
                isOpen={open}
                items={items}
                onMenuToggle={isMenuOpen=>setOpen(isMenuOpen)}
                onItemPress={handleToggle}
                right={15}
                bottom={15}
                backgroundUpColor={dark?'#841851':'#801818'}
                primaryColor={dark?'#fff':'#d8cfc4'}
                borderColor='transparent'
                backgroundDownColor={dark?'#841851':'#801818'}
                buttonWidth={60}
                innerWidth={60}
            />
            {/*closing gesture recognizer tab */}
        </GestureRecognizer>
    );

}

// creating a style sheet for creating styles of 
const stylesLight=StyleSheet.create({
    // styles for container or say full screen style
    container:{
        backgroundColor:'#d8cfc4',
        flex:1
    },
    // style for a single item of the flat list
    item:{
        width:'100%',
        marginTop:10,
        borderRadius:15,
        paddingVertical:15,
        backgroundColor:'#801818',
        //borderWidth:5,
        //borderColor:'#801818',
        paddingHorizontal:10
    },
    // style for the text segment
    text:{
        fontSize:20,
        color:'#d8cfc4',
        flex:10
    }
})
// styles for dark mode in the application
const stylesDark=StyleSheet.create({
    // cstyles for full screen
    container:{
        backgroundColor:'#1e2127',
        flex:1
    },
    // styles for single item of the flatlist
    item:{
        width:'100%',
        marginTop:10,
        borderRadius:15,
        paddingVertical:15,
        backgroundColor:'#841851',
        //borderWidth:5,
        //borderColor:'#801818',
        paddingHorizontal:10
    },
    // style for text in the dark mode
    text:{
        fontSize:20,
        color:'silver'
    }
})