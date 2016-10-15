
  /* Latest Bitcoin Transactions
     by github.com/properties
     version 3.0.1.19
     using blockchain */

  var Table = "#getBTC";

  function webSocketConnect(Way) {
    try {
      function Connect() {
        try {
          var Server = "wss://ws.blockchain.info/inv";
          Ws = new WebSocket(Server);
          if (!Ws) {
            return;
          }
          if (Way) {
            Way(Ws);
            console.log("hi");
          }
        } catch (E) {}
      }

      function Reconnect() {
        if (!Ws || Ws.readyState == WebSocket.CLOSED) {
          Connect();
        }
      }

      if (window.WebSocket) {
        Connect();
        reconnectInterval = setInterval(Reconnect, 20000);
      }

    } catch (E) {}
  }

  webSocketConnect(function(Socket) {
    Socket.onmessage = function(Msg) {
      var Json = $.parseJSON(Msg.data).x;
      var Hash = Json.hash.substring(0, 80);
      var Html = $("<tr><td><div>" + Hash + '</div></td><td><div><b>' + Json.value / 100000000 + " BTC</b></div></td></tr>");

      Html.insertAfter($(Table + " tr:first")).find("div").hide().slideDown("slow");
      $("#getBTC tr:last-child").remove();
    };

    Socket.onopen = function() {
      Socket.send('{"op":"set_tx_mini"}{"op":"unconfirmed_sub"}{"op":"blocks_sub"}');
    }
  });
