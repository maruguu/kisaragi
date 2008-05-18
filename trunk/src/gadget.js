var gadget = function() {
  
  var callback = function(calendar) {
    /*var eventInfo = '';
    var events = calendar.getEvents();
    for(var i = 0; i < calendar.getNrOfEvents(); i++) {
      var event = calendar.getEventAtIndex(i); 
      
      var startDate = event.getStartDate();
      var endDate = event.getEndDate();
      
      var timeZone = event.getTimeZone();
      var rules = event.getRuleProperties();
      
      var eventPropertyNames = event.getPropertyNames();
      for(var n = 0; n < eventPropertyNames.length; n++) {
        var propertyName = eventPropertyNames[n];
        var propertyValue = event.getProperty(propertyName);
      }
      
      if(rules.size > 0) {
        var freq = rules.getProperty('FREQ');
        
        
        eventInfo += i + ' : ' + startDate + ' : ' + freq + ':' + event.getProperty('SUMMARY') + '<br />';
      } else {
        
        eventInfo += i + ' : ' + startDate + ' : ' + event.getProperty('SUMMARY') + '<br />';
      }
    }
    $('calendar').innerHTML += eventInfo + '<br />';
    */
    
    // テスト用。2008年5月の各曜日について休日かどうかを求める
    var tod = new Date;
    var y = tod.getFullYear();
    var m = tod.getMonth();
    var date = new Date(y, m, 1, 0, 0, 0);
    
    for(var i = 0; i < 31; i++) {
      var result = iCalUtility.isHoliday(calendar, date);
      $('calendar').innerHTML += date + ' : ' + result + '<br />';
      date.setDate(date.getDate() + 1);
    }
  };
  
  // Check the latest version of gadget
  var checkLatestVersion = function() {
    var url = "http://code.google.com/p/kisaragi/wiki/ChangeLog"; // must be changed
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('If-Modified-Since', "Sat, 1 Jan 2000 00:00:00 GMT");
    xhr.onreadystatechange = function(istimeout) {
      if(xhr && xhr.readyState == 4 && xhr.status == 200) {
        // Need major and minor version in ChangeLog
        if(xhr.responseText.match(/Version\s(\d\.\d(\.\d)?(\.\d)?)/) != null) {
          var latest = RegExp.$1;
          var latest_version = latest;
          var ver = System.Gadget.version;
          while(latest.match(/(\d)/) != null) {
            n = RegExp.$1;
            latest = RegExp.rightContext;
            if(ver.match(/(\d)/) == null) {
              confirmToOpenWeb(latest_version);
              break;
            }
            m = RegExp.$1;
            ver = RegExp.rightContext;
            if(n > m) {
              confirmToOpenWeb(latest_version);
              break;
            } else if (n < m){
              break;
            }
          } 
        }
      } 
    };
    xhr.send('');
  };
  
  var confirmToOpenWeb = function(latest_version) {
    var txt = "最新版が公開されています\n\nVersion " + System.Gadget.version + " -> Version " + latest_version + "\n\nダウンロードページを表示しますか?";
    if(confirm(txt)) {
      open("http://code.google.com/p/kisaragi/");
    }
  };
  
  // ガジェットの設定
  var check_ver;
  var read_settings = function() {
      check_ver = System.Gadget.Settings.read('check_ver');
      if (!check_ver) check_ver = true;
  };
  
  return {
    settingsClosed: function(p_event) {
      if (p_event.closeAction == p_event.Action.commit) {
        
        read_settings();
        kisaragi.read_settings();
        kisaragi.loadSkin(kisaragi.getSkinName());
        
        skin.render(kisaragi.getCalendar(new Date(), 0));
      }
    },
    
    pageLoad: function() {
      window.detachEvent('onload', gadget.pageLoad);
      
      System.Gadget.settingsUI = 'settings.html';
      System.Gadget.onSettingsClosed = gadget.settingsClosed;
      read_settings();
      //if(check_ver) {
        checkLatestVersion();
      //}
      kisaragi.read_settings();
      kisaragi.loadSkin(kisaragi.getSkinName());
      
      //kisaragi.requestiCal('http://ical.mac.com/ical/Japanese32Holidays.ics', callback);
      //kisaragi.requestiCal('http://www.google.com/calendar/ical/japanese__ja%40holiday.calendar.google.com/public/basic.ics', callback);
      
      skin.render(kisaragi.getCalendar(new Date(), 0));
    }
  };
}();

window.attachEvent('onload', gadget.pageLoad);
