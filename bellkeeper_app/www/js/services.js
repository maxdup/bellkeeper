angular.module('starter.services', [])

  .service('LockService', ['$http', function($http) {
    function poll(ip){
      return $http({ url: 'http://' + ip + '/poll/',
                     method: "GET"});
    }
    function unlock(ip, password, duration){
      var data = new FormData();
      data.append('password', password);
      data.append('duration', duration);
      return $http.post('http://'+ ip + '/', data, {
        headers : { 'Content-Type': undefined }});
    }
    return {
      poll: poll,
      unlock: unlock
    };
  }]);
