import Realm from 'realm';

import RepositorySchema from '~/schemas/RepositorySchema';

export default function getRealm() {
  return Realm.open({
    schema: [RepositorySchema], // se tivesse mais schemas poderia colocar aqui junto
  })
}
