import { useEffect, useState } from 'react';
import './App.css';

import BalanceModal from './components/BalanceModal';
import TransactionModal from './components/TransactionModal';

const buttonStyle = {
    backgroundColor: '#181A20',
    fontSize: '14px', 
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
    marginRight: '5px'
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

  th
  const [ currentChain, setCurrentChain ] = useState('')
  const [ showBalanceModal, setShowBalanceModal ] = useState(false)
  const [ showTransactionModal, setShowTransactionModal ] = useState(false)



  const [ isConnected, setIsConnected ] = useState(false)
  
  
  
  
  const [ ethBalance, setEthBalance ] = useState(null)


  // Initialize the application and MetaMask Event Handlers
  useEffect(() => {

    // Setup Listen Handlers on MetaMask change events
    if(typeof window.ethereum !== 'undefined') {
        // Add Listener when accounts switch
        window.ethereum.on('accountsChanged', (accounts) => {

          console.log('Account changed: ', accounts[0])
          setWalletAccount(accounts[0])

        })
        
        // Do something here when Chain changes
        window.ethereum.on('chainChanged', (chaindId) => {

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

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      
      console.log('Account: ', account)
      setWalletAccount(account)
  }

  // Handle Disconnected. Removing the state of the account connected 
  // to your app should be enough to handle Disconnect with your application.
  const handleDisconnect = async () => {

      console.log('Disconnecting MetaMask...')
      setIsConnected(false)
      setWalletAccount('')
  }

  // Connect Once and set the account. 
  // Can be used to trigger a new account request each time, 
  // unlike 'eth_requestAccounts'
  const handleConnectOnce = async () => {

      const accounts = await window.ethereum.request({ method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
      }).then(() => window.ethereum.request({ method: 'eth_requestAccounts' }))
      
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

  // Get the Accounts current Balance and convert to Wei and ETH
  const handleGetBalance = async () => {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const balance  = await window.ethereum.request({ method: 'eth_getBalance' , params: [ account, 'latest' ]})

    // // Returns a hex value of Wei
    const wei = parseInt(balance, 16)
    const gwei = (wei / Math.pow(10, 9)) // parse to Gwei
    const eth = (wei / Math.pow(10, 18))// parse to ETH

    setEthBalance({ wei, gwei, eth })
    setShowBalanceModal(true)

  }
 
  const handleSendTransaction = async (sender, receiver, amount) => {
    const gasPrice = '0x5208' // 21000 Gas Price
    const amountHex = (amount * Math.pow(10,18)).toString(16)
    
    const tx = {
      from: sender,
      to: receiver,
      value: amountHex,
      gas: gasPrice,
    }

    await window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ]})

    setShowTransactionModal(false)
  }

  const handleCloseBalanceModal = () => {
    setShowBalanceModal(false)
  }

  const handleOpenTransactionModal = () => {
    setShowTransactionModal(true)
  }
 
  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false)
  }

  return (
    <div className="App">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }}>

            <div className="row" style={{width: '500px',display: 'flex', justifyContent: 'center', borderRadius: '4px', border: '1px solid #181A20', padding: '10px'}}>
              <div className="header-title" style={{marginBottom: '20px'}}>Connect Your Account by clicking the button below<br /> Clicking again will disconnect</div>
              <div className="connect-button" onClick={!isConnected ? handleConnectWallet : handleDisconnect} style={{...buttonStyle, maxWidth: '130px',}}>

                  <div className="left-status" style={leftStatus}>
                      {
                        isConnected ? (

                          <div className="status-icon connected" style={statusIconConnected}></div>

                        ) : (
                          
                          <div className="status-icon disconnected" style={statusIconDisconnected}></div>

                        )
                      }
                  </div>
                  {
                    isConnected ? ( 

                      
                        <div className="right-status" style={{width: '100%', textOverflow: 'ellipsis', overflow: 'hidden'}}>{walletAccount}</div>
                      
                      ) : (

                        <div className="right-status" style={{width: '100%'}}>Connect</div>

                      )
                  }
              </div>
            </div>

            <div className="row" style={{width: '500px', display: 'flex', justifyContent: 'center', borderRadius: '4px', border: '1px solid #181A20', padding: '10px', marginTop: '20px'}}>
              <div className="header-title" style={{marginBottom: '20px'}}>Disconnect Wallet from Application</div>
              <div className="connect-button" onClick={handleDisconnect} style={{justifyContent: 'center', ...buttonStyle, maxWidth: '130px',}}>
                  Disconnect
              </div>
            </div>

            <div className="row" style={{width: '500px', display: 'flex', justifyContent: 'center', borderRadius: '4px', border: '1px solid #181A20', padding: '10px', marginTop: '20px'}}>
              <div className="header-title" style={{marginBottom: '20px'}}>Reconnect after disconnect. (Connect Once)</div>
              <div className="connect-button" onClick={handleConnectOnce} style={{justifyContent: 'center', ...buttonStyle, maxWidth: '130px',}}>
                  Connect
              </div>
            </div>

            <div className="row" style={{width: '500px', display: 'flex', justifyContent: 'center', borderRadius: '4px', border: '1px solid #181A20', padding: '10px', marginTop: '20px'}}>
              <div className="header-title" style={{marginBottom: '20px'}}>Personal Sign (Signature Request w/Message)</div>
              <button className="connect-button" onClick={handlePersonalSign} style={{...buttonStyle, justifyContent: 'center', maxWidth: '130px', }}>
                  Personal-Sign
              </button>
            </div>

            <div className="row" style={{width: '500px', display: 'flex', justifyContent: 'center', borderRadius: '4px', border: '1px solid #181A20', padding: '10px', marginTop: '20px'}}>
              <div className="header-title" style={{marginBottom: '20px'}}>Send Transaction ETH</div>

              <button className="connect-button" onClick={handleOpenTransactionModal} style={{...buttonStyle, justifyContent: 'center', maxWidth: '130px', }}>
                  Send
              </button>

            </div>

            <div className="row" style={{width: '500px', display: 'flex', justifyContent: 'center', borderRadius: '4px', border: '1px solid #181A20', padding: '10px', marginTop: '20px'}}>
              <div className="header-title" style={{marginBottom: '20px'}}>Get Account Balance</div>

              <button className="connect-button" onClick={handleGetBalance} style={{...buttonStyle, justifyContent: 'center', maxWidth: '130px', }}>
                  Get Balance
              </button>

            </div>

        </div>

        {
          showBalanceModal && (
            <BalanceModal handleCloseModal={handleCloseBalanceModal} ethBalance={ethBalance} />
          )
        }
        {
          showTransactionModal && (
            <TransactionModal handleCloseModal={handleCloseTransactionModal} handleSendTransaction={handleSendTransaction} walletAccount={walletAccount} handleConnectWallet={handleConnectWallet} />
          )
        }
    </div>
  );
}

export default App;


