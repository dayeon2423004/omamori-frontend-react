import { omamoriPublic } from "../../api/omamoriExport.api";
import { useState, useEffect } from "react";
import ShareOmamori from "../omamori/ShareOmamori";

export default function OmamoriShareModal ({ omamoriData }) {
    const [data, setData] = useState(null);
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await omamoriPublic(omamoriData.shareCode);
                setData(res.data);
                
                const url = `${window.location.origin}/share/${omamoriData.shareCode}`;

                setShareUrl(url);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };

        // shareCode가 있을 때만 호출
        if (omamoriData.shareCode) {
            fetchData();
        }
    }, [omamoriData.shareCode]);

    return (
        <div>
            <h2>공유 미리보기</h2>

            {data ? (<ShareOmamori omamori={data} />) : (<p>로딩중</p>)}

            <input value={shareUrl} readOnly />
            <button onClick={() => {navigator.clipboard.writeText(shareUrl); alert("링크 복사 완료!");}}>
            복사
            </button>

            <button onClick={omamoriData.delete}>공유 취소</button>
        </div>
    );
};