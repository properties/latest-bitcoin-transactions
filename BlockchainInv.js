var satoshi = 100000000;
var show_adv = false;
var adv_rule;

var symbol_btc = {
  code: "BTC",
  symbol: "BTC",
  name: "Bitcoin",
  conversion: satoshi,
  symbolAppearsAfter: true,
  local: false
};

var symbol_local = {
  conversion: 0,
  symbol: "$",
  name: "U.S. dollar",
  symbolAppearsAfter: false,
  local: true,
  code: "USD"
};

var symbol = symbol_btc;
var root = "/";
var resource = "/Resources/";
var war_checksum;
var min = true;
var isExtension = false;
var APP_VERSION = "1.0";
var APP_NAME = "javascript_web";
var IMPORTED_APP_NAME = "external";
var IMPORTED_APP_VERSION = "0";

function stripHTML(a) {
  return $.trim($("<div>" + a.replace(/(<([^>]+)>)/ig, "") + "</div>").text())
}

function setLocalSymbol(a) {
  if (!a) {
    return
  }
  if (symbol === symbol_local) {
    symbol_local = a;
    symbol = symbol_local;
    calcMoney()
  } else {
    symbol_local = a
  }
}

function setBTCSymbol(a) {
  if (!a) {
    return
  }
  if (symbol === symbol_btc) {
    symbol_btc = a;
    symbol = symbol_btc;
    calcMoney()
  } else {
    symbol_btc = a
  }
}

$.fn.center = function() {
  scrollTo(0, 0);
  this.css("top", parseInt(Math.max(($(window).height() / 2) - (this.height() /
    2), 0)) + "px");
  this.css("left", parseInt(Math.max(($(window).width() / 2) - (this.width() /
    2), 0)) + "px");
  return this
};

if (!window.console) {
  var names = ["log", "debug", "info", "warn", "error", "assert", "dir",
    "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace",
    "profile", "profileEnd"
  ];
  window.console = {};
  for (var i = 0; i < names.length; ++i) {
    window.console[names[i]] = function() {}
  }
}
var ws;
var reconnectInterval;

function webSocketConnect(c) {
  try {
    function d() {
      try {
        var f = "wss://ws.blockchain.info/inv"; // bitcoin server
        console.log("Connect " + f);
        ws = new WebSocket(f);
        if (!ws) {
          return
        }
        if (c) {
          c(ws)
        }
      } catch (g) {
        console.log(g)
      }
    }

    function a() {
      if (!ws || ws.readyState == WebSocket.CLOSED) {
        d()
      }
    }
    if (window.WebSocket) {
      d();
      if (!reconnectInterval) {
        reconnectInterval = setInterval(a, 20000)
      }
    }
  } catch (b) {
    console.log(b)
  }
}

function BlockFromJSON(a) {
  return {
    hash: a.hash,
    time: a.time,
    blockIndex: a.blockIndex,
    height: a.height,
    txIndex: a.txIndexes,
    totalBTCSent: a.totalBTCSent,
    foundBy: a.foundBy,
    size: a.size
  }
}

