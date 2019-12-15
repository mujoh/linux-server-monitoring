function DashboardController($http, $scope, $rootScope, toastr) {
  get_server_data();

  $scope.loaded = false;

  $scope.threshold = {
    '0': { color: '#009900' },
    '40': { color: '#ff8000' },
    '75.5': { color: '#cc3300' }
  };

  function get_server_data() {
    $http.get('/rest/v1/system/srv01.racun.ninja').then(function(res) {
      $scope.sys_info = res.data;
      $scope.loaded = true;
      $scope.mem_used = (res.data.memory.used / res.data.memory.total * 100).toFixed(2);
      $scope.swp_used = (res.data.memory.swap_used / res.data.memory.swap_total * 100).toFixed(2);
      $scope.hdd_used = (res.data.hdd.hdd_used / res.data.hdd.hdd_total * 100).toFixed(2);

      if(res.data.memory.swap_used == "") {
        $scope.memory_gauge = "col-md-4"
      } else {
        $scope.memory_gauge = "col-md-6"
      }
    })
  }

  $scope.get_usage = function(server) {
    $http.get('/rest/v1/dailyusage/'+server).then(function (res) {
      data = [];
      labels = [];
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      res.data.forEach(element => {
        data.push($scope.Utils.convertMemorySize(element.usage));
        labels.push(element.day);
      });
      $scope.data = [data];
      $scope.labels = labels;
      $scope.series = res.data.map(function (value, index) { return monthNames[value.month - 1] });

      $scope.options_usage = { legend: { display: true } };
    }, function errorCallback(err) {
      toastr.error(err.data, "Error code " + err.status + " " + err.statusText);
    })
  }

  $scope.get_usage("srv01.racun.ninja");
}