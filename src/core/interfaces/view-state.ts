import { Signal } from '@angular/core';

export type ViewState<T> = Readonly<{
  [K in keyof T]: T[K] extends Signal<infer V> ? Signal<V> : T[K];
}>;
