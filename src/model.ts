import { PoolConfig, Pool, createPool, PoolConnection } from 'mysql';
import { IMySqlPoolConnection } from '.';

export class MySqlPoolConnection extends IMySqlPoolConnection {
  protected readonly pool: Pool;
  protected readonly isDebug: boolean;

  constructor(config: PoolConfig, isDebug: boolean = false) {
    super();
    this.pool = createPool(config);
    this.isDebug = isDebug;
    if (!this.isDebug) {
      return;
    }
    // pool event
    this.pool.on('connection', (connection) => {
      console.log('mysql connection create', connection.threadId);
    });
    this.pool.on('release', (connection) => {
      console.log('Connection %d released', connection.threadId);
    });
  }

  protected async getConnection() {
    return new Promise<PoolConnection>((resolve, reject) => {
      this.pool.getConnection((err, connection) => (err ? reject(err) : resolve(connection)));
    });
  }

  protected async query<T = any>(connection: PoolConnection, queryStr: string) {
    if (this.isDebug) console.log('Excute Query:', queryStr);
    return new Promise<T>((resolve, reject) => {
      connection.query(queryStr, (err, rows) => (err ? reject(err) : resolve(rows)));
    });
  }

  protected async beginTransaction(connection: PoolConnection) {
    return new Promise<void>((resolve, reject) => {
      connection.beginTransaction((err) => (err ? reject(err) : resolve()));
    });
  }

  protected async commit(connection: PoolConnection) {
    return new Promise<void>((resolve, reject) => {
      connection.commit((err) => (err ? reject(err) : resolve()));
    });
  }

  async executeReadOnly<T = any>(queryStr: string): Promise<T> {
    const connection = await this.getConnection();
    return this.query<T>(connection, queryStr).finally(() => connection.release());
  }

  async execute<T = any>(connection: PoolConnection, queryStr: string): Promise<T> {
    return this.query<T>(connection, queryStr);
  }

  async executeWithTransaction<T = any>(scope: (connection: PoolConnection) => Promise<T>): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const connection = await this.getConnection();
      try {
        await this.beginTransaction(connection);
        const result = await scope(connection);
        await this.commit(connection);
        resolve(result);
      } catch (error) {
        connection.rollback();
        reject(error);
      } finally {
        connection.release();
      }
    });
  }
}
