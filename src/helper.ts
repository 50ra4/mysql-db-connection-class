import { TMapDBColumnToPropertyConfig } from './type';

const toArrayDBObject = <T>(data: any, toRowDataConverter?: (data: any) => T): T[] => {
  if (!Array.isArray(data)) throw new Error("toRowData: parameter's data is no Array.");
  return !toRowDataConverter ? data.map((v) => ({ ...v })) : data.map(toRowDataConverter);
};

const toDBObject = <T>(config: TMapDBColumnToPropertyConfig<T>, data: any): T =>
  Object.entries(data).reduce((pre, [key, value]) => {
    const matched = config.find(({ dbColumnName }) => dbColumnName === key);
    if (!matched) return pre;
    return matched.to
      ? { ...pre, [matched.propertyName]: matched.to(value) }
      : { ...pre, [matched.propertyName]: value };
  }, {} as T);

export const toData = <T>(config: TMapDBColumnToPropertyConfig<T>): ((v: any) => T) => (data: any) =>
  toDBObject(config, data);

export const toRowDataPacket = <T>(config?: TMapDBColumnToPropertyConfig<T>) => (data: any) =>
  toArrayDBObject(data, config ? toData(config) : undefined);

export const toInsertId = (data: any): number | undefined =>
  data.hasOwnProperty('insertId') ? data.insertId : undefined;
