import { useRouter } from "vue-router";
import axios from "axios";

export function useRedirect() {
  const router = useRouter();

  const redirect = async (obj) => {
    const { url, data, type = "post" } = obj;

    if (type === "get") {
      // GET 방식으로 페이지 이동
      const queryParams = new URLSearchParams(data).toString();
      const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;
      await router.push(fullUrl);
    } else {
      try {
        // POST 방식으로 페이지 이동 (axios 사용)
        const formData = new FormData();
        for (const key in data) {
          formData.append(
            key,
            typeof data[key] === "object"
              ? JSON.stringify(data[key])
              : data[key]
          );
        }

        const response = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // 서버 응답 처리
        if (response.data.redirectUrl) {
          await router.push(response.data.redirectUrl);
        } else {
          // 서버에서 리다이렉트 URL을 제공하지 않는 경우,
          // 기본적으로 원래 요청한 URL로 이동
          await router.push(url);
        }
      } catch (error) {
        console.error("Redirect error:", error);
        // 에러 처리 로직 (예: 에러 페이지로 리다이렉트)
        if (error.response) {
          // 서버가 에러 응답을 보낸 경우
          console.error("Server responded with error:", error.response.data);
        } else if (error.request) {
          // 요청이 전송되었지만 응답을 받지 못한 경우
          console.error("No response received:", error.request);
        } else {
          // 요청 설정 중 에러가 발생한 경우
          console.error("Error setting up request:", error.message);
        }
      }
    }
  };

  return { redirect };
}
