import React, {useState, useEffect, useRef} from 'react';
import {View, Button, PermissionsAndroid, Alert, Platform} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import TaskDatabase from '../database/database';
import {useNavigation} from '@react-navigation/native';

const dbInstance = new TaskDatabase();

const CameraComponent = ({onTakePicture}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef<Camera>();
  const cameraPosition = useCameraDevice('back');
  const [capturedImagePath, setCapturedImagePath] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false); //
  const navigation = useNavigation();

  const initializeCamera = async () => {
    await cameraRef.current?.focus({x: 0, y: 0});
    navigation.addListener('focus', handleScreenFocus);
    setIsCameraReady(true);
  };

  useEffect(() => {
    requestCameraPermission();
    initializeCamera();
  }, [initializeCamera]);

  const handleScreenFocus = () => {
    console.log('Tela CameraScreen está em foco');

    if (isCameraReady) {
      setCapturedImage(null);
      setCapturedImagePath(null);
    }
  };

  const handleCameraError = (e: any) => {
    console.log('error', e);
  };

  const requestCameraPermission = () => {
    try {
      const grantedCam = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permissão de câmera',
          message:
            'Este aplicativo precisa da permissão para utilizar a câmera.',
          buttonPositive: 'OK',
        },
      );
      const grantedStorage = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permissão de armazenamento',
          message:
            'Este aplicativo precisa da permissão para salvar imagens na galeria.',
          buttonPositive: 'OK',
        },
      );
      const grantedReadSorage = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permissão de armazenamento',
          message:
            'Este aplicativo precisa da permissão para salvar imagens na galeria.',
          buttonPositive: 'OK',
        },
      );
      if (
        grantedCam === PermissionsAndroid.RESULTS.GRANTED &&
        grantedStorage === PermissionsAndroid.RESULTS.GRANTED &&
        grantedReadSorage === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissões concedidas');
      } else {
        console.log(PermissionsAndroid.RESULTS);
        console.log('Permissões negadas');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const handleTakePicture = async (): Promise<void> => {
    await dbInstance.openDatabase();
    const camera = cameraRef.current;
    if (camera) {
      try {
        const photo = await camera.takePhoto();
        const path = `${RNFS.ExternalStorageDirectoryPath}/DCIM/captured_image.jpg`;

        await RNFS.moveFile(photo.path, path);

        if (Platform.OS === 'android') {
          const result = await RNFS.scanFile(path);
          if (result && result.length > 0) {
            Alert.alert('Imagem salva na galeria!');
            onTakePicture && onTakePicture(photo);
            setCapturedImagePath(path);
            try {
              await dbInstance.inserirFoto({path: path});
            } catch (error) {
              console.error('Erro ao adicionar foto:', error);
            } finally {
              await dbInstance.closeDatabase();
            }
          } else {
            Alert.alert('Erro ao salvar imagem na galeria!');
          }
        } else {
          Alert.alert('Ação não suportada para iOS');
        }
      } catch (error) {
        console.error('Erro ao tirar a foto:', error);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      {capturedImagePath && (
        <View style={{flex: 1}}>
          <Button
            title="Ver Foto Capturada"
            onPress={() => Alert.alert('Caminho da Imagem:', capturedImagePath)}
          />
        </View>
      )}
      <View style={{flex: 1}}>
        <Camera
          photo={true}
          isActive={true}
          ref={cameraRef}
          device={cameraPosition}
          fullScreen={true}
          style={{flex: 1}}
          video={true}
          onError={handleCameraError}
        />
      </View>
      <Button title="Tirar Foto" onPress={handleTakePicture} />
    </View>
  );
};

export default CameraComponent;
