/**********************************************************
*                 CONFIGURAÇÃO DO PLAYER                  *
***********************************************************/

var stop     = true;
var url      = 'http://74.63.240.58:8250/live';
var status   = 'OK';
var webradio = null;
var time     = null;
var browser  = false;

document.addEventListener('deviceready', function(){
         
    WebRadioPlay();
   
}, false);



function WebRadioPlay(){

    status = StatusConnection();

    if(status == 'OK'){

        if(stop){            
            stop = false;            
            document.getElementById('play').className = 'play stop';
            document.getElementById('spin').className = 'spinner';
            document.getElementById('statusbar').innerHTML = ' Carregando...';
            RadioPlay();
        }else{            
            stop = true;            
            document.getElementById('play').className = 'play';
            document.getElementById('spin').className = '';
            document.getElementById('statusbar').innerHTML = ' Play';
            RadioStop();
        }         

    }else{

        MessageBox('Error', status);

    }

}



function RadioPlay() {

    webradio = new Media(url, Success, Error);
    webradio.play();

    if (time == null) {
        
        //integer
        var seg = 0;
        var min = 0;
        var hor = 0;

        //string
        var strSeg = '';
        var strMin = '';
        var strHor = '';

        time = setInterval(function() {            

            webradio.getCurrentPosition(function(position) {                    

                    if (position > 0) {                        

                        seg++;

                        if(seg > 59){
                            seg = 0;
                            min++;
                        }

                        if(min > 59){                        
                            seg = 0;
                            min = 0;
                            hor++;
                        }
                        
                        if (seg < 10){
                            strSeg = '0'+(seg);
                        }else{
                            strSeg = seg;
                        }

                        if(min < 10){
                            strMin = '0'+(min);
                        }else{
                            strMin = min;
                        }

                        if(hor < 10){
                            strHor = '0'+(hor);
                        }else{
                            strHor = hor;
                        }                        

                        SetTime((strHor)+':'+(strMin)+':'+(strSeg));

                    }

                    if (parseInt(position) == 1) {
                        SetStatusBar();                        
                    }


                },
                function(e) {
                    MessageBox('Error', e);
                }
            );

        }, 1000);

    }

}

function RadioStop() {

    if (webradio) {
        webradio.stop();
    }

    clearInterval(time);
    time     = null;

}

function Success() {           

}

function Error(error) {

    if(error.code == 0){
        
        stop = false;            
        document.getElementById('play').className = 'play stop';
        document.getElementById('spin').className = 'spinner';
        SetStatusBar();

    }else{
        
        MessageBox('Error', 'Código: ' + error.code + '\n' +'Mensagem: ' + error.message);
    
    }

}

function SetTime(time) {
    document.getElementById('time').innerHTML = time;
}

function SetStatusBar() {
    document.getElementById('statusbar').innerHTML = '<iframe id="leng" name="leng" class="leng" src="http://www.gospeleuropa.com/label.php?c=fff&f=18" border="0" scrolling="no" frameborder="0" allowtransparency="true"></iframe>';                 
}


//CONFIGURAÇÃO DO NAVEGADOR
function openURL(url){

    status = StatusConnection();

    if(status == 'OK'){

        var ref = window.open(url, '_system');

    }else{

        MessageBox('Error', status);

    }

    return false;

}


//CONEXAO DE REDE
function StatusConnection() {

    var networkState = navigator.connection.type;
    var states = {};
    
    states[Connection.UNKNOWN]  = 'Conexão desconhecida';
    states[Connection.ETHERNET] = 'OK';//'Ethernet connection';
    states[Connection.WIFI]     = 'OK';//'WiFi connection';
    states[Connection.CELL_2G]  = 'OK';//'Cell 2G connection';
    states[Connection.CELL_3G]  = 'OK';//'Cell 3G connection';
    states[Connection.CELL_4G]  = 'OK';//'Cell 4G connection';
    states[Connection.CELL]     = 'Conexão genérica';
    states[Connection.NONE]     = 'Sem conexão de rede';
    
    return states[networkState];

}

function about(){
     MessageBox('Sobre','Radio Gospel Europa\n'+
                        'Pastor Daniel Varon\n'+ 
                        'Email: contato@gospeleuropa.com\n\n'+
                        'Desenvolvido por: Jessé Oliveira\n<<jesseh.oliv@gmail.com>>');
}


function MessageBox(Titulo, Mensagem) {
    navigator.notification.alert(Mensagem, Success, Titulo, 'Fechar');
}