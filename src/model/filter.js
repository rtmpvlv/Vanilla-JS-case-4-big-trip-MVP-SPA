/* eslint-disable no-underscore-dangle */
import AbstractObserver from '../utils/abstract-observer';
import { FilterType } from '../utils/constants';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
