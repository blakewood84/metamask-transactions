import { AiOutlineClose } from 'react-icons/ai'
import { FaEthereum } from 'react-icons/fa'

import { 
    balanceModalStyle,
    modalHeaderStyle
} from '../styles/styles'

const BalanceModal = ({ ethBalance, handleCloseModal }) => {
    return (
        <div className="custom-modal" style={balanceModalStyle}>
            <div className="close-modal-icon" onClick={handleCloseModal} style={{position: 'absolute', right: 15, top: 5}}><
                AiOutlineClose size={25} style={{color: 'blue', cursor: 'pointer'}} />
            </div>
            <div className="header" style={modalHeaderStyle}>
                <div className="eth-icon"><FaEthereum color="#871A85" size="75" /></div>
                <div className="eth-text" style={{fontSize: '56px', color: '#925BB3'}}>{ ethBalance?.eth % 1 != 0 ? ethBalance?.eth.toFixed(4) : ethBalance?.eth}</div> {/* Modulo helps determine if there is a decimal place */}
            </div>
            <div className="row" style={{marginTop: '20px', marginLeft: '20px'}}>
                <div style={{marginleft: '50px'}}>Gwei: { ethBalance?.gwei % 1 != 0 ? ethBalance?.gwei.toFixed(2) : ethBalance?.gwei }</div>
                <div className="col-12">Wei: { ethBalance?.wei }</div>
            </div>
        </div>
    )
}

export default BalanceModal