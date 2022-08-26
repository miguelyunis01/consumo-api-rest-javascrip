const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const API_URL_FAVORITES_DELETE = (id) =>`https://api.thecatapi.com/v1/favourites/${id}`;

const spanError = document.getElementById('error')


async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM, {
        method:'GET',
        headers: {
            'X-API-KEY': 'live_xMmSPVDGpn3QdKK6QRfghfD0kJ975nYROvG5ocuUN7BOLLfKyrRR1n85MwI5DstA',
        },
    });
    const data = await res.json();
    console.log('Random');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
      } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavoriteMichi(data[0].id);
        btn2.onclick = () => saveFavoriteMichi(data[1].id);
      }
}

async function loadFavoritesMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_xMmSPVDGpn3QdKK6QRfghfD0kJ975nYROvG5ocuUN7BOLLfKyrRR1n85MwI5DstA',
        },
    });
    const data = await res.json();
    console.log('Favorites');
    console.log(data);
   
    if(res.status !== 200){
        spanError.innerHTML = "error: " + res.status + data.message;
    } else{
        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Gatitos favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Quitar gatito de favoritos');
            
            img.src = michi.image.url;
            btn.appendChild(btnText); 
            btn.onclick = () => deleteFavoriteMichi(michi.id)
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);

        })
    }
    
}

async function saveFavoriteMichi(id){
    const res = await fetch(API_URL_FAVORITES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'live_xMmSPVDGpn3QdKK6QRfghfD0kJ975nYROvG5ocuUN7BOLLfKyrRR1n85MwI5DstA',
      },
      body: JSON.stringify({
        image_id: id
      }),
    });
    const data =await res.json();

    console.log('save');
    console.log(res);
    
    if(res.status !== 200){
        spanError.innerHTML = "error: " + res.status + data.message;
    } else {
        console.log('Michi Guardado en favoritos')
        loadFavoritesMichis();
    }
}

async function deleteFavoriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
      method: 'DELETE',
      headers: {
        'X-API-KEY': 'live_xMmSPVDGpn3QdKK6QRfghfD0kJ975nYROvG5ocuUN7BOLLfKyrRR1n85MwI5DstA',
      },
    });
    const data = await res.json();
  
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
      console.log('Michi eliminado de favoritos')
      loadFavoritesMichis();
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            
            'X-API-KEY': 'live_xMmSPVDGpn3QdKK6QRfghfD0kJ975nYROvG5ocuUN7BOLLfKyrRR1n85MwI5DstA',
        },
        body: formData,
    })
    const data = await res.json();

    if ( res.status  !== 201 ){
        spanError.innerText = "Hubo un error: " + res.status + " "  + data.message
    }else{
        console.log("Michi cargado correctamente");
        console.log({data});
        console.log(data.url);
        console.log(loadFavoritesMichis());
        loadFavoritesMichis()
        saveFavoriteMichi(data.id)
    }
}

loadRandomMichis();
loadFavoritesMichis();