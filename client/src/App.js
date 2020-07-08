import React, { Component } from "react";
import HealthStatusContract from "./contracts/healthStatus.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

import "./App.css";

class App extends Component {
  state = { loaded: false, buffer: null, ipfsHash:'' };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      console.log(this.accounts[0])

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = HealthStatusContract.networks[this.networkId];
      this.HealthStatus = new this.web3.eth.Contract(
        HealthStatusContract.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      const ipfsHash = await this.HealthStatus.methods.getStatus().call()

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded:true, ipfsHash:ipfsHash});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error){
        console.log(error)
        return
      }
      this.HealthStatus.methods.uploadStatus(result[0].hash).send({from:this.accounts[0]}).then((data) => {
        console.log(data)
        console.log('ipfsHash', this.state.ipfsHash);
        return this.setState({ipfsHash: result[0].hash}); 
      })
      
    })
  }

  inputFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('Buffer', this.state.buffer);
    }
  }
   

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <nav>
          <h1>HealthCare</h1>
          <p>{this.accounts[0]}</p>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1"> 
              <h1>Your Health Status</h1>
              <p>This Status is stored on IPFS Ethereum Blockchain</p>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" style={{height:100, width:100}}/>
              <h2>Upload File</h2>
              <form onSubmit = {this.onSubmit}>
                <input type="file" onChange={this.inputFile}/>
                <input type="submit"/>
              </form>
            </div>

          </div>

        </main>

      </div>
    );
  }
}

export default App;
