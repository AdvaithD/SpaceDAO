pragma solidity ^0.4.15;

import "./token/HumanStandardToken.sol";

contract SpaceDAO {

  event erc20_deposit(uint _amount, address _addr);
  event erc20_withdraw(uint _amount, address _addr);

  uint public amountRaised;
  Token public stcToken;
  mapping(address => uint256) public balanceOf;
  mapping(address => uint256) public numVotes;
  mapping (uint => CommiteeMember) committeeMembers;
  mapping (uint => uint) votesForCommitteeMember;
  uint numberMembers;

  struct CommiteeMember {
    string name;
    string title;
    string avatar;
    string skills;
  }

  function SpaceDAO(address addressOfTokenUsedAsReward) {
    stcToken = Token(addressOfTokenUsedAsReward);
    committeeMembers[0] = CommiteeMember("Dava Newman", "Chief Astronaut", "dava.png", "interplanetery captain");
    committeeMembers[1] = CommiteeMember("Simonetta Di Pippo", "Chief Astronaut", "simona.png", "interplanetery captain");
    committeeMembers[2] = CommiteeMember("Buzz Aldrin", "Chief Astronaut", "buzz.png", "interplanetery captain");
    committeeMembers[3] = CommiteeMember("Elon Musk", "Chief Astronaut", "elon.png", "interplanetery captain");
    committeeMembers[4] = CommiteeMember("Brent Sherwood", "Chief Astronaut", "brent.png", "interplanetery captain");
    committeeMembers[5] = CommiteeMember("Robert Zubrin", "Chief Astronaut", "zubrin.png", "interplanetery captain");
    committeeMembers[6] = CommiteeMember("Charles Bolden", "Chief Astronaut", "charles.png", "interplanetery captain");
    committeeMembers[7] = CommiteeMember("Liu Yang", "Chief Astronaut", "liu.png", "interplanetery captain");
    numberMembers = 10;
  }


  function getName() constant returns (string) {
    return "hello";
  }

  // THIS IS NOT WORKING FOR SOME REASON
  function addCommitteeMember(
    string name,
    string title,
    string avatar,
    string skills
  ) {
    uint memberIndex = numberMembers + 1;
    committeeMembers[memberIndex] = CommiteeMember(name, title, avatar, skills);
    numberMembers += 1;
  }

  function getCommitteeMemberCount() public constant returns(uint) {
    return numberMembers;
  }

  function getCommitteeMember(uint index) public constant returns(string, string, string, string, uint, uint) {
    return (committeeMembers[index].name,
      committeeMembers[index].title,
      committeeMembers[index].avatar,
      committeeMembers[index].skills,
      votesForCommitteeMember[index],
      index
    );
  }

  function voteForCommitteeMember(uint index) public {
    // TODO: Verify that token is there
    // Check Balance on token address for user

    numVotes[msg.sender] += 1;
    votesForCommitteeMember[index] += 1;
  }

  function getUserSTCBalance() public returns(uint256 balance) {
    return stcToken.balanceOf(msg.sender);
  }

  function getUserVoteCount() public constant returns(uint) {
    return numVotes[msg.sender];
  }

  function getVotesForCommitteeMember(uint index) public constant returns(uint) {
    return votesForCommitteeMember[index];
  }

  /**
   * Fallback function
   *
   * The function without name is the default function that is called whenever anyone sends funds to a contract
   */
  function () payable {
      uint amount = msg.value;
      balanceOf[msg.sender] += amount;
      amountRaised += amount;
      stcToken.transfer(msg.sender, amount * 3);
      //FundTransfer(msg.sender, amount, true);
  }
}


//
// dao = SpaceDAO.deployed()
// dao.then(contract => contract.... )
//
