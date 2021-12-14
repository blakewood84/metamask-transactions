import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { Form, Button } from 'react-bootstrap'
import Web3 from 'web3';

const inputStyle = {
    width: '50%', 
    backgroundColor: '#181A20',  
    border: '1px solid', 
    borderImageSlice: 1,  
    borderImageSource: 'linear-gradient(to left, #734ad5, #d53a9d', 
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const modalStyle = {
    position: 'absolute', 
    width: '500px', 
    height: '350px', 
    border: '1px solid #4206F1', 
    borderRadius: '4px', 
    top: '50%', left: '50%', 
    transform: 'translate(-50%, -50%)', 
    backgroundColor: 'black', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column'
}

const TransactionModal = ({ handleSendTransaction, handleCloseModal }) => {

    const [ form, setForm ] = useState({ sender: '', receiver: '', amount: '' })
    const [ selectedWallet, setSelectedWallet ] = useState('')
    const [ sendError, setSendError ] = useState(false)
    const [ receiveError, setReceiveError ] = useState(false)
    const [ amountError, setAmountError ] = useState(false)

    useEffect(() => {
        getAccount()
    }, [])

    // Check to make sure the Sender is selected in MetaMask wallet
    // Will cause error if not
    useEffect(() => {

    }, [form])

    const getAccount = async () => {
        
        window.ethereum.on('accountsChanged', (accounts) => {
            setSelectedWallet(accounts[0])
        })

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setForm({
            ...form,
            sender: accounts[0],
        })
    }
    
    const handleFormChange = (event) => {
        console.log(form)
        
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const sendTransaction = async () => {

        // Check to see if the input addresses are valid ethereum addresses
        const checkSender = Web3.utils.isAddress(form.sender)
        const checkReceiver = Web3.utils.isAddress(form.receiver)

        if(!checkSender) setSendError(true)
        if(!checkReceiver) setReceiveError(true)

        if(selectedWallet !== form.sender) {
            alert('Please select the sender account in your MetaMask wallet!');
        }

        if(checkSender && checkReceiver && selectedWallet === form.sender) {
            setSendError(false)
            setReceiveError(false)
            handleSendTransaction(form.sender, form.receiver, form.amount)

        }
    }

    // Check if Sender & Receiver is a valid ETH address

    return (
        <div className="custom-modal" style={modalStyle}>
            <div className="close-modal-icon" onClick={handleCloseModal} style={{position: 'absolute', right: 15, top: 5}}>
                <AiOutlineClose size={25} style={{color: 'blue', cursor: 'pointer'}} />
            </div>
            <Form.Control 
                isInvalid={sendError ? true : false} 
                value={form.sender} 
                onChange={handleFormChange} 
                name="sender" type="text" 
                placeholder="Sender's Address" 
                style={{ ...inputStyle, margin: '10px 0px' }} 
            />
            <Form.Control 
                isInvalid={receiveError ? true : false} 
                value={form.receiver}
                onChange={handleFormChange} 
                name="receiver" type="text" 
                placeholder="Receiving Address" 
                style={inputStyle} 
            />
            <Form.Control 
                value={form.amount}
                onChange={handleFormChange}
                name="amount" type="text" 
                placeholder="Amount in ETH" 
                style={{...inputStyle, margin: '10px 0px'}} 
            />
            <div style={{marginTop: '40px', width: '100%', padding: '0px 20px'}}>
                <Button onClick={sendTransaction} size="sm" style={{width: '100px'}}>Send</Button>
            </div>
        </div>
    )
}

export default TransactionModal