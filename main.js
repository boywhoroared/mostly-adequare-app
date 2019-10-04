const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN("ramda/0.21.0/ramda.min");
const jquery = CDN("jquery/3.0.0-rc1/jquery.min");

requirejs.config({ paths: { ramda, jquery } });
requirejs(["jquery", "ramda"], ($, { compose, curry, map, prop }) => {
  // app goes here

  const Impure = {
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html)),
    trace: curry((tag, x) => {
      console.log(tag, x);
      return x;
    })
  };

  // Pure fns
  const host = 'api.flickr.com';
  const path = '/services/feeds/photos_public.gne';
  const query = t => `?tags=${t}&format=json&jsoncallback=?`;
  const url = t => `https://${host}${path}${query(t)}`;

  const mediaUrl = compose(prop('m'), prop('media'));
  const mediaUrls = compose(map(mediaUrl), prop('items'));
  const img = src => $('<img />', { src })
  const imgs = map(img)

  // Impure fns -- These cause the side-effects by interacting with the browers network and dom APIs

  // const render = compose(Impure.setHtml('#js-main'), mediaUrls);
  // const app = compose(Impure.getJSON(Impure.trace('response')), url);
  const render = compose(Impure.setHtml('#js-main'), imgs, mediaUrls);
  const app = compose(Impure.getJSON(render), url);


  app("cats")
});
