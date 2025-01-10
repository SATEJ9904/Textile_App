import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Subscription = () => {
    return (
        <SafeAreaView>
            <View style={styles.Headercontainer}>
                <Image
                    source={require("../Images/drawer.png")}
                    style={styles.drawerIcon}
                />
                <View style={styles.HeaderTextContainer}>
                    <Text style={styles.HeaderText}>Subscription</Text>
                </View>
            </View>
            <View>
                
            </View>
        </SafeAreaView>
    )
}

export default Subscription

const styles = StyleSheet.create({
    Headercontainer: {
        width: "100%",
        height: "25%",
        backgroundColor: "#003C43",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row"
    },
    HeaderTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "75%"
    },
    HeaderText: {
        color: "#fff",
        fontSize: 23,
        fontWeight: "600"
    },
    drawerIcon: {
        width: "10%",
        height: "60%",
        marginLeft: "3%"
    }
})