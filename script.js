'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);

    console.log(data);

    const html = `<article class="country">
<img class="country__img" src="${data.flags.png}" />
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
    1
  )} people</p>
  <p class="country__row"><span>🗣️</span>${data.languages.fra}</p>
  <p class="country__row"><span>💰</span>${data.currencies.EUR.name}</p>
</div>
</article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('nigeria');
getCountryData('france');

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags?.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name?.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${data.languages?.fra}</p>
        <p class="country__row"><span>💰</span>${data.currencies?.EUR.name}</p>
      </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

//Fetch API & promises
const getCountryDatas = function (country) {
  //country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      const neigbor = data[0].borders?.[0];

      if (!neigbor) return;

      //country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neigbor}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neigbor'))
    .catch(error => console.log(error));
};

btn.addEventListener('click', function () {
  getCountryDatas('greece');
});

// challenges 1
const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are based in ${data.city} in ${data.country}`);
    })
    .catch(err => console.log(`${err.message}`));
};

whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);

// Building simple promises

const lotteryPromise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    if (Math.random() >= 0.5) resolve('You win 💰');
    else reject(new Error('You lose'));
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

//promisifying setTimeout
// const wait = seconds => {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

wait(2)
  .then(() => console.log('I waited for 2 seconds'))
  .catch(err => console.error(err));

Promise.resolve('You win 💰').then(res => console.log(res));
Promise.reject(new Error('You lost  baba💰')).then(err => console.error(err));

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   poisiton => resolve(poisiton),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition()
  .then(pos => console.log(pos))
  .catch(err => console.error(err));

// challenge 2
const wait = seconds => {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

let currentImg;
createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
  })
  .catch(err => console.error(err));

//async / await promise
const whereAreWe = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error(`Problem getting country`);
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
  } catch (err) {
    console.error(err);
    renderError(`Something went wrong ${err.message}`);
  }
};

whereAreWe('france');
