
var $ = function (id) {
    return document.getElementById(id);
}

function show_menu(num) {
    for (i = 0; i < 100; i++) {
        if ($('li0' + i)) {
            $('li0' + i).style.display = 'none';
            $('f0' + i).className = '';
        }
    }
    $('li0' + num).style.display = 'block';//触发以后信息块
    $('f0' + num).className = 'left02down01_xia_li';//触发以后TAG样式
}

function show_menuB(numB) {
    for (j = 0; j < 100; j++) {
        if (j != numB) {
            if ($('Bli0' + j)) {
                $('Bli0' + j).style.display = 'none';
                $('Bf0' + j).style.background = 'url(images/01.gif)';
            }
        }
    }
    if ($('Bli0' + numB)) {
        if ($('Bli0' + numB).style.display == 'block') {
            $('Bli0' + numB).style.display = 'none';
            $('Bf0' + numB).style.background = 'url(images/01.gif)';
        } else {
            $('Bli0' + numB).style.display = 'block';
            $('Bf0' + numB).style.background = 'url(images/02.gif)';
        }
    }
}


var temp = 0;
function show_menuC() {
    if (temp == 0) {
        document.getElementById('LeftBox').style.display = 'none';
        document.getElementById('RightBox').style.marginLeft = '0px';
        document.getElementById('center').style.background = 'url(images/center.gif)';
        document.getElementById('center').style.background.repeat = 'no-repeat';
        document.getElementById('center').style.background = 'repeat';
        document.getElementById('RightBox').style.width = '100%';
        temp = 1;
    } else {
        Mobile
        document.getElementById('RightBox').style.marginLeft = '0px';
        document.getElementById('LeftBox').style.display = 'block';
        document.getElementById('center').style.background = 'url(images/center0.gif)';
        document.getElementById('center').style.background.repeat = 'no-repeat';
        document.getElementById('center').style.background = 'repeat';
        document.getElementById('RightBox').style.width = '80%';
        temp = 0;
    }
}
