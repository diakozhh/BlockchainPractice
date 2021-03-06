appId = "NASlOQlZPZZF0xxr3qEn91W0VqLZPruVPX3yLpPx"
serverUrl = "https://z92nmlsaqipc.usemoralis.com:2053/server"
Moralis.start({serverUrl, appId});
const CONTRACT_ADDRESS = "0xc97e4094f2a4ceb6c80580b620bdb2b84607bd53"

let web3;

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enable();
    let accounts = await web3.eth.getAccounts();
    console.log(accounts)

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = accounts[0];
}

async function mint() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);

    console.log(tokenId)
    console.log(address)
    console.log(amount)

    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    console.log(accounts[0])
    console.log(contract)

    contract.methods.mint(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt) {
        alert("Mint done!")
    })
}

document.getElementById("submit_mint").onclick = mint;

init();