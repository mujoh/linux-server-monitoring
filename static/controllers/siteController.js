function SiteController($http, $scope) {
  $scope.menu = [
    {label: 'Open...', description: 'ctrl + o'},
    {label: 'Save as...', description: 'ctrl + s'},
    {label: 'Rename', description: 'ctrl + r'},
    {label: 'Make a copy'},
    {label: 'Move to folder', icon: 'folder'},
    {label: 'Move to trash', icon: 'trash'},
    {divider: true},
    {label: 'Download As...'},
    {label: 'Publish To Web', icon: 'dropdown', children: [
      {label: 'Google Docs'},
      {label: 'Google Drive'},
      {label: 'Dropbox'},
      {label: 'Adobe Creative Cloud'},
      {label: 'Private FTP'},
      {label: 'Another Service...'}
    ]},
    {label: 'E-mail Collaborators'}
  ];
}