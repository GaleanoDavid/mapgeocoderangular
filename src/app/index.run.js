(function() {
  'use strict';

  angular
    .module('mapaAngularTest')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
