import { API_ROUTES } from './constants.js';
//////////////gardian, if it's logged in, show the modify fonction, otherwise hide the button

if(sessionStorage.getItem('token') === "none"  || sessionStorage.getItem('token') === null ){
	document.querySelector("#btnModal").style.display="none";
	document.querySelector("#logout").style.display="none";
	document.querySelector("#login").style.display="block";
    document.querySelector(".mode").classList.add("hidden");
    document.querySelector(".categories").style.display = "block";
    document.querySelector("#change_statue").style.display = "none";
    document.querySelector("#change_intro").style.display = "none";
}else{
    document.querySelector("#btnModal").style.display="block";
	document.querySelector("#logout").style.display="block";
	document.querySelector("#login").style.display="none";
    document.querySelector(".mode").classList.remove("hidden");
    document.querySelector(".categories").style.display = "none";
    document.querySelector("#change_statue").style.display = "block";
    document.querySelector("#change_intro").style.display = "block";

}
const linkLogin=document.querySelector("#login");
linkLogin.addEventListener("click", function () {
	window.location.replace("login.html");
});
const linkLogout=document.querySelector("#logout");
linkLogout.addEventListener("click", function () {
	sessionStorage.setItem("token", "none");
	location.reload();
});

/////////////////////////////////////////////////////////////Récupération tous les works 

//var reponse = await fetch('http://localhost:5678/api/works/');
var reponse = await fetch(`${API_ROUTES.WORKS}`);
var allWorks = await reponse.json();


//////////////////////////////////////////////////generate the elements to show all the works
function generateGallery(works) {

	// Récupération de l'élément du DOM qui accueillera les photos
	const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        // Création d’une balise dédiée à un work
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = works[i].id;
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title ?? "(No Title)";
		imageElement.setAttribute("crossorigin","anonymous");
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = work.title ?? "(No Figcaption)";

        // On rattache la balise figure au div
        divGallery.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
	}
}

generateGallery(allWorks);
////////////////////////////////////////////////////////button publier les changements
const btnUpdate = document.querySelector("#btn_update");
btnUpdate.addEventListener("click", async function(e){
    var reponse = await fetch(`${API_ROUTES.WORKS}`);
    //var reponse = await fetch('http://localhost:5678/api/works/');
    allWorks = await reponse.json();
    generateGallery(allWorks);
});

////////////////////////////////////////////////////////////////gestion des filter bouttons 

////click on one category, switch this category button's color to white and other's to green 
function changeBtnCtgColors(self, others){
    document.querySelector(self).style.backgroundColor = "#1D6154";
    document.querySelector(self).style.color = "white";

    others.forEach((element)=>{
        document.querySelector(element).style.backgroundColor = "white";
        document.querySelector(element).style.color = "#1D6154";
    })
}
const btnAll = document.querySelector(".allCategory");
btnAll.addEventListener("click", function () {
    generateGallery(allWorks);
    changeBtnCtgColors(".allCategory", [".objCategory",".appCategory",".hrCategory"]);
});

const btnObject = document.querySelector(".objCategory");
btnObject.addEventListener("click", function () {
    const worksObj = allWorks.filter(function (work) {
        return work.categoryId == 1;
    });
    generateGallery(worksObj);
    changeBtnCtgColors(".objCategory", [".allCategory",".appCategory",".hrCategory"]);
});
const btnAppartment = document.querySelector(".appCategory");

btnAppartment.addEventListener("click", function () {
    const worksApp = allWorks.filter(function (work) {
        return work.categoryId == 2;
    });
    generateGallery(worksApp);
    changeBtnCtgColors(".appCategory", [".allCategory",".objCategory",".hrCategory"]);
});
const btnHR = document.querySelector(".hrCategory");

btnHR.addEventListener("click", function () {
    const worksHR = allWorks.filter(function (work) {
        return work.categoryId == 3;
    });
    generateGallery(worksHR);
    changeBtnCtgColors(".hrCategory", [".allCategory",".objCategory",".appCategory"]);
});

