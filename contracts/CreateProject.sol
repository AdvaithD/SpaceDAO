/*

3. Create Projects
Space Council creates Projects, and allocates projectBounty per Project.
The sum of all projects projectBounty must not exceed the fundPool/reviewCycle
Projects
    projectPeerReviewSkills [matrix]
    projectEntryFee (how much teams have to pay to submit solution) = 2STC
    projectBounty (how much people are competing for)  [e.g. 20,000 STC]
    proposalStartDate (when it becomes open for solution submissions)
    proposalEndDate (when it becomes closed for solution submissions)
    solutionSubmissionFee [e.g. 0.5ETH]
    Solutions [matrix]

 */

pragma solidity ^0.4.15;
import "./token/HumanStandardToken.sol";

contract CreateProject {

    event erc20_deposit(uint _amount, address _addr);
    event erc20_withdraw(uint _amount, address _addr);


    address public projectCreator;
    uint public solutionSubmissionFee;
    Token public stcToken;

    uint public amountRaised;
    mapping(address => uint256) public projectBounty;
    mapping(address => uint256) public numVotes;

    mapping (uint => Proposal) proposals;
    mapping (uint => uint) votesForProposal;
    uint numberProposals;

    struct Proposal {
        string proposer_id;
        string proposer_name;
        uint proposalStartDate;
        uint proposalEndDate;
        string url;
    }

    /*  at initialization, setup the owner */
    function CreateProject(address addressOfTokenUsedAsReward) public {
        stcToken = Token(addressOfTokenUsedAsReward);
        proposals[0] = Proposal("1234567896969696969", "Jeff Bezos", 20170823, 20171023, "https://www.google.com");
        numberProposals = 1;
    }


    /*function addProposal(uint proposer_id, string proposal_url) public returns (string) {
        require(proposer_id >= 0 && proposer_id <= 15);

        proposals[proposer_id] = msg.sender;

        return proposal_url;
    }

    function getProposals() public returns (address[16]){
        return proposals;
    }*/

    function getProposalsCount() public constant returns(uint) {
        return numberProposals;
    }

    function voteForProposal(uint index) public payable {
      numVotes[msg.sender] += 1;
      votesForProposal[index] += 1;
    }

    function getProposal(uint index) public constant returns(string, uint, uint, string, uint) {
        return (proposals[index].proposer_name,
            proposals[index].proposalStartDate,
            proposals[index].proposalEndDate,
            proposals[index].url,
            votesForProposal[index]
        );
    }

    function getUserVoteCount() public constant returns(uint) {
      return numVotes[msg.sender];
    }

    function getVotesForProposal(uint index) public constant returns(uint) {
      return votesForProposal[index];
    }


    /* Fallback function
    *
    * The function without name is the default function that is called whenever anyone sends funds to a contract
    */
    function () payable {
        uint amount = msg.value;
        projectBounty[msg.sender] += amount;
        amountRaised += amount;
        stcToken.transfer(msg.sender, amount * 3);
        //FundTransfer(msg.sender, amount, true);
    }


}
