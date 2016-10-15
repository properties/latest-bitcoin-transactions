# latest-bitcoin-transactions
A lightweight javascript(jquery) script using websocket and Blockchain to recieve the latest Bitcoin transactions (Auto update).

![transactions](https://gy.ee/ab)

How to use it:

1. Add jQuery and the lbt.js to your head/body:
```sh
  <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
  <script src="lbt.js"></script>
```
2. Add a table with id getBTC (or edit id in lbt.js) with x amount of table rows (x = amount to show on page)
```sh
  <table id="getBTC">
    <tr></tr>
    <tr></tr>
    <tr></tr>
    <tr></tr>
    <tr></tr>
  </table>
```
