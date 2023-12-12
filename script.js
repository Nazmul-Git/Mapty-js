'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      // console.log(position)
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},13.15z?entry=ttu`
      );

      const coords = [latitude, longitude];

      //   L= name space of Leaflet & 'map' is empty div id name
      const map = L.map('map').setView(coords, 13);

      // console.log(map);//e {options: {…}, _handlers: Array(7), _layers: {…}, _zoomBoundLayers: {…}, _sizeChanged: false, …}

      // console.log(map.on);
      /**
       ƒ (t,e,i){
        if("object"==typeof t)for(var n in t)this._on(n,t[n],e);
        else for(var o=0,s=(t=F(t)).length;o<s;o++)this._on(t[o],e,i);
        return this}
       */

      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // on() is inside of map values prototype
      map.on('click', function (e) {
        console.log(e);
        const { lat, lng } = e.latlng;

        L.marker([lat, lng]).addTo(map).bindPopup('workout.').openPopup();
      });
    },
    () => {
      alert('Could not get your position');
    }
  );
}
