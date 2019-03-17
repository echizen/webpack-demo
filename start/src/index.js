// import _ from 'lodash';
import printMe from './print.js';
import './style.css';
import { cube } from './math.js'

function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');

  // Lodash, now imported by this script
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.innerHTML = 'Hello webpack' + cube(5);
  // element.classList.add('hello');

  // var myIcon = new Image();
  // myIcon.src = Icon;
  // element.appendChild(myIcon);


  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());

