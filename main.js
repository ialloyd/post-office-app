let arr = [];

window.addEventListener('load', () => {
    try {
        getUserGeoLocInfo();
    } catch (error) {
        alert('An error occurred:', error);
    }
});

async function getUserGeoLocInfo() {
    try {
        const ipAddress = localStorage.getItem('ip')
        const response = await fetch(`https://ipinfo.io/${ipAddress}?token=97c37d1c6c5920`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            console.log(data);
            displayUserGeoLocInfo(data)
        }
    } catch (error) {
        alert('An error occurred:', error);
    }

}

function displayUserGeoLocInfo(data) {

    const ipAddress = document.getElementsByTagName('h3')[0];
    ipAddress.textContent += localStorage.getItem('ip');

    const top = document.getElementsByClassName('top')[0];


    top.innerHTML += `<div>
                <p>Lat : ${data.loc.split(',')[0]}</p>
                <p>Long : ${data.loc.split(',')[1]}</p>
             </div>
             <div>
                 <p>City : ${data.city} </p>
                 <p>Region : ${data.region}</p>
            </div>
             <div>
                 <p>Organisation : ${data.org}</p>
                 <p>Hostname : ${location.hostname}</p>
            </div>`

    const map = document.getElementsByClassName('map')[0];

    map.innerHTML += `<iframe src="https://maps.google.com/maps?q=${data.loc.split(',')[0]},${data.loc.split(',')[1]}&z=15&output=embed" width="100%" height="300" frameborder="0" style="border:0"></iframe>`
    displayMoreInfo(data)

}

function displayMoreInfo(data) {

    const moreInfo = document.getElementsByClassName('more-info')[0];
    const userDateTime = new Date().toLocaleString("en-US", { timeZone: data.timezone });

    moreInfo.innerHTML += ` <p>Time Zone : ${data.timezone} </p>
    <p>Date And Time : ${userDateTime}</p>
    <p>Pincode : ${data.postal}</p>
    <p>Message : Number of pincode(s) found : </p>`
    getPostOffices(data.postal)

}

async function getPostOffices(pincode) {

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            const moreInfo = document.getElementsByClassName('more-info')[0].lastChild;
            moreInfo.innerHTML += data[0].PostOffice.length;
            arr = data[0].PostOffice;
            displayPostOffices(arr);
        }
    } catch (error) {
        alert('An error occurred:', error);
    }

}

function displayPostOffices(arr) {

    const postOffices = document.getElementsByClassName('post-offices')[0];
    postOffices.innerHTML = '';

    arr.forEach(element => {

        const container = document.createElement('div');

        container.innerHTML += `<p>Name : ${element.Name}</p>
        <p>Branch Type : ${element.BranchType}</p>
        <p>Delivery Status : ${element.DeliveryStatus}</p>
        <p>District : ${element.District}</p>
        <p>Division : ${element.Division}</p>`

        postOffices.appendChild(container);

    });

}

const input = document.querySelector('input');

input.addEventListener('keyup', function () {

    const searchValue = input.value.toLowerCase();

    const filteredPostOffices = arr.filter(po =>
        po.Name.toLowerCase().includes(searchValue) || po.BranchType.toLowerCase().includes(searchValue)
    );

    displayPostOffices(filteredPostOffices);

});