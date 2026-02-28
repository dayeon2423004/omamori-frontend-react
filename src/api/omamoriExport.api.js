import axiosIns from "./axiosInstance.js";

// 레이어 합성 및 이미지 생성 요청
export const layerMerge = async(data) => {
    const response = await axiosIns.post('/render/omamori', data);
    return response.data;
};

// 다운로드 이미지 URL 요청
export const omamoriImage = async(id, data) => {
    const response = await axiosIns.post(`/omamoris/${id}/export`, data);
    return response.data;
};

// 외부 공유 링크 api 요청
export const omamoriShare = async(id, data) => {
    const response = await axiosIns.post(`/omamoris/${id}/share`, data);
    return response.data;
};

// 공유용 오마모리 조회
export const omamoriPublic = async(token) => {
    const response = await axiosIns.get(`/public/shares/${token}`);
    return response.data;
}

// 공유 링크 삭제
export const omamoriUrlDel = async(id) => {
    const response = await axiosIns.delete(`/shares/${id}`);
    return response.data;
}