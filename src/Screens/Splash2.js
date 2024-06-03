import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import LinearGradient from 'react-native-linear-gradient';


const Splash2 = ({ navigation }) => {
  const animation = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(animation.value, [1, 0], [600, 350]);
    const height = interpolate(animation.value, [1, 0], [600, 230]);

    const borderRadius = interpolate(animation.value, [0, 0], [0, 0]);
    const marginLeft = interpolate(animation.value, [1, 0], [-35, 0])
    const marginTop = interpolate(animation.value, [1, 0], [150, 150])

    return {
      width: width,
      height: height,
      backgroundColor: "#fff",
      borderRadius: borderRadius,
      marginLeft: marginLeft,
      marginTop: marginTop,
    }
  })
  const DURATION = 1000;
  const DELAY = 500;

  const text = ['Weaveit', 'App'];

  const [isShown, setShown] = useState(false);

  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);
  const opacity4 = useSharedValue(0);

  // prettier-ignore
  const show = () => {
    if (isShown) {
      opacity4.value = withDelay(0 * DELAY, withTiming(0, { duration: DURATION }));
      opacity3.value = withDelay(1 * DELAY, withTiming(0, { duration: DURATION }));
      opacity2.value = withDelay(2 * DELAY, withTiming(0, { duration: DURATION }));
      opacity1.value = withDelay(3 * DELAY, withTiming(0, { duration: DURATION }));
    } else {
      opacity1.value = withDelay(0 * DELAY, withTiming(1, { duration: DURATION }));
      opacity2.value = withDelay(1 * DELAY, withTiming(1, { duration: DURATION }));
      opacity3.value = withDelay(2 * DELAY, withTiming(1, { duration: DURATION }));
      opacity4.value = withDelay(3 * DELAY, withTiming(1, { duration: DURATION }));

    }

    setShown(!isShown);
  };

  useEffect(() => {
    animation.value = withTiming(1, { duration: 2000 });
    animation.value = withTiming(0, { duration: 2200 });
    show();

    setTimeout(() => {
      navigation.navigate("Home")
    }, 3000)
  }, [])

  return (
    <View style={{ flex: 1 }}>
         <StatusBar backgroundColor={"#003C43"}></StatusBar>


      <LinearGradient style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
      }}
        colors={["#16E2F5", "#16E2F5", "#0059FF", "#0059FF", "#0000A0",]}>
        <Animated.Image
          source={require('../Images/logoweave.png')}
          style={[
            {
              marginTop: "70%",
              width: "100%",
              height: "100%",
              backgroundColor: '#000',
            }, animatedStyle,
          ]} ></Animated.Image>
        <View style={styles.container}>
          <View style={styles.text}>
            <Animated.Text style={{ ...styles.label, opacity: opacity1 }}>
              {text[0]}
            </Animated.Text>
            <Animated.Text style={{ ...styles.label, opacity: opacity2 }}>
              {text[1]}
            </Animated.Text>
            <Animated.Text style={{ ...styles.label, opacity: opacity3 }}>
              {text[2]}
            </Animated.Text>
            <Animated.Text style={{ ...styles.label, opacity: opacity4 }}>
              {text[3]}
            </Animated.Text>
          </View>

        </View>
      </LinearGradient>
    </View>
  )
}
export default Splash2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  text: {
    flexDirection: 'Column',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 8,
    color: "#fff"
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  animatedBorder: {
    height: 8,
    width: 64,
    backgroundColor: 'tomato',
    borderRadius: 20,
  },
})