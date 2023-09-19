import { Modal,Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput,KeyboardAvoidingView } from 'react-native'
import React, {useState, useEffect} from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loader from './loading';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Funds() {
    const [dark, setDark]=useState(false);

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
    const [beneficiary, setBeneficiary] =useState(' ');
    const [accountNo, setAccountNo]=useState(' ');
    const [amount, setAmount]=useState(' ');
    const [error, setError]=useState(' ');
    const [toggle, setToggle]=useState(false);
    const [hidden, setHidden]=useState(false);
    const [loading, setLoading]=useState(false);

    const [modal, setModal]=useState(false);

    async function transferFunds(){
        if(beneficiary===" "||accountNo===" "||amount===" "){
            setError("Invalid Details");
            setModal(true);
            return;
        }
        setLoading(true);
        let myname;
        const subscriber=await firestore().collection("AccountData").doc(auth().currentUser.email).get()
        .then(doc=>{
            const data=doc.data();
            if(data.balance-amount<0){
                setError("Insufficient Balance");
                setModal(true);
                return;
            }
            const sent=[];
            if(data.Sent!==undefined){
                const length=data.Sent.length;
                for(let i=0; i<length; i++){
                    sent.push(data.Sent[i]);
                }
            }
            const month=new Date().getMonth()+1;
            const date=new Date().getDate();
            const year=new Date().getFullYear();
            let str=date+"/"+month+"/"+year;
            myname=data.Name;
            const obj={
                Bank:beneficiary,
                Money:parseInt(amount),
                Date:str
            }
            obj["Account Number"]=accountNo;
            sent.push(obj);
            const balance=data.balance-amount;
            const userDoc=firestore().collection("AccountData").doc(auth().currentUser.email).update({
                balance:balance,
                Sent:sent
            }).then(setError("Transaction Successful"));
        });

        if(beneficiary==="DebitHub"){
            const subscriber=firestore().collection("AccountData").doc(accountNo).get().then(doc=>{
                if(doc!==undefined){
                    const data=doc.data();
                    const recieved=[];
                    if(data.Recieved!==undefined){
                        const length=data.Recieved.length;
                        for(let i=0; i<length; i++){
                            recieved.push(data.Recieved[i]);
                        }
                    }
                    const month=new Date().getMonth()+1;
                    const date=new Date().getDate();
                    const year=new Date().getFullYear();
                    let str=date+"/"+month+"/"+year;
                    const obj={
                        Bank:beneficiary,
                        Money:parseInt(amount),
                        Name:myname,
                        Date:str
                    }
                    obj["Account Number"]=auth().currentUser.email;
                    recieved.push(obj);
                    const balance=parseInt(data.balance)+parseInt(amount);
                    const userDoc=firestore().collection("AccountData").doc(accountNo).update({
                        Recieved:recieved,
                        balance:balance
                    }).then(setError("Transaction Successful"));
                }
            });

        }
        setLoading(false);
        setModal(true);
    }

    function toggleAns(){
        let x=hidden;
        x=!x;
        setHidden(x);
    }

    function errorModal(){
        if(error==='Transaction Successful'){
            return(
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Icon name="check" size={40} color={dark?'#841851':"#801818"}/>
                    <Text style={[dark?{color:"silver"}:{color:'#801818'}, {fontWeight:'bold', fontSize:20, margin:15, marginBottom:20}]}>{error}</Text>
                    <TouchableOpacity style={[styles().btn, {marginTop:0}]} onPress={()=>setModal(false)}>
                        <Text style={[{color:'white', fontWeight:'bold'}]}>Ok</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else{
            return(
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Icon name="close" size={40} color={dark?'#841851':"#801818"}/>
                    <Text style={[dark?{color:'silver'}:{color:'#801818'}, {fontWeight:'bold', fontSize:20, margin:15, marginBottom:20}]}>{error}</Text>

                    <TouchableOpacity style={[styles().btn, {marginTop:0}]} onPress={()=>setModal(false)}>
                        <Text style={[{color:'white', fontWeight:'bold'}]}>Ok</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
   
    return (
        <KeyboardAvoidingView
            style={{flexGrow:1}}
            behavior='height'
            keyboardVerticalOffset={10}
        >
        <View style={{flex:1}}>
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={modal}
            onRequestClose={()=>setModal(false)}
        >
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <View style={[styles().setting]}>
                    {errorModal()}
                </View>
            </View>
        </Modal>
            <View style={[styles().top,{flex:1}]}></View>
            <View style={[styles().top,{flex:1}]}>
                    <Text style={[styles().text, {fontWeight:'bold', fontSize:30}]}>TRANSFER FUNDS</Text>
            </View>
            <View style={[styles().top,{flex:2}]}></View>
            <View style={[styles().top,{flex:10}]}>

                <View style={styles().input}>
                    <View style = {{flex:1,flexDirection:'row'}} >
                    <Text style={[styles().text, {marginTop:5,flex:9,fontWeight:'normal',fontSize:14}]}>
                        {beneficiary===' '?'Bank Name...':beneficiary}
                    </Text>  
                    <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns()}>
                        <Text style={[{fontSize:25,fontWeight:'bold'}, dark?{color:'silver'}:{color:'#801818'}]}>{!hidden?"\u{25BC}":"\u{25B2}"}</Text>
                    </TouchableOpacity>  
                    </View> 
                </View>
                {hidden?<View style={{marginLeft:75,width:'100%'}} >
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('DebitHub')} >
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>DebitHub</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('HBL')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Habib Bank Limited</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('Meezan Bank')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Meezan Bank</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('Bank Alfalah')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Bank Alfalah</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles().menu]} onPress={()=>setBeneficiary('Standard Chartered')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Standard Chartered</Text>
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Other..."
                            style={[styles().menu,{paddingVertical:0,color:'white'}]}
                            placeholderTextColor={dark?"white":"black"}
                            onChangeText={setBeneficiary}
                        >
                        </TextInput>
                        
                        
                    </View>:<></>}     
               
                <TextInput
                    placeholder="Account Number..."
                    style={styles().input}
                    textAlignVertical="top"
                    placeholderTextColor={dark?"white":"black"}
                    onChangeText={setAccountNo}
                >
                </TextInput>
                <TextInput
                    placeholder="Payment Amount..."
                    style={styles().input}
                    textAlignVertical="top"
                    placeholderTextColor={dark?"white":"black"}
                    onChangeText={setAmount}
                >
                </TextInput>
                <TouchableOpacity
                    //if billID is valid && amount is enough
                    onPress={transferFunds}
                    style={styles().btn}
                >
                    <Text style={[styles().text, {fontWeight:'bold', fontSize:18}, !dark?{color:'white'}:{}]}>Proceed</Text>
                </TouchableOpacity>
            </View>
            <Loader animating={loading}/>
        </View>
        </KeyboardAvoidingView>
    )
}


const stylesDark=StyleSheet.create({
    top:{
      
        alignItems:'center',
        flex:8,
        backgroundColor:'#1e2127',
    },
    menu:{
        borderBottomWidth:2,
        borderColor:'#841851',
        borderRadius:4,
        width:'80%',
        marginVertical:5,
        backgroundColor:'#1e2127',
        paddingHorizontal:10,
 
    },
  
    text:{
        
        fontSize:25,
        color:'white',
    },
    input:{
        width:'80%',
        height:'8%',
        borderWidth:3,
        borderRadius:15,
        borderColor:'#841851',
        backgroundColor:'#2e3137',
        justifyContent:"space-between",
        color:'silver',   
        marginVertical:10,
        paddingHorizontal:10
       
    },
    btn:{
        backgroundColor:'#841851',
        borderRadius:12,
        alignItems:'center',
        width:'40%',
        padding:10,
        marginTop:40
    },
    setting:{
        //borderColor:'#801818',
        //borderWidth:2,
        borderRadius:15,
        backgroundColor:'#21252bf5',
        height:'25%', 
        width:'70%', 
        //opacity:0.95,
        justifyContent:'center',
        alignItems:'center',
        paddingTop:20,
        borderWidth:3,
        borderColor:'#841851'
    }
});

const stylesLight=StyleSheet.create({
    top:{
        alignItems:'center',
        flex:8,
        backgroundColor:'#d8cfc4',
    },
    menu:{
        borderBottomWidth:2,
        borderColor:'#801818',
        borderRadius:4,
        width:'80%',
        marginVertical:5,
        backgroundColor:'#a79292',
        paddingHorizontal:10,
 
    },
    text:{
        fontSize:25,
        color:'black',
    },
    input:{
        width:'80%',
        height:'10%',
        borderWidth:3,
        borderRadius:15,
        borderColor:'#801818',
        backgroundColor:'#A79292',
        justifyContent:"space-between",
        color:'black',
        marginVertical:10,
        paddingHorizontal:10
    },
    btn:{
        backgroundColor:'#801818',
        borderRadius:12,
        alignItems:'center',
        width:'40%',
        padding:10,
        marginTop:40
    },
    setting:{
        //borderColor:'#801818',
        //borderWidth:2,
        borderRadius:15,
        backgroundColor:'#A79292f5',
        height:'25%', 
        width:'70%', 
        //opacity:0.95,
        justifyContent:'center',
        alignItems:'center',
        paddingTop:20,
        borderWidth:3,
        borderColor:'#801818'
    }
});