function TransactionFromJSON(a) {
  return {
    hash: a.hash,
    size: a.size,
    txIndex: a.tx_index,
    time: a.time,
    inputs: a.inputs,
    out: a.out,
    blockIndex: a.block_index,
    result: a.result,
    blockHeight: a.block_height,
    balance: a.balance,
    double_spend: a.double_spend,
    note: a.note,
    setConfirmations: function(b) {
      this.confirmations = b
    },
    getHTML: function(e, g) {
      var k = this.result;
      var l = $('<div class="txdiv" style="padding-top:10px;"></div>');
      l.attr("id", "tx-" + this.txIndex);
      if (this.note) {
        var d = $('<div class="alert note"></div>');
        d.text(this.note);
        l.append(d)
      }
      var t = $(
        '<table class="table table-striped" cellpadding="0" cellspacing="0" style="padding:0px;float:left;margin:0px;"></table>'
      );
      l.append(t);
      var c = $("<tr></tr>");
      t.append(c);
      var h = $('<th colspan="4" align="left"></th>');
      c.append(h);
      var v = $('<div target="new" style="font-weight:normal"></a>');
      h.append(v);
      v.attr("href", root + "tx/" + this.hash);
      v.text(this.hash);
      var o = $('<span style="float:right"></span>');
      var f = $('<span class="can-hide" style="font-weight:bold"></span>');
      o.append(f);
      if (this.time > 0) {
        var u = new Date(this.time * 1000);
        f.text(dateToString(u))
      }
      h.append(o);
      var c = $("<tr></tr>");
      t.append(c);
      var j = $('<td width="500px"></td>');
      j.addClass("txtd");
      if (k < 0) {
        j.addClass("hidden-phone")
      }
      c.append(j);
      if (this.inputs.length > 0) {
        for (var q = 0; q < this.inputs.length; q++) {
          input = this.inputs[q];
          if (input.prev_out == null || input.prev_out.addr == null) {
            j.text("No Input (Newly Generated Coins)");
            j.append($("<br />"))
          } else {
            j.append(formatOutput(input.prev_out, e, g))
          }
        }
      } else {
        j.text("Inputs Error");
        j.append($("<br />"))
      }
      var j = $(
        '<td width="48px" class="hidden-phone" style="padding:4px;text-align:center;vertical-align:middle;"></td>'
      );
      c.append(j);
      if (k == null) {
        k = 0;
        for (var q = 0; q < this.out.length; q++) {
          k += this.out[q].value
        }
      }
      if (k > 0) {
        j.append($('<img src="' + resource + 'arrow_right_green.png" />'))
      } else {
        if (k < 0) {
          j.append($('<img src="' + resource + 'arrow_right_red.png" />'))
        } else {
          j.text(" ")
        }
      }
      var j = $("<td></td>");
      c.append(j);
      j.addClass("txtd");
      if (k >= 0) {
        j.addClass("hidden-phone")
      }
      var s = null;
      var m = null;
      for (var q = 0; q < this.out.length; q++) {
        var r = this.out[q];
        if (r.type > 0 && !r.spent && s == null) {
          var n = e[r.addr];
          if (n == null) {
            n = e[r.addr2]
          }
          if (n == null) {
            n = e[r.addr3]
          }
          if (n != null && n.priv != null) {
            s = q;
            m = n
          }
        }
        j.append(formatOutput(r, e, g))
      }
      var j = $(
        '<td width="140px" style="text-align:right" class="txtd"></td>');
      c.append(j);
      for (var q = 0; q < this.out.length; q++) {
        output = this.out[q];
        j.append('<span class="hidden-phone">' + formatMoney(output.value,
          true) + "</span><br />")
      }
      var p = $(
        '<span style="float:right;padding-bottom:30px;clear:both;"></span>'
      );
      l.append(p);
      if (this.confirmations == null) {
        p.append('<button style="display:none"></button> ')
      } else {
        if (this.confirmations == 0) {
          p.append(
            '<button class="btn btn-danger">Unconfirmed Transaction!</button> '
          )
        } else {
          if (this.confirmations > 0) {
            p.append('<button class="btn btn-primary"></button> ');
            p.text(this.confirmations + " Confirmations")
          }
        }
      }
      var b = $("<button>" + formatMoney(k, true) + "</button> ");
      p.append(b);
      if (k > 0) {
        b.addClass("btn btn-success cb")
      } else {
        if (k < 0) {
          b.addClass("btn btn-danger cb")
        } else {
          b.addClass("btn cb")
        }
      } if (this.double_spend == true) {
        p.append('<button class="btn btn-danger">Double Spend</button> ')
      }
      return l
    }
  }
}
Date.prototype.sameDayAs = function(a) {
  return ((this.getFullYear() == a.getFullYear()) && (this.getMonth() == a.getMonth()) &&
    (this.getDate() == a.getDate()))
};

function padStr(a) {
  return (a < 10) ? "0" + a : "" + a
}

function dateToString(a) {
  if (a.sameDayAs(new Date())) {
    return "Today " + padStr(a.getHours()) + ":" + padStr(a.getMinutes()) +
      ":" + padStr(a.getSeconds())
  } else {
    return padStr(a.getFullYear()) + "-" + padStr(1 + a.getMonth()) + "-" +
      padStr(a.getDate()) + " " + padStr(a.getHours()) + ":" + padStr(a.getMinutes()) +
      ":" + padStr(a.getSeconds())
  }
}

function formatSatoshi(d, a, c) {
  if (!d) {
    return "0.00"
  }
  var f = "";
  if (d < 0) {
    d = -d;
    f = "-"
  }
  if (!a) {
    a = 0
  }
  d = "" + parseInt(d);
  var e = (d.length > (8 - a) ? d.substr(0, d.length - (8 - a)) : "0");
  if (!c) {
    e = e.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  }
  var b = d.length > (8 - a) ? d.substr(d.length - (8 - a)) : d;
  if (b && b != 0) {
    while (b.length < (8 - a)) {
      b = "0" + b
    }
    b = b.replace(/0*$/, "");
    while (b.length < 2) {
      b += "0"
    }
    return f + e + "." + b
  }
  return f + e
}

