import { AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { IStoreState } from 'store';

export type IThunk<R> = ThunkAction<R, IStoreState, {}, AnyAction>;
export type TDispatch = Dispatch<AnyAction> & ThunkDispatch<IStoreState, {}, AnyAction>;

export interface IPromiseAction<T = string, P = object, M = object> {
  readonly type: T;
  readonly payload: P;
  readonly meta?: M;
}

export interface IPromiseActionResponse<V> {
  value?: V;
  action?: IPromiseAction<string, V>;
}

export interface ISelectOption {
  label: string;
  value: string | number | object;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
