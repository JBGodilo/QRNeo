# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

starttime=$(data +%s)

if [ ! -d ~/.hfc-key-store/ ]; then
	mkdir ~/.hfc-key-store/
fi

# launch network; create channel and join peer to channel
cd ../qrneo-network
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 tuna catches
docker-compose -f ./docker-compose.yml up -d cli

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.qrneo-network.com/users/Admin@org1.qrneo-network.com/msp" cli peer chaincode install -n qrneo-app -v 1.0 -p github.com/qrneo-app
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.qrneo-network.com/users/Admin@org1.qrneo-network.com/msp" cli peer chaincode instantiate -o orderer.qrneo-network.com:7050 -C mychannel -n qrneo-app -v 1.0 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
sleep 10
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.qrneo-network.com/users/Admin@org1.qrneo-network.com/msp" cli peer chaincode invoke -o orderer.qrneo-network.com:7050 -C mychannel -n qrneo-app -c '{"function":"initLedger","Args":[""]}'

printf "\nTotal execution time : $(($(date +%s) - starttime)) secs ...\n\n"
printf "\nStart with the registerAdmin.js, then registerUser.js, then server.js\n\n"