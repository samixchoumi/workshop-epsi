App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Reservation.json", function(reservation) {
      App.contracts.Reservation = TruffleContract(reservation);
      App.contracts.Reservation.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },
  render: function() {
    var reservationInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Reservation.deployed().then(function(instance) {
      reservationInstance = instance;
      return reservationInstance.clientsCount();
    }).then(function(clientsCount) {
      var clientsResults = $("#clientsResults");
      clientsResults.empty();

      var problemsSelect = $('#problemsSelect');
      problemsSelect.empty();

      var tabIncidents = ['Retard', 'Annulation', 'Autres'];
      console.log(tabIncidents);
      tabIncidents.forEach(function(option){
        problemsSelect.append("<option value='" + option + "' >" + option + "</ option>");
      });

      for (var i = 1; i <= clientsCount; i++) {
        reservationInstance.clients(i).then(function(client) {
          var id = client[0];
          var name = client[1];
          var typeErreur = client[2];
          var numTrajet = client[3];
          
          var clientTemplate = "<tr><th>" + name + "</th><td>" + id + "</td><td>" + typeErreur + "</td><td>" + numTrajet + "</td></tr>";
          clientsResults.append(clientTemplate);
        });
      }
    }).then(function() {
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  castProblem: function() {
    var clientName = $('#clientsSelect').val();
    var typeErreur = $('#problemsSelect').val();
    var numTrajet  = $('#numTrajetSelect').val();
    console.log(clientName);
    console.log(typeErreur);
    App.contracts.Reservation.deployed().then(function(instance) {
      return instance.ajoutProblem(clientName, typeErreur, numTrajet);
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }, 
  listenForEvents: function() {
    App.contracts.Reservation.deployed().then(function(instance) {
      instance.ajoutProblemEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});