function convert(a, b) {
  return (a / b).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,
    "$1,")
}

function formatBTC(a) {
  return formatSymbol(a, symbol_btc)
}

function sShift(a) {
  return (satoshi / a.conversion).toString().length - 1
}

function formatSymbol(a, c, b) {
  var d;
  if (c !== symbol_btc) {
    d = convert(a, c.conversion)
  } else {
    d = formatSatoshi(a, sShift(c))
  } if (b) {
    d = d.replace(/([1-9]\d*\.\d{2}?)(.*)/,
      '$1<span style="font-size:85%;">$2</span>')
  }
  if (c.symbolAppearsAfter) {
    d += " " + c.symbol
  } else {
    d = c.symbol + " " + d
  }
  return d
}

function formatMoney(a, b) {
  var c = formatSymbol(a, symbol);
  if (b) {
    c = '<span data-c="' + a + '">' + c + "</span>"
  }
  return c
}

function formatOutput(b, e, a) {
  function d(n, j) {
    var m = null;
    if (e != null) {
      m = e[n]
    }
    if (m != null) {
      var k = $("<span></span>");
      if (m.label != null) {
        k.text(m.label)
      } else {
        k.text(n)
      }
      return k
    } else {
      var h = $('<div target="new"></a>');
      h.attr("href", root + "address/" + n);
      if (a && a[n]) {
        h.text(a[n])
      } else {
        if (j.addr_tag) {
          var g = $("<span></span>");
          h.addClass("tag-address");
          h.text(n);
          var l = $('<span class="tag"></span>');
          l.text("(" + j.addr_tag + ") ");
          if (j.addr_tag_link) {
            var f = $(
              '<div class="external" rel="nofollow" target="new"></a>');
            f.attr("href", root + "r?url=" + j.addr_tag_link);
            l.append(f)
          }
          g.append(h);
          g.append(l);
          return g
        } else {
          h.text(n)
        }
      }
      return h
    }
  }
  var c = $("<span></span>");
  if (b.type == 0) {} else {
    if (b.type == 1 || b.type == 2 || b.type == 3) {
      c.html('(<font color="red">Escrow</font> ' + b.type + " of ")
    } else {
      c.html('<font color="red">Strange</font> ')
    }
  } if (b.addr != null) {
    c.append(d(b.addr, b))
  }
  if (b.addr2 != null) {
    c.append(", ");
    c.append(d(b.addr2, b))
  }
  if (b.addr3 != null) {
    c.append(", ");
    c.append(d(b.addr3, b))
  }
  if (b.type == 1 || b.type == 2 || b.type == 3) {
    c.append(")")
  }
  c.append("<br />");
  return c
}

function toggleAdv() {
  setAdv(!show_adv)
}

function setAdv(a) {
  show_adv = a;
  if (adv_rule != null) {
    adv_rule.remove()
  }
  if (show_adv) {
    adv_rule = $(
      "<style type='text/css'> .adv{display: inherit;} .basic{display: none;} </style>"
    ).appendTo("head");
    $("a[class=show_adv]").text("Show Basic")
  } else {
    adv_rule = $(
      "<style type='text/css'> .adv{display: none;} .basic{display: inherit;} </style>"
    ).appendTo("head");
    $("a[class=show_adv]").text("Show Advanced")
  }
}

function calcMoney() {
  $("span[data-c]").each(function() {
    $(this).text(formatMoney($(this).data("c")))
  })
}

function setupSymbolToggle() {
  $(".cb").unbind("click").click(function() {
    toggleSymbol()
  });
  $("span[data-c]").unbind("mouseenter mouseleave").mouseenter(function() {
    (function(a) {
      if (!a.data("time")) {
        return
      }
      if (!a.data("tooltip")) {
        $.ajax({
          timeout: 60000,
          type: "GET",
          dataType: "text",
          url: root + "frombtc",
          data: {
            value: a.data("c"),
            currency: symbol_local.code,
            time: a.data("time"),
            textual: true,
            nosavecurrency: true
          },
          success: function(b) {
            if (!b) {
              return
            }
            a.tooltip({
              placement: "bottom",
              html: false,
              trigger: "manual",
              title: b
            });
            if (a.is(":hover")) {
              a.tooltip("show")
            }
          },
          error: function(b) {
            console.log(b)
          }
        })
      } else {
        a.tooltip("show")
      }
    })($(this))
  }).mouseleave(function() {
    if ($(this).data("tooltip")) {
      $(this).tooltip("hide")
    }
  })
}

