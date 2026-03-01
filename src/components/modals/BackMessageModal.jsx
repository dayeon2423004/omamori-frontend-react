import { useState } from "react";
import { backOmamori} from "../../api/omamori.api";
import styles from '../../styles/BackMessage.module.css';

export default function BackMessageModal ({ omamoriData }) {
    const [message, setMessage] = useState(omamoriData.layer?.back_message || "");

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // 뒷면 메세지 제출
    const handleSave = async() => {
        try {
            const response = await backOmamori(omamoriData.omamoriId, {
                back_message: message
            });

            omamoriData.setLayers(prev => prev.map(l => 
                l.type === "frame" ? { ...l, back_message: message } : l
            ));

            alert("메세지가 저장되었습니다.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.modalContainer}>
            <h2 className={styles.modalTitle}>뒷면 메시지 작성</h2>
            <div className={styles.previewSection}>
                {/* 배경 프레임 이미지 */}
                <img
                    className={styles.frameImage}
                    src={`${baseUrl}${omamoriData.layer.url}`}
                    alt="Frame"
                />

                <textarea
                    className={styles.messageOverlay}
                    placeholder="뒷면에 들어갈 메세지를 입력해주세요"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={100}
                />
            </div>

            <div className={styles.buttonGroup}>
                <button className={styles.saveBtn} onClick={handleSave}>메시지 저장하기</button>
            </div>
        </div>
    );
};