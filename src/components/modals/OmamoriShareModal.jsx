import { omamoriPublic } from "../../api/omamoriExport.api";
import { useState, useEffect } from "react";
import ShareOmamori from "../omamori/ShareOmamori";
import styles from "../../styles/Share.module.css";

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
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>오마모리 공유하기</h2>

            {data ? (<ShareOmamori omamori={data} />) : (<p>로딩중</p>)}

            <div className={styles.linkSection}>
                <input className={styles.urlInput} value={shareUrl} readOnly />
                <button className={styles.copyBtn} onClick={() => {navigator.clipboard.writeText(shareUrl); alert("링크 복사 완료!");}}>
                    복사
                </button>

                <button className={styles.cancelBtn} onClick={omamoriData.delete}>공유 취소</button>
            </div>
        </div>
    );
};