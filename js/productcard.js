//jQuery(document).ready(function($){
//	$('.buy').on('click', function(e){
//		e.preventDefault();
//
//		$('body').toggleClass('expanded');
//	})
//});
//
//jQuery(document).ready(function($){
//	$('.love').on('click', function(e){
//		e.preventDefault();
//
//		$('.body').toggleClass('expanded');
//	})
//})


(function () {
    var module = {
        init: function (id, options) {
            var me = this,
                timer = 0;
            
            this.options = options;
            this.el = document.getElementById(id);
            this.html = this.el.innerHTML;
            
            this.on(window, 'resize', function() {
                timer && clearTimeout(timer);
                timer = setTimeout(function() {
                    if (me.options.onChange) {
                        me.options.onChange.call(me);
                    }
                }, 100);
            });
            this.render();
        },
        render: function () {
            this.el.innerHTML = this.html;
            
            var i = 0,
                col = 0,
                items = this.el.getElementsByTagName('li'),
                lists = [];

            for (i = 0; i < items.length; i += 1) {
                col = i % (this.options.columns || 3);
                if (!lists[col]) {
                    lists[col] = document.createElement('ul');
                }
                lists[col].appendChild(items[i]);
            }

            this.el.innerHTML = '';
            for (i = 0; i < lists.length; i += 1) {
                this.el.appendChild(lists[i]);
            }
        },
        on: function (obj, name, func) {
            if (obj.addEventListener) {
                obj.addEventListener(name, func, false);
            } else if (element.attachEvent) {
                obj.attachEvent('on' + name, func);
            } else {
                obj['on' + name] = func;
            }
        }
    };
    module.init('content', {
        columns: 2,
        onChange: function() {
            var w = window.innerWidth;
            if (w > 0) {
                this.options.columns = 1;
            }
            if (w > 320) {
                this.options.columns = 2;
            }
            if (w > 640) {
                this.options.columns = 3;
            }
            if (w > 920) {
                this.options.columns = 4;
            }
            console.log(w, this.options.columns);
            this.render();
        }
    });
}());