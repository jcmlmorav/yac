const socket = io.connect('http://' + document.domain + ':' + location.port);

export {socket};
