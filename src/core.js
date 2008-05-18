var kisaragi = function() {
  var leap = function(year){
    return year % 4 ? 0 : year % 100 ? 1 : year % 400 ? 0 : 1;
  };
  
  var Calendar = function(){
    this.year = 2000;
    this.month = 1;
    this.tod = 1;
    this.startDay = 0;
    this.date = new Array();
  };
  
  // render function
  var lock = false;
  var renderTimer = null;
  var render_core = function(cal) {
    if(renderTimer) {
      clearTimeout(renderTimer);
    }
    
    if(!lock) {
      lock = true;
      skin.render(cal);
      lock = false;
    } else {
      renderTimer = setTimeout(function() { render_core(cal); }, 500);
   }
  };
  
  // settings variables
  var skinName;   // current skin name
  var checkVer;
  var iCalUrl;
  
  return {
    // setting functions (global)
    read_settings: function() {
      skinName = System.Gadget.Settings.read('skinName');
      if (!skinName) skinName = 'default';
      iCalUrl = System.Gadget.Settings.read('iCalUrl');
      if (!iCalUrl) iCalUrl = 'http://www.google.com/calendar/ical/japanese__ja%40holiday.calendar.google.com/public/basic.ics';
      checkVer = System.Gadget.Settings.read('checkVer');
    },
    
    write_settings: function() {
      System.Gadget.Settings.write('skinName', skinName);
      System.Gadget.Settings.write('iCalUrl', iCalUrl);
      System.Gadget.Settings.write('checkVer', checkVer);
    },
    
    setSkinName: function(s) {
      skinName = s;
    },
    
    getSkinName: function() {
      return skinName;
    },
    
    setiCalUrl: function(s) {
      iCalUrl = s;
    },
    
    getiCalUrl: function() {
      return iCalUrl;
    },
    
    setVersionCheck: function(s) {
      checkVer = s;
    },
    
    getVersionCheck: function() {
      return checkVer;
    },
    
    
    // for debugging
    printCalendar: function(page, cal) {
      $(page).innerHTML = "";
      $(page).innerHTML += "<h2> year " + cal.year + "</h2><br />";
      $(page).innerHTML += "<h2> month " + cal.month + "</h2><br />";
      $(page).innerHTML += "<h2> today " + cal.tod + "</h2><br />";
      $(page).innerHTML += "<h2> startday " + cal.startDay + "</h2><br />";
      for(var i = 0; i < cal.date.length; i++) {
        $(page).innerHTML += " " + cal.date[i] + " ";
      }
      $(page).innerHTML += "<br />";
    },
    
    getCalendar: function(time, startDay) {
      var tod = time || new Date;
      startDay = startDay || 0;
      
      var y = tod.getFullYear();
      var m = tod.getMonth();
      var date = new Array();
      var months = [31, 28 + leap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      for(var i = 1; i <= months[m]; i++) {
        date.push(i);
      }
      var d = 1;
      var day = (new Date(y, m, 1, 0, 0, 0)).getDay();
      if(day != startDay) {
        d = m == 0 ? months[11] : months[m - 1];
        date.unshift(d);
        day = day == 0 ? 6 : day - 1;
        while(day != startDay) {
          --d;
          date.unshift(d);
          day = day == 0 ? 6 : day - 1;
        }
      }
      d = 1;
      while(date.size() < 42) {
        date.push(d);
        ++d;
      }
      var cal = new Calendar();
      cal.year = y;
      cal.month = m + 1;
      cal.tod = tod.getDate();
      cal.startDay = startDay;
      cal.date = date;
      return cal;
    },
    
    paintNextMonth: function(year, month) {
      if((year == 9999) && (month == 12)) return;
      skin.render(kisaragi.getCalendar(new Date(year, month - 1 + 1), 0));
    },
    
    paintPrevMonth: function(year, month) {
      if((year == 100) && (month == 1)) return;
      skin.render(kisaragi.getCalendar(new Date(year, month - 1 - 1), 0));
    },
    
    loadSkin: function(s) {
      $('css').href = './skin/' + s + '/style.css';
      var jsname = './skin/' + s + '/skin.js';
      var scr = document.getElementsByTagName('script');
      if(scr.size > 0) {
        for(var i in scr) {
          document.removeChild(scr[i]);
        }
      }
      var s = document.createElement('script');
      s.src = jsname;
      s.type = 'text/javascript';
      s.charset = 'utf-8';
      document.body.appendChild(s);
    },
    
    getSkinFolder: function() {
      return './skin/' + skinName;
    },
    
    
    requestiCal: function(url, callback) {
  
       var xhr = new XMLHttpRequest();
       xhr.open('GET', url, true)
       xhr.onreadystatechange = function(istimeout) {
         if(xhr && xhr.readyState == 4) {
           if(xhr.status == 200) {
             var myCalReader = new iCalReader(); 
             myCalReader.prepareData(xhr.responseText);
             myCalReader.parse();
             myCalReader.sort();
             
             callback(myCalReader.getCalendar());
             
           } else {
             $('calendar').innerHTML = xhr.status + ':' + xhr.statusText;
           }
         } else if(xhr && istimeout == 'timeout') {
           $('calendar').innerHTML = 'timeout';
         } else if(xhr && xhr.readyState == 3) {
           $('calendar').innerHTML = 'hoge';
         } else {
           $('calendar').innerHTML = 'hogehoge';
         }
       };
         $('calendar').innerHTML = 'start';
       xhr.send('');
     },
     
     render: function(cal) {
       renderTimer = setTimeout(function() { render_core(cal); }, 500);
     }
   };
}();
