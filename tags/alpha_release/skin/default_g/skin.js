skin = function() {
  return {
    changeBGColor: function(id, color){
      $(id).style.background = color;
    },
    
    render: function(cal) {
      document.body.style.width = '130px';
      document.body.style.height = '125px';
      var background = '<g:background src="%folder%/bg.png" style="position:absolute; z-index:-1;"/><div id="calendar"></div>';
      background = background.replace(/%folder%/g, kisaragi.getSkinFolder());
      $('background').innerHTML = background;
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
