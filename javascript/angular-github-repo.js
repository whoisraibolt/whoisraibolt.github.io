/**
 * GitHub Repository service and directive for AngularJS
 * @version v0.0.1
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

'use strict';

angular.module('githubRepo', [])
  .factory('GitHubRepo', function ($http, $q) {

    var githubApi = 'https://api.github.com/repos/';
    var github = 'https://github.com/';

    /**
     * GitHub Repository conntructor.
     */
    function GitHubRepo(repo) {
      this.name = repo.name;
      this.description = repo.description;
      this.url = repo.url;
      this.forks = repo.forks_count;
      this.issues = repo.open_issues;
      this.pushedAt = new Date(repo.pushed_at);
      this.stargazers = repo.stargazers_count;
      this.author = repo.owner.login;
      this.fullData = repo;
      this.repo_url = github + this.author + '/' + this.name;
    }

    var factory = {};

    /**
     * Get GitHub Repository object for a given repo.
     */
    factory.fecth = function (repo) {
      var deferred = $q.defer();

      $http.get(githubApi + repo)
        .success(function (data) {
          deferred.resolve(new GitHubRepo(data));
        })
        .error(deferred.reject);

      return deferred.promise;
    };

    return factory;
  })

  .directive('githubRepo', function(GitHubRepo, $parse) {
    return {
      restrict: 'A',
      scope: true,
      template:
        '<div class="github-box">' +
          '<div class="github-box-header">' +
            '<h3>' +
              '<a href="{{repo_url}}" target="_blank">{{name}}</a><small ng-if="options.author">, by {{author}}</small>' +
            '</h3>' +
            '<div class="github-stats">' +
              '<a ng-if="options.stars" class="repo-stars" title="Stars" data-icon="7" href="{{repo_url}}/stargazers" target="_blank">{{stargazers}}</a>' +
              '<a ng-if="options.forks" class="repo-forks" title="Forks" data-icon="f" href="{{repo_url}}/network/members" target="_blank">{{forks}}</a>' +
              '<a ng-if="options.issues" class="repo-issues" title="Issues" data-icon="i" href="{{repo_url}}/issues" target="_blank">{{issues}}</a>' +
            '</div>' +
          '</div>' +
          '<div class="github-box-content">' +
            '<p>{{description}}</p>' +
          '</div>' +
          '<div class="github-box-download">' +
            '<p class="repo-update">Latest commit to <strong>master</strong> on {{pushedAt | date:options.dateFormat}}</p>' +
            '<a class="repo-download" title="Download as zip" data-icon="w" href="{{url}}/zipball/master"></a>' +
          '</div>' +
        '</div>',
      link: function(scope, element, attr) {
        if (!attr.githubRepo) throw 'GitHub Repository not defined.';

        var defaults = {
          dateFormat: 'mediumDate',
          stars:      true,
          forks:      true,
          issues:     false,
          author:     false
        };

        GitHubRepo.fecth(attr.githubRepo)
          .then(function (repo) {
            angular.extend(scope, repo, {
              options: defaults
            });

            angular.extend(scope.options, attr.githubRepoOptions ? $parse(attr.githubRepoOptions)(scope) : {});
          })
          .catch(function (err) {
            throw err;
          });
      }
    };
  });
