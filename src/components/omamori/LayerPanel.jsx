import styles from "../../styles/LayerPanel.module.css";

export default function LayerPanel({ layers, selectedId, setSelectedId, moveLayerUp, moveLayerDown, changeFontSize}) {
    return (
        // 레이어 배열 복사해 재정렬 후 렌더링
        <div className={styles.panelContainer}>
            <div className={styles.panelTitle}>Layers</div>
                <div className={styles.layerList}>
                    {[...layers]
                        .filter(layer => layer.type !== "frame")
                        .sort((a, b) => b.zIndex - a.zIndex)
                        .map(layer => (
                        <div
                            key={layer.tempId}
                            className={`${styles.layerItem} ${selectedId === layer.tempId ? styles.selected : ""}`}
                            onClick={() => setSelectedId(layer.tempId)}
                        >
                            <span className={styles.layerIcon}>
                            {layer.type} 
                            </span>

                            <div className={styles.controls}>
                                <button onClick={(e) => { e.stopPropagation(); moveLayerUp(layer.tempId); }}>위</button>
                                <button onClick={(e) => { e.stopPropagation(); moveLayerDown(layer.tempId); }}>아래</button>
                            </div>

                            {/* 만일 텍스트인 경우, 글자 크기 수정 */}
                            {layer.type === "text" && layer.tempId === selectedId && (
                            <input
                                className={styles.fontSizeInput}
                                type="number"
                                value={layer.fontSize}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => changeFontSize(layer.tempId, Number(e.target.value))
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}