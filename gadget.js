gadget = function() {
  return {
    settingsClosed: function(p_event) {
      if (p_event.closeAction == p_event.Action.commit) {
        
        kisaragi.read_settings();
        kisaragi.loadSkin(kisaragi.getSkinName());
        
        skin.render(kisaragi.getCalendar(new Date(), 0));
      }
    },
    
    pageLoad: function() {
      window.detachEvent('onload', gadget.pageLoad);
      System.Gadget.settingsUI = 'settings.html';
      System.Gadget.onSettingsClosed = gadget.settingsClosed;
      kisaragi.read_settings();
      kisaragi.loadSkin(kisaragi.getSkinName());
      skin.render(kisaragi.getCalendar(new Date(), 0));
      //$('calendar').innerHTML = '<img src="skin/flat_black/month_1.png"/>';
    }
  };
}();

window.attachEvent('onload', gadget.pageLoad);
