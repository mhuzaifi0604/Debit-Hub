return (
    <View style={styles().container}>
        <FlatList
            data={FAQs}
            renderItem={({ item }) => (
            <View style={styles().item}>
                <View style = {{flex:1,flexDirection:'row'}} >
                    <Text style={[styles().text, {fontWeight:'normal'}]}>Q. {item.question}</Text>  
                    <TouchableOpacity disabled={false} style={{flex:1}} onPress={()=>toggleAns(item.key)}>
                        <Text style={[{fontSize:25,fontWeight:'bold'}, dark?{color:'#841851'}:{color:'#801818'}]}>{!hidden[item.key-1]?"\u{25BC}":"\u{25B2}"}</Text>
                    </TouchableOpacity>
                </View>
                {hidden[item.key-1]?<Text style={[{fontSize:20},dark?{color:'#841851'}:{color:'#801818'}]}>{item.answer}</Text>:<></>}
            </View>        
            )}
        />   
    </View>
  )
}