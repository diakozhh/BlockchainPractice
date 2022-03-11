appId = "GVFlHN1z02Zx5AqQYUS5Wuikt2IGJsfI3dkxDEJv"
serserURL = "https://obs9gnphkxas.usemoralis.com:2053/server"

Moralis.start({serserURL, appId});

const CONTRACT_ADDRESS = "0x768a53E3cdbdFB7144008639E4063200F701d9a1"

let web3;

async function init() {
    let currUser = Moralis.User.current();
    if (!currUser) {
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
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    console.log(accounts[0])
    contract.methods.mint(address, tokenId, amount).send({from: accounts[0], value: 0})
    .on("receipt", function(receipt) {
        alert("Mint done!")
    })
}

document.getElementById("submit_mint").onclick = mint;

init();