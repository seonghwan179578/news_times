let news = [];
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu =>
   menu.addEventListener("click", (event) => getNewsByTopic(event))
)

let searchButton = document.getElementById("search-button")
let url;

const getNews = async () => {
  try{
    let header = new Headers({
      "x-api-key": "J-Qdg7eG9iQGpLKb86md1KXvfZ9EsJy96FfuMfhtTUI", 
    });
  
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if(response.status == 200) {
      if(data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.")
      }
      news = data.articles;
      console.log(news);
      render();
    } else {
      throw new Error(data.message)
    }
  } catch(error) {
    console.log("잡힌 에러는",error.message)
    errorRender(error.message)
  }
}

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews()
}

// addEventListener가 주는 event 정보 받아오기
const getNewsByTopic = async (event) => { // 아래의 변수에 await가 있으므로 async 필요
  console.log("클릭됨", event.target.textContent);
  let topic = event.target.textContent.toLowerCase()
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
  getNews()
}

const getNewsByKeyword = async() => {
  // 1. 검색 키워드 읽어오기
  let keyword = document.getElementById("search-input").value
  console.log("keyword", keyword)
  // 2. url에 검색 키워드 붙이기
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
  // 3. 헤더 준비
  getNews()
}


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
        ${// summary가 200자 이상이면 ... 처리
          item.summary == null || item.summary == ""
            ? "내용없음" 
            : item.summary.length > 200
            ? item.summary.substring(0, 200) + "..."
            : item.summary
        }
        </p>
        <div>
        ${ // 출처가 없다면 no source + moment로 날짜 표현
          item.rights || "no source"}  ${moment(item.published_date).fromNow()}
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
</div>`
  
  // 에러가 발생하면 news 대신 errorHTML을 보여준다
  document.getElementById("news-board").innerHTML = errorHTML
}

searchButton.addEventListener("click", getNewsByKeyword)
getLatestNews();