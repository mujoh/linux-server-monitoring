function ServerController($http, $scope, moment, $rootScope) {

  get_server_data();
  get_hdd_info();

  $scope.threshold = {
    '0': { color: '#009900' },
    '40': { color: '#ff8000' },
    '75.5': { color: '#cc3300' }
  };

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

  function get_load_info() {
    $http.get('/rest/v1/getload/srv01.racun.ninja').then(function (res) {
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
      $scope.data_load = [one_minute_load, five_minute_load, fifteen_minute_load];
      $scope.labels_load = labels;
      $scope.series_load = ['1.load', '5.load', '15.load'];
    })

    $rootScope.timeout = setTimeout(get_load_info, 5000);
  }

  function get_hdd_info() {

    $scope.options_hdd = {
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 0
        },
        line: {
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
        }],
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        }]
      },
      annotation: {
        annotations: [{
          drawTime: 'afterDraw', // overrides annotation.drawTime if set
          id: 'a-line-1', // optional
          type: 'line',
          borderDash: [10, 10],
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: '100',
          borderColor: 'red',
          borderWidth: 2,
        }]
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItem) {
            return ""
          },
          label: function (tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + " : " + tooltipItem.yLabel + "%"
          }
        }
      },
      animation: {
        duration: 0
      }
    }

    $http.get('/rest/v1/gethddusage/srv01.racun.ninja').then(function (res) {
      mmcblk0p2 = [];
      others = [];
      labels = [];
      series = [];
      res.data.forEach(element => {
        element.disks_usage.forEach(element => {
          if(element.mount == "/dev/mmcblk0p2") {
            mmcblk0p2.push(element.percentage.replace("%", ""));
            labels.push(moment.unix(element.time).format("hh:mm:ss"));
            series.push(element.mount);
          } else {
            others.push(element.percentage.replace("%", ""));
            labels.push(moment.unix(element.time).format("hh:mm:ss"));
            series.push(element.mount);
          }
        })
      })

      $scope.data_mmcblk0p2 = [mmcblk0p2, others];
      $scope.labels_disk = labels;
      $scope.series_disk = series;
    })

    $rootScope.timeout = setTimeout(get_load_info, 5000);
  }

  $scope.start = function() {
    $scope.stopped = false;
    $scope.loading = true;
    get_load_info();
  }

  $scope.stop = function() {
    $scope.stopped = true;
    $scope.loading = false;
    clearTimeout($rootScope.timeout);
  }

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
      $scope.data_hdd_usage = [data];
      $scope.labels_hdd_usage = labels;
      $scope.series_hdd_usage = res.data.map(function (value, index) { return monthNames[value.month - 1] });

      $scope.options_usage = { legend: { display: true } };
    }, function errorCallback(err) {
      toastr.error(err.data, "Error code " + err.status + " " + err.statusText);
    })
  }

  $scope.get_usage("srv01.racun.ninja");

  $scope.start();
}