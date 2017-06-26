const express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var {wordMeaning, translate, getCafeteriaMenu} = require('./utils');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/keyboard', (req, res) => {
    menu = {
        "type" : "buttons",
        "buttons" : ["학식", "단어 찾기", "번역하기"]
    }

    res.send(menu);
});

app.post('/message', (req, res) => {
    console.log(req.body);
    var sendData = { };
    if (!req.body['user_key'] || !req.body['type'] || !req.body['content']) {
        sendData['success'] = 0;
        sendData['error'] = 'invalid request';
        res.send(JSON.stringify(sendData));
        return;
    }

    var message = req.body['content'];
    console.log(message);
    

    if (message == '포어과') {
        sendData = {
            'message': {
                'text': 'ㅎㅇ'
            }
        }
    } else if (message == 'ㅎㅇ') {
        sendData = {
            'message': {
                'text': 'Bom dia!'
            }
        }
    } else if (message == '단어 찾기') {
        sendData = {
            'message': {
                'text': '단어를 찾으려면 w나 ㄷ를 앞에 쓰고 한 칸 띄운 다음 단어를 입력해주세요'
            }
        }
    } else if (message == '번역하기') {
        sendData = {
            'message': {
                'text': '번역을 할려면 t나 ㅂ를 앞에 쓰고 한 칸 띄운 다음 문장을 입력해주세요\n한국어 -> 포어, 영어 -> 포어만 지원됩니다.'
            }
        }
    } else if (message.startsWith('w ') || message.startsWith('ㄷ ') ) {
        wordMeaning(message, (meaning) => {
                sendData = {
                    'message': {
                        'text': meaning
                    }
                }

            res.send(sendData);
            
        });
        return
    } else if (message.startsWith('t ') || message.startsWith('ㅂ ') ) { 
        translate(message, (meaning) => {
            sendData = {
                'message': {
                    'text': meaning
                }
            }
            res.send(sendData);
        });
        return;
    } else if (message == '학식') {
        sendData = {
            'message': {
                'text': '고르세요.'
            },
            'keyboard': {
                "type" : "buttons",
                "buttons" : ["인문관 점심", "인문관 저녁", "교수회관 점심", "교수회관 저녁"]
            }
        }
        
    } else if (message == '점심') {
        sendData = {
            'message': {
                'text': 'Para onde?'
            },
            'keyboard': {
                "type" : "buttons",
                "buttons" : ["인문관 점심", "교수회관 점심"]
            }
        }
        
    } else if (message == '저녁') {
        sendData = {
            'message': {
                'text': 'Para onde?'
            },
            'keyboard': {
                "type" : "buttons",
                "buttons" : ["인문관 저녁", "교수회관 저녁"]
            }
        }
        
    } else if (message == '인문관 점심' || message == '인문관 저녁' || message == '교수회관 점심' || message == '교수회관 저녁') {
        getCafeteriaMenu(message, (menu) => {
            {
            sendData = {
                'message' : {
                    'text': menu
                }
            }
            res.send(sendData);
            }
        });
        return;     
    } else if (message == '안녕') {
        sendData = {
            'message': {
                'text': '안녕'
            }
        }
    } else if (message == '도움') {
        sendData = {
            'message': {
                'text': 'ㅇㅋ'
            },
            'keyboard': {
                "type" : "buttons",
                "buttons" : ["학식", "단어 찾기", "번역하기"]
            }
        }
        
    } else {
        sendData = {
            'message': {
                'text': ' ¯\\_(ツ)_/¯',
                'photo': {
                    'url': 'http://a3.cdn.whatstrending.com/post_items/images/000/034/584/large/shrug_emoji.jpg',
                    'width': 400,
                    'height': 200
                }
            }
        }
    }
    res.send(sendData);
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});