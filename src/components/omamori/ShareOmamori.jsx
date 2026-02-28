// 공유용 오마모리 조회 컴포넌트
import ShareLayer from "./ShareLayer";
import { useState } from "react";

export default function ShareOmamori({ omamori }) {
    const [isBack, setIsBack] = useState(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const omamoriList = omamori.omamori;

    return (
        <div style={{ position: "relative", width: 300, height: 500 }}>
        
        {/* 앞면 */}
        {!isBack && (
            <>
                <img src={`${baseUrl}${omamoriList.frame.preview_url}`} alt="" />
                {omamoriList.elements.map(el => (
                    <ShareLayer key={el.id} layer={el} baseUrl={baseUrl} />
                ))}
            </>
        )}

        {/* 뒷면 */}
        {isBack && (
            <div className="back-side">
            <p>{omamoriList.back_message}</p>
            </div>
        )}

        {/* 화살표 버튼 */}
        <button
            onClick={() => setIsBack(prev => !prev)}
            style={{ position: "absolute", bottom: 10, right: 10 }}
        >
            ↺
        </button>
        </div>
    );
}