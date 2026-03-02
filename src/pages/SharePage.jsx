import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { omamoriPublic } from "../api/omamoriExport.api";
import ShareOmamori from "../components/omamori/ShareOmamori";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Helmet } from "react-helmet-async";
import "../styles/SharePage.css"; 

export default function SharePage() {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [runConfetti, setRunConfetti] = useState(false);

    useEffect(() => {
        // 현 화면에 맞게 조정
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);

        (async () => {
            try {
                const res = await omamoriPublic(token);
                setData(res.data);

                // 데이터 로드 성공 시 꽃가루 시작
                setRunConfetti(true);
                setTimeout(() => setRunConfetti(false), 10000); 
            } catch (error) {
                console.log(error);
            }
        })();
    }, [token]);

    if (!data) return (
        <div className="container">
            <p className="description">불러오는 중입니다...</p>
        </div>
    );

    return (
        <div className="container">
            <Helmet>
                <title>🍀🍀🍀 행운의 오마모리 도착! 🍀🍀🍀</title>
                <meta property="og:description" content="당신의 안녕을 바라는 소중한 마음입니다." />
            </Helmet>

            {/* 배경 */}
            <div className="bgCircle1" />
            <div className="bgCircle2" />

            {/* 꽃가루 효과 */}
            {runConfetti && (
                <Confetti 
                    width={windowSize.width} 
                    height={windowSize.height} 
                    recycle={false} 
                    numberOfPieces={600} 
                    gravity={0.1} 
                />
            )}
            
            <div className="contentWrapper">
                {/* 상단 텍스트 영역 */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="line" />
                    <h1 className="title">당신을 위한 행운이<br />도착했습니다</h1>
                    <p className="description">누군가 당신의 안녕을 바라며 만든<br />소중한 마음이 담긴 부적입니다.</p>
                </motion.div>

                {/* 메인 부적 카드 영역 */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="cardWrapper"
                >
                    <div className="cardInner">
                        <ShareOmamori omamori={data} />
                    </div>
                </motion.div>

                {/* 하단 버튼 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button 
                        className="submitButton"
                        onClick={() => window.location.href = "/"}
                    >
                        ✨ 나도 부적 만들기
                    </button>
                </motion.div>
            </div>
        </div>
    ); 
}