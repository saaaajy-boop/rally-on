const postList = document.querySelector('#post-list');

if (postList) {
  fetch('/data/posts.json')
    .then((response) => {
      if (!response.ok) throw new Error(`게시글 데이터를 불러오지 못했습니다: ${response.status}`);
      return response.json();
    })
    .then((posts) => {
      postList.innerHTML = posts.map((post) => `
        <article class="post-card">
          <a class="post-thumb" href="${post.href}" aria-label="${post.title} 읽기">
            <span class="post-thumb-label">${post.category}</span>
            <strong aria-hidden="true">3:2</strong>
            <span class="post-ball" aria-hidden="true"></span>
            <span class="sr-only">${post.thumbnailAlt}</span>
          </a>
          <div class="post-card-body">
            <p class="post-meta"><span>${post.category}</span><time datetime="${post.publishedAt}">${post.displayDate}</time></p>
            <h2><a href="${post.href}">${post.title}</a></h2>
            <p>${post.summary}</p>
            <a class="post-link" href="${post.href}">경기 분석 읽기 <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      `).join('');
    })
    .catch(() => {
      postList.innerHTML = '<p class="load-error">게시글 목록을 불러오지 못했습니다. <a href="/blog/shin-yubin-hashimoto-2026/">대표 경기 분석 바로 읽기</a></p>';
    });
}
