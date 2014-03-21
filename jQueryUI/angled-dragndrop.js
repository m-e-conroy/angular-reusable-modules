/**
 * Angled Drag N Drop
 * 
 * Angular directives to perform drag and drop functions with the help of 
 * jQuery UI.
 * 
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 * @date: 12 Mar 2014
 * 
 * @require
 * 		* AngularJS 1.2.x
 * 		* jQuery UI 1.10.x
 *  
 */
angular.module('angled-dragndrop-directives',[])

	/**
	 *	Angled Draggable
	 *	
  	 *	Attributes:
  	 * 		1.  angled-draggable - jQuery UI draggable function options (see jQuery UI docs)
     *		2.  id
     *		4.  group
     *		5.  placeholder
     * 		6.  associate - associated object, pass in an object of values to associate with the draggable content
     *	
     *	Example:
     *		<div id="menu" angled-draggable="{addClasses: false,opacity: 0.5}" group="groupName" placeholder="true">...</div>
     *		
     *	Events Emitted:
     *		* angled.draggable.started (sends scope.obj object)
     *		* angled.draggable.dragging
     *		* angled.draggable.stopped
     *	
     *	Place Holder CSS Class: .dragging-placeholder
	 */
	.directive('angledDraggable',[function(){
		return {
    		restrict : 'A',
		    link : function(scope,el,attrs){
		    	scope.minimized = false;
		    	
		    	// draggable object properties
		      	scope.obj = {
		        	id : null,
        			content : '',
        			associate : null,
		        	group : null
		      	};
      			scope.placeholder = false;
			    
			    //=== Setup ===//
			    
			    scope.obj.content = el.html(); // save object content
      	
				if(angular.isDefined(attrs.id)) // save id if defined
        			scope.obj.id = attrs.id;
      			
      			if(angular.isDefined(attrs.associate)) // save associated object
      				scope.obj.associate = attrs.associate;
      				
	      		if(angular.isDefined(attrs.placeholder)) // set whether or not to show the place holder upon dragging the element
    	    		scope.placeholder = scope.$eval(attrs.placeholder);
      
      			// options for jQuery UI's draggable method
      			var opts = (angular.isDefined(attrs.angledDraggable)) ? scope.$eval(attrs.angledDraggable) : {};
      
				if(angular.isDefined(attrs.group)){ // identify the draggable group if there is one
    	    		scope.obj.group = attrs.group;
        			opts.stack = '.' + attrs.group;
      			}
      
	      		// event handlers
    	  		var evts = {
    	  			start : function(evt,ui){
          				if(scope.placeholder) // ui.helper is jQuery object
            				ui.helper.wrap('<div class="angled-draggable-placeholder"></div>');
          	
						scope.$apply(function(){ // emit event in angular context, send object with event
            				scope.$emit('angled.draggable.started',{obj: scope.obj});
          				}); // end $apply
	        		}, // end start
        
	        		drag : function(evt){
    	      			scope.$apply(function(){ // emit event in angular context
        	    			scope.$emit('angled.draggable.dragging');
          				}); // end $apply
        			}, // end drag
        
	        		stop : function(evt,ui){
    	      			if(scope.placeholder)
        	    			ui.helper.unwrap();
          
          				scope.$apply(function(){ // emit event in angular context
            				scope.$emit('angled.draggable.stopped');
	          			}); // end $apply
    	    		} // end stop
      			}; // end evts
      
	      		// combine options and events
    	  		var options = angular.extend({},opts,evts);
      			el.draggable(options); // make element draggable
    		} // end link
  		}; // end return
	}]) // end draggable

	/**
	 * Angled Droppable
	 * 
	 * Attributes:
	 * 		1.  angled-droppable - jQuery UI droppable function options (see jQuery UI docs)
	 * 		2.  id
	 * 
	 * Example:
	 * 		<div id="dropArea" angled-droppable="{}">...</div>
	 * 
	 * Events Emitted:
	 *  	* angled.droppable.dropped (sends droppable's scope.obj object)
	 */
	.directive('angledDroppable',[function(){
		return {
			restrict : 'A',
			link : function(scope,el,attrs){
				scope.obj = {
					id : null,
					dropped : [] // list of items dropped on droppable
				};
				
				if(angular.isDefined(attrs.id)) // save id if defined
					scope.obj.id = attrs.id;
					
				// setup the options object to pass to jQuery UI's draggable method
				var opts = (angular.isDefined(attrs.angledDroppable)) ? scope.$eval(attrs.angledDroppable) : {};
				
				var evts = {
					drop : function(evt,ui){ // apply scope context
						scope.$apply(function(){
							scope.obj.dropped.push(angular.copy(scope.$parent.obj));
							scope.$emit('angled.droppable.dropped',{obj: scope.obj});
						});
					}
				}; // end evts
				
				var options = angular.extend({},opts,evts);
				el.droppable(options);
			} // end link
		}; // end return
	}]); // end droppable
	
// declare main module
angular.module('angled-dragndrop',['angled-dragndrop-directives']);