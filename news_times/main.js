let news = [];
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event)))
const getLatestNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  let header = new Headers({
    "x-api-key": "J-Qdg7eG9iQGpLKb86md1KXvfZ9EsJy96FfuMfhtTUI",
  });

  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  console.log(news);

  render();
};

// addEventListener가 주는 event 정보 받아오기
const getNewsByTopic = async (event) => { // 아래의 변수에 await가 있으므로 async 필요
  console.log("클릭됨", event.target.textContent);
  let topic = event.target.textContent.toLowerCase()
  let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
  let header = new Headers({
    "x-api-key": "J-Qdg7eG9iQGpLKb86md1KXvfZ9EsJy96FfuMfhtTUI",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  console.log("토픽뉴스 데이터", data)

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

getLatestNews();
