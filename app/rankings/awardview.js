define("rankings/awardview",
[
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "events/common/event",
    "common/basicview",
    "app.config",

    "text!./templates/award.html",
    "text!./templates/awards.html",
    "text!./templates/usersvotes.html"
], function ($, Backbone, _, Handlebars, EventModel, BasicView, App, AwardTemplate, AwardsTemplate, UserVotesTemplate) {

	/**
	View abstracta das páginas de prémios

	@class rankings.AwardView
	@alternateClassName AwardView
	@extends BasicView
	**/
	return BasicView.extend({

		/**
		Elemento da DOM onde são colocados todas as páginas

		@property el 
		@type String
		@static
		@readonly
		
		**/
		el: "div[data-role=content]",


		/**
		Template base de todas as páginas de prémio

		@property template 
		@type String
		@readonly
		@protected
		
		**/
		template: AwardTemplate,

		/**
		Template da tab de premiados

		@property awardsTemplate 
		@type String
		@readonly
		@protected
		**/
		awardsTemplate: AwardsTemplate,

		/**
		Template da tab de votos de utilizadores

		@property usersVotesTemplate 
		@type String
		@readonly
		@protected
		
		**/
		usersVotesTemplate: UserVotesTemplate,

		/**
		Array de mais votados

		@property model 
		@type Array
		@protected
		
		**/
		models: [],

		/**
		Booleano que verifica se o elemento votado
		pelo utilizador está entre os mais votados

		@property isMostVoted
		@type boolean
		@protected
		
		**/
		isMostVoted: false,

		/**
		Booleano que representa a existência votos

		@property hasVotes
		@type boolean
		@protected
		
		**/
		hasVotes: false,

		/**
		Booleano que representa se estamos a apresentar
		a página de prémios de um evento ou de oradores

		@property isEvent
		@type boolean
		@protected
		
		**/
		isEvent: null,

		/**
		Indica o tipo de evento que a esta página de prémios
		apresenta, se tiver a null é uma página de oradores,
		caso contrário pode ser qualquer um dos tipos definidos na aplicação

		@property eventsType
		@type String
		@protected
		
		**/
		eventsType: null,

		/**
		Colecção dos elementos apresentados

		@property modelCollection
		@type Backbone.Collection
		@protected
		
		**/
		modelCollection: null,

		/**
		Array com o elementos apresenados na lista de votados pelos 
		utilizadores, representados pelo seu id e votos correspondentes

		@property votesArray
		@type Array
		@protected
		@example [{"id": 1, "votes":30}, {"id": 2, "votes":29}]
		**/
		votesArray: null,

		/**
		Array com o elementos apresenados na lista de premiados, representados
		pelo seu id

		@property prizesArray
		@type Array
		@protected
		@example [1,2,3]
		**/
		prizesArray: null,

		/**
		Modelo que guarda toda a informação sobre a página de prémios

		@property ranksInfo
		@type RankInfo
		@protected
		
		**/
		ranksInfo: null,

		/**
		Inteiro que representa o elemento em que o utilizador do dispositivo
		votou

		@property voted
		@type Number
		@protected
		
		**/
		voted: -1,

		/**
        Dicionário que guarda informações relativas aos tipos de
        eventos possíveis

        @property typesInfo
        @type Object
        @static
        @readonly
        @protected
        @example	"social": {color: '#8e44ad', url: '#social/'}, "keynote": {color: '#2ecc71', url: '#keynote/'},
					"session": {url: '#sessions/'}};
        **/
		typesInfo: app.TYPESINFO,

		/**
		Eventos lançados pela transição entre tabs
		

		@property events
		@type Object
		@protected
		**/
		events: {

			"click #awards-tab"			: "renderAwardsTab",
			"click #users-votes-tab"	: "renderUsersVotesTab",
			"click #vote-button" 		: "vote"
		},


		/**
        Construtor da classe. Faz o render das páginas de prémios

        @constructor
        **/
		initialize: function ()
		{
			_.bindAll(this);

			this.renderLayout();
			this.setElement($("[data-role=content]"));
			this.render();
		},

		/**
        Trata da inicialização dos parametros necessários para a página,
        chamando o construtor da AwardView quando a informação estiver pronta.
        É de salienntar que este é chamado principalmente pelas páginas que herdam
        da AwardView

        @method getStarted
        @protected
        @param {AwardView} AwardView view para chamar o seu construtor
        @param {Backbone.View} self	 view que utiliza o método
        @param {boolean} isEvent booleano que refere se estamos a tratar de uma página de prémios de eventos
        @param {String} eventsType tipo de evento, null se for uma página de oradores
        @param {Backbone.Collection} collection colecção dos elementos a apresentar
        **/
		getStarted: function(AwardView, self, isEvent, eventsType, collection){

			var attrs = this.ranksInfo.attributes;

			this.hasVotes = attrs.has_votes;

			this.isEvent = isEvent;

			this.eventsType = eventsType;

			this.votesArray = attrs.competitors;

			this.prizesArray = attrs.awards;

			this.modelCollection = collection;

			this.voted = attrs.voted;

			if(this.hasVotes)
				this.modelsId = this.getMostVoted(this.votesArray);


			this.modelCollection.fetch().done(
				function () {
					if(self.hasVotes)
						self.models = self.modelCollection.getByIds(self.modelsId);
					AwardView.prototype.initialize.apply(self);
				});	
		},

		/**
        Método que permite obter o array de elementos com mais votos,
        de um array em que os elementos são compostos por um id e um inteiro
        que representa os votos

        @method getMostVoted
        @protected
        @param {Array} array um array em que os elementos são compostos por um id e um inteiro que representa os votos
        @return {Array} retorna um array de id's
        **/
		getMostVoted: function(array){
			var maxVotes = array[0].votes;
			var results = [];
			var counter = 0;
			var that = this;

			this.lastModelIndex = 0;
			
			_.each(array, function(obj){
				
				if(obj.votes === maxVotes)
				{
					results.push(obj.id);
					that.lastModelIndex = counter;
				}
				counter += 1;
			});	

			return results;
		},

		/**
		Faz o rendering das páginas de prémios

		@method render
		@protected
		@chainable
		**/
		render: function () {

			var context = null;

			var html = this.compileTextTemplate(this.template, context);

			this.$el.append(html);
			this.enhanceJQMComponentsAPI();

			this.renderAwardsTab();

			return this;

		},

		/**
        Método que permite o jquery mobile funcionar bem na transição de tabs

        @method refresher
        @protected
        **/
		refresher: function(html){
			//adição do html pretendido e "refresh" para jquey mobile funcionar 
            $("#prize-tab-placeholder").html(html);
            $("#" + this.id).trigger("create");
		},

		/**
        Método que trata da informação a ser apresentada na tab de premiados.
        Faz o tratamento dos contextos dos premiados

        @method treatPrizesArray
        @protected
        **/
		treatPrizesArray: function(){
			var that = this;
			//Obtém os modelos correspondetes aos id's passados
			var elementsArray = this.modelCollection.getByIds(this.prizesArray);

			//Construção dos contextos dos premiados, dependendo do seu tipo,
			//ou seja, se estamos a falar de eventos ou oradores
			if(this.isEvent)
				return _.map(elementsArray, function(element){
					var attrs = element.attributes;
					return {
						id 			: attrs.id.toString(),
						url 		: that.typesInfo[that.eventsType.toLowerCase()].url + attrs.id.toString(),
						title 		: attrs.name,
						datetime 	: attrs.hour,
						room_name 	: attrs.local.name,
					};
				});
			else
				return _.map(elementsArray, function(element){
					var attrs = element.attributes;
					return {
						id 			: attrs.id.toString(),
						url 		: "#/user/"+attrs.id.toString(),
						name 		: attrs.name,
						institution : attrs.institution,
						area 		: attrs.area,
					};
				});
		},

		/**
        Faz o render da página de premiados, invocando o método de tratamento
        de informação, compilando o template e por fim faz o render do template

        @method renderAwardsTab
        @protected
        **/
		renderAwardsTab: function() {
			var awards = [];
			if(this.prizesArray === null)
				awards = null;
			else
				awards = this.treatPrizesArray();

			var context = {
					isEvent	: this.isEvent,
					awards	: awards
			};

			//compilação do template com a sua informação
            var html = this.compileTextTemplate(this.awardsTemplate, context);

            this.refresher(html);
		},

		/**
       	Método que trata de reotornar os votos de um certo elemento, representado
       	pelo id passado

        @method getVotes
        @protected
        @param {Number} id id de um elemento
        @return {Number} votos do elemento referente ao id passado
        **/
		getVotes: function(id){
			//Obtém o elemento com um dado id no array de votos
			var element = _.find(this.votesArray, function(obj){
				return obj.id === id;
			});
			return element.votes;
		},

		/**
       	Método que trata de retornar um array com os contextos dos elementos com mais votos

        @method treatVoteWinners
        @protected
        @return {Array} retorna array com os contexto dos elementos mais votados
        **/
		treatVoteWinners: function(){
			var that = this;
			return _.map(this.models, function(model){
				var model = model.attributes;
				if(that.isEvent)
					return {
						isvoted  	: that.voted === model.id,
						id 			: model.id.toString(),
						url 		: that.typesInfo[that.eventsType.toLowerCase()].url + model.id.toString(),
						title 		: model.name,
						datetime 	: model.hour,
						room_name 	: model.local.name,
						votes 		: that.getVotes(model.id),
					};
				else
					return {
						isvoted  	: that.voted === model.id,
						id 			: model.id.toString(),
						url 		: "#/user/"+model.id.toString(),
						name       	: model.name,
						institution	: model.institution,
						area 		: model.area,
						votes 		: that.getVotes(model.id),
					};

			});
		},


		/**
        Método que trata da informação a ser apresentada na tab votos de utilizadores,
        sobre os elementos que não são o mais votado

        @method treatOthers
        @protected
        @param {Array} array array de elementos que não são o mais votado
        @return {Array} com os contextos de cada elemento, ou seja a informação necessária de 
        cada elemento
        **/
		treatOthers: function(array){
			that = this;
			//Percorre array de modelos construindo o contexto de cada modelo,
			//ou seja, obtendo só a informação necessária
			return _.map(array, function(element){
								var attrs = element.attributes;
								if(that.isEvent)
									return {
										isvoted  	: that.voted === attrs.id,
										id 			: attrs.id.toString(),
										url 		: that.typesInfo[that.eventsType.toLowerCase()].url + attrs.id.toString(),
										title 		: attrs.name,
										votes 		: that.getVotes(attrs.id)
									}
								else
									return {
										isvoted  	: that.voted === attrs.id,
										id 			: attrs.id.toString(),
										url 		: "#/user/"+attrs.id.toString(),
										name 		: attrs.name,
										votes 		: that.getVotes(attrs.id)
									}
							});
		},

		/**
        Método que trata toda a informação a ser apresentada na tab votos de utilizadors,
		retornando a informação completa da tab

        @method getMostVotedContext
        @protected
        @return {Object} contexto completo da tab, ou seja, informação completa
        @example {
					isEvent		: true,
					isvoted  	: true,
					id 			: 1,
					url 		: #paper/1,
					title 		: "Nome do paper",
					datetime 	: Hora do evento,
					room_name 	: "Sala1",
					votes 		: 3,
					others		: resultado do treatOthers
				};
				ou
				{
					isEvent		: false,
					isvoted  	: true,
					id 			: 1,
					url 		: "#/users/1",
					user        : atributos do mais votado,
					votes 		: 2,
					others		: resultado do treatOthers
				};
        **/
		getMostVotedContext: function(){
			var that = this;
			var context = {};

			
			//Trata do votesArray, retirando apenas os id's
			//mais um para o utlimo com o voto maximo nao estar na parte dos outros
			var array = _.map(_.rest(this.votesArray, this.lastModelIndex+1), function(obj){
				return obj.id;
			});


			//Vai buscar os modelos necessários, passando os seus id's
			var elementsArray = this.modelCollection.getByIds(array);

			//Trata dos modelos para termos apenas a informação necessária
			var others = this.treatOthers(elementsArray);

			//Construção dos contextos para os eventos ou para o oradores
			return {
				hasVotes 	: this.hasVotes,
				isEvent		: this.isEvent,
				votewinners : this.treatVoteWinners(),
				others		: others
			};


		},

		/**
        Faz o render da página de votos dos utilizadores

        @method renderUsersVotesTab
        @protected
        **/
		renderUsersVotesTab: function() {
			
			var context = this.getMostVotedContext();
			
			//compilação do template com a sua informação
            var html = this.compileTextTemplate(this.usersVotesTemplate, context);
			this.isMostVoted = this.votedIsOneOfMostVoted();
            this.checkVoted();
            
            this.refresher(html);
		},

		/**
        Trata dos comportamentos da página quando há um incremento de um voto

        @method incrementVote
        @protected
        **/
		incrementVote: function(){
			var votes = $('#votes[value='+ this.voted+'] span').text();


           	$('#votes[value='+ this.voted+'] span').empty();
    		var newVotes = parseInt(votes) + 1;
    		$('#votes[value='+ this.voted+'] span').text(newVotes);

           	$('#vote-button[value='+ this.voted+'] i').remove();



           	this.checkVoted();
		},

		/**
       	Vericfica se o id do elemento que o utilizador votou está no array dos mais
       	votados

        @method votedIsOneOfMostVoted
        @protected
        @return {boolean} booleano que indica se o elemento votado é um dos mais votados
        **/
		votedIsOneOfMostVoted: function(){
			
			 return _.contains(this.modelsId, this.voted);
		},

		/**
        Trata dos comportamentos da página quando há um decremento de um voto

        @method decrementVote
        @protected
        **/
		decrementVote: function(){
			var votes = $('#votes[value='+ this.voted+'] span').text();

        	$('#votes[value='+ this.voted+'] span').empty();
        	var newVotes = parseInt(votes) - 1;
        	$('#votes[value='+ this.voted+'] span').text(newVotes);

        	$('#vote-button[value='+ this.voted+'] i').remove();


        	this.uncheckVoted()
		},

		/**
        Trata dos comportamentos da página quando há um incremento de um voto,
		num ambito de icons que assinalam o elemento em que o utilizador votou.
		Neste caso, adiciona o check ao elemento que possuí o voto do utilizador.

        @method checkVoted
        @protected
        **/
		checkVoted: function(){
			if(this.voted !== -1)
		    {
		    	if(this.isMostVoted)
		    	{
		    		$('#vote-button[value='+ this.voted+'] i').remove();
           			$('#vote-button[value='+ this.voted+'] .ui-btn-text').append('<i class="icon-check-sign"></i>');
		    	}
		    	else
		    		$('#vote-button[value='+ this.voted+'] .ui-btn.ui-btn-up-b.ui-shadow.ui-btn-corner-all.ui-btn-icon-notext').buttonMarkup({ icon: "check" });
		    	
		    }
		},

		/**
        Trata dos comportamentos da página quando há um decremento de um voto,
		num ambito de icons que assinalam o elemento em que o utilizador votou.
		Neste caso, remove o check ao elemento que possuía o voto do utilizador.

        @method uncheckVoted
        @protected
        **/
		uncheckVoted: function(){
			if(this.voted !== -1)
		    {	
		    	if(this.isMostVoted)
		    	{
		    		$('#vote-button[value='+ this.voted+'] i').remove();
        			$('#vote-button[value='+ this.voted+'] .ui-btn-text').append('<i class="icon-plus-sign"></i>');
		    	}
		    	else
		    		$('#vote-button[value='+ this.voted+'] .ui-btn.ui-btn-up-b.ui-shadow.ui-btn-corner-all.ui-btn-icon-notext').buttonMarkup({ icon: "plus" });
		    	
		    }
		},

		/**
        Trata do envio do voto ao servidor e dos incrementos e decrementos de votos

        @method vote
        @protected
        **/
		vote: function(e){

			if(App.account.isLogged())
            {
				if(this.voted !== -1)
		        {
		        	console.log(this.isMostVoted);
		        	this.decrementVote();
		        }

				var that = this;

				var url = App.URL + "votes";

				e.preventDefault();
				//Verfica se o botão clicado pertence a um dos mais votados
				//serve apenas para uma questão mudanças de icons
				this.isMostVoted = $(e.currentTarget).hasClass("most-voted");
	   			var id = parseInt($(e.currentTarget).attr("value"));

	   			var votable_type = this.eventsType;

	   			if(votable_type  === null)
	   				votable_type = "User";

	   			$.ajax({
	                method: "POST",

	                async: false,

	                timeout: 5000,

	                url: url,

	                
	                data: { 
	                	vote: {
		                    "user_id": App.account.getUserId(),
		                    "votable_id": id,
		                    "votable_type": votable_type
		                }
	                },

	                beforeSend: function () {
	                    $.mobile.loading( 'show', {
	                            text: "A enviar",
	                            textVisible: true
	                    });
	                },

	                complete: function () {
	                    //override do ajaxsetup para nao fazer hide do load spinner
	                },

	                success: function () {
	                    $.mobile.loading( 'hide' );
	                   	// options.success();
	                  	that.showErrorOverlay({text:"Voto atribuído"});
	                   	that.voted = id;
	                   	that.incrementVote();
	                },

	                error: function (){
	                    that.showErrorOverlay({text: "Erro no envio"});
	                    //Para tirar o efeito do decrement
	                   	that.incrementVote();
	                }
	            });
			}
	        else
			{
                this.showErrorOverlay({text:App.MSG.REGISTRATION_NEEDED});
            }
	        
		}

	});

});