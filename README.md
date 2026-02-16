# 🏥 Blockchain Patient Health Timeline (v2.0)
**A Decentralized, Immutable, and Patient-Centric Medical Record System.**

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://health-timeline-two.vercel.app)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-blue)](https://sepolia.etherscan.io/)
[![IPFS](https://img.shields.io/badge/Storage-IPFS/Pinata-orange)](https://www.pinata.cloud/)

## 🌟 Vision
Traditional healthcare data is "siloed" in centralized hospital databases. When a patient moves, their history is lost. This project creates a **Unified Health Ledger** where medical records follow the patient’s wallet address, ensuring data integrity and global accessibility.

---

## 🚀 Key Features
- **Dual-Role Dashboard:** Seamlessly switch between **Patient View** and **Doctor Dashboard**.
- **Immutable Timeline:** Records are secured on the **Ethereum Sepolia Blockchain**; they cannot be edited or deleted once signed.
- **Decentralized Storage:** High-resolution medical files are stored on **IPFS**, ensuring no single-point-of-failure.
- **Doctor Search:** Healthcare providers can search for a patient by their wallet ID to retrieve a verified medical history.
- **Real-Time Transactions:** Integration with **MetaMask** for secure, cryptographic transaction signing.

---

## 🏗️ Technical Architecture
1. **Frontend:** React.js (Hooks, Axios, Ethers.js)
2. **Smart Contract:** Solidity (Mapping, Structs, Event Ledger)
3. **Blockchain:** Ethereum Sepolia Testnet
4. **File Storage:** IPFS (via Pinata API)
5. **Deployment:** Vercel (CI/CD)

---

## 🛠️ How It Works
1. **Upload:** A Doctor uploads a medical file and enters a diagnosis.
2. **Hashing:** The file is sent to **IPFS**, which returns a unique **CID (Content Identifier)**.
3. **Mining:** The React app triggers a MetaMask transaction. The **CID + Diagnosis** are saved to the patient's address on the blockchain.
4. **Retrieval:** The Patient (or an authorized Doctor) connects their wallet. The app fetches the array of records from the blockchain and displays them in a chronological timeline.

---

## 📋 Smart Contract Details
- **Network:** Sepolia Testnet
- **Contract Address:** `0x760f33B4f0eA6109ed706a2449902E43C2a639a0`
- **Audit Trail:** Every entry is timestamped and cryptographically linked to the doctor's wallet.

---

## 💻 Local Setup
1. Clone the repo: `git clone https://github.com/DHARSHINIVELLINGIRI/health-blockchain-timeline.git`
2. Install dependencies: `npm install`
3. Add your Pinata Keys in `App.js`.
4. Run the app: `npm start`

---

## 📄 License
This project is for educational purposes as part of a Blockchain Development Portfolio.


