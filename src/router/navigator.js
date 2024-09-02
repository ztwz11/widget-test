import router from "./router";

export async function submitNavigation(url, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    if (method === "POST" && data) {
      options.body = new URLSearchParams(data).toString();
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 서버 응답에서 리다이렉션 URL을 확인
    const redirectUrl = response.headers.get("X-Redirect-To") || url;

    // Vue Router를 사용하여 페이지 전환
    await router.push(redirectUrl);
  } catch (error) {
    console.error("Navigation failed:", error);
  }
}
