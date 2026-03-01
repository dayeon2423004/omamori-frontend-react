// OmamoriEdit.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOmamori, omamoriElementUpdate, omamoriElementRender } from '../api/omamori.api';
import { updateOmamori, omamoriSave } from '../api/omamori.api';
import { useNavigate } from 'react-router-dom';
import SelectionBoard from '../components/omamori/SelectionBoard';
import { addOmamoriElement } from '../api/omamori.api';
import { frames } from '../api/omamoriExpansion.api';
import OmamoriCanvas from '../components/omamori/OmamoriCanvas';
import LayerPanel from '../components/omamori/LayerPanel';
import { useModal } from '../components/hooks/useModal';
import { omamoriImage, omamoriShare, omamoriUrlDel } from '../api/omamoriExport.api';
import styles from "../styles/OmamoriEdit.module.css";

export default function OmamoriEdit() {
    const navigate = useNavigate();
    const [content, setContent] = useState("내용을 입력하세요");
    const [selectedId, setSelectedId] = useState(null);
    const { openModal } = useModal(); 

    const [imageUrl, setImageUrl] = useState(null);

    // 본문 상태
    const [editContent, setEditContent] = useState(false);

    // 라우트 ID 파싱
    const { id } = useParams(); 
    const [omamoriData, setOmamoriData] = useState("");

    // 오마모리 관리
    const [layers, setLayers] = useState([]);
    const [selectionType, setSelectionType] = useState(null);

    // 공유 토큰, ID 저장
    const [shareCode, setShareCode] = useState(null);
    const [shareId, setShareId] = useState(null)

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        (async () => {
            try {
                const response = await getOmamori(id);

                // 기본 프레임 전달
                const initialFrame = {
                    id: response.data.frame?.id,
                    type: 'frame',
                    url: response.data.frame?.preview_url,
                    back_message: response.data.back_message || "",
                    x: 0,
                    y: 0,
                    zIndex: 0
                };

                // 스탬프, 텍스트 요소
                const parsedElements = (response.data.elements || []).map(el => ({
                    tempId: el.id,
                    type: el.type,
                    url: el.stamp_url, 
                    content: el.props?.content,
                    fontSize: el.props?.fontSize ?? 20,
                    asset_key: el.props?.asset_key,
                    x: el.transform?.x ?? 0,
                    y: el.transform?.y ?? 0,
                    zIndex: el.layer ?? 1,
                    color : el.props?.color ?? "#111111"
                }));

                setLayers([initialFrame, ...parsedElements]);

                setOmamoriData(response.data);

                // 공유링크 저장
                const saved = localStorage.getItem(`share_${id}`);

                if (saved) {
                    const parsed = JSON.parse(saved); 
                    setShareCode(parsed.token);
                    setShareId(parsed.shareId);
                }
                
            } catch (error) {
                alert("오마모리를 불러올 수 없습니다. 마이페이지로 이동합니다.");
                navigate('/mypage');
            }
        })();
    }, [id]);

    // 폼 서버 전송
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try {
            // 백 요청
            const response = await updateOmamori(id, { meaning : content });

        } catch (error) {
            alert("수정 중에 문제가 발생했습니다.");
        }
        setEditContent(false);
    };

    // 텍스트 추가
    const addText = async() => {
        const newText = {
            tempId: crypto.randomUUID(),
            type: "text",
            content: "내용을 입력해주세요.",       
            x: 30,
            y: 30,
            fontSize : 20,
            rotation: 0,
            zIndex: layers.length
            }
        try {
            const response = await addOmamoriElement(id, {
                type : "text",
                props : { content: newText.content, },
                transform: {
                    x: newText.x,
                    y: newText.y
                }
                });

                newText.tempId = response.data.id
                setLayers(prev => [...prev, newText]);
        } catch (error) {
            console.log(error);
        }
    };

    // 스탬프 추가
    const addStamp = async(preview_url, key) => {
        const newStamp = {
            tempId: crypto.randomUUID(),
            type: "stamp",
            url: preview_url,         
            asset_key: key,  
            x: 300,
            y: 300,
            rotation: 0,
            zIndex: layers.length
            }
        try {
            const response = await addOmamoriElement(id, {
                type : "stamp",
                props : { asset_key: key },
                x: newStamp.x,
                y: newStamp.y
                });
                newStamp.tempId = response.data.id;
                setLayers(prev => [...prev, newStamp]);
        } catch (error) {
            console.log(error);
        }
    };

    // 레이어 중 프레임만 변경
    const changeFrame = async(url, fid) => {
        setLayers(prev => prev.map(layer => 
            layer.type === 'frame' ? { ...layer, url: url, id : fid} : layer
        ));
        try {
            // 프레임 적용
            const res = await frames(id, { frameId : fid});
        } catch(error) {
            console.log(error);
        }
    };

    // 레이어 위로 보내기
    const moveLayerUp = async (tid) => {
        const frame = layers.find(l => l.type === "frame");
        // 프레임 제외 요소의 인덱스
        const others = layers.filter(l => l.type !== "frame");
        const index = others.findIndex(l => l.tempId === tid);

        // 가장 위 요소는 제외
        if (index === others.length - 1) return;
        const newOrder = [...others];

        // 현 인덱스와 위의 인덱스 맞변경
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        try {
            await omamoriElementRender(id, {"elementIds" : newOrder.map(l => l.tempId)}); 
            const reordered = newOrder.map((layer, index) => ({
            ...layer,
            zIndex: index + 1
            }));

            setLayers([frame, ...reordered]);
        } catch(error) {
            console.log(error);
        }
    };

    // 레이어 아래로 보내기
    const moveLayerDown = async (tid) => {
        const frame = layers.find(l => l.type === "frame");
        const others = layers.filter(l => l.type !== "frame");
        const index = others.findIndex(l => l.tempId === tid);

        // 0번 제외
        if (index === 0) return;

        const newOrder = [...others];
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];

        try {
            await omamoriElementRender(id, {"elementIds" : newOrder.map(l => l.tempId)});   
            const reordered = newOrder.map((layer, index) => ({
            ...layer,
            zIndex: index + 1
            }));

            setLayers([frame, ...reordered]);
        } catch (error) {
            console.log(error);
        }
    };

    // 글자 크기 수정
    const changeFontSize = async(tid, size) => {
        const targetLayer = layers.find(l => l.tempId === tid);

        setLayers(prev => prev.map(layer =>
            layer.tempId === tid
                ? { ...layer, fontSize: size }
                : layer
            )
        );

        try {
            await omamoriElementUpdate(id, tid, {props : { content: targetLayer.content, fontSize : size, color : targetLayer.color }});
        } catch(error) {
            console.log(error);
        }
    };

    // 최종 저장 함수
    const handlePublish = async () => {
        try {
            await omamoriSave(id);
            alert("최종 저장 완료되었습니다.");

            const res = await omamoriImage(id, {
                "format": "png",
                "dpi": 300,
                "includeBack": true
            });
            setImageUrl(`${baseUrl}${res.data.download_url}`);

        } catch (error) {
            console.error(error);
        }
    };

    // 외부 공유API 호출
    const handleShare = async() => {
        try {
            let code = shareCode;

            // 공유 코드가 이미 생성되어 있다면 재사용
            if (!code) {
                const now = new Date();
                const expiresAt = now.toISOString().split('.')[0];
                const res = await omamoriShare(id, {option : "A", expires_at : expiresAt});

                setShareCode(code);
                setShareId(res.data.id);

                const shareData = {
                    token: res.data.token,
                    shareId: res.data.id 
                };

                localStorage.setItem(`share_${id}`, JSON.stringify(shareData));
            }
        
        openModal("omamoriShare", { shareCode : code, delete : handleCancelShare });
        } catch(error) {
            console.log(error);
        }
    }

    // 외부 공유링크 취소
    const handleCancelShare = async () => {
        try {
            await omamoriUrlDel(shareId); 

            setShareCode(null);
            setShareId(null);

            localStorage.removeItem(`share_${id}`);
            console.log("됨");
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <div className={styles.mainContainer}>
        {/* 우측 상단 액션 버튼 */}
        <div className={styles.leftSection}>
            <div className={styles.topActionGroup}>
                <button className={`${styles.actionBtn} ${styles.publishBtn}`} onClick={handlePublish}>최종저장</button>
                <button className={styles.actionBtn} onClick={handleShare}>공유</button>
                <button className={styles.actionBtn} onClick={() => openModal("backMessage", {layer : layers.find(l => l.type === "frame"), omamoriId : id, setLayers : setLayers})}>뒷면 메세지 입력하기</button>
            </div>

            {/* 제목 영역 */}
            <header className={styles.header}>
                <h3 className={styles.title}>{omamoriData?.title || "제목 없는 오마모리"}</h3>
            </header>

            <div className={styles.divider} />

            {/* {imageUrl ? (<img src={imageUrl} />) : (<p>X</p>)} */}
            
            {/* 본문 메세지 입력 */}
            <div className={styles.messageSection}>
                <form onSubmit={handleSubmit}>
                    {editContent ? (
                        <div>
                        <textarea
                            className={styles.textarea}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                            onBlur={() => setEditContent(false)}
                        />
                        <button type="submit" className={styles.actionBtn}>완료</button>
                        </div>
                    ) : (
                        <p className={styles.messageText} onClick={() => {setEditContent(true);}}> {content} </p>
                    )}
                </form>
            </div>
        </div>

        {/* 캔버스 영역 */}
        <div className={styles.centerSection}>
            {<OmamoriCanvas omamoriId={id} layers={layers} setLayers={setLayers} baseUrl={baseUrl} selectedId={selectedId} setSelectedId={setSelectedId} changeFontSize={changeFontSize}/>}
        </div>

        {/* 레이어 화면 */}
        <div className={styles.rightPanel}>
            < LayerPanel layers={layers} selectedId={selectedId} setSelectedId={setSelectedId} moveLayerUp={moveLayerUp} moveLayerDown={moveLayerDown} changeFontSize={changeFontSize} />
        </div>

        {/* UI 보드 */}
        <div className={styles.uiBoard}>
            <div className={styles.uiHeader}>
                <span className={styles.categoryLabel}>CATEGORY</span>
                <div className={styles.tabGroup}>
                    <button 
                        className={`${styles.tabBtn} ${selectionType === "Frame" ? styles.activeTab : ""}`}
                        onClick={() => setSelectionType("Frame")}
                    >프레임</button>
                    <button 
                        className={`${styles.tabBtn} ${selectionType === "Text" ? styles.activeTab : ""}`}
                        onClick={() => { addText("Text"); setSelectionType("Text"); }}
                    >텍스트</button>
                    <button 
                        className={`${styles.tabBtn} ${selectionType === "Stamp" ? styles.activeTab : ""}`}
                        onClick={() => setSelectionType("Stamp")}
                    >스탬프</button>
                </div>
            </div>

            {/* 조건부 렌더링 */}
            {selectionType && (
                <div className={styles.uiContent}>
                    <SelectionBoard 
                        type={selectionType}
                        omamoriId={id}
                        // 각 타입에 따른 로직을 함수로 전달. 
                        onSelect={(item) => {
                            if (item.type === "Stamp") addStamp(item.preview_url ?? item.stamp_url, item.key);
                            if (item.type === "Frame") changeFrame(item.preview_url, item.id, item.frame_key);
                            setSelectionType(null); 
                        }} 
                    />
                </div>
                )}
                {!selectionType && <p style={{color: '#666', textAlign: 'center'}}>카테고리를 선택하여 오마모리를 꾸며보세요.</p>}
            </div>
        </div>
    );
}