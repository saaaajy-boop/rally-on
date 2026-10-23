# RALLY — 2026 아시안게임 탁구 다시보기 가이드

PC 화면을 우선으로 구성한 스포츠 콘텐츠 랜딩 페이지와 데이터 기반 내부 블로그입니다. 선수 사진 대신 CSS로 만든 자체 비주얼을 사용합니다.

## 로컬 실행

`dist` 폴더를 정적 서버로 실행합니다.

```powershell
python -m http.server 3000 --directory dist --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:3000/`을 엽니다. `file://`로 HTML을 직접 열면 블로그 JSON을 불러올 수 없습니다.

## 배포 전 빌드

canonical과 sitemap은 실제 배포 주소를 `SITE_URL` 환경변수로 전달했을 때만 생성됩니다. 가짜 도메인은 사용하지 않습니다.

```powershell
$env:SITE_URL='https://실제-배포-도메인.example'
node scripts/build.mjs
Remove-Item Env:SITE_URL
```

`SITE_URL` 없이 빌드하면 canonical과 sitemap은 생략되고 `robots.txt`의 공개 페이지 허용 규칙만 생성됩니다.

## Vercel 배포

GitHub 저장소를 Vercel에서 가져오면 `vercel.json` 설정에 따라 자동으로 빌드됩니다.

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`

Vercel의 `VERCEL_PROJECT_PRODUCTION_URL`을 사용해 canonical, sitemap, robots 주소도 자동 생성합니다. 별도의 `SITE_URL` 환경변수는 필요하지 않습니다. 커스텀 도메인을 연결한 뒤에는 새 배포를 실행해 검색엔진용 주소를 갱신합니다.

## 공개 페이지

- `/` — 2026 아이치·나고야 아시안게임 탁구 다시보기 메인 가이드
- `/blog/` — 블로그 목록
- `/blog/shin-yubin-lim-jonghoon-bronze-2026/` — 신유빈·임종훈 혼합복식 동메달 여정

기존 `/blog/shin-yubin/`과 `/blog/shin-yubin-hashimoto-2026/` 주소는 새 상세 페이지로 이동합니다.

## 콘텐츠와 측정

- 블로그 목록 데이터: `dist/data/posts.json`
- 공통 CTA 이벤트: `replay_cta_click`
- 이벤트 매개변수: `page_path`, `cta_location`, `link_url`, `match_name`
- CTA 클릭 이벤트는 GTM이 감지할 수 있도록 `dataLayer`로 전달합니다.

메인과 블로그의 `data-replay-cta` 링크는 SBS 공식 혼합복식 8강 영상 페이지로 연결됩니다.
