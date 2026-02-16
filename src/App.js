import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { contractABI } from './contractInfo';
import './App.css';

const MY_CONTRACT_ADDRESS = "0x760f33B4f0eA6109ed706a2449902E43C2a639a0";

function App() {
  const [account, setAccount] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetPatient, setTargetPatient] = useState("");

  const PINATA_API_KEY = "27736c8c2a218d177172";
  const PINATA_SECRET_KEY = "acaf2785eb2221a32c2e83e8bd5fbb0163806d2c14d29904a7288476ae38c66d";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setTargetPatient(accounts[0]); 
      } catch (error) { console.error(error); }
    } else { alert("Please install MetaMask!"); }
  };

  const fetchRecords = async (addressToFetch) => {
    // 1. If the address is too short or wrong, STOP and clear the screen
    if (!addressToFetch || addressToFetch.length < 42) {
      setRecords([]); 
      return;
    }

    try {
      setLoading(true);
      setRecords([]); // <--- THIS line clears the previous patient's data IMMEDIATELY
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(MY_CONTRACT_ADDRESS, contractABI, provider);
      
      const data = await contract.getRecords(addressToFetch);
      
      // We set the records. If data is empty [], the UI will show "No Records"
      setRecords(data);
    } catch (error) {
      console.error("Search failed:", error);
      setRecords([]); // Clear screen on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
          "Content-Type": "multipart/form-data"
        }
      });
      
      const realIpfsHash = res.data.IpfsHash;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MY_CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.addRecord(targetPatient, realIpfsHash, diagnosis);
      await tx.wait();
      
      alert("Success! Record secured on Blockchain.");
      fetchRecords(targetPatient);
    } catch (error) {
      console.error(error);
      alert("Error: Check your connection or keys!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (account && targetPatient) { fetchRecords(targetPatient); }
  }, [account, targetPatient]);

  return (
    <div className="app-container">
      {/* 1. PREMIUM HEADER */}
      <div className="header-section">
        <h1>🏥 Patient Health Timeline</h1>
        <p>Decentralized & Immutable Medical Records</p>
        {!account ? (
          <button onClick={connectWallet} className="primary-btn" style={{width: 'auto', background: 'white', color: '#0070f3'}}>Connect Wallet</button>
        ) : (
          <div className="wallet-badge">✓ Connected: {account.substring(0,10)}...</div>
        )}
      </div>
    
      {account && (
        <>
          {/* 2. DOCTOR DASHBOARD CARD */}
          <div className="card doctor-card">
            <h3>👨‍⚕️ Doctor Dashboard</h3>
            <p>Enter Patient Wallet Address to manage history:</p>
            <input 
              type="text" 
              placeholder="Patient Address 0x..." 
              value={targetPatient}
              onChange={(e) => setTargetPatient(e.target.value)}
              className="search-input"
            />
            <button onClick={() => fetchRecords(targetPatient)} className="search-btn">
              🔍 View Patient History
            </button>
          </div>

          {/* 3. UPLOAD CARD WITH SPINNER */}
          <div className="card patient-card">
            <h3>➕ Add Medical Entry</h3>
            <p style={{fontSize: '0.8em', color: '#666'}}>Target: <b>{targetPatient === account ? "Self" : "Patient Account"}</b></p>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Diagnosis (e.g. Chronic Fever)" onChange={(e) => setDiagnosis(e.target.value)} required />
              
              <div className="file-input-wrapper">
                <input type="file" id="file-upload" style={{display: 'none'}} onChange={(e) => setFile(e.target.files[0])} required />
                <label htmlFor="file-upload" style={{cursor: 'pointer'}}>
                  <span style={{fontSize: '2em'}}>📄</span><br/>
                  {file ? <b>{file.name}</b> : "Click to select Medical Doc"}
                </label>
              </div>

              <button type="submit" disabled={loading} className="primary-btn btn-blue">
                {loading ? (
                  <><div className="spinner"></div> Processing...</>
                ) : (
                  "🔒 Save to Blockchain"
                )}
              </button>
            </form>
          </div>

          {/* 4. TIMELINE SECTION */}
          <div className="timeline-section" style={{marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px'}}>
  
  {/* Header showing whose folder we are in */}
  <h2 style={{color: '#2c3e50'}}>
    📋 Results for: <span style={{fontSize: '0.6em', color: '#0070f3'}}>{targetPatient}</span>
  </h2>

  {/* 1. Show Spinner while searching */}
  {loading && (
    <div style={{textAlign: 'center', padding: '40px'}}>
      <div className="spinner" style={{borderTopColor: '#0070f3', width: '40px', height: '40px'}}></div>
      <p>Accessing Blockchain Ledger...</p>
    </div>
  )}

  {/* 2. Show "Empty" message ONLY if we finished loading and found nothing */}
  {!loading && records.length === 0 && (
    <div style={{textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '15px', border: '1px dashed #ccc'}}>
       <p style={{fontSize: '3em', margin: '0'}}>📭</p>
       <p><b>No Medical History Found.</b></p>
       <p style={{color: '#666', fontSize: '0.9em'}}>This address has no records stored on the Sepolia network.</p>
    </div>
  )}

  {/* 3. Show Records only if they exist */}
  {!loading && [...records].reverse().map((rec, index) => (
    <div key={index} className="timeline-record" style={{animation: 'fadeIn 0.5s ease'}}>
      <div>
        <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
        <p className="date-stamp">📅 {new Date(Number(rec.timestamp) * 1000).toLocaleString()}</p>
      </div>
      <a href={`https://gateway.pinata.cloud/ipfs/${rec.ipfsHash}`} target="_blank" rel="noreferrer" className="view-btn">
        View File
      </a>
    </div>
  ))}
</div>
        </>
      )}
    </div>
  );
}

export default App;