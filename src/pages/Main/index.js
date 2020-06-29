import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '~/services/api';
import getRealm from '~/services/realm';

import Repository from '~/components/Repository';

import { Container, Title, Form, Input, Submit, List } from './styles';

export default function Main() {
  const [input, setInput] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadRepositories() {
      const realm = await getRealm();

      // para obter os dados no BD, utilizar o comando abaixo, onde será feita uma query no BD
      // primeiro parâmetro é o schema
      const data = realm.objects('Repository').sorted('stars', true);
      console.tron.log('repositories', repositories);

      setRepositories(data);
    }

    loadRepositories();
  }, []);

  async function saveRepository(repository) {
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

    const realm = await getRealm();

    // para salvar os dados no banco de dados é preciso encapsular a funçao para isso no realm.write, conforme abaixo
    // terceiro parametro é para quando o dado for atualizado
    realm.write(() => {
      realm.create('Repository', data, 'modified'); // schema e os dados para incluir
    });

    return data;
  }

  async function handleAddRepository() {
    try {
      const response = await api.get(`/repos/${input}`);

      await saveRepository(response.data);

      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      console.tron.log(err);
      setError(true);
    }
  }

  async function handleRefreshRepository(repository) {
    const response = await api.get(`/repos/${repository.fullName}`);

    const data = await saveRepository(response.data);

    setRepositories(repositories.map(repo => (repo.id === data.id ? data : repo)));
  }

  return (
    <Container>
      <Title>Repositórios</Title>

      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Procurar repositório..."
        />

        <Submit onPress={handleAddRepository}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Repository data={item} onRefresh={() => handleRefreshRepository(item)} />
        )}
      />
    </Container>
  );
}
