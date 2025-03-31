let str_copyLink = "Copy Link";
let str_copied = "Copied !";
let str_likeButtonSelector = "div[aria-label='Like'], div[aria-label*='Remove']";
let lang = document.querySelector("html").getAttribute("lang");
if (lang === "ar") {
  str_likeButtonSelector = "div[aria-label='أعجبني'], div[aria-label*='إزالة']";
  str_copyLink = "نسخ الرابط";
  str_copied = "تم النسخ";
}

const copyButton = document.createElement("div");
copyButton.setAttribute("class", "copyButton");
copyButton.textContent = str_copyLink;

setInterval(function () {
  const posts = document.querySelectorAll("div[role=main] div[class=x1lliihq]:has(div[aria-label='Like'])");
  const length = posts.length;
  for (i = 0; i < length; i++) {
    if (checkVisible(posts[i])) {
      const bottomBar = posts[i].querySelector(str_likeButtonSelector).parentElement.parentElement;
      if (!bottomBar.querySelector("div.copyButton")) addCopyButton(bottomBar, posts[i]);
    }
  }
}, 400);

function checkVisible(elm) {
  const rect = elm.getBoundingClientRect();
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function addCopyButton(bottomBar, postElement) {
  let node = copyButton.cloneNode(true);
  bottomBar.append(node);
  node.addEventListener("click", async (e, h) => {
    let url = await getPostUrl(postElement);
    let cleanUrl = getCleanUrl(url);
    e.target.focus();
    navigator.clipboard.writeText(cleanUrl);
    e.target.className = "copyButton clicked";
    e.target.textContent = str_copied;
    setTimeout(() => {
      e.target.textContent = str_copyLink;
      e.target.className = "copyButton";
    }, 1000);
  });
}

async function getPostUrl(post) {
  post.querySelectorAll("a[role=link]").forEach((urlElement) => urlElement.focus({ preventScroll: true }));
  await new Promise((r) => setTimeout(r, 100));
  let urlElements = post.querySelectorAll("a[role=link]");
  for (let urlElement of urlElements) {
    if (/(multi_permalinks)|(\/posts\/)/gm.test(urlElement.href)) return urlElement.href;
  }
  for (let urlElement of urlElements) {
    if (/(\/watch\/)|(\/photo\/)|(permalink\.php)/gm.test(urlElement.href)) return urlElement.href;
  }
  return null;
}

function getCleanUrl(/**@type String */ url) {
  if (url) {
    url = url
      .replaceAll(/(\?|&)hoisted_section_header_type=recently_seen&*/gm, "")
      .replaceAll("?*multi_permalinks=", "posts/");
    url = url.replaceAll(/(&|\?)?__cft.+/gm, "").replaceAll(/&set=.+/gm, "");
    url = url.replaceAll(/\?comment_id=.+/gm, "");
    return decodeURIComponent(url);
  }
  return "";
}
