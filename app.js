// 설치한 express 모듈 불러오기
const express = require('express');

// 설치한 socket.io 모듈 불러오기
const socket = require('socket.io');

// Node.js 기본 내장 모듈 불러오기
const http = require('http');
const fs = require('fs');

// express 객체 생성
const app = express();

// express http 서버 생성
const server = http.createServer(app);

// 생성된 서버를 socket.io 에 바인딩
const io = socket(server);

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

// Get 방식으로 / 경로에 접속하면 실행되기
app.get('/', (req, res) => {
  //console.log('User가 / 으로 접속하였습니다.');
  //response.send('Hello, Express Server');
  fs.readFile('./static/index.html', function(err, data) {
    if (err) {
      res.send('에러');
    } else {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write(data);
      res.end();
    }
  });
});

io.sockets.on('connection', function(socket) {
  // 새로운 유저가 접속했을 경우 다른 소켓에게도 알려주ㄱㅣ
  socket.on('newUser', function(name) {
    console.log(name + ' 님이 접속하였습니다.');

    // 소켓에 이름 저장하기
    socket.name = name;

    // 모든 소켓에게 전송
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + " 님이 접속하였습니다."});
  });

  // 전송한 메세지 받기
  socket.on('message', function(data) {
    // 받은 데이터에 누가 보냈는지 이름 붙이기
    data.name = socket.name;

    console.log(data);

    // 보낸사람을 제외한 나머지 유저에게 메세지 보내기
    socket.broadcast.emit('update', data);
  });

  // 접속 종료
  socket.on('disconnect', function() {
    console.log(socket.name + ' 님이 접속 종료하였습니다.');

    // 나가는 사람을 제외한 나머지 유제어게 메세지 전송
    socket.broadcast.emit('update', {type: 'disconnect', name: "SERVER", message: socket.name + ' 님이 접속종료하였습니다.'});
  });
});

// 서버를 8080 포트로 listen
server.listen(8080, function() {
  console.log('서버 실행 중..');
});
