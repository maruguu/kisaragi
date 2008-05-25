var gadget = function() {
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
  
  return {
    settingsClosed: function(p_event) {
      if (p_event.closeAction == p_event.Action.commit) {
        kisaragi.read_settings();
        kisaragi.loadSkin(kisaragi.getSkinName());
        
        //skin.render(kisaragi.getCalendar(new Date(), 0));
        kisaragi.render(kisaragi.getCalendar(new Date(), 0));
        if(kisaragi.getHolidayCheck()) {
          kisaragi.requestiCal(kisaragi.getiCalUrl(), kisaragi.setHolidays);
        }
      }
    },
    
    pageLoad: function() {
      window.detachEvent('onload', gadget.pageLoad);
      
      System.Gadget.settingsUI = 'settings.html';
      System.Gadget.onSettingsClosed = gadget.settingsClosed;
      kisaragi.read_settings();
      if(kisaragi.getVersionCheck()) {
        checkLatestVersion();
      }
      
      kisaragi.loadSkin(kisaragi.getSkinName());
      kisaragi.render(kisaragi.getCalendar(new Date(), 0));
      if(kisaragi.getHolidayCheck()) {
        kisaragi.requestiCal(kisaragi.getiCalUrl(), kisaragi.setHolidays);
      }
      kisaragi.update_date();
    }
  };
}();

window.attachEvent('onload', gadget.pageLoad);
