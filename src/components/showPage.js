/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ScrollView ,Dimensions,Alert, AsyncStorage,View,Image, TextInput, TouchableOpacity, Platform, Animated, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Container, Icon, Text} from 'native-base';
import ProgressBar from 'react-native-progress/Bar';


import Video from 'react-native-video';
import getirAd from '../assets/getir.mp4';

const THRESHOLD = 100;

const {width} = Dimensions.get("window");
   const height = width * 0.5625;

function secondsToTime(time){

    return ~~( time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class showPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paused: false,
            selectedPeriod: '',
            showPicArrow: false,
            promotions: '',
            showPicArr: [],
            buffering: true,
            animated: new Animated.Value(0),
            progress: 0,
            duration: 0,
            fullHeight: false,
            periodData: '',
            visible: true,
            periods: [],
            display: ''
        };
    };

    position = {
        start: null,
        end: null
    }

    animated = new Animated.Value(0);


    handleProgressPress = (e) => {
        this.triggerShowHide();
        const position = e.nativeEvent.locationX;
        const progress = (position/250) * this.state.duration;
        this.player.seek(progress);
    }

    handleMainButtonTouch = () => {
        this.triggerShowHide();
        if(this.state.progress >= 1){
            this.player.seek(0);
        }

        this.setState(state => {
            return {
                paused: !state.paused
            }
        })
    }




    handleLoadStart = () => {
        this.triggerBufferAnimation();
    }

    triggerBufferAnimation = () => {
        this.loopingAnimation = Animated.loop(
            Animated.timing(this.state.animated, {
                toValue: 1,
                duration: 350
            })
        ).start();
    }

    handleEnd = () => {
        this.setState({
            paused: true
        })
    }

    handleBuffer = (meta) => {
        meta.isBuffering && this.triggerBufferAnimation();

        if(this.loopingAnimation && !meta.isBuffering){
            this.loopingAnimation.stopAnimation();
        }

        this.setState({
            buffering: meta.isBuffering
        })
    }


    handleProgress = (progress) => {
        this.setState({
            progress: progress.currentTime / this.state.duration
        })
    }

    handleLoad = (meta) => {
        this.setState({
            duration: meta.duration
        })
    }

    handleVideoPress = () => {
        this.triggerShowHide();
    };

    triggerShowHide = () => {
        clearTimeout(this.hideTimeout);

        Animated.timing(this.animated, {
            toValue: 1,
            duration: 100
        }).start();

        this.hideTimeout = setTimeout(() => {
            Animated.timing(this.animated, {
                toValue: 0,
                duration: 300
            }).start();
        }, 2000)
    }


    handleVideoLayout = (e) => {
        const { height } = Dimensions.get("window");
        this.position.start = e.nativeEvent.layout.y - height + THRESHOLD;
        this.position.end = e.nativeEvent.layout.y + e.nativeEvent.layout.height - THRESHOLD;
    }

    handleScroll = (e) => {
        const scrollPosition = e.nativeEvent.contentOffset.y;
        const paused = this.state.paused;
        const { start, end } = this.position;

        if(scrollPosition > start && scrollPosition < end  && paused) {
            this.setState({paused: false});
        }else if((scrollPosition > end || scrollPosition < start) && !paused){
            this.setState({paused: true});
        }
    }



    render() {

        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                backgroundColor: '#F5FCFF',
                justifyContent: 'center'
            },
            welcome: {
                fontSize: 20,
                textAlign: 'center',
                margin: 10,
            },
            instructions: {
                textAlign: 'center',
                color: '#333333',
                marginBottom: 5,
            },
            backgroundVideo: {
                width: '100%',
                height: height
            },
            duration: {
              color: "#FFF",
              marginLeft: 15
            },
            mainButton: {
              marginRight: 15
            },
            controls: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                height: 48,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                paddingHorizontal: 10
            },
            videoParentView: {
                width: width,
                height: height,
                backgroundColor: 'black',
                marginLeft: 10,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: "hidden"
            },
            fakeContent: {
                height: 850,
                backgroundColor: "#CCC",
                paddingTop: 250,
                alignItems: "center"
            }
        });


        const {error} = this.state;
        const {buffering} = this.state;

        const interpolatedAnimation =
            this.state.animated.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"]
            });


        const rotateStyle = {
            transform: [
                {rotate: interpolatedAnimation}
            ]
        }



        const interpolatedControls = this.animated.interpolate({
            inputRange: [0, 1],
            outputRange: [48, 0],
        });

        const controlHideStyle = {
            transform: [
                {
                    translateY: interpolatedControls,
                }
            ]
        };




        return (
           <Container style={styles.container}>
                <View disabled style={styles.videoParentView}>
                    <TouchableWithoutFeedback  onPress={this.handleVideoPress}>
                    <Video source={getirAd}   // Can be a URL or a local file.
                           ref={(ref) => {
                               this.player = ref
                           }}                                      // Store reference
                           paused={this.state.paused}
                           onLoadStart={this.handleLoadStart}
                           onLoad={this.handleLoad}
                           onProgress={this.handleProgress}
                           onBuffer={this.handleBuffer}                // Callback when remote video is buffering
                           onEnd={this.handleEnd}                      // Callback when playback finishes
                           onError={()=>this.handleError}              // Callback when video cannot be loaded
                           style={styles.backgroundVideo}
                           resizeMode="contain"
                                                     />
                    </TouchableWithoutFeedback>
                    <Animated.View style={[styles.controls, controlHideStyle]}>
                        <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
                            <Icon name={!this.state.paused ? "ios-pause" : "ios-play"}
                                  style={{color: "#FFF"}} size={30} color={"#FFF"} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <View>
                                <ProgressBar progress={this.state.progress}
                                             color="#FFF"
                                             unfilledColor="rgba(255, 255, 255, .5)"
                                             borderColor="#FFF"
                                             width={250}
                                             height={10}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={styles.duration}>
                            {secondsToTime(Math.floor(this.state.progress * this.state.duration))}
                        </Text>
                    </Animated.View>
                </View>
            </Container>
        );
    }
}


