(function () {
  var routes = {};
  var route = function(path, templateId, controller) {
    if (typeof templateId === 'function') {
      controller = templateId;
      templateId = null;
    }
    routes[path] = {templateId: templateId, controller: controller};
  }
  var el = null, current = null;
  var router = function() {
    var url = location.hash.slice(1) || '/';
    var route = routes[url];
    if (route && !route.templateId) {
      return route.controller ? new route.controller : null;
    }
    el = el || document.getElementById('view');
    if (current) {
      Object.unobserve(current.controller, current.render);
      current = null;
    }
    if (el && route && route.controller) {
      current = {
        controller: new route.controller,
        template: tmpl(route.templateId),
        render: function () {
          el.innerHTML = this.template(this.controller);
        }
      };
      current.render();
      Object.observe(current.controller, current.render.bind(current));
    }
  }
  this.addEventListener('hashchange', router);
  this.addEventListener('load', router);
  this.route = route;
  
})();