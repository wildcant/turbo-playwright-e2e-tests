import { faker } from '@faker-js/faker'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { Todo, User } from 'schemas'
import { CheckExclude, ExcludeArgs, GetEntityPayload } from './types'

/** Generic function that allows to create an object of a given entity, allows to exclude and override keys in a type safe manner. */
type CreateFakeArgs<T extends {}> = ExcludeArgs<T> & { overrides?: Partial<T> }
const createFakeEntity = <T extends {}, TArgs extends CreateFakeArgs<T>>(
  args: TArgs & { json: T }
): CheckExclude<TArgs, T, GetEntityPayload<T, TArgs>> => {
  return args?.exclude ? (merge(omit(args.json, args?.exclude), args.overrides ?? {}) as any) : args.json
}

export const createMock = {
  user: <TArgs extends CreateFakeArgs<User>>(args: TArgs) =>
    createFakeEntity<User, TArgs>({
      ...args,
      json: {
        id: faker.datatype.number(),
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
      },
    }),
  todo: <TArgs extends CreateFakeArgs<Todo>>(args: TArgs) =>
    createFakeEntity<Todo, TArgs>({
      ...args,
      json: {
        _id: faker.database.mongodbObjectId(),
        title: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
      },
    }),
}
