skin = function() {
  return {
    changeBGColor: function(id, color){
      $(id).style.background = color;
    },
    
    render: function(cal) {
      document.body.style.width = '130px';
      document.body.style.height = '82px';
      var template = '<g:background src="%folder%/bg.png" style="position:absolute; z-index:-1;"/><table cellspacing="0" cellpadding="0"><tr><td><img src="%folder%/year_%year0%.png" /><img src="%folder%/year_%year1%.png" /><img src="%folder%/year_%year2%.png" /><img src="%folder%/year_%year3%.png" /><img src="%folder%/padding.png" /><img src="%folder%/month_%month%.png" onclick="kisaragi.paintNextMonth(%year%, %month%)" oncontextmenu="kisaragi.paintPrevMonth(%year%, %month%)" /></td></tr></table><table cellspacing="0" cellpadding="0"><tr><td class="vertical_line_w"></td></tr></table><table cellspacing="0" cellpadding="0"><tr><td width="5px"></td><td class="line"></td><td class="days"><img src="%folder%/day_0_r.png" /></td><td class="line"></td><td class="days"><img src="%folder%/day_1.png" /></td><td class="line"></td><td class="days"><img src="%folder%/day_2.png" /></td><td class="line"></td><td class="days"><img src="%folder%/day_3.png" /></td><td class="line"></td><td class="days"><img src="%folder%/day_4.png" /></td><td class="line"></td><td class="days"><img src="%folder%/day_5.png" /></td><td class="line"></td><td class="days"><img src="%folder%/day_6_b.png" /></td><td class="line"></td><td width="5px"></td></tr><tr><td class="vertical_line" colspan="17"></td></tr><tr><td width="5px"></td><td class="line"></td><td>%00%</td><td class="line"></td><td>%01%</td><td class="line"></td><td>%02%</td><td class="line"></td><td>%03%</td><td class="line"></td><td>%04%</td><td class="line"></td><td>%05%</td><td class="line"></td><td>%06%</td><td class="line"></td><td width="5px"></td></tr><tr><td class="vertical_line" colspan="17"></td></tr><tr><td width="5px"></td><td class="line"></td><td>%07%</td><td class="line"></td><td>%08%</td><td class="line"></td><td>%09%</td><td class="line"></td><td>%10%</td><td class="line"></td><td>%11%</td><td class="line"></td><td>%12%</td><td class="line"></td><td>%13%</td><td class="line"></td><td width="5px"></td></tr><tr><td class="vertical_line" colspan="17"></td></tr><tr><td width="5px"></td><td class="line"></td><td>%14%</td><td class="line"></td><td>%15%</td><td class="line"></td><td>%16%</td><td class="line"></td><td>%17%</td><td class="line"></td><td>%18%</td><td class="line"></td><td>%19%</td><td class="line"></td><td>%20%</td><td class="line"></td><td width="5px"></td></tr><tr><td class="vertical_line" colspan="17"></td></tr><tr><td width="5px"></td><td class="line"></td><td>%21%</td><td class="line"></td><td>%22%</td><td class="line"></td><td>%23%</td><td class="line"></td><td>%24%</td><td class="line"></td><td>%25%</td><td class="line"></td><td>%26%</td><td class="line"></td><td>%27%</td><td class="line"></td><td width="5px"></td></tr><tr><td class="vertical_line" colspan="17"></td></tr><tr><td width="5px"></td><td class="line"></td><td>%28%</td><td class="line"></td><td>%29%</td><td class="line"></td><td>%30%</td><td class="line"></td><td>%31%</td><td class="line"></td><td>%32%</td><td class="line"></td><td>%33%</td><td class="line"></td><td>%34%</td><td class="line"></td><td width="5px"></td></tr><tr><td class="vertical_line" colspan="17"></td></tr><tr><td width="5px"></td><td class="line"></td><td>%35%</td><td class="line"></td><td>%36%</td><td class="line"></td><td>%37%</td><td class="line"></td><td>%38%</td><td class="line"></td><td>%39%</td><td class="line"></td><td>%40%</td><td class="line"></td><td>%41%</td><td class="line"></td><td width="5px"></td></tr></table>';
      var year_str = String(cal.year);
      template = template.replace(/%year0%/, year_str.slice(0,1));
      template = template.replace(/%year1%/, year_str.slice(1,2));
      template = template.replace(/%year2%/, year_str.slice(2,3));
      template = template.replace(/%year3%/, year_str.slice(3,4));
      
      template = template.replace(/%year%/g, cal.year);
      template = template.replace(/%month%/g, cal.month);
      
      var nextMonthFlag = true;
      var prevMonthFlag = false;
      
      var tod = new Date;
      var y = tod.getFullYear();
      var m = tod.getMonth() + 1;
      var d = tod.getDate();
      
      var sunday = cal.startDay == 0 ? 0 : 7 - cal.startDay;
      var saturday = 6 - cal.startDay;
      
      for(var i = cal.date.size() - 1; i >= 0; i--) {
        var str = i < 10 ? '0' + i : i;
        str = '%' + str + '%';
        var date = String(cal.date[i]);
        if(nextMonthFlag && (date >= 28)) {
          nextMonthFlag = false;
        } else if((i <= 7) && (date >= 23)) {
          prevMonthFlag = true;
        }
        
        // Coloring 
        // priority: Month +- 1 > today > holiday > Sunday > Saturday
        var color = '';
        var today = false;
        if(nextMonthFlag || prevMonthFlag) {
          color = 'h';
        } else if((cal.date[i] == d) && (cal.month == m) && (cal.year == y)) {
          today = true;
        } else if((cal.holidays != null) && cal.holidays[i]) {
          color = 'r';
        } else if(i % 7 == sunday) {
          color = 'r';
        } else if(i % 7 == saturday) {
          color = 'b';
        } 
        
        var replaceTo = '%' + date.slice(0, 1) + color + '%';
        if(date.length > 1) {
          replaceTo += '%' + date.slice(1, 2) + color + '%';
        }
        if(today) {
          replaceTo = '<div id="today">' + replaceTo + '</div>';
        } else if(color == 'h') {
          replaceTo = '<div class="hidden">' + replaceTo + '</div>';
        } else {
          replaceTo = '<div class="day">' + replaceTo + '</div>';
        }
        template = template.replace(str, replaceTo);
      }
      for(var i = 0; i < 10; i++) {
        var reg = new RegExp('%' + i + '%', 'g');
        template = template.replace(reg, '<img src="%folder%/num_' + i + '.png" />');
        reg = new RegExp('%' + i + 'r%', 'g');
        template = template.replace(reg, '<img src="%folder%/num_' + i + '_r.png" />');
        reg = new RegExp('%' + i + 'b%', 'g');
        template = template.replace(reg, '<img src="%folder%/num_' + i + '_b.png" />');
        reg = new RegExp('%' + i + 'h%', 'g');
        template = template.replace(reg, '<div width="5px"></div>');
      }
      template = template.replace(/%folder%/g, kisaragi.getSkinFolder());
      
      $('calendar').innerHTML = template;
    }
  };
}();
