'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// let map, mapE;

class Workout {
  date= new Date();
  id= (Date.now()+'').slice(-10);
  constructor(coords, distance,duration){
    this.coords=coords;
    this.distance=distance; //km
    this.duration=duration; //min
  }
}

class Running extends Workout{
  type='running'
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration);
    this.cadence=cadence;
    
    this.calcPace();
  }

  calcPace(){
    this.pace= this.duration/this.distance;
    return this.pace;
  }
}

// const run1= new Running([39, -12], 5.2, 24, 178);
// console.log(run1);



class Cycling extends Workout{
  type='cycling'
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain=elevationGain;
    // this.type='cycling';

    this.calcSpeed();
  }

  calcSpeed(){
    this.speed= this.distance/this.duration;
    return this.speed;
  }
}
// const cycling1= new Cycling([39, -12], 27, 95, 523);
// console.log(cycling1);





////////////////////////////////////////////////////////
// Application Architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapE;
  #workout=[];

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }


  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert('Could not get your position');
      });
    }
  }

  _loadMap(position) {
    // console.log(position)
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(
    //   `https://www.google.com/maps/@${latitude},${longitude},13.15z?entry=ttu`
    // );

    const coords = [latitude, longitude];

    //   L= name space of Leaflet & 'map' is empty div id name
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling click on map
    // on() is inside of map values prototype
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapEv) {
    this.#mapE = mapEv;
      form.classList.remove('hidden');
      inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {

    const validInputs=(...inputs)=>inputs.every(inp=>Number.isFinite(inp));
    const allPositive= (...inputs)=>inputs.every(inp=>inp>0)

    e.preventDefault();
    console.log(this);
    // get data from form
    const type= inputType.value;
    const distance= +inputDistance.value;
    const duration= +inputDuration.value;
    const { lat, lng } = this.#mapE.latlng;
    let workout;
    

    // If workout running , create running object
    if(type==='running'){
      const cadence= +inputCadence.value;
      // check if data is valid
      if(
        // !Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)

        !validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence)
        )
        return alert('Input have to be positive numbers!')

      workout= new Running([lat, lng], distance, duration, cadence);
        
    }
    // If workout cycling , create cycling object
    if(type==='cycling'){
      const elevation= +inputElevation.value;

      if(!validInputs(distance, duration, elevation) || !allPositive(distance, duration)) 
      return alert('Input have to be positive numbers!')

    workout= new Cycling([lat, lng], distance, duration, elevation);
    
    }
    // add new object to workout array
    this.#workout.push(workout);
    console.log(workout)

    // render workout on map as marker 
    this.renderWorkoutMarker(workout);
   
    // render workout on list 



      // clear input field
      inputDistance.value =
        inputDuration.value =
        inputCadence.value =
        inputElevation.value =
          '';
      
  }
  renderWorkoutMarker(workout){

     L.marker(workout.coords)
     .addTo(this.#map)
     .bindPopup(
       L.popup({
         maxWidth: 250,
         minWidth: 100,
         autoClose: false,
         closeOnClick: false,
         className: `${workout.type}-popup`,
       })
     )
     .setPopupContent('workout')
     .openPopup();
  }
}

const app = new App();
console.log(app);