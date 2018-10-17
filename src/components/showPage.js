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
import CustomHeader from './commonComponents/Header';
import Modal from "react-native-modal";

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
            fullscreen: false,
            periodData: '',
            visible: true,
            periods: [],
            display: '',
            isModalVisible: true,
            adWatched: false
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
            paused: true,
            adWatched: true,
            isModalVisible: true
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


    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });


    replayVideo = () => {
        this.player && this.player.seek(0);
        this.setState({ paused: false, isModalVisible: false });
    }


    render() {

        const styles = StyleSheet.create({
            Container: {
                alignItems: 'center'
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
                height: '100%'
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
                alignItems: 'center',
                justifyContent: 'center',
                overflow: "hidden"
            },
            fakeContent: {
                height: 850,
                backgroundColor: "#CCC",
                paddingTop: 250,
                alignItems: "center"
            },
            modalView: {
                backgroundColor: "#6b3fef",
                width: 300,
                height: 420,
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 8,
                justifyContent: 'space-evenly'
            },
            modalHeaderView: {
                width: 260,
                height: 40,
                marginLeft: 20,
                marginRight: 20,
                backgroundColor: '#FED95F',
                borderRadius: 6,
                alignItems: 'center',
                marginTop: 15,
                justifyContent: 'center',
                flexDirection: 'row'
            },
            modalViewTitle: {
                fontSize: 25,
                color: 'black'
            },
            modalViewText: {
                fontSize: 15,
                color: '#FED95F',
                fontWeight: 'bold'
            },
            modalViewFooter: {
                width: 300,
                flexDirection: "row",
                justifyContent: 'space-around',
                height: 40
            },
            ModalMiddleView: {
                alignItems: 'center',
                flexDirection: 'row',
                height: 30,
                width: 200,
                justifyContent: 'space-around',
            },
            modalButtonView: {
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
                height: 34,
                borderRadius: 6,
                backgroundColor: '#FED95F'
            },
            question: {
                color: 'white',
                fontWeight: 'bold',
                alignItems: 'center',
                flexDirection: 'row',
                margin: 5
            },
            choiceParentView: {
                flexDirection: 'row',
                width: 270,
                height: 100,
                flexWrap: 'wrap',
                justifyContent: 'space-around'
            },
            choiceView: {
                width: 110,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FED95F',
                margin: 10,
                borderRadius: 8
            },
            answerText: {
                fontSize: 15,
                fontWeight: 'bold'
            },
            replayView: {
                width: 150,
                height: 40,
                flexDirection: 'row',
                backgroundColor: '#FED95F',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8
            },
            replayText: {
                fontWeight: 'bold',
                fontSize: 18
            },
            replayIcon: {
                fontSize: 25,
                fontWeight: 'bold',
                marginLeft: 10
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




        return(
           <Container style={styles.Container}>
            <CustomHeader hamburger={true}/>
                <View disabled style={styles.videoParentView}>
                    <TouchableWithoutFeedback  onPress={this.handleVideoPress}>
                    <Video source={getirAd}   // Can be a URL or a local file.
                           ref={(ref) => {
                               this.player = ref
                           }}                                      // Store reference
                           paused={this.state.isModalVisible===true?true:this.state.paused}
                           onLoadStart={this.handleLoadStart}
                           onLoad={this.handleLoad}
                           onProgress={this.handleProgress}
                           onBuffer={this.handleBuffer}                // Callback when remote video is buffering
                           onEnd={this.handleEnd}                      // Callback when playback finishes
                           onError={()=>this.handleError}              // Callback when video cannot be loaded
                           style={styles.backgroundVideo}
                           resizeMode="none"
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
                        <TouchableWithoutFeedback onPress={()=>this.setState({fullscreen: !this.state.fullscreen})}>
                            <Icon name="expand"/>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </View>
               <Modal style={{height: 250}}
                   //   onBackdropPress={() => this.setState({ isModalVisible: false })}  when active, modal disappear when there is press outside Modal
                      isVisible={this.state.isModalVisible}>
                   {!this.state.adWatched?
                       <View style={styles.modalView}>
                           <View style={styles.modalHeaderView}>
                               <Text style={styles.modalViewTitle}>Upcoming Ad</Text>
                           </View>
                           <View style={styles.ModalMiddleView}>
                               <Text style={styles.modalViewText}>Type: </Text>
                               <Text>Video</Text>
                           </View>
                           <View style={styles.ModalMiddleView}>
                               <Text style={styles.modalViewText}>Length:   </Text>
                               <Text>00:16</Text>
                           </View>
                           <View style={styles.ModalMiddleView}>
                               <Text style={styles.modalViewText}>Prize:  </Text>
                               <Text>2 Cent</Text>
                           </View>
                           <View style={styles.modalViewFooter}>
                               <TouchableOpacity style={styles.modalButtonView}>
                                   <Text onPress={()=>this._toggleModal()} style={{ color: 'black'}}>Watch</Text>
                               </TouchableOpacity>
                               <TouchableOpacity style={styles.modalButtonView}>
                                   <Text style={{color: 'black'}}>Skip</Text>
                               </TouchableOpacity>
                           </View>
                        </View>
                       :
                       <View style={styles.modalView}>
                               <View style={styles.modalHeaderView}>
                                   <Text style={styles.modalViewTitle}>Question</Text>
                               </View>
                               <TouchableOpacity onPress={()=>this.replayVideo()} style={styles.replayView}>
                                   <Text style={styles.replayText}>Replay Ad</Text>
                                   <Icon style={styles.replayIcon} name="refresh"/>
                               </TouchableOpacity>

                           <Text style={styles.question}>What sort of service is provided by the product shown?</Text>
                           <TouchableOpacity disabled style={styles.choiceParentView}>
                                   <TouchableOpacity style={styles.choiceView}>
                                        <Text style={styles.answerText}>Accomodation</Text>
                                   </TouchableOpacity>

                                   <TouchableOpacity style={styles.choiceView}>
                                       <Text style={styles.answerText}>Shipping Products</Text>
                                   </TouchableOpacity>

                                   <TouchableOpacity style={styles.choiceView}>
                                       <Text style={styles.answerText}>Consulting</Text>
                                   </TouchableOpacity>

                                   <TouchableOpacity style={styles.choiceView}>
                                       <Text style={styles.answerText}>Health</Text>
                                   </TouchableOpacity>
                           </TouchableOpacity>
                       </View>

                   }

               </Modal>
            </Container>
        );
    }

}


