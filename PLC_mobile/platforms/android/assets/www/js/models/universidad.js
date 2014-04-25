// Filename: models/universidad
define([
  'underscore',
  'backbone',
], function(_, Backbone){

	Universidad = Backbone.Model.extend({
		defaults : {
			id:""
		},
				
		initialize : function() {
			this.fbtoken = "";
			this.set("id", this.get("rbd"));
		},
		
		setToken: function(token) {
			this.fbtoken = token;
		}, 

		url: function() {
			return "http://webapi2.azurewebsites.net/api/uni/"+this.get("id")+"?token="+this.fbtoken;
		},
	});
	
  return Universidad;
});