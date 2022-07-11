//console.log(cleanUrl("https://www.facebook.com/groups/218151142047187/?multi_permalinks=1321456788383278&hoisted_section_header_type=recently_seen"));
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.todo === "showLength")
  {
    console.log(request.count);
    console.log("visible posts : " + request.visiblePosts);
    console.log("urls : " + request.urls);
  }
});
