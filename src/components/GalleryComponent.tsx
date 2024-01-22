import React, {useState} from 'react';
import {View, Button, Image, Alert} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {GalleryComponentProps} from '../interfaces/GalleryComponentProps.ts';

const GalleryComponent: React.FC<GalleryComponentProps> = ({onSelectImage}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleChoosePhoto = (): void => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
    };
    launchImageLibrary(options, (response: ImagePickerResponse): void => {
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.errorMessage) {
        console.error('Erro ao escolher a imagem:', response.errorMessage);
        Alert.alert('Erro', 'Houve um erro ao escolher a imagem.');
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        setSelectedImage(source ? source : null);
        onSelectImage(source);
      }
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {selectedImage && (
        <Image
          source={{uri: selectedImage}}
          style={{width: 200, height: 200, marginBottom: 20}}
        />
      )}
      <Button title="Escolher Foto da Galeria" onPress={handleChoosePhoto} />
    </View>
  );
};

export default GalleryComponent;
