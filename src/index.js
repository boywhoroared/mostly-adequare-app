import { compose, curry, map, prop, join } from "ramda";
import Axios from "axios";

// Skip the Fns used to load the libraries

const Impure = {
  getJSON: curry((callback, url) => {
    Axios.get(url).then((response) => { callback(response.data) });
  }),
  setHtml: curry((sel, html) => {
    const el = document.querySelector(sel);
    el.innerHTML += html;
  }),
  trace: curry((tag, x) => {
    console.log(tag, x);
    return x;
  })
};

const host = 'localhost:3000';
const path = '/flickr/services/feeds/photos_public.gne';
// Flickr wrapped it's JSON in a function and Axios doesn't play well with that.
const query = t => `?tags=${t}&format=json&nojsoncallback=1`;
const url = t => `http://${host}${path}${query(t)}`;

// items.media.m
const mediaUrl = compose(prop("m"), prop("media"));
const img = (src) => `<img src='${src}' />`
// create a right-to-left pipeline `mediaToImg` to process the image data.
//
//  - mediaUrl grabs the url from the items
//  - img creates the html
//  - the composition law lets us apply both functions "at once". 
//
// The pipeline is a function of nested functions. This is what lets
// us do both operations (function calls) in a single loop.
const mediaToImg = compose(img, mediaUrl)
const imgs = compose(map(mediaToImg), prop("items"));
const render = compose(Impure.setHtml("#main"), join(''), imgs)

const app = compose(
  Impure.getJSON(render),
  url
);

app("cat");
