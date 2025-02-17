import React, {useState, useEffect, createRef, useRef} from 'react';
import {Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { Asset } from 'expo-media-library';
import { Video } from 'expo-av'
import VideoPlayer from './VideoPlayer';
import {
  TapGestureHandler,
  PinchGestureHandler,
  HandlerStateChangeEvent,
  PinchGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
  State,
  PinchGestureHandlerProps
} from 'react-native-gesture-handler';

interface Props {
  imageHeight: number;
  imageWidth: number;
  media:Asset|undefined;
  state: {modalShown:boolean;activeIndex: number;}|undefined;
  index: number;
  setScrollEnabled: Function;
  pinchRef: React.RefObject<React.ComponentType<PinchGestureHandlerProps & React.RefAttributes<any>>>;
  imageScale:Animated.AnimatedInterpolation;
  _baseImageScale: Animated.Value;
  _pinchScale: Animated.Value;
}

const Media: React.FC<Props> = (props) => {
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SCREEN_HEIGHT = useWindowDimensions().height;

  
  let doubleTapRef = createRef<TapGestureHandler>();
  
  let _lastScale:number = 1;

  const isMounted = useRef(false);
  useEffect(() => {
      isMounted.current = true;
      return () => {isMounted.current = false;}
  }, []);



  const _onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: props._pinchScale } }],
    { useNativeDriver: true }
  );
  const _onPinchHandlerStateChange = ( event:HandlerStateChangeEvent<PinchGestureHandlerEventPayload> ) => {
    if(event.nativeEvent.numberOfPointers > 1 && isMounted.current){
      //props.setScrollEnabled(false);
    }
    if (event.nativeEvent.oldState === State.ACTIVE && isMounted.current) {
      _lastScale *= event.nativeEvent.scale;
      props._baseImageScale.setValue(_lastScale);
      props._pinchScale.setValue(1);
    }
  }

  const _onDoubleTapHandlerStateChange = ( event:HandlerStateChangeEvent<TapGestureHandlerEventPayload> ) => {
    if (event.nativeEvent.oldState === State.ACTIVE && event.nativeEvent.state !== State.ACTIVE && isMounted.current) {
      if(_lastScale > 1){
        _lastScale = 1;
        props._baseImageScale.setValue(_lastScale);
      }else{
        _lastScale *= 2;
        props._baseImageScale.setValue(_lastScale);
      }
    }
  }

      let video:any;
      const [isMute, setIsMute] = useState<boolean>(false);
      useEffect(()=>{
        if(video && props?.media?.duration && isMounted.current){
          if(props.state?.activeIndex===props.index && !props.state?.modalShown){
            console.log('video unloaded');
            video?.unloadAsync();
          }else if(props.state?.modalShown && props.state?.activeIndex===props.index){
            video.loadAsync({uri: props.media?.uri},{shouldPlay: true, positionMillis: 0});
          }
        }
      }, [props.index, props.state?.activeIndex, props.state]);

      const buildMedia = (media:Asset|undefined) => {
        if(media){
          if(media?.duration > 0){ 
            return (
              <VideoPlayer
                sliderColor='whitesmoke'
                showFullscreenButton={false}
                showMuteButton={true}
                mute={() =>setIsMute(true)}
                unmute={() =>setIsMute(false)}
                isMute={isMute || !(props.state?.activeIndex===props.index?true:false) || !props.state?.modalShown}
                videoProps={{
                  ref: (v: any) => (video = v),
                  shouldPlay: (props.state?.activeIndex===props.index && props.state?.modalShown),
                  isMuted: isMute,
                  resizeMode: Video.RESIZE_MODE_CONTAIN,
                  source: {
                    uri: media.uri,
                  },
                }}
                inFullscreen={false}
                height= {props.imageHeight}
                width= {props.imageWidth}
                fadeOutDuration={2000}
                quickFadeOutDuration={2000}
                showControlsOnLoad={true}
              />
            );
          }else{
            return (
              <Animated.Image
                style={[
                  styles.pinchableImage,
                  {
                    height: props.imageHeight,
                    width: props.imageWidth,
                    transform: [
                      { scale: (props.state?.modalShown && props.state?.activeIndex===props.index)?props.imageScale:1 },
                    ],
                  },
                ]}
                source={{uri: media?.uri}}
              />
            )
          }
        }else{
          return (
            <></>
          );
        }
      }

      return (
        <Animated.View
          style={{
            marginLeft: (SCREEN_WIDTH-props.imageWidth)/2,
            marginTop: (SCREEN_HEIGHT-props.imageHeight)/2,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          }}
        >
                <TapGestureHandler
                  ref={doubleTapRef}
                  onHandlerStateChange={_onDoubleTapHandlerStateChange}
                  numberOfTaps={2}
                >
                  <Animated.View 
                    style={[styles.wrapper, 
                      {
                        width: SCREEN_WIDTH, 
                        height: SCREEN_HEIGHT,
                      }]}
                  >
                    <PinchGestureHandler
                      ref={props.pinchRef}
                      onGestureEvent={_onPinchGestureEvent}
                      onHandlerStateChange={_onPinchHandlerStateChange}
                    >
                      <Animated.View 
                        style={[styles.container, 
                          {
                            width: SCREEN_WIDTH, 
                            height: SCREEN_HEIGHT,
                            opacity: (props.state?.modalShown && props.state?.activeIndex===props.index)?1:(props.imageScale.interpolate({
                              inputRange: [0, 0.99, 1, 1.01, 4],
                              outputRange: [0, 0, 1, 0, 0],
                            }))
                          }
                        ]} 
                        collapsable={false}
                      >
                        {buildMedia(props.media)}
                      </Animated.View>
                    </PinchGestureHandler>
                  </Animated.View>
                </TapGestureHandler>
              </Animated.View>
      );
    
  
};

const styles = StyleSheet.create({
  pinchableImage: {

  },
  video: {

  },
  wrapper:{
    position: 'relative',
    zIndex:5,
  },
  container: {
    position: 'relative',
    zIndex:5,
  },
});

export default Media;
