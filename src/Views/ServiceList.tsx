import * as React from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';

const ServiceItem = ({title, description, value}) => {
  return (
    <Card style={stylesList.card}>
      <Card.Content>
        <Title style={stylesList.title}>{title}</Title>
        <Paragraph style={stylesList.description}>{description}</Paragraph>
        <Paragraph style={stylesList.value}>{value}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const ServiceList = () => {
  const servicesData = [
    {
      id: '1',
      title: 'Formatação',
      description: 'Formatação do sistema operacional',
      value: 'R$ 100,00',
    },
    {
      id: '2',
      title: 'Instalação de Componente',
      description: 'Instalação e configuração de hardware ou software',
      value: 'R$ 50,00',
    },
    {
      id: '3',
      title: 'Manutenção Preventiva',
      description: 'Revisão e limpeza do sistema para prevenir problemas',
      value: 'R$ 80,00',
    },
    {
      id: '4',
      title: 'Reparo',
      description: 'Reparo de hardware ou software',
      value: 'R$ 120,00',
    },
  ];

  return (
    <View style={stylesList.container}>
      <Text style={stylesList.enterpriseName}>CleanBIOS</Text>
      <FlatList
        data={servicesData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ServiceItem
            title={item.title}
            description={item.description}
            value={item.value}
          />
        )}
      />
    </View>
  );
};

const stylesList = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  enterpriseName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    color: '#00cc00',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: "#ece8e8"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00cc00',
  },
});

export default ServiceList;
