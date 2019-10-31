import React from 'react';
import { StyleSheet, View, Text } from 'react-native'

import BalloonSlider from './src/Balloon';

export default App = () => {
  return (
    <View style={styles.container}>
      <BalloonSlider 
        onChange={(value) => console.log('onChange: ', value)}
        onChangeComplete={(value) => console.log('Complete: ', value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1
  }
});