var settings = function(){
  var menu = new Array();
  menu[0] = 'スキン';
  menu[1] = '祝日';
  menu[2] = 'バージョン';
  var pages = new Array();
  pages[0] = '<form><select id="skin_list" size="10" name="skin_list"><option value="default">default</option><option value="default_r">default_r</option><option value="default_g">default_g</option><option value="default_b">default_b</option><option value="flat_black">flat_black</option></select></form>';
  pages[1] = '<input type="checkbox" name="disp_holiday" value="" />祝日を表示する<br /><p>iCalデータのURL:<br><input type="text" id="ical_url" value="" class="input-box" /></p>';
  pages[2] = '<center><img src="images/icon.png" width="64px" height="64px"/><br /><b>kisaragi <div id="version"></div></b><br /><a href="http://code.google.com/p/kisaragi/" target="_blank">http://code.google.com/p/kisaragi/</a><br /><input type="checkbox" name="check_ver" value="" />起動時に最新版を確認する</center></center>';
  
  var current_page = 0;
  return {
    init: function() {
      window.detachEvent('onload', settings.init);
      System.Gadget.onSettingsClosing = settings.closing;
      
      kisaragi.read_settings();
      current_page = 0;
      settings.showTab(0);
    },
    
    
    closing: function(event) {
      if(event.closeAction == event.Action.commit) {
        settings.updateCurrentInput(current_page);
        kisaragi.write_settings();
      }
    },
    
    updateCurrentInput: function(page) {
      if(page == 0) {
        var list = $('skin_list').getElementsByTagName('option');
        var nodes = $A(list);
        nodes.each(function(node){
          if(node.selected == true) {
            kisaragi.setSkinName(node.innerHTML);
          }
        });
      } else if(page == 1) {
        kisaragi.setHolidayCheck($('disp_holiday').checked);
        kisaragi.setiCalUrl($('ical_url').value);
      } else if(page == 2) {
        kisaragi.setVersionCheck($('check_ver').checked);
      }
    },
    
    showTab: function(page) {
      c = (page < 0) ? "" : pages[page];
      
      if(current_page != page) {
         settings.updateCurrentInput(current_page);
      }
      
      $('menu').innerHTML = "";
      for(var i = 0; i < menu.length; i++) {
        var m = menu[i];
        if(i == page) {
          m = '<a class="current_tab" onClick="settings.showTab(' + i + ')">' + menu[i] + '</a>';
        } else {
          m = '<a class="tab" onClick="settings.showTab(' + i + ')">' + menu[i] + '</a>';
        }
        $('menu').innerHTML += m;
        if(i < menu.length - 1) {
          $('menu').innerHTML += " | ";
        }
      }
      
      $('content').innerHTML = c;
      if(page == 0) {
        var s = kisaragi.getSkinName();
        var list = $('skin_list').getElementsByTagName('option');
        var nodes = $A(list);
        nodes.each(function(node){
          if(s == node.innerHTML) {
            node.selected = true;
          }
        });
      } else if(page == 1) {
        $('disp_holiday').checked = kisaragi.getHolidayCheck();
        $('ical_url').value = kisaragi.getiCalUrl();
      } else if(page == 2) {
        $('check_ver').checked = kisaragi.getVersionCheck();
        $('version').innerHTML = 'Version ' + System.Gadget.version;
      }
      current_page = page;
    }
  };
}();

window.attachEvent('onload', settings.init);

