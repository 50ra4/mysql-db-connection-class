# mysql-db-pool-connection-class

## what is `mysql-db-pool-connection-class`?

## Installation

npm package

```
npm i mysql-db-pool-connection-class
```

&&

```
import { MySqlPoolConnection } from 'mysql-db-pool-connection-class';
```

## usage

API Documentation created By typedoc: [Check github pages](https://shigarashi1.github.io/mysql-db-connection-class)

### How to class

```
import { IMySqlPoolConnection, MySqlPoolConnection } from 'mysql-db-pool-connection-class';

const mysqlPoolConfig = {
  connectionLimit: << mysql connection >>,
  host: << mysql host >>,
  user: << mysql user >>,
  password: '<< mysql password >>,
  database: << mysql database >>,
}

export class TestClass {
  private readonly connection: IMySqlPoolConnection;
  constructor(connection: IMySqlPoolConnection) {
    this.connection = connection;
  }

  // SELECT Query use executeReadOnly
  async get18YearsUsers() {
    return await this.connection.executeReadOnly('SELECT * from where age = 18;');
  }

  // INSERT, UPDATE, DELETE use executeWithTransaction & execute
  async editUserName(userId: number, username: string) {
    return await this.connection.executeWithTransaction(async (connection) => {
      await this.connection.execute(
        connection,
        `UPDATE SET username = /'${username}/' where id = ${userId}`,
      );
      const projects = await this.connection
        .execute(connection, 'SELECT * from where id = ${userId};');
      return projects[0];
    });
  }
}

// DI injection
const test = new TestClass(new new TestClass(new MySqlPoolConnection(mysqlPoolConfig));

const users = test.get18YearsUsers();
console.log(users);
// [
//   {
//    id: 1,
//     username: 'risa',
//     age: 18,
//     createe_at: 2020-01-25T00:00:00.000Z,
//     updated_at: 2020-01-25T00:00:00.000Z,
//   },
//   {
//    id: 2,
//     username: 'masumi',
//     age: 18,
//     created_at: 2020-01-25T00:00:00.000Z,
//     updated_at: 2020-01-25T00:00:00.000Z,
//   },
//   {
//    id: 3,
//     username: 'yuka',
//     age: 18,
//     created_at: 2020-01-25T00:00:00.000Z,
//     updated_at: 2020-01-25T00:00:00.000Z,
//   },
//   ...
// ]

const modifiedUser = test.editUserName(3, 'yuuka');
console.log(modifiedUser);
// [
//   {
//    id: 3,
//     username: 'yuuka',
//     age: 18,
//     created_at: 2020-01-25T00:00:00.000Z,
//     updated_at: 2020-01-25T12:00:00.000Z,
//   },
//   ...
// ]
```

### How to converter

```
import { toRowDataPacket, TMapDBColumnToPropertyConfig } from 'mysql-db-pool-connection-class';
import { format } from 'date-fns';
import * as R from 'ramda';

const DATE_FORMAT = 'yyyy/MM/dd';
const toDateString = R.partialRight(format, [DATE_FORMAT, undefined]);
type TUser = {
  id: number;
  name: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

// map DB column name to Javascript interface property definition.
const USER_MAPPING_CONFIG: TMapDBColumnToPropertyConfig<TUser> = [
  {
    // db column name
    dbColumnName: 'id',
    // TUser property name
    propertyName: 'id',
  },
  {
    dbColumnName: 'name',
    propertyName: 'name',
  },
  {
    dbColumnName: 'age',
    propertyName: 'age',
  },
  {
    dbColumnName: 'created_at',
    propertyName: 'createdAt',
    // DB data convert function
    to: toDateString,
  },
  {
    dbColumnName: 'updated_at',
    propertyName: 'updatedAt',
    to: toDateString,
  },
];

// create converter function.
// return (data: any) => TUser[]
const toUsers = toRowDataPacket(USER_MAPPING_CONFIG);

export class TestClass {
  ...
  async get18YearsUsers() {
    return await this.connection.executeReadOnly('SELECT * from where age = 18;')
      // set converter
      .then(toUsers);
  }

  async addUser(username: string, age: number) {
    return await this.connection.executeWithTransaction(async (connection) => {
      const id = await this.connection
          .execute(
            connection,
            `INSERT INTO users (username, age) VALUES (/'${username}/', age);',
          )
          // return auto increment id
          .then(toInsertId);
    });
    return id;
  }
}

const test = new TestClass(new new TestClass(new MySqlPoolConnection(mysqlPoolConfig));
const users = test.get18YearsUsers();
console.log(users);
// [
//   {
//    id: 1,
//     username: 'risa',
//     age: 18,
//     createdAt: '2020/01/25',
//     updatedAt: '2020/01/25',
//   },
//  ...
// ]
const createdId = test.addUser('yuuki', 19);
console.log(createdId);
// 4
```
