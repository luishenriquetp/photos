import React, {useEffect, useState, useRef} from 'react';
import {Animated, Dimensions, View, Text} from 'react-native';
import {sortCondition, FlatSection, story} from '../types/interfaces';
import RenderPhotos from './RenderPhotos';
import SingleMedia from './SingleMedia';
import StoryHolder from './StoryHolder';

import { Asset } from 'expo-media-library';
import {prepareLayout,} from '../utils/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  photos: Array<Asset>;
  scale: Animated.Value;
  baseScale: Animated.AnimatedAddition;
  pinchOrZoom: 'pinch' | 'zoom' | undefined;
  sortCondition: sortCondition;
  numColumns: 2 | 3 | 4;
  loading: boolean;
  focalX: Animated.Value;
  focalY: Animated.Value;
  numberOfPointers: Animated.Value;
  velocity: Animated.Value;
  isPinchAndZoom: boolean;
  setLoadMore: Function;
  storiesHeight: number;
  scrollAnim: Animated.Value;
  HEADER_HEIGHT: number;
  setHeaderShown: Function;
}

const AllPhotos: React.FC<Props> = (props) => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {isMounted.current = false;}
  }, []);

  const scrollY2 = useRef(new Animated.Value(0)).current;
  const scrollY3 = useRef(new Animated.Value(0)).current;
  const scrollY4 = useRef(new Animated.Value(0)).current;

  //Remove the below with a more optimizes logic
  if(props.numColumns===2){
    scrollY2.removeAllListeners();
    scrollY3.removeAllListeners();
    scrollY4.removeAllListeners();
    scrollY2.addListener(({value})=>{
      props.scrollAnim.setValue(value);
    });
  }else if(props.numColumns===3){
    scrollY2.removeAllListeners();
    scrollY3.removeAllListeners();
    scrollY4.removeAllListeners();
    scrollY3.addListener(({value})=>{
      props.scrollAnim.setValue(value);
    });
  }else if(props.numColumns===4){
    scrollY2.removeAllListeners();
    scrollY3.removeAllListeners();
    scrollY4.removeAllListeners();
    scrollY4.addListener(({value})=>{
      props.scrollAnim.setValue(value);
    });
  }

 

  const [scrollOffset, setScrollOffset] = useState<{[key:string]:(2|3|4|number)}>({'in':0,'to':0});
  const [preparedMedia, setPreparedMedia] = useState<FlatSection>({layout:[],headerIndexes:[], stories:[]});
  const [modalShown, setModalShown] = useState<boolean>(false);
  const [singlePhotoIndex, setSinglePhotoIndex] = useState<number>(1);
  const [imagePosition, setImagePosition] = useState<{x:number;y:number}>({x:0,y:0});
  const [medias, setMedias] = useState<Asset[]|undefined>(undefined);
  const [stories, setStories] = useState<story[]|undefined>(undefined);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [story, setStory] = useState<story|undefined>();

  useEffect(()=>{
    if(isMounted){
      let prepared = prepareLayout(props.photos,['day', 'month']);
      setPreparedMedia(prepared);
      let onlyMedias:any[] = prepared.layout.filter(item => typeof item.value !== 'string').map((item)=>{return item.value});
      setMedias(onlyMedias);
      setStories(prepared.stories);
    }
  },[props.photos]);

  useEffect(()=>{
    if(isMounted){
      if(modalShown || showStory){
        props.setHeaderShown(false);
      }else{
        props.setHeaderShown(true);
      }
    }
  },[modalShown, showStory]);
  
  return (
    preparedMedia.layout.length>0?(
    <View
      style={{
        flex: 1,
        width: SCREEN_WIDTH,
        position: 'relative',
      }}
    >
      <RenderPhotos
        photos={preparedMedia}
        loading={props.loading}
        margin={props.baseScale.interpolate({
          inputRange: [0, 1, 3],
          outputRange: [0, 0, 0],
        })}
        maxWidth={SCREEN_WIDTH*2}
        minWidth={SCREEN_WIDTH/2}
        numColumns={2}
        opacity={props.baseScale.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 1, 0],
        })}
        sizeTransformScale={
          props.baseScale.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [2.2, 1, 0.66667],
          })
        }
        date={new Date()}
        sortCondition="day"
        zIndex={(props.numColumns === 2)?1:0}
        scale={props.scale}
        isPinchAndZoom={props.isPinchAndZoom}
        scrollOffset={scrollOffset}
        setScrollOffset={setScrollOffset}
        setLoadMore={props.setLoadMore}
        focalY={props.focalY}
        numberOfPointers={props.numberOfPointers}
        modalShown={modalShown}
        setModalShown={setModalShown}
        setSinglePhotoIndex={setSinglePhotoIndex}
        setImagePosition={setImagePosition}
        storiesHeight={props.storiesHeight}
        stories={stories}
        showStory={showStory}
        setShowStory={setShowStory}
        setStory={setStory}
        scrollY={scrollY2}
        HEADER_HEIGHT={props.HEADER_HEIGHT}
      />
      <RenderPhotos
        photos={preparedMedia}
        loading={props.loading}
        margin={props.baseScale.interpolate({
          inputRange: [0, 1, 3],
          outputRange: [0, 0, 0],
        })}
        maxWidth={SCREEN_WIDTH*2}
        minWidth={SCREEN_WIDTH/2}
        numColumns={3}
        opacity={props.baseScale.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, 1, 0],
        })}
        sizeTransformScale={
          props.baseScale.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [1.5, 1, 0.75],
          })
        }
        date={new Date()}
        sortCondition="day"
        zIndex={(props.numColumns === 3)?1:0}
        scale={props.scale}
        isPinchAndZoom={props.isPinchAndZoom}
        scrollOffset={scrollOffset}
        setScrollOffset={setScrollOffset}
        setLoadMore={props.setLoadMore}
        focalY={props.focalY}
        numberOfPointers={props.numberOfPointers}
        modalShown={modalShown}
        setModalShown={setModalShown}
        setSinglePhotoIndex={setSinglePhotoIndex}
        setImagePosition={setImagePosition}
        storiesHeight={props.storiesHeight}
        stories={stories}
        showStory={showStory}
        setShowStory={setShowStory}
        setStory={setStory}
        scrollY={scrollY3}
        HEADER_HEIGHT={props.HEADER_HEIGHT}
      />
      <RenderPhotos
        photos={preparedMedia}
        loading={props.loading}
        margin={props.baseScale.interpolate({
          inputRange: [0, 1, 3],
          outputRange: [0, 0, 0],
        })}
        maxWidth={SCREEN_WIDTH*2}
        minWidth={SCREEN_WIDTH/2}
        numColumns={4}
        opacity={props.baseScale.interpolate({
          inputRange: [1, 2, 3],
          outputRange: [0, 1, 0],
        })}
        sizeTransformScale={
          props.baseScale.interpolate({
            inputRange: [1, 2, 3],
            outputRange: [1.3333, 1, 0.8],
          })
        }
        date={new Date()}
        sortCondition="month"
        zIndex={(props.numColumns === 4)?1:0}
        scale={props.scale}
        isPinchAndZoom={props.isPinchAndZoom}
        scrollOffset={scrollOffset}
        setScrollOffset={setScrollOffset}
        setLoadMore={props.setLoadMore}
        focalY={props.focalY}
        numberOfPointers={props.numberOfPointers}
        modalShown={modalShown}
        setModalShown={setModalShown}
        setSinglePhotoIndex={setSinglePhotoIndex}
        setImagePosition={setImagePosition}
        storiesHeight={props.storiesHeight}
        stories={stories}
        showStory={showStory}
        setShowStory={setShowStory}
        setStory={setStory}
        scrollY={scrollY4}
        HEADER_HEIGHT={props.HEADER_HEIGHT}
      />
      <SingleMedia 
        modalShown={modalShown}
        setModalShown={setModalShown}
        medias={medias}
        singleMediaIndex={singlePhotoIndex}
        setSinglePhotoIndex={setSinglePhotoIndex}
        imagePosition={imagePosition}
        numColumns={props.numColumns}
      />
      <StoryHolder 
        duration={1500}
        showStory={showStory}
        setShowStory={setShowStory}
        numColumns={props.numColumns}
        story={story}
      />
      
    </View>
    ):(
      <View><Text>No Photos</Text></View>
    )
  );
};

export default AllPhotos;
