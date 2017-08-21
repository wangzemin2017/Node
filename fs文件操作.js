"use strict"

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'xia.html');
const distPath = path.join(__dirname, 'b.txt');

//========================监视文件变化================================
// fs.watchFile(filePath, {interval: 500}, function(curr, prev){
// 	console.log(`the current mtime is: ${curr.mtime}`);
// 	console.log(`the previous mtime was: ${prev.mtime}`);
// });

//========================普通方式读写文件============================
// fs.readFile(filePath, 'utf8', function(err, data){
// 	if(err){
// 		return console.log("读取文件失败");
// 	}
// 	fs.writeFile(distPath, data, err => {
// 		if(err){
// 			console.log("写入文件失败");
// 		}
// 		console.log(`${distPath}文件写入成功`);
// 	})
// });
// console.log(11111);

//=======================以流的方式读写文件==========================
// fs.createReadStream(filePath).pipe(fs.createWriteStream(distPath));

//===========================删除文件================================
// fs.unlink(distPath, err =>{
// 	if(err){
// 		console.log(`${distPath}文件删除失败`)
// 	}
// });

//========================获取文件信息===============================
// fs.stat(filePath, (err, stats) => {
// 	if(err){
// 		console.log(`${filePath}文件信息读取失败`);
// 	}
// 	console.log(stats);
// 	if(stats.isFile()){
// 		console.log(`${filePath}是一个文件`);
// 	}else if(stats.isDirectory()){
// 		console.log(`${filePath}是一个目录`);
// 	}
// });


fs.readdir('./todo', (err, files) => {
	if(err){
		console.log(`文件夹读取失败`);
	}
	var pathList = [];
	var count = 0;
	files.forEach(item => {
		let itemPath = path.join(__dirname, 'todo', item);

		fs.stat(itemPath, (err, stats) => {
			if(err){
				throw err;
			}

			if(stats.isFile()){
				pathList.push({'path': itemPath, 'type': 'file'});
			}else if(stats.isDirectory()){
				pathList.push({'path': itemPath, 'type': 'directory'});
			}

			count++;
			if(count == files.length){
				console.log(pathList);
			}
		})
	})
})
