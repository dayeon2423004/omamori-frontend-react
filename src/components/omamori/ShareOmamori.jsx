// 공유용 오마모리 조회 컴포넌트
import ShareLayer from "./ShareLayer";
import { useState } from "react";
import styles from '../../styles/Share.module.css';

export default function ShareOmamori({ omamori }) {
    const [isBack, setIsBack] = useState(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const omamoriList = omamori.omamori;

    return (
        <div className={styles.shareContainer}>
        
        {/* 앞면 */}
        {!isBack ? (
            <>
                <img className={styles.frameImage}
                    src={`${baseUrl}${omamoriList.frame.preview_url}`} 
                    alt="" 
                />
                {omamoriList.elements.map(el => (
                    <ShareLayer key={el.id} layer={el} baseUrl={baseUrl} />
                ))}
            </>
        ) : (
            // 뒷면
            <div className={styles.backSide}>
                <div className={styles.backMessage}>
                    {omamoriList.back_message || "작성된 메시지가 없습니다."}
                </div>
            </div>
        )}


        {/* 화살표 버튼 */}
        <button className={styles.flipBtn} onClick={() => setIsBack(!isBack)}>
            ↺
        </button>
        </div>
    );
}