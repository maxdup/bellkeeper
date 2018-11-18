angular.module('starter.services', [])

  .service('LockService', ['$http', function($http) {
    function poll(ip){
      return $http({ url: 'http://' + ip + '/poll/',
                     method: "GET"});
    }
    function unlock(ip, password, duration){
      return $http({ url: 'http://'+ ip + '/',
                     method: 'POST',
                     headers : { 'Content-Type': undefined },
                     data    : { password: password,
                                 duration: duration },
                     transformRequest: function (data, headersGetter) {
                       var formData = new FormData();
                       angular.forEach(data, function (value, key) {
                         formData.append(key, value);
                       });
                       var headers = headersGetter();
                       delete headers['Content-Type'];
                       return formData;
                     }
                   });
    }
    return {
      poll: poll,
      unlock: unlock
  };
}]);
