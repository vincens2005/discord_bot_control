var Discord = require("discord.js");
var client = new Discord.Client();
var express = require("express");
var fs = require("fs");
var messages = [];
var eventstreams = [];
var app = express();
client.on('ready', () => {
    console.log("logged into discord");
});
client.on("message", msg => {
    if(msg.content == "ping"){
        msg.reply("pong");
    }
    messages.push(msg);
    var data = {
        content: msg.content,
        msgindex: messages.indexOf(msg),
        tag: msg.author.tag
    };
    for(i in eventstreams){
        eventstreams[i].write(`data: ${JSON.stringify(data)}\n\n`);
        eventstreams[i].flushHeaders();
    }
});
client.login("NzkyNDY3NDYwMzM0NTUxMDkx.X-eI1Q.Qb72FbyQxRKdr8YFUq37HALvSTM");
app.get("/", function(request, response){
    response.writeHead(200, {"content-type":"text/html"});
    fs.createReadStream("index.html").pipe(response);
});
app.get("/sendmsg/:data",function(request,response){
    var currentdata = JSON.parse(request.params.data);
    messages[currentdata.msgindex].reply(currentdata.reply);
    response.end();
});
app.get("/messages",function(request,response){
    response.writeHead(200,{
        "content-type":"text/event-stream",
        "cache-control":"no-cache",
        "access-control-allow-origin":"*",
        "connection":"keep-alive"
    });
    response.write("data: connected!\n\n");
    eventstreams.push(response);
    response.flushHeaders();
})
app.listen(5500);
console.log("app is running at http://localhost:5500");