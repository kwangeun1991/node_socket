const socket = io();

// 접속 되었을 때 실행
socket.on('connect', () => {
  // 이름을 입력 받기
  const name = prompt('반갑습니다. 이름을 입력해주세요.', '');

  // 이름이 빈칸으로 오는경우
  if (!name) {
    name = '익명';
  }

  // 서버에 새로운 유저가 왔다가 알리기
  socket.emit('newUser', name);
});

// 서버로부터 데이터 받은 경우
socket.on('update', (data) => {
  //console.log(`${data.name}: ${data.message}`);
  const chat = document.getElementsByClassName('chat_area');
  const message = document.createElement('div');
  const node = document.createTextNode(`${data.name}: ${data.message}`);
  let className = '';

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message' :
      className = 'other';
      break;
    case 'connect' :
      className = 'connect';
      break;
    case 'disconnect' :
      className = 'disconnect';
      break;
  }

  message.classList.add(className);
  message.appendChild(node);
  chat.appendChild(message);
});

// 전송 함수
function send() {
  // 입력되어있는 데이터 가져오기
  let message = document.getElementById('test').value;

  //가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value='';

  // 내가 전송할 메세지 클라이언트에게 표시
  const chat = document.getElementsByClassName('chat_area');
  const msg = document.createElement('div');
  const node = document.createTextNode(message);

  msg.classList.add('me');
  msg.appendChild(node);
  chat.appendChild(msg);

  //서버로 send 이벤트 전달 + 데이터도 보냄
  socket.emit('message', {type: 'message', message: message});
}
