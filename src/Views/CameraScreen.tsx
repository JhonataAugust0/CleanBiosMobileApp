import {View} from 'react-native';
import CameraComponent from '../components/CameraComponent.tsx';
import React from 'react';

const CameraScreen = () => {
  const handleTakePicture = (image: any) => {
    console.log('Foto capturada:', image);
  };
  return (
    <View style={{flex: 1}}>
      <CameraComponent onTakePicture={handleTakePicture} />
    </View>
  );
};

export default CameraScreen;
