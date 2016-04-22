# latest-bitcoin-transactions
A jquery script to get the latest bitcoin transactions

A simple light-weighted jquery/js script to view the latest bitcoin transactions. Latest transactions will auto update.
Using: wss://ws.blockchain.info/inv

![alt tag](http://gy.ee/SJFJ.gif)

How to use:

Add 3 scripts in your head
```sh
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
  <script type="text/javascript" src="connectSocket.js" ></script>
  <script type="text/javascript" src="BlockchainInv.js"></script>
```

Now you can create a table, add id "getBTC" to let the script know which table to use.
```sh
  <table id="getBTC">
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
  </table>
```

The amount of table rows means how much bitcoin transactions he needs to show. In this case we recieve the 10 latest transactions (live update)

