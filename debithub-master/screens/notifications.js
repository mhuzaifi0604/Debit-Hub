// importing components from react native
import React, {useState, useEffect} from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,

} from 'react-native';

// importing libraries for different features
import GestureRecognizer from 'react-native-swipe-gestures';
import { FloatingMenu } from 'react-native-floating-action-menu';
// importing libraries for the firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from './loading'
//Main function for notifications a customer gets
export default function Notifications({navigation}){
    // decalring and setting constants
    const [which, setWhich]=useState("All");
    
    const [all, setAll]=useState([]);
     // setting tyoes of notifications in constants
    const [notifications, setNotifications]=useState([]);
    const [feedback, setFeedback]=useState([]);
    const [promo, setPromo]=useState([]);

    const [open, setOpen]=useState(false);

    const [loading, setLoading]=useState(false);

    const [dark, setDark]=useState(false);

    useEffect(()=>{
        // function for getting dark mode
        async function getDark(){
            // waiting for the firebase to fetch dark mode
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                // setting app to dark mode
                setDark(JSON.parse(read));
            }
        }
        getDark();
    });
    // function for getting data from the database
    async function getData(){
        // setting arrays for type of notifications
        const temp=[];
        const temp2=[];
        const temp3=[];
        const tAll=[];
        // waiting for firestore to fetc data
        const subscriber=await firestore()
        // getting data from notifications collection from the database
        .collection('Admin').doc('Notifications').get().then(doc=>{
            const data=doc.data();
            // getting notifiacations length
            const length=data.notifications.length;
            let j=0;
            for(let i=0; i<length; i++){
                // pushing user input in the database
                temp.push({key:i, data:data.notifications[i], type:'Bank'});
                tAll.push({key:j, data:data.notifications[i], type:'Bank'});
                j++;
            }
            // gettin promo notifications length
            const length2=data.Promotions.length;
            for(let i=0; i<length2; i++){
                // pushing promos into the database
                temp2.push({key:i, data:data.Promotions[i], type:'Promotions'});
                tAll.push({key:j, data:data.Promotions[i], type:'Promotions'});
                j++;
            }
            // getting feedback notificarions' length
            const length3=data.Feedback.length;
            for(let i=0; i<length3; i++){
                // checking if email exists in the database
                if(data.Feedback[i].user===auth().currentUser.email){
                    // pushing notificatioons for feedback into the database
                    temp3.push({key:i, question:data.Feedback[i].Question, answer:data.Feedback[i].Answer, type:'Feedback'});
                    tAll.push({key:j, question:data.Feedback[i].Question, answer:data.Feedback[i].Answer, type:'Feedback'});
                    j++;
                }
            }
        });
        // setting loaders, notifications, promos and feedbacks
        setLoading(false);
        setNotifications(temp);
        setPromo(temp2);
        setFeedback(temp3);
        setAll(tAll);
    }

    useEffect(()=>{
        // setting loader and getting data
        setLoading(true);
        
        getData();
    }, []);
        // function for getting dark and light mode
    function styles(){
        if(dark){
            return stylesDark;
        }
        return stylesLight;
    }
    // function for handing notifications type
    function handleToggle(item, index){
        //checking notes types
        index===0?setWhich('Promotions'):index===1?setWhich('Feedback'):index===2?setWhich('Bank'):setWhich('All');
        setOpen(false);
    }

    const items=[
        // creatig arrays for types of notifications
        {label:'All'},
        {label:'Bank'},
        {label:'Feedback'},
        {label:'Promotions'},
    ]

    return(
        // gesture rtecognizer for swipe down function
        <GestureRecognizer                   
            onSwipeDown={(e)=>{
                // setting loader and getting data
                setLoading(true);
                getData();
            }}
            style={{flex:1}}
        >
            {/* setting style for the view of notification */}
            <View style={[{flex:1, justifyContent:'center', alignItems:'center'}, styles().container]}>
                <View style={{flex:1, width:'100%'}}>
                    <FlatList
                    // style for flatlist
                        contentContainerStyle={{paddingHorizontal:10,}}
                        // setting notification type
                        data={which=='All'?all:which=='Bank'?notifications:which=='Feedback'?feedback:promo}
                        // renderimg items in the flatlist
                        renderItem={({item})=>
                            {
                                // checking question property in the database
                                if(!item.hasOwnProperty('question')){
                                    return(
                                        <View style={[styles().item, {width:'100%'}]}>
                                            {/*gertting item data from the daabase */}
                                            <Text style={[styles().text, {fontWeight:'normal'}]}>{item.data}</Text>
                                        </View>
                                    );
                                }else{
                                    return(
                                        <View style={[styles().item, {width:'100%'}]}>
                                            {/* getting notifications reply and associated email address */}
                                            <Text style={[styles().text, {fontWeight:'bold'}]}>You: {item.question}</Text>
                                            <Text style={[styles().text, {fontWeight:'normal'}]}>{item.answer}</Text>
                                        </View>
                                    );
                                }
                            }
                        }
                    />
                </View>
                {/* opening loader */}
                <Loader animating={loading} />
            </View>
            {/* floating menu for notifications tab */}
            <FloatingMenu
            // style for floating menu
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
        </GestureRecognizer>
    );
}

// creating stylesheet for different features
const stylesLight=StyleSheet.create({
    // style for container in the dark mode
    container:{
        backgroundColor:'#d8cfc4',
        flex:1
    },
    // style for items in the mode mode
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
    // style for texts in the dark mode
    text:{
        fontSize:20,
        color:'#d8cfc4',
        flex:10
    }
})
const stylesDark=StyleSheet.create({
    // style for container in the light mode
    container:{
        backgroundColor:'#1e2127',
        flex:1
    },
    // style for items in the light mode
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
    // style for text in the light mode
    text:{
        fontSize:20,
        color:'silver'
    }
})