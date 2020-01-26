 
generateApiUrl = (offset, type) => {
  
  const apiKey = "4p7w4YD3KnU48WzncbVg5PTrJYdGB4yk";
  console.log(type);

 

  const select = document.getElementById("limit");

  
  const selectValue = select.options[select.selectedIndex].value;

  

  let giphyAPI = ""; 

  

//https://api.giphy.com/v1/gifs/search?
//https://api.giphy.com/v1/gifs/trending?



  if (type === "Search") {
    const searchInput = document.getElementById("search").value;
    giphyAPI = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${apiKey}&offset=${offset}&limit=${selectValue}`;
  } else if (type === "Trending") {
    giphyAPI = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&offset=${offset}&limit=${selectValue}`;
  }

  
  return giphyAPI;
};


getGif = (offset, type) => {
  console.log(type);

  generatePageNumber(1);

  

  const URL = generateApiUrl(offset, type);

  
  fetch(URL)
    .then(function(resp) {
      //console.log(resp);

      if (!resp.ok) {
        document.getElementById("result").innerHTML = "Error blababla";
        throw Error(resp.statusText);
      } else {
        return resp.json();
      }

      
    })
    .then(function(response) {
      

      

      if (response.pagination.total_count !== 0) {
        document.getElementById("pagination").style.display = "block";
        generatePagination(response.pagination, type);
      } else {
        document.getElementById("pagination").style.display = "none";
      }
      
      if (response.pagination.offset == 0) {
        setFirstElementToActive();
      }

      loadGifs(response.data);
    })
    .catch(err => console.log(err));
};




loadGifs = result => {
  
  cleanResultDiv();

  
  result.map(item => {
    
    const image = item.images.fixed_height_downsampled.url;

    
    //console.log(item.images.fixed_height_downsampled.url);

    
    const newImg = document.createElement("img");
    newImg.setAttribute("src", image);

    

    document.getElementById("result").appendChild(newImg);
  });
};



getLinks = () => {
  
  return document.getElementsByTagName("a");
};

generatePagination = (data, type) => {
  let links = getLinks(); //this returns us a NodeList object which be accessed by index numbers with the links inside
  for (let i = 0; i < links.length; i++) {
    links[i].onclick = e => changeIndex(e, data, type); 
  }
};

// The changeIndex handles the functionality that we click on our pagination elements and we receive the corret gifs for the clicked page. Furthermore we handle here the display of the correct page number in the pagination elements + the clicked one is active by having a blue background. Maybe we will split up this function in smaller functions to keep the seperation of concern principle.

changeIndex = (event, data, type) => {
  handleActives(event);
  const contentValue = parseInt(event.target.innerText);
  /* Here we get the content of our pagination elements = pageNumber
    <li class="page-item"><a index="0" class="active page-link" href="#">1</a></li>*/

  const index = parseInt(
    event.target.attributes.index.value
  ); /* Here we get which element was clicked, because we want to decrease the page number if the first element is clicked and we want increase the page number if the last element was clicked. For this reason we defined an index attribute starting from 0 - 9 

    
  const count = data.count; // this is our limit based on our first call from our pagination object. So we can calculate our offset value.
  const offset = (contentValue - 1) * count; // with this formular we calculate our offset value for the query based on on the pageNumber=contentValue of our pagination elements (see line 47 in giphy_comment.html) and our limit=count => how many gifs are displayed.

  getGif(offset, type); // here we call our getGif function with our calculated offset value

  /* This part is responsible for the logic to decrease the pageNumber if the first element was clicked => index == 0 and increasing the pageNumber=contentValue if the last element was clicked => index == 9. We call here our function generatePageNumber function to display the updated values in our pagination elements. */
  if (index == 9) {
    // Here we check if the last element was clicked and we update our pagination elements. because our function works with starting values to generate the page numbers, we have to contentValue - 8 to move 1 element further. (pageNumber 10 - 8) => start = 2 . Including!!! 2 we generate 10 page numbers which equals to page number 11.
    generatePageNumber(contentValue - 8);
  }
  if (contentValue > 1 && index == 0) {
    // Here we check if the first element was clicked and if our contentValue would be 1 we wouldn't decrease the page number anymore because we would get 0!. So if contentValue = 1 the IF condition is not met and we are not!! invoiking our generatePageNumber(contentValue - 1) function.
    generatePageNumber(contentValue - 1);
  }
};

// this part concerns the implementation of which element has beed clicked by the user -> is active

// The cleanActivesfunction cleans all the active classes. Active classes means the background of the pagination element will have the color blue. This is a class from bootstrap. You don't find it in the giphy_comment.css file - none of them are active anymore
cleanActives = () => {
  const elements = document.getElementsByClassName("active");
  for (let i = 0; i < elements.length; i++) {
    elements[i].className = "page-item";
  }
};

// the handleActives function provides us with the functionality that if we press a pagination element we change the background color to show what element is active.
handleActives = event => {
  cleanActives(); // we call our cleanActives function

  // and then we add the active class to element which was clicked
  event.target.parentElement.className += " active";
};

//The setFirstElementToActive function always cleans the active elements and sets in back to the first one. We need this if we make a new search or new trending request
setFirstElementToActive = () => {
  cleanActives();
  document.getElementsByClassName("page-item")[0].className += " active";
};



generatePageNumber = start => {
  let links = getLinks();
  for (let i = start; i < start + 10; i++) {
    links[i - start].innerText = i;
  }
};
//This function cleans our result div to load new gifs inside triggered by a new query
cleanResultDiv = () => {
  document.getElementById("result").innerHTML = "";
};

// Here the fun starts;) we click our search or trending button

/* 
If a button is pressed we invoke the getGif function with the parameters offset=0 and which button was pressed via type="Search". Because we use an eventListiner we have to pack our call to getGif into an anymonous function which waits to get fired if the buttons have been clicked. If we would use
document.getElementById("btnSearch").addEventListener("click",
  getGif(0, "Search");



*/
const inputSearch = document.getElementById("btnSearch");
const inputTrending = document.getElementById("btnTrending");

inputSearch.addEventListener("click", function() {
  getGif(0, "Search");
});

inputTrending.addEventListener("click", function() {
  getGif(0, "Trending");
});

