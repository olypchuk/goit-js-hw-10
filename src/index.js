
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector("#search-box");
const DEBOUNCE_DELAY = 300;
const countryInfo = document.querySelector(".country-info");
const countryList=document.querySelector(".country-list")


input.addEventListener("input", debounce(validation, DEBOUNCE_DELAY))

function validation() {
  const inputValue=input.value.trim()
  if (inputValue === "") {
    clear()

    return
  }

  if(!inputValue){return}
 
  fetchCountries(inputValue)
    .then(response => {
     
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
      clear()
      // countryInfo.innerHTML = ""
      return Notify.failure("Oops, there is no country with that name")
    })

}

function renderCountries(countries) {
    clear()
  const markup = countries.map(country => {
  const {flags,name,capital,population,languages}=country
    return `<div>
      <img src="${flags.svg}" width ="30"><span>${name.official}</span>
      <p>Capital :${capital}</p>
      <p>Population :${population}</p>
      <p>Languages :${Object.values(languages)}</p>
      </div>`}).join("");

countryInfo.innerHTML=markup
}

function renderListCountries(items) {
clear()
  const markupList = items.map(country => {
    return `<li>
    <img src="${country.flags.svg}" alt="${country.name.official}" width ="30"><p>${country.name.official}</p></li>`
  }).join("");
  countryList.innerHTML = markupList;
  countryList.addEventListener("mouseover",onHoverItemList)
}

function onHoverItemList(e) {
  if (e.target.alt === undefined) {
    return
  } 
  e.target.setAttribute("width", "50");
}

function clear() {
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
}