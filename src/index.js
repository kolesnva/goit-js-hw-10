import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

import './css/styles.css';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

refs.searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput() {
  const searchValue = refs.searchInput.value.trim().toLowerCase();

  console.log(searchValue);

  if (searchValue) {
    fetchCountries(searchValue)
      .then(resultLengthCheck)
      .catch(error => console.log(error));
  }

  if (searchValue.length === 0) {
    clearSearchResult();
  }
};

function resultLengthCheck(countryArray) {
  console.log(countryArray);

  if (countryArray.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countryArray.length === 1) {
    buildCountryInfoMarkup(countryArray[0]);
    refs.countryList.innerHTML = '';
    return;
  } else {
    buildCountryArrayMarkup(countryArray);
    refs.countryInfo.innerHTML = '';
    return;
  }
};

function buildCountryInfoMarkup(country) {

  const countryInfoMarkup = `<h2><img src=${country.flags.svg} alt="flag of ${
    country.name.official
  } class="flag-icon flag-icon-large" width="42" /> ${
    country.name.official
  }</h2><p><b>Capital: </b>${country.capital}</p><p><b>Population: </b>${
    country.population
    }</p><p><b>Languages: </b>${Object.values(country.languages).join(', ')}</p >`;
  
  
  refs.countryInfo.innerHTML = countryInfoMarkup;
  
};

function buildCountryArrayMarkup(countryArray) {
  const countryListMarkup = countryArray.map(({ flags: { svg }, name: { official } }) => {
    return `<li class="list-item">
      <img src="${svg}" alt="${official} flag" width="30" height="25"/>
      ${official}
    </li>`
  }).join('');
  refs.countryList.innerHTML = countryListMarkup;
}
  
function clearSearchResult() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}





