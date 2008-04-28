kisaragi = function() {
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
  
  var skin_name = '';
  
  return {
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
      skinname = s;
      $('css').href = './skin/' + skinname + '/style.css';
      var jsname = './skin/' + skinname + '/skin.js';
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
      return './skin/' + skinname;
    }
  };
}();


gadget = function() {
  return {
    pageLoad: function() {
      window.detachEvent('onload', gadget.pageLoad);
      kisaragi.loadSkin('flat_black');
      
      //skin.render(kisaragi.getCalendar(new Date(), 0));
      skin.render(kisaragi.getCalendar(new Date(), 0));
      //$('calendar').innerHTML = '<img src="skin/flat_black/month_1.png"/>';
    }
  };
}();

window.attachEvent('onload', gadget.pageLoad);
