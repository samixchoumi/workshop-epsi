// solium-disable linebreak-style
pragma solidity ^0.4.24;

contract Reservation {

    struct Client {
        uint id;
        string nom;
        string typeErreur;
        string numTrajet;
    }

    mapping(uint => Client) public clients;

    uint public clientsCount;

    function addClient (string _clientName, string _typeErreur, string _numTrajet) private {
        clientsCount ++;
        clients[clientsCount] = Client(clientsCount, _clientName, _typeErreur, _numTrajet);
    }

    function ajoutProblem (string _clientName, string _typeErreur, string _numTrajet) public {
        clientsCount ++;
        clients[clientsCount] = Client(clientsCount, _clientName, _typeErreur, _numTrajet);
        emit ajoutProblemEvent(clientsCount);
    }

    // Constructor
    constructor() public {
        addClient("0x436c656d73746572", "Retard", "0BER4KIO");
        addClient("0x53616d6978", "Annulation", "TUVWX492");
        addClient("0x43c3a964726963", "Autre", "IK67A1RJ");
    }

    event ajoutProblemEvent (
        uint indexed _clientId
    );
}