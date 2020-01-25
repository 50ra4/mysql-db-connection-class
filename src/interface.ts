import { PoolConnection, Pool } from 'mysql';

export abstract class IMySqlPoolConnection {
  protected abstract readonly pool: Pool;
  protected abstract readonly isDebug: boolean;
  protected abstract async query<T = any>(connection: PoolConnection, queryStr: string): Promise<T>;
  protected abstract async beginTransaction(connection: PoolConnection): Promise<void>;
  protected abstract async commit(connection: PoolConnection): Promise<void>;
  protected abstract async getConnection(): Promise<PoolConnection>;
  abstract async executeReadOnly<T = any>(queryStr: string): Promise<T>;
  abstract async execute<T = any>(connection: PoolConnection, queryStr: string): Promise<T>;
  abstract async executeWithTransaction<T = any>(scope: (connection: PoolConnection) => Promise<T>): Promise<T>;
}
