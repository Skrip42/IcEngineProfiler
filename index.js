document.addEventListener('DOMContentLoaded', function () {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'init'}, function (response) {
                    var controllerList = document.getElementById('controllerListContainer');
                    controllerList.innerHTML = '';
                    controllerList.appendChild(drowControllerList(response));
                })
            }
        );
    eventInit();
    }
);

function eventInit() {
    document.getElementById('controllerListContainer').addEventListener(
        'mouseover', 
        function (event) {
            if (event.target.classList.contains('elementContent')) {
                hoverController(event.target.parentNode.id);
            }
        }
    );
    document.getElementById('controllerListContainer').addEventListener(
        'mouseout', 
        function (event) {
            if (event.target.classList.contains('elementContent')) {
                if (event.relatedTarget.parentNode !== event.target) {
                    setTimeout(
                        blurController(event.target.parentNode.id),
                        500
                    );
                }
            }
        }
    );
}

function hoverController(id) {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id, 
                {type: 'hover', controllerId: id}, 
                function (response) {
                }
            )
        }
    );
}

function blurController(id) {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id, 
                {type: 'blur', controllerId: id}, 
                function (response) {
                }
            )
        }
    );
}

function drowControllerList(controllerList) {
    var container = document.createElement('div');
    container.classList.add('controllerList');
    for (var i = 0; i < controllerList.length; i++) {
        container.appendChild(drowController(controllerList[i]));
    }
    return container;
}

function drowController(controller) {
    var controllerElement = document.createElement('div');
    controllerElement.id = controller.id;
    controllerElement.classList.add('controllerElement');
    controllerElement.setAttribute(
        'title', 
        'controller: ' + controller.controller 
            + '\ntemplate: ' + controller.template
            + '\ntime:' + controller.time
    );
    var titleElement = document.createElement('div');
    titleElement.innerHTML = controller.controller;
    titleElement.classList.add('controllerElementTitle');
    var timeElement = document.createElement('div');
    timeElement.innerHTML = controller.time;
    timeElement.classList.add('controllerElementTime');
    var clearfix = document.createElement('div');
    clearfix.classList.add('clearfix');
    var elementContent = document.createElement('div');
    elementContent.classList.add('elementContent');
    if (parseFloat(controller.time) > 0.01) {
        timeElement.classList.add('alert');
    }
    elementContent.appendChild(titleElement);
    elementContent.appendChild(timeElement);
    elementContent.appendChild(clearfix);
    controllerElement.appendChild(elementContent);
    if (controller.childs.length) {
        controllerElement.appendChild(drowControllerList(controller.childs));
    }
    return controllerElement;
}












