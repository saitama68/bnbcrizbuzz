
pragma experimental ABIEncoderV2;
pragma solidity ^0.5.17;


import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.5/ChainlinkClient.sol";

contract Game is ChainlinkClient{

struct bet{
    uint256 betamount;
    address  payable starter;
    address  payable player;
    string choice;
    bool locked;
}


mapping(bytes32=>bet[]) public bets;
mapping(address=>uint256) public player1;
mapping(address=>uint256)  public player2;
mapping(uint256=>bool)  public closed;
address public oracle;
bytes32 public jobid;
uint256 public feesamount;
string public winner;
uint256 public fee;
uint256 public globalbetid;
string public result;
string public globalmatchid;

constructor() public{
    oracle=;
    jobid="";
    fee = 1 * 10 ** 18; 
}


// function  getbets(string memory matchid) public returns(bet[] memory){
//     return bets[matchid];
// }

function gk(string memory data) public returns(bytes32){
    return keccak256(abi.encodePacked((data)));
}


function placenewbet(string memory playerchoice,string memory matchid) public payable {
    bet memory newbet;
    newbet.betamount=msg.value;
    newbet.starter=msg.sender;
    newbet.choice=playerchoice;
    newbet.locked=false;
    bytes32 mkid=gk(matchid);
    bets[mkid].push(newbet);
    player1[msg.sender]=bets[mkid].length-1;

}


function getbetid(string memory matchid) public returns (string memory,uint256,uint256){
    uint256 betid=player1[msg.sender];
    uint256 betid2=player2[msg.sender];
    if (betid!=betid2){
        if (betid2>betid){
            betid=betid2;
        }
    }
    bytes32 mkid=gk(matchid);
    
    return (matchid,betid,bets[mkid][betid].betamount);
    
}







function joinbet(string memory matchid, uint256 _betid) public payable{
    bytes32 mkid=gk(matchid);
    require(closed[_betid]!=true,"4");
    require(bets[mkid][_betid].locked==false,"5");
    require(bets[mkid][_betid].betamount==msg.value,"6");
    bets[mkid][_betid].locked=true;
    bets[mkid][_betid].player=msg.sender;
    uint256 value=bets[mkid][_betid].betamount;
    bets[mkid][_betid].betamount+=value;
    player2[msg.sender]=_betid;

}

 function concat(string memory a ) public  view returns (string memory) {
        
        return string(abi.encodePacked("https://bsc-bet.herokuapp.com/winnerById/",a));
    }

function winorlose(string memory matchid,uint256 betid) public returns (bytes32 _requestId) {
    bytes32 mkid=gk(matchid);
    require(bets[mkid].length-1>=betid,"1");
    require(closed[betid]!=true,"2");
    require(msg.sender==bets[mkid][betid].starter || msg.sender==bets[mkid][betid].player,"3");
    globalbetid=betid;
    globalmatchid=matchid;
    
    Chainlink.Request memory request = buildChainlinkRequest(jobid, address(this), this.fulfill.selector);
    string memory apiendpoint=concat(matchid);
    request.add("get",apiendpoint);
    request.add("path","");
    return sendChainlinkRequestTo(oracle, request, fee);
    
}
 
function bytes32ToString(bytes32 x) public returns (string memory) {
    bytes memory bytesString = new bytes(60);
    uint charCount = 0;
    for (uint j = 0; j < 34; j++) {
        byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[charCount] = char;
            charCount++;
        }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (uint256 j = 0; j < charCount; j++) {
        bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
}

//     function _toLower(string memory str) internal returns (string memory) {
// 		bytes memory bStr = bytes(str);
// 		bytes memory bLower = new bytes(bStr.length);
// 		for (uint i = 0; i < bStr.length; i++) {
// 			// Uppercase character...
// 			if ((bStr[i] >= 65) && (bStr[i] <= 90)) {
// 				// So we add 32 to make it lowercase
// 				bLower[i] = bytes1(int(bStr[i]) + 32);
// 			} else {
// 				bLower[i] = bStr[i];
// 			}
// 		}
// 		return string(bLower);
// 	}
    

    
function compareStrings(string memory a, string memory b) public view returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
}

// function fulfill(bytes32 _requestId, bytes32 _volume) public recordChainlinkFulfillment(_requestId){
// //   result=_toLower(bytes32ToString(_volume));
// //     bool compare =compareStrings(result,bets[globalmatchid][globalbetid].choice);
// //     if(compare){
// //         address(this).transfer(bets[globalmatchid][globalbetid].starter,bets[globalmatchid][globalbetid].betamount);
// //     }
// //     else{
// //         address(this).transfer(bets[globalmatchid][globalbetid].player,bets[globalmatchid][globalbetid].betamount);
// //     }
// //     bets[globalmatchid][globalbetid].betamount=0;
// //     closed[globalbetid]=true;
// }
    
function fulfill(bytes32 _requestId, bytes32 _volume) public recordChainlinkFulfillment(_requestId)
    {
     result=(bytes32ToString(_volume));
     bytes32 mkid=gk(globalmatchid);
        bool compare =compareStrings(result,bets[mkid][globalbetid].choice);
    if(compare){
        bets[mkid][globalbetid].starter.send(bets[mkid][globalbetid].betamount);
    }
    else{
        bets[mkid][globalbetid].player.send(bets[mkid][globalbetid].betamount);
    }
    bets[mkid][globalbetid].betamount=0;
    closed[globalbetid]=true;
        
    }
}

