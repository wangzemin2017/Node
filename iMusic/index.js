
"use strict"

//引入核心模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qstring = require('querystring');
const _ = require('underscore');

const regexp_del = /^\/delete\/(\d{1,3})$/;
const regexp_edit = /^\/edit\/(\d{1,3})$/;

//列表
const imusicList = [{
	id: '1',
	song: '刚刚好',
	singer: '薛之谦',
	isHighQ: true
},{
	id: '2',
	song: '演员',
	singer: '薛之谦',
	isHighQ: false
},{
	id: '3',
	song: '告白气球',
	singer: '周杰伦',
	isHighQ: true
},{
	id: '4',
	song: '刚好遇见你',
	singer: '冯提莫',
	isHighQ: false
},{
	id: '5',
	song: '童话镇',
	singer: '陈一发儿',
	isHighQ: true
}];
//创建一个服务器
const server = http.createServer((req, res) => {
	// console.log(typeof req.url);
	let urlObj = url.parse(req.url);
	//console.log(urlObj);
	let pathname = urlObj.pathname;
	let method = req.method;

	if(pathname === '/'){
		fs.readFile('./index.html', 'utf-8', function(err, data){
			if(err){
				return res.end(err.message);
			}
			//使用_模板
			let tplData = _.template(data);
			let htmlStr = tplData({
				imusicList
			});
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end(htmlStr);
		});
	}else if(method === 'GET' && pathname === '/add'){
		fs.readFile('./add.html', 'utf-8', function(err, data){
			if(err){
				return res.end(err.message);
			}
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end(data);
		});
	}else if(method === 'POST' && pathname === '/add'){
		recivePostData(req, function(postData){
			let id = postData.id;
			let song = postData.song;
			let singer = postData.singer;
			let isHighQ = postData.isHighQ === '1' ? true : false;
			// console.log(isHighQ);

			let musicInfo = imusicList.find(music => music.song === song); 
			// console.log(musicInfo);

			if(musicInfo){
				return res.end('The song is already exist!');
			}
			imusicList.push({
				id: id,
				song: song,
				singer: singer,
				isHighQ: isHighQ
			});
			res.writeHead(302, {
				'Location': 'http://127.0.0.1:3000/'
			})
			res.end('success');
		});
	}else if(method === 'GET' && regexp_del.test(pathname)){
		let tarId = pathname.match(regexp_del)[1];
		let musicIndex = imusicList.findIndex(music => music.id === tarId);
		try{
			imusicList.splice(musicIndex, 1);
			res.end(JSON.stringify({
				code: '1',
				msg: 'success'
			}));
		}catch(e){
			res.end(JSON.stringify({
				code: '0',
				msg: e.message
			}));
		}
	}else if(method === 'GET' && regexp_edit.test(pathname)){
		let tarId = pathname.match(regexp_edit)[1];
		let musicInfo = imusicList.find(music => music.id === tarId);
		
		fs.readFile('./edit.html','utf-8', function(err, data){
			if(err){
				return res.end(err.message);
			}
			let tplData = _.template(data);
			let htmlStr = tplData({
				musicInfo
			});
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end(htmlStr);
		})
	}else if(method === 'POST' && regexp_edit.test(pathname)){
		recivePostData(req, function(postData){
			console.log(postData)
			let tarId = pathname.match(regexp_edit)[1];
			let infoCheck = imusicList.find(music => music.song === postData.song);
			if(infoCheck){
				return res.end('The song is already exist!');
			}
			imusicList[tarId - 1].song = postData.song;
			imusicList[tarId - 1].singer = postData.singer;
			imusicList[tarId - 1].isHighQ = postData.isHighQ === '1' ? true : false;

			res.writeHead(302, {
				'Location': 'http://127.0.0.1:3000/'
			});
			res.end();
		});
		
	}

});
server.listen(3000, function(){
	console.log('server is listening at port 3000...');
});
//接收POST方法的数据
function recivePostData(request, callback){
	let data = '';
	request.on('data', function(chunk){
		data += chunk;
	});
	request.on('end', function(){
		callback(qstring.parse(data));
	});
}