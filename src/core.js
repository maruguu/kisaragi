var kisaragi = function() {
  var leap = function(year){
    return year % 4 ? 0 : year % 100 ? 1 : year % 400 ? 0 : 1;
  };
  
  // カレンダクラス
  var Calendar = function(){
    this.year = 2000;
    this.month = 1;
    this.tod = 1;
    this.startDay = 0;
    this.date = new Array();
    this.holidays = null;
  };
  
  // refresh
  var today_cal; // render時に更新される
  var dateTimer = null;
  var refresh_date = function() {
    if(dateTimer) {
      clearTimeout(dateTimer);
    }
    var tod = new Date();
    var d = tod.getDate();
    
    // 日付が変わったかどうかチェック
    if(today_cal.tod != d) {
      kisaragi.render(kisaragi.getCalendar(tod, 0));
      if(kisaragi.getHolidayCheck()) {
        kisaragi.requestiCal(kisaragi.getiCalUrl(), kisaragi.setHolidays);
      }
    }
    var s = tod.getSeconds();
    dateTimer = setTimeout(function() { refresh_date(); }, (60 - s) * 1000);
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
      today_cal = cal;
      skin.render(cal);
      lock = false;
    } else {
      renderTimer = setTimeout(function() { render_core(cal); }, 500);
   }
  };
  
  // settings variables
  var skinName;   // current skin name
  var checkVer;
  var checkHoliday;
  var iCalUrl;
  
  return {
    // setting functions (global)
    read_settings: function() {
      skinName = System.Gadget.Settings.read('skinName');
      if (!skinName) skinName = 'default';
      checkHoliday = System.Gadget.Settings.read('checkHoliday');
      iCalUrl = System.Gadget.Settings.read('iCalUrl');
      if (!iCalUrl) iCalUrl = 'http://www.google.com/calendar/ical/japanese__ja%40holiday.calendar.google.com/public/basic.ics';
      checkVer = System.Gadget.Settings.read('checkVer');
    },
    
    write_settings: function() {
      System.Gadget.Settings.write('skinName', skinName);
      System.Gadget.Settings.write('checkHoliday', checkHoliday);
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
    
    setHolidayCheck: function(s) {
      checkHoliday = s;
    },
    
    getHolidayCheck: function() {
      return checkHoliday;
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
      var tod = time || new Date();
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
      //skin.render(kisaragi.getCalendar(new Date(year, month - 1 + 1), 0));
      kisaragi.render(kisaragi.getCalendar(new Date(year, month - 1 + 1), 0));
      if(kisaragi.getHolidayCheck()) {
        kisaragi.requestiCal(kisaragi.getiCalUrl(), kisaragi.setHolidays, new Date(year, month - 1 + 1));
      }
    },
    
    paintPrevMonth: function(year, month) {
      if((year == 100) && (month == 1)) return;
      //skin.render(kisaragi.getCalendar(new Date(year, month - 1 - 1), 0));
      kisaragi.render(kisaragi.getCalendar(new Date(year, month - 1 - 1), 0));
      if(kisaragi.getHolidayCheck()) {
        kisaragi.requestiCal(kisaragi.getiCalUrl(), kisaragi.setHolidays, new Date(year, month - 1 - 1));
      }
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
      $('calendar').innerHTML = '';
    },
    
    getSkinFolder: function() {
      return './skin/' + skinName;
    },
    
    
    requestiCal: function(url, callback, option) {
  
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true)
      xhr.onreadystatechange = function(istimeout) {
        if(xhr && xhr.readyState == 4) {
          if(xhr.status == 200) {
            var myCalReader = new iCalReader(); 
            myCalReader.prepareData(xhr.responseText);
            myCalReader.parse();
            myCalReader.sort();
            
            callback(myCalReader.getCalendar(), option);
            
          } else {
          }
        } else if(xhr && istimeout == 'timeout') {
        } else if(xhr && xhr.readyState == 3) {
        } else {
        }
      };
      xhr.send('');
    },
     
    setHolidays: function(calendar, req_date) {
      req_date = req_date || new Date();
      var cal = kisaragi.getCalendar(req_date, 0);
      cal.holidays = new Array();
      
      var y = cal.year;
      var m = cal.month - 1;
      var date = new Date(y, m, 1, 0, 0, 0);
      
      var prevMonthFlag = true;
      var nextMonthFlag = false;
      for(var i = 0; i < cal.date.size(); i++) {
        if(cal.date[i] == 1) {
          prevMonthFlag = false;
        } else if(!prevMonthFlag && (cal.date[i] == 1)){
          nextMonthFlag = true;
        }
        if(!(prevMonthFlag || nextMonthFlag)) {
          var result = iCalUtility.isHoliday(calendar, date);
          cal.holidays.push(result);
          date.setDate(date.getDate() + 1);
        } else {
          cal.holidays.push(false);
        }
      }
      
      kisaragi.render(cal);
    }, 
    
    render: function(cal) {
      if(renderTimer) {
        clearTimeout(renderTimer);
      }
      renderTimer = setTimeout(function() { render_core(cal); }, 500);
    },
    
    update_date: function() {
      if(dateTimer) {
        clearTimeout(dateTimer);
      }
      var tod = new Date();
      var s = tod.getSeconds();
      dateTimer = setTimeout(function() { refresh_date(); }, (60 - s) * 1000);
    }
  };
}();
