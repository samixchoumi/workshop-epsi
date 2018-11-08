var Reservation = artifacts.require("./Reservation.sol");

contract("Reservation", function(accounts) {
  var reservationInstance;

  it("initializes with two candidates", function() {
    return Reservation.deployed().then(function(instance) {
      return instance.clientsCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Reservation.deployed().then(function(instance) {
        reservationInstance = instance;
      return reservationInstance.clients(1);
    }).then(function(client) {
      assert.equal(client[0], 1, "id correct");
      assert.equal(client[1], "Clemster", "nom correct");
      return reservationInstance.clients(2);
    }).then(function(client) {
      assert.equal(client[0], 2, "id correct");
      assert.equal(client[1], "Samix", "nom correct");
    });
  });
});