function toggleSymbol() {
  if (symbol_local && symbol === symbol_btc) {
    symbol = symbol_local;
    SetCookie("local", "true")
  } else {
    symbol = symbol_btc;
    SetCookie("local", "false")
  }
  $("#currencies").val(symbol.code);
  calcMoney()
}
var _sounds = {};

function playSound(b) {
  try {
    if (!_sounds[b]) {
      _sounds[b] = new Audio(resource + b + ".wav")
    }
    _sounds[b].play()
  } catch (a) {}
}

function setupToggle() {
  $("[class=show_adv]").unbind().click(function() {
    toggleAdv()
  })
}

function updateQueryString(b, d, a) {
  if (!a) {
    a = window.location.href
  }
  var c = new RegExp("([?|&])" + b + "=.*?(&|#|$)(.*)", "gi");
  if (c.test(a)) {
    if (typeof d !== "undefined" && d !== null) {
      return a.replace(c, "$1" + b + "=" + d + "$2$3")
    } else {
      return a.replace(c, "$1$3").replace(/(&|\?)$/, "")
    }
  } else {
    if (typeof d !== "undefined" && d !== null) {
      var f = a.indexOf("?") !== -1 ? "&" : "?",
        e = a.split("#");
      a = e[0] + f + b + "=" + d;
      if (e[1]) {
        a += "#" + e[1]
      }
      return a
    } else {
      return a
    }
  }
}
$(document).ready(function() {
  var f = $(".footer");
  var c = f.data("symbol-local");
  if (c) {
    symbol_local = c
  }
  var b = f.data("symbol-btc");
  if (b) {
    symbol_btc = b
  }
  if (symbol_local && getCookie("local") == "true") {
    symbol = symbol_local
  } else {
    symbol = symbol_btc
  }
  war_checksum = $(document.body).data("war-checksum");
  show_adv = getCookie("show_adv");
  try {
    var d = $("#languages_select").find("a");
    d.click(function(h) {
      h.preventDefault();
      var j = $(this).data("code");
      SetCookie("clang", j);
      var g = window.location.pathname;
      d.each(function() {
        var e = $(this).data("code");
        if (g.indexOf("/" + e) == 0) {
          g = g.replace("/" + e, "/" + j);
          return false
        }
      });
      window.location.href = g
    });
    $("#currencies").change(function() {
      var e = $(this).val();
      if (symbol == null || e != symbol.symbol) {
        if (symbol_local != null && e == symbol_local.code) {
          toggleSymbol()
        } else {
          if (symbol_btc != null && e == symbol_btc.code) {
            toggleSymbol()
          } else {
            document.location.href = updateQueryString("currency", e,
              document.location.href)
          }
        }
      }
    });
    setupSymbolToggle();
    setupToggle();
    setAdv(show_adv)
  } catch (a) {}
});

function loadScript(j, h, a) {
  var f = false;
  $("script").each(function() {
    var e = $(this).attr("src");
    if (e && e.replace(/^.*[\\\/]/, "").indexOf(j) == 0) {
      h();
      f = true;
      return false
    }
  });
  if (f) {
    return
  }
  console.log("Load " + j);
  var d = false;
  var c = document.createElement("script");
  c.type = "text/javascript";
  c.async = true;
  c.src = resource + j + (min ? ".min.js" : ".js") + "?" + war_checksum;
  try {
    c.addEventListener("error", function(k) {
      d = true;
      if (a) {
        a("Error Loading Script. Are You Offline?")
      }
    }, false);
    c.addEventListener("load", function(k) {
      if (!d) {
        h()
      }
    }, false)
  } catch (g) {
    setTimeout(function() {
      if (!d) {
        h()
      }
    }, 10000)
  }
  var b = document.getElementsByTagName("head")[0];
  b.appendChild(c)
}

function SetCookie(a, b) {
  document.cookie = a + "=" + encodeURI(b.toString()) +
    "; path=/; domain=blockchain.info; max-age=" + (60 * 60 * 24 * 365)
}

function getCookie(a) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(a + "=");
    if (c_start != -1) {
      c_start = c_start + a.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) {
        c_end = document.cookie.length
      }
      return decodeURI(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}
var MyStore = new function() {
  this.put = function(a, b) {
    try {
      localStorage.setItem(a, b)
    } catch (c) {
      console.log(c)
    }
  };
  this.get = function(b, d) {
    try {
      var a = localStorage.getItem(b)
    } catch (c) {
      console.log(c)
    }
    d(a)
  };
  this.remove = function(a) {
    try {
      localStorage.removeItem(a)
    } catch (b) {
      console.log(b)
    }
  };
  this.clear = function() {
    try {
      localStorage.clear()
    } catch (a) {
      console.log(a)
    }
  }
};
