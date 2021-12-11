import { useEffect, useState } from 'react';
import './App.css';

const buttonStyle = {
    width: '90px',
    maxWidth: '90px',
    backgroundColor: '#181A20',
    fontSize: '12px', 
    color: '#FFF',
    borderRadius: '4px',
    border: '1px solid #181A20',
    display: 'flex',
    padding: '5px 7.5px',
    cursor: 'pointer'
}

const leftStatus = {
    width: '12px', 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexShrink: 0,
}

const statusIconConnected = {
  height: '5px', width: '5px', borderRadius: '50%', marginTop: '1.5px', backgroundColor: 'green'
}

const statusIconDisconnected = {
  height: '5px', width: '5px', borderRadius: '50%', marginTop: '1.5px', backgroundColor: 'red'
}

// Sometimes using Web3 packages like Web3 are just not ideal and you need a simple solution to work with MetaMask. Here are some simple solutions and code snippets you can use
// to get rolling on better understanding how to make simple transactions with MetaMask wallet directly using window.ethereum

function App() {

  const [ walletAccount, setWalletAccount ] = useState('')
  const [ currentChain, setCurrentChain ] = useState('')
  const [ isConnected, setIsConnected ] = useState(false)


  // Initialize the application and MetaMask Event Handlers
  useEffect(() => {
    
    const provider = window.ethereum

    // Setup Listen Handlers on MetaMask change events

    if(typeof provider !== 'undefined') {
        // Add Listener when accounts switch
        provider.on('accountsChanged', (accounts) => {

          console.log('Account changed: ', accounts[0])
          setWalletAccount(accounts[0])

        })
        
        // Do something here when Chain changes
        provider.on('chainChanged', (chaindId) => {

          console.log('Chain ID changed: ', chaindId)
          setCurrentChain(chaindId)

        })

    } else {

        alert('Please install MetaMask to use this service!')

    }
  }, [])

  // Used to see if the wallet is currently connected to the application
  // If an account has been accessed with MetaMask, then the wallet is connected to the application.
  useEffect(() => {
      setIsConnected(walletAccount ? true : false)
  }, [walletAccount])

  // Connect the Wallet to the current selected account in MetaMask. 
  // Will generate a login request for user if no account is currently connected to the application
  const handleConnectWallet = async () => {

      console.log('Connecting MetaMask...')
      const provider = window.ethereum

      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      
      console.log('Account: ', account)
      setWalletAccount(account)
  }

  // Handle Disconnected. Removing the state of the account connected to your app should be enough to handle Disconnect with your application.
  const handleDisconnect = async () => {

      console.log('Disconnecting MetaMask...')
      setIsConnected(false)
      setWalletAccount('')
  }

  // Connect Once and set the account. Can be used to trigger a new account request each time, unlike 'eth_requestAccounts'
  const handleConnectOnce = async () => {

      const provider = window.ethereum

      const accounts = await provider.request({ method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
      }).then(() => provider.request({ method: 'eth_requestAccounts' }))
      
      setWalletAccount(accounts[0])

  }

  // Request the personal signature of the user via MetaMask and deliver a message.
  const handlePersonalSign = async () => {

    console.log('Sign Authentication')

    const message = [
      "This site is requesting your signature to approve login authorization!",
      "I have read and accept the terms and conditions (https://example.org/) of this app.",
      "Please sign me in!"
    ].join("\n\n")

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const sign = await window.ethereum.request({ method: 'personal_sign', params: [message, account] })

  }

  return (
    <div className="App">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }}>

            <div className="connect-button" onClick={isConnected ? handleConnectWallet : handleDisconnect} style={buttonStyle}>
                <div className="left-status" style={leftStatus}>
                    {
                      isConnected ? (

                        <div className="status-icon connected" style={statusIconConnected}></div>

                      ) : (
                        
                        <div className="status-icon disconnected" style={statusIconDisconnected}></div>

                      )
                    }
                </div>

                <div className="right-status" style={{width: '100%'}}>Connect</div>

            </div>
            
          <div className="connected-account">

              Connected Account: { walletAccount && walletAccount}
          
          </div>

        </div>
    </div>
  );
}

export default App;
