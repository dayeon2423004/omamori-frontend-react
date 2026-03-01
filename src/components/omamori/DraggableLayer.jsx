import { useRef, useState } from "react";
import Draggable from "react-draggable";
import styles from "../../styles/DraggableLayer.module.css";

export default function DraggableLayer({ layer, baseUrl, handleDragStop, handleDelete, editingId, setEditingId, setLayers, handleTextSave, selectedId, setSelectedId}) {
    const nodeRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Draggable
        nodeRef={nodeRef}
        bounds="parent"
        position={{ x: layer.x ?? 0, y: layer.y ?? 0 }}
        onStart={() => setSelectedId(layer.tempId)}
        onStop={(e, data) => handleDragStop(e, data, layer)}
        >

        {/* 프레임 기준, 텍스트  수정 */}
        <div
            ref={nodeRef}
            className={`${styles.draggableWrapper} ${selectedId === layer.tempId ? styles.selected : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ zIndex: layer.zIndex + 10 }}
        >
            
            {layer.type === "text" && (
            editingId === layer.tempId ? (
                <div className={styles.editContainer}>
                    <input
                    className={styles.textInput}
                    value={layer.content}
                    autoFocus
                    onChange={(e) => {
                        const value = e.target.value;
                        setLayers(prev => prev.map(l =>
                            l.tempId === layer.tempId
                            ? { ...l, content: value } : l
                        )
                        );
                    }}
                    // Enter를 눌러 텍스트 저장
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleTextSave(layer);
                    }}
                    />

                    {/* 컬러 선택 */}
                    <input
                    type="color"
                    className={styles.colorPicker}
                    value={layer.color || "#111111"}
                    onChange={(e) => {
                    const value = e.target.value;
                    setLayers(prev =>
                        prev.map(l =>
                        l.tempId === layer.tempId
                            ? { ...l, color: value }
                            : l
                        )
                    );
                    }}
                    />
            </div>
            ) : (
                // 수정 상태가 아닌 경우, 텍스트 렌더링
                <p className={styles.textElement} 
                    style={{ fontSize: `${layer.fontSize}px`, color: layer.color}}
                    onDoubleClick={() => setEditingId(layer.tempId)}>
                    {layer.content}
                </p>
            )
            )}

            {/* 스탬프 렌더링*/}
            {layer.type === "stamp" && (
            <img
                width={80}
                height={80}
                src={`${baseUrl}${layer.url}`}
                className={styles.stampElement}
                alt=""
            />
            )}

            {/* 해당  */}
            {isHovered && (
                <button className={styles.deleteBtn}
                    onClick={(e) => {
                    e.stopPropagation();  handleDelete(layer.tempId);}}>
                    X
                    </button>)}

            </div>
        </Draggable>
    );
}