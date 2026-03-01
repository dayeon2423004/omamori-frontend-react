import { useState } from 'react';
import { fortuneColorResult } from '../../api/omamoriExpansion.api.js';
import { useFortune } from '../../context/FortuneContext.jsx';
import styles from "../../styles/FortuneModal.module.css";

export default function BirthDayModal() {
    // 날짜 상태 관리
    const [birthDate, setBirthDate] = useState("");
    const [resultColor, setResultColor] = useState(null);

    const { setActiveColor } = useFortune();

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        if (!birthDate) {
            alert("생년월일을 선택해주세요!");
            return;
        }

        try {
            const response = await fortuneColorResult({birthday : birthDate});

            console.log(response.data);

            setResultColor({
                id : response.data.id,
                hex : response.data.hex,
                name : response.data.name,
                meaning : response.data.meaning,
                shortMeaning : response.data.short_meaning,
                tips : response.data.tips
            })

        } catch (error) {
            alert(error);
        }
    };

    // 배경색 적용 핸들러
    const handleColor = async() => {
        setActiveColor({
        // id: resultColor.id,
        hex: resultColor.hex
        });
        alert(`${resultColor.name} 컬러가 적용되었습니다!`);
    };

    if (resultColor) {
        return (
            <div className={styles.container}>
            <h2 className={styles.magicTitle}>오늘의 행운 컬러: {resultColor.name}</h2>
            <p><strong>한줄평:</strong> {resultColor.shortMeaning}</p>
            <p><strong>상세 의미:</strong> {resultColor.meaning}</p>
            
            <div className={styles.tipsSection}>
                <h3>행운을 높이는 팁</h3>
                <ul className={styles.tipsList}>
                    {resultColor.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
            </div>
            <button className={styles.magicButton} onClick={() => handleColor()}>해당 컬러로 배경 색 적용하기</button>
        </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.magicTitle}>오늘의 행운 컬러 확인</h2>
            <p className={styles.description}>생년월일을 입력하면 당신의 오늘을 지켜줄<br/>신비로운 컬러를 찾아드려요.</p>

            <form onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                    <label htmlFor="birthday">생년월일: </label>
                    <input 
                        className={styles.dateInput}
                        type="date" 
                        id="birthday" 
                        name="birthday"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>

                <button className={styles.magicButton} type="submit" style={{ marginTop: '30px' }}>
                    결과 보기
                </button>
            </form>
        </div>
    );
}
