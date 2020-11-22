var BUTTON_ICON = require('../img/button-icon.svg');
var BADGE_ICON = require('../img/badge-icon.svg');
var LOGO_ICON = require('../img/icon-logo.jpg');
BUTTON_ICON="https://linktoapp.app/button-icon.dd3b36cf.svg";
BADGE_ICON="https://linktoapp.app/badge-icon.a65bfaa4.svg"

var secondsToDhms = function(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600*24));
var h = Math.floor(seconds % (3600*24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);

var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "");
}


var onTimerClick = function(t,opts){
  var time_traveller_counter = {
    is_running: false,
    seconds_counter: 0,
    interval_id: 0,
  }
  t.get('card','shared','time_traveller_counter',time_traveller_counter).then(function(data){

    time_traveller_counter = data;
    function startTimerCounter(){
      time_traveller_counter.is_running = true;
      time_traveller_counter.seconds_counter+=1;
      time_traveller_counter.interval_id = interval_id;
      t.set('card','shared','time_traveller_counter',time_traveller_counter);
    }
    if(!time_traveller_counter.is_running){
      interval_id = setInterval(startTimerCounter,1000);
    }else{
      clearInterval(time_traveller_counter.interval_id);
      time_traveller_counter = {
        is_running: false,
        seconds_counter: time_traveller_counter.seconds_counter,
        interval_id: 0,
      }
       t.set('card','shared','time_traveller_counter',time_traveller_counter);
    }
  });
}

window.TrelloPowerUp.initialize({
  'card-badges': function(t,ops){
    return t.card('all').then(function(card){
        return t.get(card.id,'shared','time_traveller_counter',{
            is_running: false,
            seconds_counter: 0,
            interval_id: 0,
          }).then(function(data){
            var timer_count = (data.seconds_counter===0)? "0" : secondsToDhms(data.seconds_counter);
            var badge_color = (data.is_running)? "green" : "sky";
            return [{
              text: "Duration: "+timer_count,
              color:badge_color,
            }];
          });
    });
  },
  'card-buttons': function(t,opts){
    return t.card('id').then(function(card){
      return t.get(card.id,'shared','time_traveller_counter',{
        is_running: false,
        seconds_counter: 0,
        interval_id: 0,
      }).then(function(data){
        var button_text = (data.is_running)? 'Stop Timer':'Start Timer';
        return [{
          icon:BUTTON_ICON,
          text: button_text,
          callback: onTimerClick,
          condition:'always'
        }];
      });
    });
  },
  'card-detail-badges': function(t,opts){
    return t.card('all').then(function(card){
        return t.get(card.id,'shared','time_traveller_counter',{
            is_running: false,
            seconds_counter: 0,
            interval_id: 0,
          }).then(function(data){
            var timer_count = (data.seconds_counter===0)? "0" : secondsToDhms(data.seconds_counter);
            var badge_color = (data.is_running)? "green" : "purple";
            return [{
              text: "Time Tracked: "+timer_count,
              color: badge_color,
              callback: onTimerClick,
            }];
          });
    });
  }
});
