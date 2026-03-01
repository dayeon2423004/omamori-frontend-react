import { useState, useEffect } from 'react';
import { fortuneColorList } from '../api/omamoriExpansion.api.js';
import { useModal } from '../components/hooks/useModal.js';
import '../styles/fortuneColorList.css';

export default function FortuneListPage() {
    const [colors, setColors] = useState([]);
    const [page, setPage] = useState(1); 
    // const [totalPages, setTotalPages] = useState(1);
    const { openModal } = useModal();

    useEffect(() => {
        fetchColors();
    }, [page]); 

    // 목록
    const fetchColors = async () => {
        try {
            const response = await fortuneColorList(page, 10, 1);
            const colorList = response.data;

            const processedColors = colorList.map((color) => ({
                id: color.id,
                name: color.name,
                hex: color.hex
            }));
            
            setColors(processedColors);
        } catch (error) {
            console.error("목록 로드 실패", error);
        }
    };

    return (
        <div className="list-page">
            <h2 className="page-title">행운 컬러 목록</h2>
            
            <div className="color-grid">
                {colors.map(color => (
                    <div 
                        key={color.id} 
                        className="color-card"
                        onClick={() => openModal("fortuneDetail", { id: color.id })} 
                    >
                        <div className="color-circle" style={{ backgroundColor: color.hex || '#eee' }}></div>
                            <div className="color-info">
                                <span className="color-id">#{String(color.id).padStart(2, '0')}</span>
                                <span className="color-name">{color.name}</span>
                            </div>
                        </div>
                    ))}
            </div>

            {/* 페이지네이션 UI */}
            {/* <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>이전</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>다음</button>
            </div> */}
        </div>
    );
}