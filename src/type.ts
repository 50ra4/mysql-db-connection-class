type TMapDBColumnToProperty<T> = {
  dbColumnName: string;
  propertyName: keyof T;
  to?: (v: any) => any;
};

export type TMapDBColumnToPropertyConfig<T> = TMapDBColumnToProperty<T>[];
