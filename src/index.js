import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

function onSearchInput(event) {
  const searchValue = event.target.value.trim().toLowerCase();
  console.log(searchValue);
  if (searchValue) {
    fetchCountries(searchValue)
      .then(result => displaySearchResult(result))
      .catch(error => console.log(error));
  }
};

const refs = {};

window.addEventListener('load', () => {
  refs.searchInput = document.querySelector('#search-box'),
  refs.countryList = document.querySelector('.country-list'),
  refs.countryInfo = document.querySelector('country-info'),
  refs.searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY))
})

function displaySearchResult(countryArray) {
  console.log(countryArray, countryArray.length);

  if (countryArray.length === 0) {
    Notify.failure('Oops, there is no country with that name');
    return;
  }

  if (countryArray.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countryArray.length === 1) {
    makeCountryInfoMarkup(countryArray[0]);
    return;
  }

  makeCountryArrayMarkup(countryArray);
}

function makeCountryInfoMarkup(country) {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = `<h2><img src=${country.flags.svg} alt="flag of ${
    country.name.official
  } class="flag-icon flag-icon-large" width="42" /> ${
    country.name.official
  }</h2><p><b>Capital: </b>${country.capital}</p><p><b>Population: </b>${
    country.population
  }</p><p><b>Languages: </b>${Object.values(country.languages).join(', ')}</p >`
};

function makeCountryArrayMarkup(countryArray) {
  const markup = countryArray.map(country => {
    const countryItem = document.createElement('li');
    countryItem.innerHTML = `<img src=${country.flags.svg} class="flag-icon" width="32" alt="flag of ${country.name.official}" /> ${country.name.official}`;

    return countryItem;
  });
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  refs.countryList.append(...markup);
};





