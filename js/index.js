let data = [];
let pageData = [];
let activePage = 1;
let perPage = 3;
let select;
// fetching the data from api
function getData(searchItem) {
  activePage = 1;
  var apikey = "77779f17";
  var anywhere = "https://cors-anywhere.herokuapp.com/";
  var data = fetch(`${anywhere}http://www.omdbapi.com/?apikey=${apikey}&s=${searchItem}`)
    .then((res) => res.json())
    .then((res) => {
      console.log("res", res);
      let { Search } = res;
      pagination(activePage, Search);
    })
    .catch((err) => {
      console.log("error", err);
    });
  return data;
}

// using debouncing for the searching
function debounce(fn, delay) {
  let timer = null;
  let beforeInput = "";
  return function () {
    let context = this;
    let args = arguments;
    let input = document.getElementById("search");
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (input.value == "") {
        notfound("Please enter some name🔖");
      } else if (beforeInput !== input.value) {
        getData(input.value);
      } else {
        console.log("keyword no change");
      }
      beforeInput = input.value;
    }, delay);
  };
}

// load the data for every page
var loadData = () => {
  console.log("calling", data);
  page = activePage;
  let low = (page - 1) * perPage;
  let high = page * perPage;
  pageData = data.filter((a, i) => i >= low && i < high);
  fillPage(page);
};

// for fill the page
function fillPage() {
  let resultPanel = document.getElementById("result");
  console.log(pageData);
  resultPanel.innerHTML = "";

  //   console.log(resultPanel.childNodes);
  // if (pageData == undefined) {
  //   loader = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  //   // resultPanel.append(loader);
  //   resultPanel.insertAdjacentHTML("afterbegin", loader);
  // }
  if (pageData) {
    for (let i = 0; i < pageData.length; i++) {
      // console.log(keywords[i]);
      let div = document.createElement("div");
      div.className = "shadow-lg card col-3 p-0";
      div.style.cssText = "height: 100%; margin-right:20px; border:none; box-shadow: 10px 10px rgb(238, 241, 245); border-radius:15px";
      let img = document.createElement("img");
      let cardbody = document.createElement("div");
      cardbody.className = "card-body";
      let h5 = document.createElement("h5");
      let li = document.createElement("p");
      let { Title, Year, Poster } = pageData[i];
      if (Poster == "N/A") {
        img.src = "https://firebasestorage.googleapis.com/v0/b/mybuk960.appspot.com/o/unwantedImages%2FimageNotFound.jpeg?alt=media&token=b27666e1-59e6-4706-a077-c699534123af";
      } else {
        img.src = Poster;
        img.className = "card-img-top";
        img.style.cssText = "height: 300px; width: 100%; border-radius:13px";
      }

      h5.textContent = Title;
      h5.className = "card-title";
      li.textContent = Year;
      li.className = "card-text";
      cardbody.append(h5);
      cardbody.append(li);
      div.append(img);
      div.append(cardbody);
      resultPanel.append(div);
    }
  }
}

// calling the whole function
let getinput = document.getElementById("search");
getinput.addEventListener("keyup", debounce(search, 1000));

// control the data for how many data is hoing to append
function pagination(page, Search) {
  data = Search;
  if (Search !== undefined) {
    let total = Search.length;
    let pageCount = Math.ceil(total / perPage);
    let pages = document.getElementById("pagination");
    pages.innerHTML = "";

    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement("li");
      li.setAttribute("onclick", `changePage(${i + 1})`);
      if (i === page - 1) {
        li.setAttribute("class", "page-item active");
      } else {
        li.setAttribute("class", "page-item");
      }
      let a = document.createElement("a");
      a.setAttribute("class", "page-link");
      a.setAttribute("href", `#${i + 1}`);
      a.textContent = i + 1;
      li.append(a);
      pages.append(li);
    }
    loadData();
  } else {
    notfound("No matching result found ❗️🚧");
  }
}

var changePage = (newPage) => {
  console.log(activePage, newPage);
  let liActive = document.querySelector(`#pagination li:nth-child(${activePage})`);
  console.log(liActive);
  liActive.setAttribute("class", "page-item");
  activePage = newPage;
  let liNew = document.querySelector(`#pagination li:nth-child(${activePage})`);
  liNew.setAttribute("class", "page-item active");
  loadData();
};

const notfound = (cause) => {
  let notfound = document.getElementById("result");
  let li = document.createElement("p");
  li.textContent = `${cause}`;
  notfound.innerHTML = "";
  notfound.append(li);
  let pagefield = document.getElementById("pagination");
  pagefield.innerHTML = "";
};
