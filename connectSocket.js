function updateTimes() {
  var a = new Date().getTime() / 1000;
  $("td[data-time]").each(function(b) {
    var e = parseInt($(this).data("time"));
    if (e == 0) {
      $(this).text("")
    }
    var d = a - e;
    if (d < 60) {
      $(this).text("1 second ago")
    } else {
      if (d < 3600) {
        var c = (parseInt(d / 60) > 1) ? "s" : "";
        $(this).text(parseInt(d / 60) + " minute" + c)
      } else {
        var c = (parseInt(d / 3600) > 1) ? "s" : "";
        $(this).text(parseInt(d / 3600) + " hour" + c + " " + parseInt((d %
          3600) / 60) + " minutes")
      }
    }
  })
}

webSocketConnect(function(a) {
  a.onmessage = function(i) {
    var h = $.parseJSON(i.data);
    if (h.op == "minitx") {
      var b = h.x;
      var c;
      if (b.tag) {
        c = '<b><font color="red">' + b.tag;
        if (b.tag_link) {
          c = '<b><font color="green">' + b.hash.substring(0, 80) +
            "</font></b>"
        } else {
          c = '<b><font color="red">' + b.hash.substring(0, 80) +
            "</font></b>"
        }
        c += ""
      } else {
        c = '<b><font color="red">' + b.hash.substring(0, 80) +
          "</font></b>"
      }
      var f = $("<tr><td><div>" + c +
        '</div></td><td data-time="' + b.time +
        '"><div>1 second ago</div></td><td><div><b>' +
        formatMoney(b.value, true) + "</b></div></td></tr>");
      f.insertAfter($("#getBTC tr:first")).find("div").hide().slideDown(
        "slow");
      $("#getBTC tr:last-child").remove()
    } else {
      if (h.op == "block") {
        var j = BlockFromJSON(h.x);
        if ($("#bi-" + j.blockIndex).length > 0) {
          return
        }
        var g = "Unknown";
        if (j.foundBy != null) {
          g = ''
        }
        if (j.txIndex) {
          var d = j.txIndex.length
        } else {
          var d = 0
        }
        $('<tr id="bi-' + j.blockIndex +
          '"><td><div></div></td><td data-time="' + j.time +
          '"><div>1 second ago</div></td><td><div>' +
          j.txIndex.length +
          '</div></td><td><div>' + formatMoney(j.totalBTCSent,
            true) + "</div></td><td><div>" + g +
          '</div></td><td><div>' + parseInt(j.size /
            1024) + "</div></td></tr>").insertAfter($(
          "#blocks tr:first")).find("div").hide().slideDown("slow");
        $("#blocks tr:last-child").remove()
      }
    }
    setupSymbolToggle()
  };
  a.onopen = function() {
    a.send(
      '{"op":"set_tx_mini"}{"op":"unconfirmed_sub"}{"op":"blocks_sub"}'
    )
  }
});
