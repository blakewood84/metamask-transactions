import { useState, useEffect } from 'react'
import { CgArrowsExchangeAltV } from 'react-icons/cg'
import { FaEthereum } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { Form, Button } from 'react-bootstrap'

const TransactionModal = ({ handleSendTransaction, handleCloseModal, handleConnectWallet, walletAccount }) => {
    const [ form, setForm ] = useState({ sender: '', receiver: '', amount: '' })
    
    const handleFormChange = (event) => {
        
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    // Check if Sender & Receiver is a valid ETH address

    return (
        <div className="custom-modal" style={{position: 'absolute', width: '500px', height: '350px', border: '1px solid #4206F1', borderRadius: '4px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div className="close-modal-icon" onClick={handleCloseModal} style={{position: 'absolute', right: 15, top: 5}}><AiOutlineClose size={25} style={{color: 'blue', cursor: 'pointer'}} /></div>
            
            <Form.Control value={form.sender} onChange={handleFormChange} name="sender" type="text" placeholder="Sender's Address" style={{width: '50%', backgroundColor: '#181A20',  border: '1px solid', borderImageSlice: 1,  borderImageSource: 'linear-gradient(to left, #734ad5, #d53a9d', color: '#fff' }} />
            <div style={{margin: '10px 0px'}}><FaEthereum color="red" size="40" /> <CgArrowsExchangeAltV color="red" size="40" /> </div>
            <Form.Control onChange={handleFormChange} name="receiver" type="text" placeholder="Receiving Address" style={{width: '50%', backgroundColor: '#181A20',  border: '1px solid', borderImageSlice: 1,  borderImageSource: 'linear-gradient(to left, #734ad5, #d53a9d', color: '#fff' }} />
            <Form.Control onChange={handleFormChange} name="amount" type="text" placeholder="Amount in ETH" style={{marginTop: '10px', width: '50%', backgroundColor: '#181A20',  border: '1px solid', borderImageSlice: 1,  borderImageSource: 'linear-gradient(to left, #734ad5, #d53a9d', color: '#fff' }} />
            <div value={form.receiver} style={{marginTop: '40px', width: '100%', padding: '0px 20px'}}><Button onClick={() => handleSendTransaction(form.sender, form.receiver, form.amount)} size="sm" style={{width: '100px'}}>Send</Button></div>
        </div>
    )
}

export default TransactionModal