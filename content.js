//await new Promise(r => setTimeout(r, 2000));
const copyButton = document.createElement('div');
copyButton.setAttribute("class","copyButton");
copyButton.textContent = "Copy Link";
//copyButton.style = "font-size: 15px; font-weight: 500; align-self: center; color: #65676B; margin-right: 8px; padding: 8px;";
//copyButton.addEventListener("mouseover",()=>{copyButton.style = copyButton.getAttribute("style") + " background-color: #F2F2F2;"});
//copyButton.addEventListener("mouseout",()=>{copyButton.style = copyButton.getAttribute("style") + " background-color: #fff;"});
copyButton.addEventListener("mouseover",(e,s)=>{e.setAttribute("clicked","yes")});

setInterval(function () {
  let j = 0;
  let links = [];
  let posts = document.querySelectorAll("div[aria-labelledby][role='article']");
  let length = posts.length;
  for(i=0 ; i<length ; i++)
  {
    if(checkVisible(posts[i]))
    {
      let parent = posts[i].querySelector("div[aria-label='Like']").parentElement.parentElement;
      if(parent.querySelector("div.copyButton") === null)
      {
        let url = posts[i].querySelectorAll("a[aria-label]")[2].getAttribute("href");
        let cleanUrl = getCleanUrl2(url);
        links.push(posts[i].querySelectorAll("a[aria-label]")[2].getAttribute("href"));
        let node = copyButton.cloneNode(true);
        node.setAttribute("href",cleanUrl)
        parent.append(node); 
        j++;
      }
    }
  }
  chrome.runtime.sendMessage({todo: "showLength", count: posts.length, visiblePosts: j, urls: links});
  }, 1000);


function checkVisible(elm)
{
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function getCleanUrl(/**@type String */ url)
{
  return url.replace("/&+","").replace("posts/");
}
function getCleanUrl2(/**@type String */ url)
{
  return url.replace(/&.+/,"").replace("?multi_permalinks=","posts/");
}

// ابقى استثني لما يفتح فيديو معين ميدورش في البوستات الجانبية اللي فيه
// remove everything after '?'
