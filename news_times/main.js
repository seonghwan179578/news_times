let news = [];
let page = 1; // 첫 번째 페이지이므로 1이 붙는다
let total_pages = 0; // 뉴스가 없을 수도 있으니 0부터 시작

let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "J-Qdg7eG9iQGpLKb86md1KXvfZ9EsJy96FfuMfhtTUI",
    });
    url.searchParams.set("page", page); // 페이지라는 키를 뒤에 추가한다는 뜻. ex) &page=
    console.log("url은?", url);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      console.log("받은 데이터가 뭐지?", data);
      total_pages = data.total_pages;
      page = data.page;
      news = data.articles;
      console.log(news);
      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

// addEventListener가 주는 event 정보 받아오기
const getNewsByTopic = async (event) => {
  // 아래의 변수에 await가 있으므로 async 필요
  console.log("클릭됨", event.target.textContent);
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const getNewsByKeyword = async () => {
  // 1. 검색 키워드 읽어오기
  let keyword = document.getElementById("search-input").value;
  page = 1
  console.log("keyword", keyword);
  // 2. url에 검색 키워드 붙이기
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  // 3. 헤더 준비
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `        <div class="row news">
    <div class="col-lg-4">
        <img class="news-img-size" src="${
          // 사진이 없으면 No Image 사진 넣기
          item.media ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
        }">
    </div>
    <div class="col-lg-8">
        <h2>
          ${item.title}
        </h2>
        <p>
        ${
          // summary가 200자 이상이면 ... 처리
          item.summary == null || item.summary == ""
            ? "내용없음"
            : item.summary.length > 200
            ? item.summary.substring(0, 200) + "..."
            : item.summary
        }
        </p>
        <div>
        ${
          // 출처가 없다면 no source + moment로 날짜 표현
          item.rights || "no source"
        }  ${moment(item.published_date).fromNow()}
        </div>
    </div>
</div>`;
    })
    .join("");

  console.log(newsHTML);

  document.getElementById("news-board").innerHTML = newsHTML;
};

// 에러 메세지를 보여주는 ui 함수
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger" role="alert">
  ${message}
</div>`;

  // 에러가 발생하면 news 대신 errorHTML을 보여준다
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagination = () => {
  let paginationHTML = ``;
  // total_page
  // 현재 보고 있는 page
  // page group
  let pageGroup = Math.ceil(page / 5);
  // last page
  let last = pageGroup * 5;
  if (last > total_pages) {
    // 마지막 그룹이 5개 이하이면
    last = total_pages;
  }
  // first page
  let first = last - 4 <= 0 ? 1 : last - 4 // 첫 그룹이 5 이하면

  

  // 이전페이지로( < ) 버튼
  if(first >= 6) {
  paginationHTML = `<li class="page-item" onclick="pageClick(1)">
  <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
</li>
  <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous"onclick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`}
  // first~last까지의 페이지 프린트
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  // total page가 3페이지일 경우 3개의 페이지만 프린트 하는 법(last, first 방법을 이용)
  // << >> 이 버튼들(첫 페이지로, 마지막 페이지로) 만들어주기
  // 내가 그룹1일 때 << > 이 버튼이 없다
  // 내가 마지막 그룹일 떄 > >> 이 버튼이 없다


  // 다음 페이지로( > ) 버튼
  if (last < total_pages) {
  paginationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next"onclick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>
<li class="page-item" onclick="pageClick(${total_pages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`}

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const pageClick = (pageNum) => {
  //7.클릭이벤트 세팅
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
}

// 페이지 이동 기능
const moveToPage = (pageNum) => {
  // 1. 이동하고 싶은 페이지를 알아야 한다
  page = pageNum;
  // 2. 이동하고 싶은 페이지를 가지고 api를 다시 호출한다
  getNews();
};
searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};