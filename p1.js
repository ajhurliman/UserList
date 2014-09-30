(function($){
  //USER
	var User = Backbone.Model.extend({});

  //USERLIST
  var UserList = Backbone.Collection.extend({
    model: User
  });
  var userList = new UserList;

  //USERVIEW
  var UserView = Backbone.View.extend({
    events: {
      "click .delete": "deleteUser",
      "click .firstEditButton": "firstUpdate",
      "click .lastEditButton": "lastUpdate",
      "click .emailEditButton": "emailUpdate",
      "click .phoneEditButton": "phoneUpdate",
    },

    template: _.template($('#userTemplate').html()),

    initialize: function(){
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.$('.help-block').hide();
      return this;
    },

    deleteUser: function() {
      this.model.destroy();
    },

    firstUpdate: function() {
      var newFirst = this.$('.firstTextEdit').val();
      if (newFirst) {
        this.model.set('first', newFirst);
        this.render();
      } else {
        this.$('.firstEditHelp').show();
      }
    },

    lastUpdate: function() {
      var newLast = this.$('.lastTextEdit').val();
      this.model.set('last', newLast);
      this.render();
    },

    emailUpdate: function() {
      var newEmail = this.$('.emailTextEdit').val();
      var validEmail = appView.isEmailValid(newEmail);
      if (validEmail) {
        this.model.set('email', newEmail);
        this.render();
      } else {
        this.$('.emailEditHelp').show();
      }
    },

    phoneUpdate: function() {
      var newPhone = this.$('.phoneTextEdit').val();
      this.model.set('phone', newPhone);
      this.render();
    },
  });


  //APPVIEW
	var AppView = Backbone.View.extend({
		el: $('#appView'),
    events: {
      'keypress #inputFirst': 'addUser',
      'keypress #inputLast': 'addUser',
      'keypress #inputEmail': 'addUser',
      'keypress #inputPhone': 'addUser',
    },
		initialize: function(){
      this.inputFirst = this.$('#inputFirst');
      this.inputLast = this.$('#inputLast');
      this.inputEmail = this.$('#inputEmail');
      this.inputPhone = this.$('#inputPhone');
			_.bindAll(this, 'render');
			this.listenTo(userList, 'add', this.pushUser);
      $('.help-block').hide();

		},

    addUser: function(e) {
      if (e.keyCode != 13)
        return;
      if (!this.inputFirst.val()) {
        $('.firstNameHelp').show();
        return;
      } else {
        $('.firstNameHelp').hide();
      }

      var validEmail = this.isEmailValid(this.inputEmail.val());
      if (!validEmail) {
        $('.emailHelp').show();
        return;
      }
      e.preventDefault();
      userList.add({
        first: this.inputFirst.val(),
        last: this.inputLast.val(),
        email: this.inputEmail.val(),
        phone: this.inputPhone.val()
      });
    },

    //checks to see if the email is valid, returns false if not, as in "no, this is not valid"
    isEmailValid: function(email) {
      atPos = email.indexOf("@");
      stopPos = email.lastIndexOf(".");
      stopPosLast = email.indexOf(".");
      if (atPos === -1 || stopPos === -1) return false;
      if (stopPos - atPos <= 1) return false;
      if (atPos == 0) return false;
      if (stopPosLast < 2) return false; //can't put upper bound on domain length because of new TLDs
      return true;
    },

    pushUser: function(user) {
      var userView = new UserView({model: user});
      this.$('#userList').append(userView.render().el);
      this.inputFirst.val("");
      this.inputLast.val("");
      this.inputEmail.val("");
      this.inputPhone.val("");
      $('.help-block').hide();
    }
	});
	var appView = new AppView();
}) (jQuery);
