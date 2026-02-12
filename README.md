# Note
```js
const result = await util.status(ip_be, port_be);
const result_be = await util.statusBedrock(ip_be, port_be);
{ name: `**Xserver (BE限定)**`, value: " ", inline: false },
{ name: "サーバー状態", value: "🟢 オンライン", inline: true },
{ name: "参加人数", value: `${result_be.players.online}/${result_be.players.max}`, inline: true },
{ name: "バージョン", value: result_be.version.name || "undefined" }
```

```
npm init -y
npm install --save-dev eslint
npx eslint --init
```
