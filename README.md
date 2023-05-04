# P2P-alert 
[![Netlify Status](https://api.netlify.com/api/v1/badges/a1f36bf3-9d9d-46e7-834b-06ebb326fad1/deploy-status)](https://app.netlify.com/sites/p2p-alert/deploys)

P2P-alert is a command-line tool that sends alerts to a specified WhatsApp number using the Twilio API. It can be used to send alerts in a P2P network whenever a peer disconnects from the network.

## Requirements

- Node.js
- Twilio account
- WhatsApp account

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/p2p-alert.git
```
2. Install dependencies:

```
cd p2p-alert
npm install
```


3. Create a .env file in the root directory of the project with the following environment variables:

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
YOUR_PHONE_NUMBER=your_whatsapp_phone_number


4. Run the tool:

```
npm start
```

## Usage

When running the tool, it will listen for P2P network events and send a WhatsApp message to the specified number whenever a peer disconnects from the network.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
