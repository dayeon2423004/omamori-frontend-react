import { useState } from "react";
import { loginLIst } from "../../api/auth.api";
import { useEffect } from "react";
import { GOOGLE_LINK_URL } from "../../constants/GoogleLink";
import { googleUnlink } from "../../api/auth.api";
import "../../styles/SocialLinkModal.css";

export default function SocialLinkModal({ onClose }) {

    const [isGoogleLinked, setIsGoogleLinked] = useState(false);
    const [loginMethod, setLoginMethod] = useState("");

    // 시작 시 로그인 수단 목록 조회
    useEffect(() => {
        (async () => {
            try {
                const response = await loginLIst();
                const loginData = response.data;

                // 첫 번째 이메일 띄우기
                setLoginMethod(loginData[0].email);

                // 배열 안 provider에 'google'이 있는지 검사
                const hasGoogle = loginData.some(item => item.provider === "google");
                setIsGoogleLinked(hasGoogle);
                
            } catch (error) {
                alert("로그인 조회에 실패하였습니다.");
            }
        })();
    }, []);

    // 구글 연동
    const handleGoogleLogin = () => {
        try {
            window.location.href = GOOGLE_LINK_URL;

        } catch (error) {
            alert("구글 연동에 실패했습니다.");
        }
    };

    // 연동 해제
    const handleUnlink = async (e) => {
        e.preventDefault();
        try {
            await googleUnlink();

            setIsGoogleLinked(false);
            alert("구글 연동이 해제되었습니다.");
        } catch {
            alert("연동 해제에 실패하였습니다.");
        }
    };

    return (
        <div className="social-modal-overlay">
            <div className="social-modal-container">

                <button className="close-x-btn" onClick={onClose}>✕</button>

                <p>현재 로그인 중인 이메일: {loginMethod}</p>
                <h2>계정 연동 관리</h2>

                <div className="social-card">
                    <div className="social-info">
                        <h3>Google 계정</h3>
                        <span className={isGoogleLinked ? "linked" : "unlinked"}>
                            {isGoogleLinked ? "연동됨" : "연동되지 않음"}
                        </span>
                    </div>

                        {isGoogleLinked ? (
                            <button className="unlink-btn" onClick={handleUnlink}>
                                연동 해제
                            </button>
                        ) : (
                            <button className="link-btn" onClick={handleGoogleLogin}>
                                연동하기
                            </button>
                        )}
                </div> 
            </div>
        </div> 
    );
}
