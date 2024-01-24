import {useEffect, useState} from 'react';
import {Service} from '../interfaces/Service.ts';
import {Button, Card, TextInput, Portal} from 'react-native-paper';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import ServiceDatabase from '../database/database.ts';
import GalleryComponent from '../components/GalleryComponent.tsx';

function SchedulleForm({navigation}) {
  const [servico, setDescription] = useState('');
  const [data_agendado, setDueDate] = useState('');
  const [services, setService] = useState<Service[]>([]);
  const [photo, setPhoto] = useState('');
  const [showGallery, setShowGallery] = useState(false);
  const [photoPaths, setPhotoPaths] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState('');

  // const navigation = useNavigation();
  const dbInstance = new ServiceDatabase();

  const fetchData = async () => {
    try {
      await dbInstance.openDatabase();
      const servicesList = await dbInstance.listar();

      const mappedServices = servicesList.map(item => ({
        id: item.id,
        servico: item.servico,
        data: item.data,
        foto: item.foto,
      }));
      setService(mappedServices);
    } catch (error) {
      console.error('Erro ao buscar dados do banco de dados:', error);
    } finally {
      await dbInstance.closeDatabase();
    }
  };

  const handleAddService = async () => {
    try {
      await dbInstance.openDatabase();
      const data = {
        servico: servico,
        data: data_agendado,
        foto: photo,
      };
      await dbInstance.inserir(data);
      setDescription('');
      setDueDate('');
      fetchData();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } finally {
      await dbInstance.closeDatabase();
    }
  };

  const removeService = async (serviceId: number) => {
    console.log('Removendo tarefa: ', serviceId);
    try {
      await dbInstance.openDatabase();
      await dbInstance.remover(serviceId);

      const updatedServicesList = await dbInstance.listar();
      const updatedMappedServices = updatedServicesList.map(item => ({
        id: item.id,
        servico: item.servico,
        data: item.data,
        foto: item.foto,
      }));
      setService(updatedMappedServices);
    } catch (error) {
      console.error('Erro ao remover tarefa do banco de dados:', error);
    } finally {
      await dbInstance.closeDatabase();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenGallery = () => {
    setShowGallery(true);
  };
  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  async function loadPhotos() {
    try {
      await dbInstance.openDatabase();
      const photoList = await dbInstance.listarFoto();
      setPhotoPaths(photoList);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    }
  }

  const handlePhotoSelected = (photoPath: React.SetStateAction<string>) => {
    setSelectedPhoto(photoPath);
    setPhoto(photoPath);
  };
  const handleCapturePhoto = async () => {
    navigation.navigate('CameraScreen');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPhotos();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => handlePhotoSelected(item.path)}>
        <Text>{item.path}</Text>
      </TouchableOpacity>
    );
  };

  const handleGalleryImageSelect = (imageUri: string | null) => {
    console.log('Foto selecionada pela galeria:', imageUri);
    setPhoto(imageUri);
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={showGallery}
          onRequestClose={handleCloseGallery}
          animationType="slide"
          style={styles.modalContainer}>
          <Button
            icon="close"
            mode="text"
            onPress={handleCloseGallery}
            style={styles.closeButton}>
            Fechar Galeria
          </Button>
          <GalleryComponent onSelectImage={handleGalleryImageSelect} />
        </Modal>
      </Portal>
      <Card style={styles.card}>
        <Card.Title title="CleanBIOS" titleStyle={styles.enterpriseName} />
        <Card.Content>
          <TextInput
            label="Serviço"
            value={servico}
            onChangeText={text => setDescription(text)}
            style={styles.input}
          />
          <TextInput
            label="Data yyyy-dd-mm"
            value={data_agendado}
            onChangeText={text => setDueDate(text)}
            style={styles.input}
          />
          <FlatList
            data={photoPaths}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
          <Text style={styles.textLabel}>Foto selecionada: {selectedPhoto}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            icon="camera"
            mode="contained"
            onPress={handleCapturePhoto}
            style={styles.photoButton}>
            Fotografe seu dispositivo (opcional)
          </Button>
          <Button
            icon="camera-image"
            mode="contained"
            onPress={handleOpenGallery}
            style={styles.galleryButton}>
            Abrir Galeria
          </Button>
        </Card.Actions>
        <Card.Actions>
          <View style={styles.addButtonContainer}>
            <Button
              icon="check-bold"
              mode="contained"
              onPress={handleAddService}
              style={styles.addButton}>
              Adicionar tarefa
            </Button>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  listContainer: {
    backgroundColor: '#fff',
  },
  textLogo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 40,
  },
  serviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  textLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000',
  },
  completeButton: {
    backgroundColor: '#007bff',
    padding: 8,
    marginTop: 8,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  touchableButton: {
    width: '100%',
    height: 36,
    backgroundColor: '#53b5e6',
    borderRadius: 0,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  enterpriseName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    color: '#00cc00',
  },
  closeButton: {
    marginBottom: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 40,
    borderRadius: 8,
  },
  photoButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#53b5e6',
  },
  galleryButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#53b5e6',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#00cc00',
  },
});

export default SchedulleForm;
