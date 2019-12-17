function ServerController($http, $scope, moment) {

  get_info();

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

      $scope.colors = [{
        fill: false,
        borderColor: '#4FC3F7',
        pointBorderColor: '#000000',
        pointHoverBackgroundColor: '#4FC3F7'
      },
      {
        fill: false,
        borderColor: '#FF8A65',
        pointBorderColor: '#000000',
        pointHoverBackgroundColor: '#FF8A65'
      },
      {
        fill: false,
        borderColor: '#90A4AE',
        pointBorderColor: '#000000',
        pointHoverBackgroundColor: '#90A4AE'
      }]

      $scope.options = {
        elements: {
          point: {
            radius: 0.5
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            }
          }]
        }
      }
    })
  }
}