/////////////////////////////////////////////////////////generate the elements in window modify
function generateTobeEdit(works) {
	// Récupération de l'élément du DOM qui accueillera les photos
	const divWorks = document.querySelector("#works");
    divWorks.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
		const oneWork = document.createElement("div");
        const work = works[i];
        oneWork.id="div"+work.id;
        // Création des balises 
        const imgWork = document.createElement("img");
        //imgWork.id = work.id;
        imgWork.src = work.imageUrl;
        imgWork.alt = work.title ?? "(No Title)";
		imgWork.setAttribute("crossorigin","anonymous");
		const btnEdit = document.createElement("button");
        btnEdit.classList.add("edit");
		btnEdit.innerText = "éditer";

        const moveIcon = document.createElement("i");
        moveIcon.classList.add("fa-solid");
        moveIcon.classList.add("fa-up-down-left-right");
        moveIcon.classList.add("fa-sm");
        const delIcon = document.createElement("i");
        delIcon.classList.add("fa-solid");
        delIcon.classList.add("fa-trash");
        delIcon.classList.add("fa-sm");
        
        delIcon.id = work.id;

        // On rattache la balise au div
		divWorks.appendChild(oneWork);
        oneWork.appendChild(imgWork);
        oneWork.appendChild(moveIcon);
        oneWork.appendChild(delIcon);
		oneWork.appendChild(btnEdit);
	}
}
//////////////////////////////////add click event listener to every delete icon on every photo
//////////////////////////because addEventListener doesn't work on the elements generated, 
//////////////////////////so bind delete function to the parent element

const delFunc = document.getElementById("works");
delFunc.addEventListener("click", async function(event){
    
    let tagTrash = event.target.classList.contains("fa-trash");
    let id = event.target.id;
    if(tagTrash){
        let confirmDel = confirm("Êtes-vous sûr de supprimer cette photo?");
        if(confirmDel==true){
            const res = await fetch(`${API_ROUTES.WORKS}/${id}`,{
                method:"DELETE",
                headers:{
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                }
            });
            if(res.status==204){
                alert("Une photo a été supprimée.");
                const divDel = document.getElementById("div"+id);
                document.getElementById("works").removeChild(divDel);
            }else{
                alert("Échec de la suppression: "+res.status);
            }
        }
    }
});
//////////////////////////show or hide the window modify with a layer who covers other elements 
var modal = document.querySelector(".modal");
var overlay = document.querySelector(".overlay");
var openModalBtn = document.querySelector("#btnModal");
var closeModalBtn = document.querySelector(".btnClose");
var btnAdd = document.querySelector("#btnAdd");
var modalAdd = document.querySelector(".addWork");

//function button "modifier"
const openModal = function () {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
	generateTobeEdit(allWorks);
};
openModalBtn.addEventListener("click", openModal);
//function button X on window modify
const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};
closeModalBtn.addEventListener("click", closeModal);
//overlay clicked: close window modify or window adding photo
const closeWindows = function(){
    closeModal();
    modalAdd.classList.add("hidden");
}
overlay.addEventListener("click", closeWindows);

///////////////////////////////////////////////////////////////////delete all
const delAll= document.querySelector("#btnDeleteAll");
delAll.addEventListener("click",async function(){
    
    let res = confirm("Êtes-vous sûr de supprimer tous?");
    if(res==true){
        allWorks.forEach(async (element)=>{
            const res = await fetch(`${API_ROUTES.WORKS}/${parseInt(element.id)}`,{
                method:"DELETE",
                headers:{
                    'Authorization': 'Bearer ' + sessionStorage.getItem("token")
                }
            })
        });
        document.getElementById("works").innerHTML="";
    }     
});
//////////////////////////////////////fonction of button "Ajouter une photo", hide modify window, generate a window for adding a work
/////////////////////////////////////////////////////////Récupération des categories 
var ctg = window.localStorage.getItem('ctg');
var inputCount;
if (ctg === null) {
    // Récupération des categories depuis l'API
    // const reponse = await fetch('http://localhost:5678/api/categories');
    const reponse = await fetch(`${API_ROUTES.CATEGORY}`);
    ctg = await reponse.json();
    // Transformation des categories en JSON
    const valeurCtg = JSON.stringify(ctg);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("ctg", valeurCtg);
} else {
    ctg = JSON.parse(ctg);
}
///////////////////////////////////////////generate all the categories in a select
function listCategories(ctg){
	const divCtg = document.querySelector("#optionCtg");
	const optDefault = document.createElement("option");
	optDefault.value = 0;
	optDefault.innerText="";
	divCtg.appendChild(optDefault);
    for (let i = 0; i < ctg.length; i++) {
		// Création des balises 
		const opt = document.createElement("option");
        const category = ctg[i];
        opt.innerText = category.name;
		opt.value = category.id;
        // On rattache la balise au div
		divCtg.appendChild(opt);
	}
}
//create all the elements on window for adding new work
btnAdd.addEventListener("click", function(){
    //hide window for modify
	modal.classList.add("hidden");
    //show window for adding photo
    modalAdd.classList.remove("hidden");
    //clear all form's inputs
	document.querySelector("#optionCtg").innerHTML = "";
	listCategories(ctg);
    document.querySelector("#title").value="";
    document.querySelector("#upload_input").value="";
    document.querySelector("#show").src="";
    document.getElementById('upload_div').classList.remove("hidden");
    //initiate form's input number for validation
    inputCount=0;
    document.getElementById('send').disabled = true;
    document.getElementById('send').style.backgroundColor="#A7A7A7";
});

