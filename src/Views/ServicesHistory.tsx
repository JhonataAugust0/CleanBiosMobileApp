import {useState} from 'react';
import {Service} from '../interfaces/Service.ts';
import {useFocusEffect} from '@react-navigation/native';
import * as React from 'react';
import {Card, Title, Paragraph, Text} from 'react-native-paper';
import { FlatList, Image, StyleSheet, View } from "react-native";
import ServiceDatabase from '../database/database.ts';

function ServicesHistory() {
  const [services, setServices] = useState<Service[]>([]);
  const dbInstance = new ServiceDatabase();
  const fetchData = async () => {
    try {
      await dbInstance.openDatabase();
      const servicesList = await dbInstance.listar();

      const mappedServices = servicesList.map(item => ({
        id: item.id,
        servico: item.servico,
        data: formatDateString(item.data),
        foto: item.foto,
      }));
      setServices(mappedServices);
    } catch (error) {
      console.error('Erro ao buscar dados do banco de dados:', error);
    } finally {
      await dbInstance.closeDatabase();
    }
  };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.enterpriseName}>CleanBIOS</Text>
      <FlatList
        style={styles.listContainer}
        data={services}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Card style={styles.serviceCard}>
            <Card.Content>
              <Title style={styles.textStyle}>Descrição: {item.servico}</Title>
              <Paragraph style={styles.textStyle}>
                Data de término: {item.data}
              </Paragraph>
            </Card.Content>
            {item.foto &&
            typeof item.foto === 'string' &&
            item.foto.trim() !== '' ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: `file://${item.foto}`}}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </View>
            ) : null}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  enterpriseName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    color: '#00cc00',
  },
  serviceCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
});

export default ServicesHistory;
