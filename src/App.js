import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap'
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

function App() {

  const [ walletAccount, setWalletAccount ] = useState('')
  const [ isConnected, setIsConnected ] = useState(false)

  useEffect(() => {
    
    const provider = window.ethereum

    if(typeof provider !== 'undefined') {
        // Add Listener when accounts switch
        provider.on('accountsChanged', (accounts) => {

          console.log('Account changed: ', accounts[0])
          setWalletAccount(accounts[0])

        })
        
        // Do something here when Chain changes
        provider.on('chainChanged', (chaindId) => {
          console.log('Chain ID changed: ', chaindId)
          if(chaindId !== '0x1') { //0x1 is Mainnet
            // alert('Chain Not Supported')
          }
        })

    } else {
        alert('Please install MetaMask to use this service!')
    }
  }, [])

  useEffect(() => {
      setIsConnected(walletAccount ? true : false)
  }, [walletAccount])

  const handleConnectWallet = async () => {

      console.log('Connecting MetaMask...')
      const provider = window.ethereum

      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      
      console.log('Account: ', account)
      setWalletAccount(account)
  }

  const handleDisconnect = async () => {
      console.log('Disconnecting MetaMask...')
      setIsConnected(false)
      setWalletAccount('')
  }

  const handleConnectOnce = async () => {

      const provider = window.ethereum

      const accounts = await provider.request({ method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
      }).then(() => provider.request({ method: 'eth_requestAccounts' }))
      
      setWalletAccount(accounts[0])

  }

  const handleTransaction = async () => {

    console.log('Sign Authentication')

    const message = [
      "I have read and accept the terms and conditions (https://example.org/tos) of this app.",
      "Please sign me in!"
    ].join("\n\n")

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    const sign = await window.ethereum.request({ method: 'personal_sign', params: [message, account] })

  }

  return (
    <div className="App">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }}>

            <div className="connect-button" onClick={handleTransaction} style={buttonStyle}>
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
