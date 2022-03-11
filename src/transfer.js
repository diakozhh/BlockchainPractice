appId = "GVFlHN1z02Zx5AqQYUS5Wuikt2IGJsfI3dkxDEJv"
serserURL = "https://obs9gnphkxas.usemoralis.com:2053/server"

Moralis.start({serserURL, appId});

const CONTRACT_ADDRESS = "0x768a53E3cdbdFB7144008639E4063200F701d9a1"

let web3;

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enable();

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);

    const options = {type: "erc1155",
                     receiver: address,
                     contract_address: CONTRACT_ADDRESS,
                     token_id: tokenId,
                     amount: amount}
    let result = await Moralis.transfer(options);
    console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();