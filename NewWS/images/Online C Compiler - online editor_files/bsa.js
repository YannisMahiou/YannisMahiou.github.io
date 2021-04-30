var _native = {
  construct: function(e) {
    var default_options = {
      display: "block",
      fallback: "",
      placement: "",
      prefix: "native",
      targetClass: "native-ad",
      visibleClass: "native-show"
    };

    if (typeof e == "undefined") return default_options;
    Object.keys(default_options).forEach((key, index) => {
      if (typeof e[key] == "undefined") {
        e[key] = default_options[key];
      }
    });
    return e;
  },
  init: function(zone, options) {
    options = this.construct(options);
    this.className = options["targetClass"];
    this.displayStyle = options["display"];
    this.fallback = options["fallback"];
    this.visibleClassName = options["visibleClass"];
    this.prefix = options["prefix"];
    this.placement = options["placement"];

    let jsonUrl = "https://srv.buysellads.com/ads/" + zone + ".json?callback=_native_go";
    if (options["placement"] !== "") {
      jsonUrl += "&segment=placement:" + options["placement"];
    }

    let srv = document.createElement("script");
    srv.src = jsonUrl;
    document.getElementsByTagName("head")[0].appendChild(srv);

  },
  sanitize: function(ads) {
    return ads
      .filter(ad => {
        return Object.keys(ad).length > 0;
      })
      .filter(ad => {
        return ad.hasOwnProperty("statlink");
      });
  },
  pixel: function(p, timestamp) {
    let c = "";
    if (p)
      p.split("||").forEach((pixel, index) => {
        c += '<img src="' + pixel.replace("[timestamp]", timestamp) + '" style="display:none;" height="0" width="0" />';
      });
    return c;
  }
};

var _native_go = function(json) {
  let ads = _native.sanitize(json["ads"]);
  
  if (ads.length < 1) {
    document.querySelectorAll("." + _native.className).forEach((className, index) => {
      //document.getElementsByClassName(_native.className)[index].innerHTML = _native.fallback;
      if (_native.fallback !== "") document.getElementsByClassName(_native.className)[index].className += " " + _native.visibleClassName;
      

      $.getJSON( "/fallback_ad", function( data ) {
            if(!(data && data.ad_link)) return;
            
            $("#editor-container").css('top','37px');
/*var data = {
	ad_description: "Got an Opinion? Share and get rewarded.",
	ad_link: "http://tracking.vcommission.com/aff_c?offer_id=8231&aff_id=66738",
	ad_company: "Rakuten AIP"
};*/
            let adElement = document.getElementsByClassName(_native.className)[index].innerHTML;
            let ad = adElement
            .replace(new RegExp("#" + _native.prefix + "_desc#", "g"), data.ad_description)
            .replace(new RegExp("#" + _native.prefix + "_link#", "g"), data.ad_link)
            .replace(new RegExp("#" + _native.prefix + "_company#", "g"), data.ad_company);

            document.getElementsByClassName(_native.className)[index].innerHTML = null;
            document.getElementsByClassName(_native.className)[index].innerHTML += ad;
            document.getElementsByClassName(_native.className)[index].style.display = _native.displayStyle;
            document.getElementsByClassName(_native.className)[index].className += " " + _native.visibleClassName;
      });
      
    });
  //$("#editor-container").css('top','37px');
    return "No ads found";
  }
  $("#editor-container").css('top','37px');
  document.querySelectorAll("." + _native.className).forEach((className, index) => {
    if (ads[index] && className) {
      let adElement = document.getElementsByClassName(_native.className)[index].innerHTML;

      let ad = adElement
        .replace(new RegExp("#" + _native.prefix + "_bg_color#", "g"), ads[index]["backgroundColor"])
        .replace(new RegExp("#" + _native.prefix + "_bg_color_hover#", "g"), ads[index]["backgroundHoverColor"])
        .replace(new RegExp("#" + _native.prefix + "_company#", "g"), ads[index]["company"])
        .replace(new RegExp("#" + _native.prefix + "_cta#", "g"), ads[index]["callToAction"])
        .replace(new RegExp("#" + _native.prefix + "_cta_bg_color#", "g"), ads[index]["ctaBackgroundColor"])
        .replace(new RegExp("#" + _native.prefix + "_cta_bg_color_hover#", "g"), ads[index]["ctaBackgroundHoverColor"])
        .replace(new RegExp("#" + _native.prefix + "_cta_color#", "g"), ads[index]["ctaTextColor"])
        .replace(new RegExp("#" + _native.prefix + "_cta_color_hover#", "g"), ads[index]["ctaTextColorHover"])
        .replace(new RegExp("#" + _native.prefix + "_desc#", "g"), ads[index]["description"])
        .replace(new RegExp("#" + _native.prefix + "_index#", "g"), _native.prefix + "-" + ads[index]["i"])
        .replace(new RegExp("#" + _native.prefix + "_img#", "g"), ads[index]["image"])
        .replace(new RegExp("#" + _native.prefix + "_link#", "g"), ads[index]["statlink"])
        .replace(new RegExp("#" + _native.prefix + "_logo#", "g"), ads[index]["logo"])
        .replace(new RegExp("#" + _native.prefix + "_color#", "g"), ads[index]["textColor"])
        .replace(new RegExp("#" + _native.prefix + "_color_hover#", "g"), ads[index]["textColorHover"])
        .replace(new RegExp("#" + _native.prefix + "_title#", "g"), ads[index]["title"]);

      document.getElementsByClassName(_native.className)[index].innerHTML = null;
      document.getElementsByClassName(_native.className)[index].innerHTML += ad + _native.pixel(ads[index]["pixel"], ads[index]["timestamp"]);
      document.getElementsByClassName(_native.className)[index].style.display = _native.displayStyle;
      if (_native.className !== "") document.getElementsByClassName(_native.className)[index].className += " " + _native.visibleClassName;
    } else {
      document.getElementsByClassName(_native.className)[index].innerHTML = null;
      document.getElementsByClassName(_native.className)[index].style.display = "none";
    }
  });
};