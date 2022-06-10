
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector("#search-box");
const DEBOUNCE_DELAY = 300;
const countryInfo=document.querySelector(".country-info")


input.addEventListener("input", debounce(validation, DEBOUNCE_DELAY))

function validation() {
  if (input.value === "") {
    countryInfo.innerHTML = ""
    return
} 
  fetchCountries(input.value.trim())
    .then(response => {
      console.log(response);
    
      if (response.length > 10) {
        return Notify.info("Too many matches found. Please enter a more specific name.")
      }
      if (response.length >= 2 && response.length <= 10) {
       return renderListCountries(response)
      } else {
        return renderCountries(response)
      }
      
    })

    .catch(error => {
      countryInfo.innerHTML = ""
      return Notify.failure("Oops, there is no country with that name")
    })

}

function renderCountries(countr) {

  const markup = countr.map(country => {
  const {flags,name,capital,population,languages}=country
    return `<li>
      <img src="${flags.svg}" width ="30">${name.official}
      <p>Capital :${capital}</p>
      <p>Population :${population}</p>
      <p>Languages :${Object.values(languages)}</p>
      </li>`}).join("");
  
countryInfo.innerHTML=markup
}

function renderListCountries(items) {
  const markupList = items.map(country => {
    return `<li>
    <img src="${country.flags.svg}" width ="30">${country.name.official}</li>`
  }).join("");
  countryInfo.innerHTML = markupList;
}