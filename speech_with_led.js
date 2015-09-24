//say converts pre-defined text to speech
var say = require('say');
    GPIO = require('onoff').Gpio, 
    gled = new GPIO(17, 'out'),
    rled = new GPIO(22, 'out');

function flash(){
  if(state ==1 ){
    say.speak(null, 'Hi! Turning light green');
    gled.writeSync(1);
    rled.writeSync(0);
    state = 0;    
  }
  else{
    say.speak(null, 'Bye! Turning light red');
    rled.writeSync(1);
    gled.writeSync(0);
    state=1;
  }
}

state=0;
setInterval(function(){
  flash();
}, 3000);