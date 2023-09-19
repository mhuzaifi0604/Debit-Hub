// importing components from react native
import React from 'react';
import {
    View, 
    Text, 
    ActivityIndicator, 
    Image
} from 'react-native';

// importing linear gradient with animation
import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient';

// function for loaders on a loading screen
export default function Loader(props){
    // loader for dark mode
        const darkColors=[
            // setting styles for laoder
            '#000',
            '#231F20',
            '#1e2127',
            '#000',
            '#231F20',
            '#1e2127'
        ];
        // loader for light mode
    const lightColors=[
        // setting loader styles for light mode
        '#978282',
        '#d8cfc4',
        '#978282',
        '#d8cfc4',
        '#978282',
        '#d8cfc4'
    ];
    // CHECKING IF THE animation property is true or not
    if(props.animating){
        return(
            // setting styles for view of the animator or loader
            <View style={[{position:'absolute', top:'40%',left:'38%', right:'50%', width:100, height:40, borderRadius:50, elevated:10, overflow:'hidden', elevation:10, zIndex:1000}]}>
            <AnimatedLinearGradient 
                // setting loader animation === instagram theme
                customColors={presetColors.instagram}
                speed={7000}// animation speed
            >
               {/* designing logo for the animator */}
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    {/* setting picture as the animating loader */}
                    <Image source={require('../assets/designing/logo.png')} style={{resizeMode:'cover', width:80, height:20}} />
                </View>
            </AnimatedLinearGradient>
            
            </View>
        );
    }
    else return <></>
}