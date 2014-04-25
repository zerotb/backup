define([
  'underscore',
  'backbone',
  'jquery',
  'facebook',
  'views/universidades/universidadesView'
	], function(_, Backbone,$,FB, UniversidadesView){
	var MainView = Backbone.View.extend({
			
		events : {
			"click #FacebookLogIn":"loginFaceBook",
			"click #FacebookLogOut":"logoutFaceBook"
		},
		
	
		initialize: function() {
			_.bindAll(this, "render", "loginFaceBook", "logoutFaceBook"); // Needed for including "this" context in functions

			this.myfbtoken = "";
			
			$("li#FacebookLogout").hide();
			
			this.render();
		},
		
		logoutFaceBook: function() {
			FB.logout();
			$("li#FacebookPicture").html("");
			$("li#FacebookLogin").show();
			$("li#FacebookLogout").hide();
		},
		
		loginFaceBook: function() {
			var me = this;
			
			FB.login(function() {
			FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire
				var accessToken = response.authResponse.accessToken;
				me.myfbtoken = accessToken;
				me.FBUserId = response.authResponse.userID;
				me.showFBUser();
			  } else if (response.status === 'not_authorized') {
				// the user is logged in to Facebook, 
				// but has not authenticated your app
			  } else {
				// the user isn't logged in to Facebook.
			  }
			 });
			});    

		},
		
		showFBUser: function() {
			$("li#FacebookPicture").append("<img src='https://graph.facebook.com/"+this.FBUserId+"/picture'/>");
			$("li#FacebookLogin").hide();
			$("li#FacebookLogout").show();

		},
		

		
		render: function() {
			this.universidadesView = new UniversidadesView({el:$("#contenido")});


			
			$("body").append("Main");
		
			return this
		}
	
	});
  
  return MainView;
});