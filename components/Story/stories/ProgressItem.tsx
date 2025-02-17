import React, { useEffect, useState, useRef, useReducer } from "react";
import {BAR_INACTIVE_COLOR, BAR_ACTIVE_COLOR, } from "../utils/colors";
import { ProgressItemProps } from "../utils/interfaceHelper";
import { progressReducer, initialState, PROGRESS } from "./ProgressReducer";
import { View, StyleSheet } from "react-native";

var isValid = true
var isBlock = false

const OFFSET = 100
const BAR_WIDTH = 100
const BAR_HEIGHT = 7

function ProgressItem(props: ProgressItemProps) {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {isMounted.current = false;clearTimeout(listener);}
  }, []);
  // const [refreshProgress, setRefreshProgress] = useState(true)
  // const [progress, setProgress] = useState(0)

  var [state, dispatch] = useReducer(progressReducer, initialState);
  var { progress } = state;

  const barActiveColor = props.barStyle && props.barStyle.barActiveColor ? props.barStyle.barActiveColor : BAR_ACTIVE_COLOR
  const barInActiveColor = props.barStyle && props.barStyle.barInActiveColor ? props.barStyle.barInActiveColor : BAR_INACTIVE_COLOR
  const barWidth = props.barStyle && props.barStyle.barWidth ? props.barStyle.barWidth : BAR_WIDTH
  const barHeight = props.barStyle && props.barStyle.barHeight ? props.barStyle.barHeight : BAR_HEIGHT
  const [listener, setListener] = useState<any>();
  React.useEffect(() => {
    if(isMounted){
      if (props.enableProgress) {
        if (progress >= 0 && progress < OFFSET) {
          if (progress == OFFSET - 2) {
            isValid = true
          }
          if (!isBlock && isMounted) {
            startProgress()
          } else {
            isBlock = false
            dispatch({ type: PROGRESS, payload: progress + 1 })
          }
        } else {
          if (isValid) {
            clearTimeout(listener)
            isValid = false
            props.onChangePosition()
          }
        }
      } else {
        blockProgress()
      }
    }
  }, [progress, props.enableProgress])

  React.useEffect(() => {
    if(isMounted){
      clearTimeout(listener);
      if (props.enableProgress) {
        // This if condition is critical at it blocks the multiple callbacks for other position in row
        if (props.currentIndex === props.progressIndex) {
          if (props.progressIndex != 0) {
            blockProgress();
            dispatch({ type: PROGRESS, payload: 0 });
            console.log("Progress Change => === ", props.progressIndex);
          } else {
            isValid = false;
            dispatch({ type: PROGRESS, payload: 0 });
          }
        }
      } else {
        blockProgress();
      }
    }
  }, [props.progressIndex])

  function startProgress() {
    if(isMounted){
      clearTimeout(listener);
      setListener(setTimeout(() => {
        if(isMounted){
          // setProgress(progress + 1)
          dispatch({ type: PROGRESS, payload: progress + 1 });
        }else{
          clearTimeout(listener);
        }
      }, props.duration));
    }
  }

  function blockProgress() {
    clearTimeout(listener)
    isValid = false
    isBlock = true
  }

  return (
    <View
      style={[
        styles.mainParent,
        {
          minWidth: `${barWidth / props.size - 1}%`,
          backgroundColor: barInActiveColor,
        }
      ]}>

      {props.currentIndex === props.progressIndex && (
        <View
          style={[
            styles.childActive,
            {
              width: `${progress}%`,
              height: barHeight,
              backgroundColor: barActiveColor,
            }]}
        />
      )}

      {(props.currentIndex != props.progressIndex) && (
        <View
          style={[
            styles.childInactive,
            {
              backgroundColor: props.currentIndex >= props.progressIndex ? barInActiveColor : barActiveColor,
              minWidth: `${barWidth / props.size - 1}%`,
              height: barHeight
            }
          ]}
        />
      )}
    </View>
  );
}

export default ProgressItem;

const styles = StyleSheet.create({
  mainParent: {
    // marginLeft: '0.5%',
    // marginRight: '0.5%',
    borderRadius: 20,
  },
  childActive: {
    borderRadius: 20,
  },
  childInactive: {
    borderRadius: 20,
  }
});
