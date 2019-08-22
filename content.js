var controller = function (element) {
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
        if (request.type == 'init') {
            var topControllers = [];
            var elements = document.getElementsByClassName('profile-container');
            elements = Array.prototype.slice.call(elements);
            for (var i = 0; i < elements.length; i++) {
                var elId = elements[i].id.replace('profile-container-', '');
                var controllerElement = new controller(elements[i]);
                controllerList[elId] = controllerElement;
                var parent = elements[i].getAttribute('data-profile-parent');
                if (parent) {
                    controllerList[parent].appendChild(controllerElement);
                } else {
                    topControllers.push(controllerElement);
                }

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
            sendResponse(topControllers);
        } else if (request.type == 'hover') {
            var oldTarget = document.getElementsByClassName('profile-hover');
            if (oldTarget && oldTarget[0]) {
                oldTarget[0].classList.remove('profile-hover');
            }
            var target = document.getElementById(
                'profile-container-' + request.controllerId
            );
            target.classList.add('profile-hover');
        } else if (request.type == 'blur') {
            var target = document.getElementById(
                'profile-container-' + request.controllerId
            );
            target.classList.remove('profile-hover');
        }
    }
);
