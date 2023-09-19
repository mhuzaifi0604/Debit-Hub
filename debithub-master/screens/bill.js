// importing components from raect and react native
import { Modal,Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput,KeyboardAvoidingView } from 'react-native'
import React, {useState, useEffect} from 'react'

// importing libraries for the firebase
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loader from './loading';
import Icon from 'react-native-vector-icons/FontAwesome';
// importing libraries for different features

// deafult function for paying bills
export default function PayBills() {
    // declaring and setting constants
    const [dark, setDark]=useState(false);

    useEffect(()=>{
        // function for checking dark and light mode
        async function getDark(){
            // waiting for the firestore for getting darkmode
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                // setting app in the datrk mode
                setDark(JSON.parse(read));
            }
        }
        getDark();
    });
    // function for returning light and dark mode
    function styles(){
        if(dark){
            return stylesDark;
        }
        return stylesLight;
    }
    // declaring and setting constants for different purposes
    const [beneficiary, setBeneficiary] =useState(' ');
    const [billID, setBillID]=useState(' ');
    const [amount, setAmount]=useState(' ');
    const [error, setError]=useState(' ');
    const [toggle, setToggle]=useState(false);
    const [hidden, setHidden]=useState(false);
    // setting loaders and modals
    const [loading, setLoading]=useState(false);
    const [modal, setModal]=useState(false);

    // function for paying bills through the application
    async function payBills(){
        // checking if the values entered were empty or not
        if(beneficiary===" "||billID===" "||amount===" "){
            setError("Invalid Details"); // if eempty then prompting for invalid details
            setModal(true);
            return;
        }
        setLoading(true);
        let myname;
        // waiting for firebase to fetch data from the AccountData collection in the database
        const subscriber=await firestore().collection("AccountData").doc(auth().currentUser.email).get()
        .then(doc=>{
            const data=doc.data();
            // logging values on the cosole
            console.log(data);
            // checking if the current balance is in negative
            if(data.balance-amount<0){
                // displaying msg for insufficient balance
                setError("Insufficient Balance");
                setModal(true);
                return;
            }
            // creating an array for sent money records
            const sent=[];
            if(data.Sent!==undefined){
                // getting length of the array
                const length=data.Sent.length;
                for(let i=0; i<length; i++){
                    // pushing data into the database
                    sent.push(data.Sent[i]);
                }
            }
            // getting credentials like date, month and year
            const month=new Date().getMonth()+1;
            const date=new Date().getDate();
            const year=new Date().getFullYear();
            // concatinating the credentials
            let str=date+"/"+month+"/"+year;
            myname=data.Name;
            // making an object and filling with entered details
            const obj={
                Bank:beneficiary,
                Money:parseInt(amount),
                Date:str
            }
            // getting and pushing account number into the database
            obj["Account Number"]=billID;
            sent.push(obj);
            // updating remainning balance in the account
            const balance=data.balance-amount;
            // setting data in the accountsdata collection in the database
            const userDoc=firestore().collection("AccountData").doc(auth().currentUser.email).update({
                balance:balance,
                Sent:sent
            }).then(setError("Transaction Successful")); // prompts for successful transactions
        });
        // setting loader and modal
        setLoading(false);
        setModal(true);
        }
            // function for toggling answer for in view and hidden content
    function toggleAns(){
        let x=hidden;
        x=!x;
        setHidden(x);
    }
    // modal for suucessful or unseccessful transactions
    function errorModal(){
        if(error==='Transaction Successful'){ // if transaction was successful
            return(
                // setting style for modal
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    {/* displaying icon for successful transaction */}
                    <Icon name="check" size={40} color={dark?'#841851':"#801818"}/>
                    <Text style={[dark?{color:"silver"}:{color:'#801818'}, {fontWeight:'bold', fontSize:20, margin:15, marginBottom:20}]}>{error}</Text>
                    {/* [touchable opacity for closing the modal] */}
                    <TouchableOpacity style={[styles().btn, {marginTop:0}]} onPress={()=>setModal(false)}>
                        <Text style={[{color:'white', fontWeight:'bold'}]}>Ok</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else{ // if the transaction was unsuccessful
            return(
                // setting modal and views style
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    {/* displaying icons for unsuccessful transaction */}
                    <Icon name="close" size={40} color={dark?'#841851':"#801818"}/>
                    <Text style={[dark?{color:'silver'}:{color:'#801818'}, {fontWeight:'bold', fontSize:20, margin:15, marginBottom:20}]}>{error}</Text>
                        {/* touchable opacity for closing the modal */}
                    <TouchableOpacity style={[styles().btn, {marginTop:0}]} onPress={()=>setModal(false)}>
                        <Text style={[{color:'white', fontWeight:'bold'}]}>Ok</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
   
    return ( 
        // keyboard avoiding view at the time of inputting from the keyboard
        <KeyboardAvoidingView
            style={{flexGrow:1}}
            behavior='height'
            keyboardVerticalOffset={10}
        >
        <View style={{flex:1}}>
            {/* setting modal details */}
        <Modal
        // style for modal
            animationType={"slide"}
            transparent={true}
            visible={modal}
            onRequestClose={()=>setModal(false)}
        >
           {/* view for the modal in case of successful or unsuccessful transaction */}
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <View style={[styles().setting]}>
                    {errorModal()}
                </View>
            </View>
        </Modal>{/* closing view and modal tags */}
            <View style={[styles().top,{flex:1}]}></View>
            <View style={[styles().top,{flex:1}]}>
                {/* button for bill payment */}
                    <Text style={[styles().text, {fontWeight:'bold', fontSize:30}]}>BILL PAYMENT</Text>
            </View>
            <View style={[styles().top,{flex:2}]}></View>
            <View style={[styles().top,{flex:10}]}>

                <View style={styles().input}>
                    {/* setting flex direction in row format */}
                    <View style = {{flex:1,flexDirection:'row'}} >
                    <Text style={[styles().text, {marginTop:5,flex:9,fontWeight:'normal',fontSize:14}]}>
                        {/* getting benificiary or say bank name for paying bills */}
                        {beneficiary===' '?'Biller...':beneficiary}
                    </Text>  
                    {/* toggle icons for displaying the hidden content */}
                    <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns()}>
                        <Text style={[{fontSize:25,fontWeight:'bold'}, dark?{color:'silver'}:{color:'#801818'}]}>{!hidden?"\u{25BC}":"\u{25B2}"}</Text>
                    </TouchableOpacity>  
                    </View> 
                </View>
                {/* hidden details for paying bills */}
                {hidden?<View style={{marginLeft:75,width:'100%'}} >
                    {/* touchable opacity for nayatel */}
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('Nayatel')} >
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Nayatel</Text>
                        </TouchableOpacity>
                        {/* touchable opacity for IESCO bills */}
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('IESCO')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>IESCO</Text>
                        </TouchableOpacity>
                        {/* touchable opacity for PTCL bills */}
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('PTCL')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>PTCL</Text>
                        </TouchableOpacity>
                        {/* touchable opacity for Jazz payment */}
                        <TouchableOpacity style={[styles().menu,{align:'left'}]} onPress={()=>setBeneficiary('Jazz')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Jazz</Text>
                        </TouchableOpacity>
                        {/* touchable opacity for ufone bills */}
                        <TouchableOpacity style={[styles().menu]} onPress={()=>setBeneficiary('Ufone')}>
                        <Text style={[{fontSize:14},dark?{color:'white'}:{color:'black'}]}>Ufone</Text>
                        </TouchableOpacity>
                        {/* text input for setting benificiary name */}
                        <TextInput
                        // setting styles for text input
                            placeholder="Other..."
                            style={[styles().menu,{paddingVertical:0,color:'white'}]}
                            placeholderTextColor={dark?"white":"black"}
                            onChangeText={setBeneficiary} // setting benificiary
                        >
                        </TextInput>
                        
                        
                    </View>:<></>}     
               {/* setting bill id for paying bills */}
                <TextInput
                /* styles for bill id */
                    placeholder="Bill ID..."
                    style={styles().input}
                    textAlignVertical="top"
                    placeholderTextColor={dark?"white":"black"}
                    onChangeText={setBillID} // setting bill id
                >
                </TextInput>
                {/* text input for amount to be payed */}
                <TextInput
                // styles for paying amount for the bills
                    placeholder="Payment Amount..."
                    style={styles().input}
                    textAlignVertical="top"
                    placeholderTextColor={dark?"white":"black"}
                    onChangeText={setAmount} // setting amount in constant
                >
                </TextInput>
                <TouchableOpacity
                    //if billID is valid && amount is enough
                    // calling paybills functions
                    onPress={payBills}
                    style={styles().btn}
                >
                    <Text style={[styles().text, {fontWeight:'bold', fontSize:18}, !dark?{color:'white'}:{}]}>Proceed</Text>
                </TouchableOpacity>
            </View>
            {/* setting loader  */}
            <Loader animating={loading}/>
        </View>
        </KeyboardAvoidingView>
    );
}

// creating a style sheet for styles for buttons and stuff
const stylesDark=StyleSheet.create({
    /* styles for top fo the modal */
    top:{
      
        alignItems:'center',
        flex:8,
        backgroundColor:'#1e2127',
    },
    /* styles for dropdown menu for benificiaries */
    menu:{
        borderBottomWidth:2,
        borderColor:'#841851',
        borderRadius:4,
        width:'80%',
        marginVertical:5,
        backgroundColor:'#1e2127',
        paddingHorizontal:10,
 
    },
  /* styles for text on the screen */
    text:{
        
        fontSize:25,
        color:'white',
    },
    /* styles for input method in the application */
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
    /* styles for buttons in the appliaction */
    btn:{
        backgroundColor:'#841851',
        borderRadius:12,
        alignItems:'center',
        width:'40%',
        padding:10,
        marginTop:40
    },
    /* styles for settings */
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