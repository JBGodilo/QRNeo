package main

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define User structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type User struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	PasswordSalt string `json:"passwordsalt"`
	Role         string `json:"role"`
}

/*
 * The Init method *
 called when the Smart Contract "qrneo-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "qrneo-chaincode"
 The app also specifies the specific smart contract function to call with args
*/

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryUser" {
		return s.queryUser(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordUser" {
		return s.recordUser(APIstub, args)
	} else if function == "queryAllUser" {
		return s.queryAllUser(APIstub)
	} else if function == "updateUserDetails" {
		return s.updateUserDetails(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The queryUser method *
Used to view the records of one particular User
It takes one argument -- the key for the User in question
*/

func (s *SmartContract) queryUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if userAsBytes == nil {
		return shim.Error("Could not locate user")
	}
	return shim.Success(userAsBytes)
}

/*
 * The initLedger method *
Will add test data (10 tuna catches)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	user := []User{
		User{Username: "jgodilo", Password: "password", PasswordSalt: "salt", Role: "Admin"},
		User{Username: "etan", Password: "password", PasswordSalt: "salt", Role: "Admin"},
	}

	i := 0
	for i < len(user) {
		fmt.Println("i is ", i)
		userAsBytes, _ := json.Marshal(user[i])
		APIstub.PutState(strconv.Itoa(i+1), userAsBytes)
		fmt.Println("Added", user[i])
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 * The recordUser method *
Admin can register user.
This method takes in five arguments (attributes to be saved in the ledger).
*/
func (s *SmartContract) recordUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var user = User{Username: args[1], Password: args[2], PasswordSalt: args[3], Role: args[4]}

	userAsBytes, _ := json.Marshal(user)
	err := APIstub.PutState(args[0], userAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record tuna catch: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The queryAllUser method *
allows for assessing all the records added to the ledger(all tuna catches)
This method does not take any arguments. Returns JSON string containing results.
*/
func (s *SmartContract) queryAllUser(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllUser:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The changeUserDetails method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, id and new password.
*/
func (s *SmartContract) updateUserDetails(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	userAsBytes, _ := APIstub.GetState(args[0])
	if userAsBytes == nil {
		return shim.Error("Could not locate tuna")
	}
	user := User{}

	json.Unmarshal(userAsBytes, &user)
	// Normally check that the specified argument is a valid holder of user
	// we are skipping this check for this example
	user.Password = args[1]

	userAsBytes, _ = json.Marshal(user)
	err := APIstub.PutState(args[0], userAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change user password: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * main function *
calls the Start function
The main function starts the chaincode in the container during instantiation.
*/
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
