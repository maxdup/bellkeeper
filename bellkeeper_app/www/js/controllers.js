angular.module('starter.controllers', [])

  .controller('MainCtrl', function($scope, $rootScope, LockService, $timeout) {

    $scope.form_value = {
      'ip': window.localStorage.getItem('ip'),
      'password': window.localStorage.getItem('password'),
      'duration': window.localStorage.getItem('duration') || 2
    }

    $scope.lock = '';

    $scope.options = {
      loop: false,
      effect: 'slide',
      speed: 500,
    }

    function save_settings(){
      if (window.localStorage.getItem('password') !=
          $scope.form_value.password){
        window.localStorage.setItem('password', $scope.form_value.password);
        if ($scope.status == 'denied'){
          $scope.status = 'online';
        }
      }
      if (window.localStorage.getItem('ip') !=
          $scope.form_value.ip){
        window.localStorage.setItem('ip', $scope.form_value.ip);
        $scope.status = 'polling';
        $scope.query();
      }
      if (window.localStorage.getItem('duration') !=
          $scope.form_value.duration){
        window.localStorage.setItem('duration', $scope.form_value.duration);
      }
    }

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
      save_settings();
    });

    function poll_handler(data){
      $scope.status = data.status == 204? 'online' : 'offline';
    }
    function unlock_handler(data){
      switch(data.status) {

      case 403:
        $scope.status = 'denied';
        $scope.lock = 'locked';
        timed_relock(3);
        break;

      case 200:
        $scope.status = 'online';
        $scope.lock = 'unlocked';
        timed_relock($scope.form_value.duration);
        break;

      default:
        $scope.status = 'offline';
        $scope.lock = 'locked';
        timed_relock(3);
      }
    }

    function timed_relock(duration){
      $timeout(relock, duration * 1000)
    }
    function relock(){
      $scope.lock = "";
    }

    $scope.query = function(){
      if ($scope.status != 'online' && $scope.status != 'denied'){
        $scope.status = 'polling';
        LockService.poll($scope.form_value.ip).then(poll_handler, poll_handler);
      } else {
        if ($scope.lock == ""){
          LockService.unlock($scope.form_value.ip,
                             $scope.form_value.password,
                             $scope.form_value.duration)
            .then(unlock_handler,unlock_handler)
        }
      }
    }
    $scope.query();
  })

