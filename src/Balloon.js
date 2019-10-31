

import React from 'react';
import { StyleSheet, Text, View, PanResponder, Animated, Image } from 'react-native';


export default BalloonSlider = ({ onChange, onChangeComplete }) => {
  const [sliderValue, setSliderValue] = React.useState(50);
  const [statusOfSliding, setStatusOfSliding] = React.useState('');
  const circlePosition = React.useRef(new Animated.ValueXY({x: 150, y: 92})).current;
  const circleSize = React.useRef(new Animated.Value(17)).current;
  const balloonPosition = React.useRef(new Animated.ValueXY({x: 139, y: 15})).current;
  const balloonOpacityAndScaleValue = React.useRef(new Animated.Value(0)).current;
  const sliderFilledPipeLineValue = React.useRef(new Animated.Value(0)).current;

  let latestPosition = 0;

  const useAnimation = (value, { toValue, duration = 500, delay = 0 }) => Animated.spring(value, { toValue, duration, delay }).start();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, { dx, dy, moveX, moveY }) => {
        if (moveX < 310) {
            onChange((moveX / 3).toFixed());
            if (latestPosition > moveX) {
            setStatusOfSliding('increase');
            } else {
            setStatusOfSliding('decrease');
            }
            sliderFilledPipeLineValue.setValue(moveX)
            useAnimation(balloonOpacityAndScaleValue, { toValue: 1 })
            useAnimation(circleSize, { toValue: 35 })
            circlePosition.setValue({ x: moveX, y: 80 });
            balloonPosition.setValue({ x: latestPosition > moveX ? moveX + 27 : moveX - 27, y: 15 });
            setSliderValue((moveX / 3).toFixed())
            latestPosition = moveX;
        } else {
            circlePosition.setValue({ x: 300, y: 80 });
            balloonPosition.setValue({ x: 300 - 11, y: 15 });
            setSliderValue(100);
            onChange(100);
        }
    },
    onPanResponderRelease: (event, { dx, dy, moveX, moveY }) => {
      setStatusOfSliding('stopped');
      useAnimation(circleSize, { toValue: 17, delay: 100 })
      
      useAnimation(balloonOpacityAndScaleValue, { toValue: 0, delay: 1000 })

      if (moveX < 310) {
        onChangeComplete((moveX / 3).toFixed());
        
        latestPosition = moveX;
        
        circlePosition.setValue({ x: moveX, y: 92 });
        balloonPosition.setValue({ x: moveX - 11, y: 25 });
        setSliderValue((moveX / 3).toFixed())
      } else {
        circlePosition.setValue({ x: 300, y: 92 });
        balloonPosition.setValue({ x: 300 - 11, y: 25 });
        setSliderValue(100);
        onChangeComplete(100);
      }
    },  
  });
  const sliderCirclePanResponder = React.useRef(panResponder).current;

    const getStatusOfSliding = () => {
      switch (statusOfSliding) {
        case 'increase':
          return '25deg';
        case 'decrease': 
          return '-25deg';
        case 'stopped': 
          return '0deg';

        default: 
          return '0deg';
      };
    };

    const getWidthOfFilledPipeLine = () => {
      console.log(circlePosition.x)
      return `${sliderValue}%`;
    }

    return (
      <View style={styles.container}>
        <View style={styles.sliderBox}>
          <Animated.View style={styles.balloonBox} {...balloonPosition.getLayout()}>
            <Animated.Image 
              source={require('../balloon.png')} 
              style={[styles.ballonStyle, {
                transform: [{ rotateZ: getStatusOfSliding() }, { scale: balloonOpacityAndScaleValue }],
                opacity: balloonOpacityAndScaleValue,
              }]}  
            />
            <Text 
                style={[styles.sliderValueText, {
                    transform: [{ rotateZ: getStatusOfSliding() }],
                }]}>
                {Math.abs(sliderValue)}
            </Text>
          </Animated.View>
          <View style={[styles.sliderFilledPipLine, {
            width: `${sliderValue}%`
          }]} />
          <View style={styles.sliderMainPipLine} />
          <Animated.View 
            style={[styles.sliderCircle, {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize
            }]} 
            {...sliderCirclePanResponder.panHandlers} 
            {...circlePosition.getLayout()} 
          />
        </View>
        <Text>{Math.abs(sliderValue)}</Text>        
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sliderBox: {
    width: '80%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderMainPipLine: {
    width: '90%',
    height: 2,
    backgroundColor: '#CCC'
  },
  sliderCircle: {
    width: 17,
    height: 17,
    borderRadius: 17,
    borderColor: '#5f27cd',
    borderWidth: 4,
    position: 'absolute',
    backgroundColor: '#FFF',
    zIndex: 100
  },
  balloonBox: {
    width: 40,
    height: 60,
    position: 'absolute',
    bottom: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballonStyle: {
    width: 40,
    height: 60,
    resizeMode: 'contain',
  },
  sliderValueText: {
    position: 'absolute',
    bottom: 22,
    marginBottom: 3,
    color: '#FFF',
    fontFamily: 'tahoma'
  },
  sliderFilledPipLine: {
    flex: 1,
    height: 4,
    backgroundColor: '#5f27cd',
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'flex-start'
  }
});
