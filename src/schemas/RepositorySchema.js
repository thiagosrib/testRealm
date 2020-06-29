export default class RepositorySchema {
  static schema = {
    name: 'Repository', // nome da tabela
    primaryKey: 'id',
    properties: { // todos os campos do schema
      id: { type: 'int', indexed: true },
      name: 'string',
      fullName: 'string',
      description: 'string',
      stars: 'int',
      forks: 'int',
    }
  }
}
