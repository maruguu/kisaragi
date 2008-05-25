var iCalUtility = function() {

  var checkDate = function(a,  b) {
    if((a.getFullYear() == b.getFullYear()) &&
       (a.getMonth() == b.getMonth()) &&
       (a.getDate() == b.getDate())) {
      return true;
    }
    return false;
  };
    
  var checkInterval = function(date, freq, interval, sDate) {
    var startDate = new Date(sDate);
    var i = 0;
    if(freq == 'YEARLY') {
      while(date.getFullYear() >= startDate.getFullYear()) {
        if(date.getFullYear() == startDate.getFullYear()) {
          return true;
        }
        startDate.setFullYear(startDate.getFullYear() + parseInt(interval));
      }
    } else if(freq == 'MONTHLY') {
      while(date.getFullYear() >= startDate.getFullYear()) {
        if((date.getFullYear() == startDate.getFullYear()) &&
           (date.getMonth() == startDate.getMonth())) {
          return true;
        }
        startDate.setMonth(startDate.getMonth() + parseInt(interval));
      }
    } else if(freq == 'DAYLY') {
      while(date >= startDate) {
        if(checkDate(date, startDate)) {
          return true;
        }
        startDate.setDate(startDate.getDate() + parseInt(interval));
      }
    }
    return false;
  };
  
  var checkByMonth = function(date, value) {
    var list = value.split(',');
    for(var i = 0; i < list.length; i++) {
      if((date.getMonth() + 1)== list[i]) {
        return true;
      }
    }
    return false;
  };
  
  var checkByDay = function(date, value) {
    var reg_day = /([\+-]?\d)?((?:MO)|(?:TU)|(?:WE)|(?:TH)|(?:FR)|(?:SA)|(?:SU))/;
    value.match(reg_day);
    var day_ary = ['SU','MO','TU','WE','TH','FR','SA'];
    if(day_ary[date.getDay()] != RegExp.$2) {
      return false;
    }
    // check nth day
    if(RegExp.$1 != '') {
      if(RegExp.$1 > 0) {
        if((date.getDate() - (RegExp.$1 - 1) * 7 > 0) &&
           (date.getDate() - (RegExp.$1) * 7 <= 0)) {
          return true;
        } else {
          return false;
        }
      } else if(RegExp.$1 < 0) {
        // TODO: 
      }
    }
    return true;
  };
  
  // return date < until or not
  var checkUntil = function(date, value) {
    value.match(/^(\d\d\d\d)(\d\d)(\d\d)/);
    var y = RegExp.$1;
    var m = RegExp.$2 - 1;
    var d = RegExp.$3;
    
    if(((date.getFullYear() < y)) ||
       ((date.getFullYear() == y) && (date.getMonth() < m)) ||
       ((date.getFullYear() == y) && (date.getMonth() == m) && (date.getDate() <= d))) {
      return true;
    }
    return false;
  };
  
  
  return {
    isHoliday: function(calendar, date) {
      // check all event of calendar
      for(var i = 0; i < calendar.getNrOfEvents(); i++) {
        var event = calendar.getEventAtIndex(i); 
        var startDate = event.getStartDate();
        var rules = event.getRuleProperties();
        
        if(rules.size > 0) {
          // if VEVENT has RRULE section, check FREQ, INTERVAL...
          var freq = rules.getProperty('FREQ');
          var interval = 1;
          var result = false;
          
          if(rules.containsKey('INTERVAL')) {
            interval = rules.getProperty('INTERVAL');
          } else {
            interval = 1;
          }
          result = checkInterval(date, freq, interval, startDate);
          if(!result) {
            continue;
          }
          
          
          if(rules.containsKey('BYMONTH')) {
            if(!checkByMonth(date, rules.getProperty('BYMONTH'))) {
              continue;
            }
          } else {
            // if BYMONTH is missing, check the month of DTSTART
            if(date.getMonth() != startDate.getMonth()) {
              continue;
            }
          }
          
          if(rules.containsKey('BYWEEKNO')) {
            // not used
          }
          
          if(rules.containsKey('BYYEARDAY')) {
            // not used
          }
          
          if(rules.containsKey('BYMONTHDAY')) {
            // not used?
          } if(rules.containsKey('BYDAY')) {
            if(!checkByDay(date, rules.getProperty('BYDAY'))) {
              continue;
            }
          } else {
            // if both BYMONTHDAY and BYDAY are missing, 
            //  check the monthday of DTSTART.
            if(date.getDate() != startDate.getDate()) {
              continue;
            } 
          }
          
          if(rules.containsKey('COUNT')) {
            // TODO:
          }
          
          if(rules.containsKey('UNTIL')) {
            if(!checkUntil(date, rules.getProperty('UNTIL'))) {
              continue;
            }
          }
          return true;
        } else {
          if(checkDate(date, startDate)) {
            return true;
          }
        }
      }
      return false;
    }
  };
}();
