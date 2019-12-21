function ServerController($http, $scope, moment, $rootScope) {

  //get_info();

  $scope.colors = [{
    fill: false,
    borderColor: '#4FC3F7',
    pointBorderColor: '#000000',
    pointHoverBackgroundColor: '#4FC3F7',
    pointHoverRadius: 2,
    pointHitRadius: 5
  },
  {
    fill: false,
    borderColor: '#FF8A65',
    pointBorderColor: '#000000',
    pointHoverBackgroundColor: '#FF8A65',
    pointHoverRadius: 2,
    pointHitRadius: 5
  },
  {
    fill: false,
    borderColor: '#90A4AE',
    pointBorderColor: '#000000',
    pointHoverBackgroundColor: '#90A4AE',
    pointHoverRadius: 2,
    pointHitRadius: 5
  }]

  $scope.options = {
    elements: {
      point: {
        radius: 0
      },
      line: {
        fill: false,
        tension: 0
      }
    },
    scales: {
      xAxes: [{
        afterTickToLabelConversion: function (data) {
          var xLabels = data.ticks;

          xLabels.forEach(function (labels, i) {
            xLabels[i] = moment(xLabels[i], "HH:mm:ss").format("hh:mm");
            if (i % 2 == 1) {
              xLabels[i] = '';
            }
          })
        },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0
        },
        gridLines: {
          display: false,
        }
      }]
    },
    tooltips: {
      callbacks: {
        title: function (tooltipItem) {
          return this._data.labels[tooltipItem[0].index];
        }
      }
    },
    animation: {
      duration: 0
    }
  }

  function get_info() {
    $http.get('/rest/v1/getusage/srv01.racun.ninja').then(function (res) {
      one_minute_load = [];
      five_minute_load = [];
      fifteen_minute_load = [];
      labels = [];
      res.data.forEach(element => {
        one_minute_load.push(element.one_minute_load);
        five_minute_load.push(element.five_minute_load);
        fifteen_minute_load.push(element.fifteen_minute_load);
        labels.push(moment.unix(element.time).format("hh:mm:ss"));
      });
      $scope.data = [one_minute_load, five_minute_load, fifteen_minute_load];
      $scope.labels = labels;
      $scope.series = ['1.load', '5.load', '15.load']
    })

    $rootScope.timeout = setTimeout(get_info, 5000);
  }

  $scope.start = function() {
    $scope.stopped = false;
    $scope.loading = true;
    get_info();
  }

  $scope.stop = function() {
    $scope.stopped = true;
    $scope.loading = false;
    clearTimeout($rootScope.timeout);
  }

  $scope.start();
}