////////////////////////////////////////function button valider
document.getElementById('form_work').addEventListener("submit", async function (event){
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", document.querySelector("[name=file]").files[0]);
    formData.append("title", document.querySelector("[name=title]").value);
    formData.append("category", parseInt(document.querySelector("[name=optionCtg]").value));
    const response = await fetch(`${API_ROUTES.WORKS}`, {
          method: "post",
          headers: {'Authorization': 'Bearer ' + sessionStorage.getItem("token")},
          body: formData
       })
    if(response.status==201){
        alert("Votre photo a été téléchargée.");
        //clear form for next upload
        document.querySelector("#title").value="";
        document.querySelector("#upload_input").value="";
        document.getElementById('upload_div').classList.remove("hidden");
        document.querySelector("#show").src="";
        document.querySelector("#show").classList.add("hidden");
        document.querySelector("#optionCtg").innerHTML = "";
	    listCategories(ctg);
        document.getElementById('valid_message').classList.remove("hidden");
        
        inputCount=0;
        document.getElementById('send').style.backgroundColor="#A7A7A7";
        document.getElementById('send').disabled = true;
   
    }else{
        alert("Le téléchargement de la photo a échoué: "+response.status);
    }
 })

//get photo'url
function getObjectURL(file) {
	let url = null ;
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
}
 ////////////////////////////valid check for the new photo's data: url, title and category
 modalAdd.addEventListener("change", function(event){
    
    if((event.target.id=="upload_input")&&(event.target.value!="")){
        //////////////////////////////////////show this photo in the input zone
        var newSrc=getObjectURL(document.getElementById('upload_input').files[0]);
        var imgSize = document.getElementById('upload_input').files[0].size;  
        if(imgSize>(1024*1024*4)){//4M
            return alert("Des photos jusqu'à 4mo peuvent être téléchargées");
        }else{
            document.getElementById('show').classList.remove("hidden");
            document.getElementById('show').src=newSrc;
            document.getElementById('upload_div').classList.add("hidden");
        }
        inputCount++;
    }
    if((event.target.value!=="")&&(event.target.id=="title")){
        inputCount++;
    }
    if((event.target.id=="optionCtg")&&(event.target.value>0)){
        inputCount++;
    }
    if(inputCount>2){
        document.getElementById('send').disabled = false;
        document.getElementById('send').style.backgroundColor="#1D6154";
        document.getElementById('valid_message').classList.add("hidden");
    }
 
})


////////////////////////////////////////function button X and button <---
modalAdd.addEventListener("click", function(event){
    
    let whichButton = event.target.id;
    if( (whichButton=="btnAddClose") || (whichButton=="btnEsc") )
    {
        document.getElementById('show').src = "";
        document.getElementById("show").classList.add("hidden");
        document.getElementById('upload_div').classList.remove("hidden");
        
        modalAdd.classList.add("hidden");
        if(whichButton=="btnAddClose"){
            overlay.classList.add("hidden");
        }
        if(whichButton=="btnEsc"){
            modal.classList.remove("hidden");
        }
    }
      
})

