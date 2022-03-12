appId = "NASlOQlZPZZF0xxr3qEn91W0VqLZPruVPX3yLpPx";
serverUrl = "https://z92nmlsaqipc.usemoralis.com:2053/server";
Moralis.start({serverUrl, appId});
const CONTRACT_ADDRESS = "0xc97e4094f2a4ceb6c80580b620bdb2b84607bd53"

let currentUser;

function fetchNFTMetaData(NFTs){
    let promises = [];
    for(let i = 0; i <NFTs.length; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch("https://z92nmlsaqipc.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=NASlOQlZPZZF0xxr3qEn91W0VqLZPruVPX3yLpPx&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = {address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby"};
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then((res) => {
            nft.owners  = [];
            res.result.forEach(element => {
                nft.owners.push(element.ownerOf);
            })
            return nft;
        }))
    }
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
         let htmlString = `
            <div class="card">
                <div class="card-body">
                    <img src="${nft.metadata.image}" class="card-img-top" alt="...">
                    <h5 class="card-title">${nft.metadata.name}</h5>
                    <p class="card-text">${nft.metadata.description}</p>
                    <p class="card-text">Total amount: ${nft.amount}</p>
                    <p class="card-text">Number of owners: ${nft.owners.length}</p>
                    <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                    <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">mint</a>
                    <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">transfer</a>
                </div>
            </div>
         `

         let col = document.createElement("div");
         col.className = "col col-md-3"
         col.innerHTML = htmlString;
         parent.appendChild(col);
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = {chain: "rinkeby", address: accounts[0], token_address: CONTRACT_ADDRESS};
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currentElem) => {
            object[currentElem.token_id] = currentElem.amount;
            return object;
        }, {})
        return result
    });
}

async function initApp() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }
    const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"}
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    console.log(NFTs);

    let NTFWithMetaData = await fetchNFTMetaData(NFTs.result);
    let ownerData = await getOwnerData();

    renderInventory(NTFWithMetaData, ownerData);
}

initApp();