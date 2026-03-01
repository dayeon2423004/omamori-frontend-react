import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../constants/images";
import { useEffect, useState } from "react";
import { omamoriList } from "../../api/omamori.api";
import { useModal } from "../hooks/useModal";
import { updateOmamori } from "../../api/omamori.api";
import styles from "../../styles/MyOmamori.module.css";
import ShareLayer from "./ShareLayer";

export default function MyOmamoriSection() {
    const navigate = useNavigate();
    const { openModal } = useModal();

    const [title, setTitle] = useState("제목을 입력하세요");
    const [editingId, setEditingId] = useState(null);

    // 오마모리 수 관리 
    const [omamoris, setOmamoris] = useState([]);

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        (async () => {
        try {
            const response = await omamoriList();
            setOmamoris(response.data || []);
            console.log(response.data);
        } catch (error) {
            console.error("목록을 불러오는 중 에러 발생:", error);
        }
        })();
    }, []);

    // 타이틀 수정
    const handleSubmit = async(e, id) => {
        e.preventDefault();

        try {
            // 백 요청 후 페이지 제목 상태 변경
            const response = await updateOmamori(id, { title : title});
            setOmamoris(prev => 
                prev.map(data => data.id === id ? { ...data, title: title } : item)
            );

            setEditingId(null);
        } catch (error) {
            alert("수정 중에 문제가 발생했습니다.");
        }
    };

    return (
        <div className={styles.grid}>
            {/* 제작 이미지 */}
            <div 
                className={`${styles.itemWrapper} ${styles.addButton}`} 
                onClick={() => openModal("omamori")}>
                <span className={styles.plusIcon}>+</span>
            </div>

            {/* 오마모리 목록 */}
            {omamoris.map((omamori) => (
                <div key={omamori.id} className={styles.itemWrapper}>

                    {/* 이미지 합성 */}
                    <div className={styles.omamoriCanvas} >
                        <img 
                            src={`${baseUrl}${omamori.frame.preview_url}`} 
                            onClick={() => navigate(`/omamori/edit/${omamori.id}`)}
                            className={styles.frameImg} 
                            alt="frame" 
                        />
                        {/* {omamori.elements?.map(el => (
                        <ShareLayer layer={el} baseUrl={baseUrl} />
                        ))} */}
                    </div>

                        {/* 하단 정보(제목) */}
                        {/* 제목 수정 */}
                        <div className={styles.infoRow}>
                        {editingId === omamori.id ? (
                            <form onSubmit={(e) => handleSubmit(e, omamori.id)}>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit">완료</button>
                            </form>
                        ) : (
                            <div>
                                {/* 제목 클릭 */}
                                <h3
                                    className={styles.titleText}
                                    >{omamori.title}
                                    <span className={styles.editBtn}
                                        onClick={() => {
                                            setEditingId(omamori.id);
                                            setTitle(omamori.title);
                                            }}>
                                            ✏️
                                    </span>
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}