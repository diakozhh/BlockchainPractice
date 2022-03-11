appId = "GVFlHN1z02Zx5AqQYUS5Wuikt2IGJsfI3dkxDEJv"
serserURL = "https://obs9gnphkxas.usemoralis.com:2053/server"

Moralis.start({serserURL, appId});

const CONTRACT_ADDRESS = "0x768a53E3cdbdFB7144008639E4063200F701d9a1"

let currUser;

function fetchNFTMetaData(NFTs){
    let promises = [];
    for(let i = 0; i <NFTs.length; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch("https://obs9gnphkxas.usemoralis.com:2053/server/function/getNFT?_ApplicationId=GVFlHN1z02Zx5AqQYUS5Wuikt2IGJsfI3dkxDEJv"+id)
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


function drawInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
         let htmlString = `
            <div class="card">
                <img src="${nft.metadata.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nft.metadata.name}</h5>
                    <p class="card-text">Total amount: ${nft.amount}</p>
                    <p class="card-text">Number of owners: ${nft.owners.length}</p>
                    <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                    <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">MINT DAT</a>
                    <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">TRANSFER DAT</a>
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
    let accounts = currUser.get("accounts");
    const options = {chain: "rinkeby", address: accounts[0], token_address: CONTRACT_ADDRESS};
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currElem) => {
            object[currElem.token_id] = currElem.amount;
            return object;
        }, {})
        return result
    });
}

async function initApp(){
    currUser = Moralis.User.current();
    if(!currUser){
        currUser = await Moralis.Web3.authenticate();
    }
    const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"}
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NTFWithMetaData = await fetchNFTMetaData(NFTs.result);
    let ownerData = await getOwnerData();

    drawInventory(NTFWithMetaData, ownerData);
}

initApp();