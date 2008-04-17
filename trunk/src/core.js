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
    }
  };
}();

skin = function() {
  return {
    changeBGColor: function(id, color){
      $(id).style.background = color;
    },
    
    render: function(cal) {
      $('background').innerHTML = '<table border="0" cellspacing="0" cellpadding="0"><tr><td class="curve-corner"><img src="images/left-top.gif" /></td><td class="curve" width="120px"></td><td class="curve-corner"><img src="images/right-top.gif" /></td></tr><tr><td class="curve" colspan="3"><div id="calendar"></div></td></tr><tr><td id="curve-corner"><img src="images/left-bottom.gif" /></td><td class="curve" width="120px"></td><td class="curve-corner"><img src="images/right-bottom.gif" /></td></tr></table>';
      
      var template = '<table class="calendar"><tr><td>%year%</td><td>%d0%</td><td>%d1%</td><td>%d2%</td><td>%d3%</td><td>%d4%</td><td>%d5%</td><td>%d6%</td></tr><tr><td rowspan="6"><table><tr><td><div id="nextMonth" onclick="kisaragi.paintNextMonth(%year%, %month%)" onmouseover="skin.changeBGColor(\'nextMonth\', \'orange\')" onmouseout="skin.changeBGColor(\'nextMonth\', \'transparent\')">▲</div></td></tr><tr><td id="month">%month%</td></tr><tr><td><div id="prevMonth" onclick="kisaragi.paintPrevMonth(%year%, %month%)" onmouseover="skin.changeBGColor(\'prevMonth\', \'orange\')" onmouseout="skin.changeBGColor(\'prevMonth\', \'transparent\')">▼</div></td></tr></table></td><td>01</td><td>02</td><td>03</td><td>04</td><td>05</td><td>06</td><td>07</td></tr><tr><td>08</td><td>09</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr><tr><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td></tr><tr><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td></tr><tr><td>29</td><td>30</td><td>31</td><td>32</td><td>33</td><td>34</td><td>35</td></tr><tr><td>36</td><td>37</td><td>38</td><td>39</td><td>40</td><td>41</td><td>42</td></tr></table>';
      
      var nextMonthFlag = true;
      var prevMonthFlag = false;
      
      var tod = new Date;
      var y = tod.getFullYear();
      var m = tod.getMonth() + 1;
      var d = tod.getDate();
      
      var sunday = cal.startDay == 0 ? 0 : 7 - cal.startDay;
      var saturday = 6 - cal.startDay;
      
      for(var i = cal.date.size() - 1; i >= 0; i--) {
        var str = (i + 1) < 10 ? '0' + (i + 1) : (i + 1);
        var date = cal.date[i];
        if(nextMonthFlag && (date >= 28)) {
          nextMonthFlag = false;
        } else if((i <= 7) && (date >= 23)) {
          prevMonthFlag = true;
        }
        
        // Coloring 
        // priority: Month +- 1 > today > holiday > Sunday > Saturday
        if(nextMonthFlag || prevMonthFlag) {
          date = '<font color="#aaaaaa">' + date + '</font>';
        } else if((cal.date[i] == d) && (cal.month == m) && (cal.year == y)) {
          date = '<div id="today">' + date + '</div>';
        } else if(i % 7 == sunday) {
          date = '<font color="#ff0000">' + date + '</font>';
        } else if(i % 7 == saturday) {
          date = '<font color="#0000ff">' + date + '</font>';
        } 
        
        template = template.replace(str, date);
      }
      template = template.replace(/%year%/g, cal.year);
      template = template.replace(/%month%/g, cal.month);
      var days = ['<font color="#FF0000">日</font>', '月', '火', '水', '木', '金', '<font color="#0000FF">土</font>'];
      for(var i = 0; i < 7; i++) {
        var day = '%d' + i + '%';
        var offset = cal.startDay + i;
        if(offset >= 7) offset -= 7;
        template = template.replace(day, days[offset]);
      }
      $('calendar').innerHTML = template;
    }
  };
}();

gadget = function() {
  return {
    pageLoad: function() {
      window.detachEvent('onload', gadget.pageLoad);
      skin.render(kisaragi.getCalendar(new Date(), 0));
    }
  };
}();

window.attachEvent('onload', gadget.pageLoad);
