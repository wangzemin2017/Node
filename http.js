"use strict"
//引入http核心模块
const http = require('http');
//创建一个服务器
const server = http.createServer();
//监听用户的请求
server.on('request', function(req, res){
	res.write('hello world');
	//请求头信息（JSON对象形式）
	console.log(req.headers);
	//请求头信息（字符串数组形式）
	console.log(req.rawHeaders);
	//请求方式（在地址栏中输入进行请求的都是GET方式）
	console.log(req.method);
	//协议版本
	console.log(req.httpVersion);
	//请求的地址（浏览器会自动请求一个'/favicon.ico'的地址，所以会产生两次请求）
	console.log(req.url);
	res.end();
});
//监听本地地址的3000端口
server.listen(3000, '127.0.0.1', function(){
	console.log('server is running ar port 3000...');
});