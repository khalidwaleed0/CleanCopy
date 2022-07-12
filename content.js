let str_copyLink = "Copy Link";
let str_copied = "Copied !";
let str_sponsored = "Sponsored";
let str_likeButtonSelector = "div[aria-label='Like'], div[aria-label*='Remove']";
let lang = document.querySelector("html").getAttribute("lang");
if(lang === "ar")
{
  str_sponsored = "مُموَّل";
  str_likeButtonSelector = "div[aria-label='أعجبني'], div[aria-label*='إزالة']";
  str_copyLink = "نسخ الرابط";
  str_copied = "تم النسخ";
}

const copyButton = document.createElement('div');
copyButton.setAttribute("class","copyButton");
copyButton.textContent = str_copyLink;


setInterval(function () {
  /**@type NodeListOf<Element> */
  let posts = document.querySelectorAll("div[aria-labelledby][role='article']");
  let length = posts.length;
  for(i=0 ; i<length ; i++)
  {
    if(checkVisible(posts[i]))
    {
      let parent = posts[i].querySelector(str_likeButtonSelector).parentElement.parentElement;
      if(parent.querySelector("div.copyButton") === null)
      {
        let postUrl = getPostUrl(posts[i]);
        let cleanUrl = getCleanUrl(postUrl);
        addCopyButton(parent, cleanUrl);
      }
    }
  }
  }, 400);

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
    e.target.textContent = str_copied;
    setTimeout(()=>{
      e.target.textContent = str_copyLink;
      e.target.className = "copyButton";
    }, 400);
  });
}

function getPostUrl(post)
{
  let postUrlElement =  getNormalPostUrlElement(post)?? getEventUrlElement(post)?? getNearestUrlElement(post);
  if(postUrlElement.getAttribute("aria-label") === str_sponsored)
    postUrlElement = post.querySelectorAll("a[aria-label]")[2]
  return postUrlElement.getAttribute("href");
}

function getNormalPostUrl(post)
{
  return post.querySelector("span[id] a[aria-label]");
}

function getEventUrl(post)
{
  return post.querySelector("div[aria-labelledby][role='article'] div[id] a");
}

function getNearestUrl(post)
{
  return post.querySelectorAll("span a[aria-label]")[1];
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