chrome.tabs.getCurrent((tab) => {
  let currentTabTarget = {tabId: tab.id};

  chrome.debugger.attach(currentTabTarget, '1.3', () => {
    if(chrome.runtime.lastError) {
      alert(chrome.runtime.lastError.message);
    }
  });

  chrome.debugger.getTargets((targets) => {
    currentTarget = targets.find((info) => { return info.url === tab.url });
    chrome.debugger.sendCommand(currentTabTarget, 'Target.exposeDevToolsProtocol', {targetId: currentTarget.id});
  });
});


//------------------------------------------------------------------------------

$(function(){
  $('#scan-button').on('click', function(){
    chrome.tabs.getCurrent((tab) => {
      let currentTabTarget = {tabId: tab.id};

      chrome.debugger.attach(currentTabTarget, '1.3', () => {
        if(chrome.runtime.lastError) {
          alert(chrome.runtime.lastError.message);
        }
      });

      chrome.debugger.getTargets((targets) => {
        currentTarget = targets.find((info) => { return info.url == tab.url });
        chrome.debugger.sendCommand(currentTabTarget, 'Target.exposeDevToolsProtocol', {targetId: currentTarget.id});
        chrome.debugger.detach(currentTabTarget, () => {
          if(chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
          }else{
            alert(window.cdp)
          }
        });
      });
    });
  });
});
