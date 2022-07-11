const copyButton = document.createElement('div');
copyButton.setAttribute("class","copyButton");
copyButton.textContent = "Copy Link";

setInterval(function () {
  /**@type NodeListOf<Element> */
  let posts = document.querySelectorAll("div[aria-labelledby][role='article']");
  let length = posts.length;
  let j = 0;
  for(i=0 ; i<length ; i++)
  {
    if(checkVisible(posts[i]))
    {
      let parent = posts[i].querySelector("div[aria-label='Like']").parentElement.parentElement;
      if(parent.querySelector("div.copyButton") === null)
      {
        let postUrl = getPostUrl(posts[i]);
        let cleanUrl = getCleanUrl(postUrl);
        addCopyButton(parent, cleanUrl);
      }
    }
  }
  }, 500);

function checkVisible(elm)
{
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function addCopyButton(parent, cleanUrl)
{
  let node = copyButton.cloneNode(true);
  node.setAttribute("href",cleanUrl);
  parent.append(node);
  node.addEventListener("click",(e,h)=>{
    copy(node,cleanUrl);
    e.target.className = "copyButton clickedCopyButton";
    e.target.textContent = "Copied !";
    setTimeout(()=>{
      e.target.textContent = "Copy Link"
      e.target.className = "copyButton";
    }, 400);
  });
}

function getPostUrl(post)
{
  let postUrlElement = post.querySelector("span[id] a[aria-label]");
  if(postUrlElement === null)
    postUrlElement = post.querySelector("div[aria-labelledby][role='article'] div[id] a");
  else if(postUrlElement.getAttribute("aria-label") === "Sponsored")
    postUrlElement = post.querySelectorAll("a[aria-label]")[2];
  return postUrlElement.getAttribute("href");
}

function getCleanUrl(/**@type String */ url)
{
  url = url.replace(/&[^(id)].+/,"").replace("?multi_permalinks=","posts/").replace(/\?__.+/,"");
  if(url.startsWith("/"))
    url = "https://www.facebook.com" + url;
  return decodeURIComponent(url).replace("https://l.facebook.com/l.php?u=","").replace(/(&|\?)utm.+/,"").replace(/(&|\?)fbclid.+/,"");
}

function copy(node,url)
{
  let input = document.createElement('textarea');
  input.style = "opacity: 0;"
  node.append(input);
  input.value = url;
  input.select();
  input.focus();
  document.execCommand("copy");
  input.remove();
}