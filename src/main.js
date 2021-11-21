import MenuView from './view/menu';
import { getTripPointInfo } from './mock-data/mock-data';
import { render } from './utils/render';
import ListPresenter from './presenter/list';
import FilterPresenter from './presenter/filter';
import PointModel from './model/points';
import FilterModel from './model/filter';
import TripInfo from './presenter/trip-info';

const POINTS_COUNT = 15;
const tripPoints = new Array(POINTS_COUNT).fill().map(getTripPointInfo);

const header = document.querySelector('.trip-main');
const headerMenuNavigation = header.querySelector('.trip-controls__navigation');
const headerMenuFilters = header.querySelector('.trip-controls__filters');
const mainTripEventsSection = document.querySelector('.trip-events');

const pointModel = new PointModel();
pointModel.setPoints(tripPoints);
const filterModel = new FilterModel();

const listPresenter = new ListPresenter(mainTripEventsSection, pointModel, filterModel);
const filterPresenter = new FilterPresenter(headerMenuFilters, pointModel, filterModel);
listPresenter.renderView();
filterPresenter.init();
const tripInfopresenter = new TripInfo(header, pointModel);
tripInfopresenter.init();

render(headerMenuNavigation, new MenuView());

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  listPresenter.createPoint();
});

export default POINTS_COUNT;
