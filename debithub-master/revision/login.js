import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    Modal,
    KeyboardAvoidingView,
} from 'react-native';
import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'
import GestureRecognizer from 'react-native-swipe-gestures';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../screens/loading';

export default function Login({navigation}){
    const gradientColors=[
        '#801818',
        'rgb(139,0,139)',
        '#801818',
        'rgb(220,20,60)',
        'rgb(139,0,139)'
    ]

    const [dark, setDark]=useState(false);
    useEffect(()=>{
        async function getDark(){
            const read=await AsyncStorage.getItem('darkMode');
            if(read!=null){
                setDark(JSON.parse(read));
            }
        }
        const unsubscribe=navigation.addListener('focus', ()=>{
            getDark();
        });

        return unsubscribe;
    }, [navigation]);

    const [password, setPassword] =useState(' ');
    const [email, setEmail]=useState(' ');
    const [error, setError]=useState(' ');
    const [logging, setLogging]=useState(false);
    const [signing, setSigning]=useState(false);

    const [name, setName]=useState(' ');
    const [cnic, setCnic]=useState(' ');

    const [loading, setLoading]=useState(false);

    function resetModal(){
        setPassword(' ');
        setEmail(' ');
        setError(' ');
        setName(' ');
        setCnic(' ');
    }   

    function login(){
        setError(" ");
        if(email===' '){
            setError('Please enter an email');
            setLoading(false);
            return;
        }
        if(password===' '){
            setError('Please enter a password');
            setLoading(false);
            return;
        }
        auth().signInWithEmailAndPassword(email, password)
        .then(userCredentials=>{
            const user=userCredentials.user;
            var check=email.substring(email.length-7);
            if(check==='dhl.com'){
                navigation.navigate('Dashboard');
            }
            else{
                navigation.navigate('User');
            }
            setLoading(false);
            setLogging(false);
            resetModal();
        })
        .catch(error=>{
            if(error.code==="auth/invalid-email"){
                setError("Invalid Email Address");
            }
            else if(error.code==="auth/user-not-found"){
                setError("Invalid email or password");
            }
            else if(error.code==="auth/wrong-password"){
                setError("Invalid email or password");
            }
            setLoading(false);
        })
    }

    function signUp(){
        setError(" ");
        var check=email.substring(email.length-7);
        if(check==='dhl.com'){
          setError("Invalid Email Address");
          setLoading(false);
          return;
        }
        if(email===" "){
            setError("Please enter an email");
            setLoading(false);
            return;
        }
        if(password===" "){
            setError("Please enter a password");
            setLoading(false);
            return;
        }
        if(cnic===" "){
            setError("Please enter your CNIC");
            setLoading(false);
            return;
        }
        if(name===" "){
            setError("Please enter your name");
            setLoading(false);
            return;
        }
        if(cnic.length!==13){
            setError("Please enter a valid CNIC");
            setLoading(false);
            return;
        }
        
        auth().createUserWithEmailAndPassword(email, password)
        .then(userCredentials=>{
          const user=userCredentials.user;
            const userDocument=firestore().collection('AccountData').doc(email)
            .set({
                email:email,
             CNIC:cnic,
             Name:name,
             balance:0,
            }).then(()=>setLoading(false));
            setLoading(false);
          setSigning(false);
          setLogging(true);
          setError("Successfully Signed Up. Please log in to start using the app");
        })
        .catch(error=>{
            if(error.code==="auth/email-already-in-use"){
                setError("This email is already in use");
            }
            else if(error.code==="auth/invalid-email"){
                setError("Invalid Email Address");
            }
            else if(error.code==="auth/weak-password"){
                setError("Weak Password");
            }
            setLoading(false);
        })
    }

    function reset(){
        if(email===' '){
          setError("Please enter your email");
          setLoading(false);
          return;
        }
        auth().sendPasswordResetEmail(email)
        .then(()=>{setError("Please check your email to reset your password"); setLoading(false);})
        .catch(error=>{
            if(error.code==="auth/invalid-email"){
                setError("Invalid Email Address. Please enter your email");
            }
            else if(error.code==="auth/user-not-found"){
                setError("No user was found with this email address");
            }
            setLoading(false);
        })
      }

    function loginScreen(){
        if(logging){
            return(
                <View style={[dark?styles.login:styles.loginLight]}>
                    <TextInput
                        placeholder="Enter email"
                        placeholderTextColor={dark?"white":"black"}
                        onChangeText={(val)=>setEmail(val)}
                        style={[dark?styles.input:styles.inputLight]}
                    />
                    <TextInput
                        placeholder="Enter password"
                        placeholderTextColor={dark?"white":"black"}
                        onChangeText={(val)=>setPassword(val)}
                        secureTextEntry={true}
                        style={[dark?styles.input:styles.inputLight, {marginBottom:20,}]}
                    />
                    <Text style={[dark?styles.error:styles.errorLight]}>{error}</Text>

                    <TouchableOpacity
                        style={[dark?styles.btn:styles.btnLight, { margin:20, marginTop:40, opacity:1}]}
                        onPress={()=>{setLoading(true);login()}}
                    >
                        <Text style={[{color:'white', fontWeight:'bold'}, dark?{color:'white'}:{color:'black'}]}>Login</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row'}}>
                        <Text style={[dark?{color:'white'}:{color:'black'}]}>
                            Forgot Password?
                        </Text>
                        <TouchableOpacity
                            onPress={()=>{setLoading(true);reset();}}
                        >
                            <Text style={[dark?{color:'white', fontWeight:'bold'}:{color:'black', fontWeight:'bold'}]}> Reset</Text>
                        </TouchableOpacity>
                    </View>
                    <Loader animating={loading}/>
                </View>
            );
        }
    }

    function signupScreen(){
        if(signing){
            return(
                <View style={[dark?styles.login:styles.loginLight]}>
                    <TextInput
                        placeholder="Enter your full name"
                        placeholderTextColor={dark?"white":"black"}
                        onChangeText={(val)=>setName(val)}
                        style={[dark?styles.input:styles.inputLight]}
                    />
                    <TextInput
                        placeholder="Enter your CNIC"
                        placeholderTextColor={dark?"white":"black"}
                        onChangeText={(val)=>setCnic(val)}
                        style={[dark?styles.input:styles.inputLight]}
                    />
                    <TextInput
                        placeholder="Enter email"
                        placeholderTextColor={dark?"white":"black"}
                        onChangeText={(val)=>setEmail(val)}
                        style={[dark?styles.input:styles.inputLight]}
                    />
                    <TextInput
                        placeholder="Enter password"
                        placeholderTextColor={dark?"white":"black"}
                        onChangeText={(val)=>setPassword(val)}
                        secureTextEntry={true}
                        style={[dark?styles.input:styles.inputLight, {marginBottom:20,}]}
                    />
                    <Text style={[dark?styles.error:styles.errorLight]}>{error}</Text>

                    <TouchableOpacity
                        style={[dark?styles.btn:styles.btnLight, {/*backgroundColor:'black',*/ margin:20, marginTop:20, opacity:1} ]}
                        onPress={()=>{setLoading(true);signUp();}}
                    >
                        <Text style={[dark?{color:'white', fontWeight:'bold'}:{color:'black', fontWeight:'bold'}]}>Signup</Text>
                    </TouchableOpacity>
                    <Loader animating={loading}/>
                </View>
            );
        }
    }

    return(
        <AnimatedLinearGradient
            customColors={gradientColors}
            style={styles.container}
            speed={4000}
        >
            <View
                style={styles.main}
            >
                <Image style={[{width:260, height:110}, styles.image, signing||logging?{top:60}:{top:100}]} source={dark?require('../assets/designing/logo.png'):require('../assets/designing/logolight.png')}/>
                <TouchableOpacity
                    style={[dark?styles.btn:styles.btnLight]}
                    onPress={()=>{setLogging(true);}}
                >
                    <Text style={[{color:'white', fontWeight:'bold', fontSize:20}, dark?{color:'white'}:{color:'black'}]}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[dark?styles.btn:styles.btnLight]}
                    onPress={()=>setSigning(true)}
                >
                    <Text style={[{color:'white', fontWeight:'bold', fontSize:20}, dark?{color:'white'}:{color:'black'}]}>SignUp</Text>
                </TouchableOpacity>

                <GestureRecognizer                   
                    onSwipeDown={(e)=>{
                        setLogging(false);
                        setSigning(false);
                        resetModal();
                    }}
                >
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={logging||signing} 
                        onRequestClose={(e)=>{
                            setLogging(false);
                            setSigning(false);
                            resetModal();
                        }}       
                    >
                        <KeyboardAvoidingView
                            style={{flexGrow:1}}
                            behavior='height'
                            keyboardVerticalOffset={10}
                        >
                        <View style={{height:'80%', marginTop:'auto'}}> 
                            {loginScreen()}
                            {signupScreen()}
                        </View>
                        </KeyboardAvoidingView>
                    </Modal>
                </GestureRecognizer>
            </View>
        <StatusBar backgroundColor="#000" translucent={true}/>
        </AnimatedLinearGradient>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    main:{
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
        opacity:1,
    },
    btn:{
        width:'50%',
        padding:7,
        alignItems:'center',
        borderColor:'white',
        borderWidth:2,
        borderRadius:25,
        margin:10,
        backgroundColor:'black',
        //opacity:0.8,
        paddingTop:10,
        paddingBottom:10,
        elevation:6,
        shadowColor:'#fff',
    },
    btnLight:{
        width:'50%',
        padding:7,
        alignItems:'center',
        borderColor:'black',
        borderWidth:2,
        borderRadius:25,
        margin:10,
        backgroundColor:'#d8cfc4',
        //opacity:0.8,
        paddingTop:10,
        paddingBottom:10,
        elevation:10,
    },
    image:{
        position:'absolute',
        top:80,
        bottom:60,
    },
    login:{
        flex:1,
        backgroundColor:'#000',
        borderTopEndRadius:80,
        borderTopLeftRadius:80,
        opacity:0.94,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:4,
        borderBottomWidth:0,
        borderColor:'white',
        elevation:10,
    },
    loginLight:{
        flex:1,
        backgroundColor:'#d8cfc4',
        borderTopEndRadius:80,
        borderTopLeftRadius:80,
        opacity:0.99,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:4,
        borderBottomWidth:0,
        borderColor:'black',
        elevation:10,
    },
    input:{
        marginTop:50,
        width:'80%',
        padding:5,
        borderBottomWidth:1,
        borderColor:'white',
        color:'white',
    },
    inputLight:{
        marginTop:50,
        width:'80%',
        padding:5,
        borderBottomWidth:1,
        borderColor:'black',
        color:'black',
    },
    error:{
        color:'#FF3131'
    },
    errorLight:{
        color:'#801818',
    }
});