import{S as e,i as a,s as t,e as s,a as r,t as n,b as i,p as m,c as p,d as c,q as u,f as h,n as l,g as d,r as o,v as f,u as g}from"./main.js";function x(e){let a,t,l,d,o,f,g,x,v,$,w,y,M,T,b=e[0].name+"",j=e[0].premiered.split("-")[0]+"",z=e[0].summary+"";return{c(){a=s("img"),l=r(),d=s("h1"),o=n(b),f=n(" ("),g=n(j),x=n(")"),v=r(),$=s("p"),w=r(),y=s("a"),M=n("Read more on TVMaze"),a.src!==(t=e[0].image.medium.replace("http","https"))&&i(a,"src",t),i(a,"alt","cover"),m(a,"height","295px"),i(y,"href",T=e[0].url)},m(e,t){p(e,a,t),p(e,l,t),p(e,d,t),c(d,o),c(d,f),c(d,g),c(d,x),p(e,v,t),p(e,$,t),$.innerHTML=z,p(e,w,t),p(e,y,t),c(y,M)},p(e,s){1&s&&a.src!==(t=e[0].image.medium.replace("http","https"))&&i(a,"src",t),1&s&&b!==(b=e[0].name+"")&&u(o,b),1&s&&j!==(j=e[0].premiered.split("-")[0]+"")&&u(g,j),1&s&&z!==(z=e[0].summary+"")&&($.innerHTML=z),1&s&&T!==(T=e[0].url)&&i(y,"href",T)},d(e){e&&h(a),e&&h(l),e&&h(d),e&&h(v),e&&h($),e&&h(w),e&&h(y)}}}function v(e){let a,t,u,d,o,f,g=e[0].id&&x(e);return{c(){a=s("div"),t=s("h4"),u=s("a"),d=n("Go back"),f=r(),g&&g.c(),i(u,"href",o=e[1]("./")),m(a,"text-align","center"),m(a,"max-width","540px"),m(a,"margin","auto")},m(e,s){p(e,a,s),c(a,t),c(t,u),c(u,d),c(a,f),g&&g.m(a,null)},p(e,[t]){2&t&&o!==(o=e[1]("./"))&&i(u,"href",o),e[0].id?g?g.p(e,t):(g=x(e),g.c(),g.m(a,null)):g&&(g.d(1),g=null)},i:l,o:l,d(e){e&&h(a),g&&g.d()}}}function $(e,a,t){let s,r,n;d(e,o,(e=>t(2,s=e))),d(e,f,(e=>t(3,r=e))),d(e,g,(e=>t(1,n=e)));let i={};return e.$$.update=()=>{var a;4&e.$$.dirty&&(a=s.showId,fetch(`https://api.tvmaze.com/shows/${a}`).then((e=>e.json())).then((e=>{t(0,i=e),r()})))},[i,n,s]}export default class extends e{constructor(e){super(),a(this,e,$,v,t,{})}}
//# sourceMappingURL=[showId]-b01f1fa1.js.map
