var controller = function (element) { //обьект - элемент дерева контролеров
    this.id = element.id.replace('profile-container-', '');
    this.controller = element.getAttribute('data-profile-controller');
    this.template = element.getAttribute('data-profile-template');
    this.time = element.getAttribute('data-profile-time');
    this.childs = [];

    this.appendChild = function (child) {
        this.childs.push(child);
    };
}

var controllerList = {};
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'init') {   //инициализация
            var elements = document.getElementsByClassName('profile-container');
            elements = Array.prototype.slice.call(elements);
            //расскрашиваем элементы, создаем лэйблы
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].classList.contains('profile-border')) {
                    continue;
                }
                elements[i].classList.add('profile-border');
                var profileData = document.createElement('div');
                profileData.classList.add('profile-data-label')

                var span = document.createElement('p')
                span.innerHTML = 'controller: ' 
                    + elements[i].getAttribute('data-profile-controller');
                profileData.appendChild(span);

                span = document.createElement('p');
                span.innerHTML = 'template: ' + elements[i].getAttribute('data-profile-template');
                profileData.appendChild(span);

                span = document.createElement('p');
                span.innerHTML = 'time: ' + elements[i].getAttribute('data-profile-time');
                profileData.appendChild(span);

                var point = document.createElement('div');
                point.classList.add('profile-point');

                elements[i].insertBefore(profileData, elements[i].firstChild);
                elements[i].insertBefore(point, elements[i].firstChild);
            }
            //сбор дерева контролеров
            var waitArray = elements; 
            var elementArray = [];
            var topControllers = [];
            var lastLenght;
            do {
                lastLenght = waitArray.lenght;
                elementArray = waitArray;
                waitArray = [];
                for (var i = 0; i < elementArray.length; i++) {
                    var elId = elementArray[i].id.replace('profile-container-', '');
                    var controllerElement = new controller(elementArray[i]);
                    controllerList[elId] = controllerElement;
                    var parent = elementArray[i].getAttribute('data-profile-parent');
                    if (parent) {
                        if (controllerList[parent]) { 
                            controllerList[parent].appendChild(controllerElement);
                        } else {    //если на текущей итерации предка еще нет, ставим элемент в следующю итерацию
                            waitArray.push(elementArray[i]);
                        }
                    } else {
                        topControllers.push(controllerElement);
                    }
                }
            } while (waitArray.length && waitArray.lenght != lastLenght);

            sendResponse(topControllers);
        } else if (request.type == 'hover') { //подсведка контролеров
            var oldTarget = document.getElementsByClassName('profile-hover');
            if (oldTarget && oldTarget[0]) {
                oldTarget[0].classList.remove('profile-hover');
            }
            var target = document.getElementById(
                'profile-container-' + request.controllerId
            );
            target.classList.add('profile-hover');
        } else if (request.type == 'blur') { //разподсветка контролллеров:)
            var target = document.getElementById(
                'profile-container-' + request.controllerId
            );
            target.classList.remove('profile-hover');
        }
        return true;
    }
);
