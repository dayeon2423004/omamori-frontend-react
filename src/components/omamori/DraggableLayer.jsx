import { useRef } from "react";
import Draggable from "react-draggable";

export default function DraggableLayer({ layer, baseUrl, handleDragStop, handleDelete, editingId, setEditingId, setLayers, handleTextSave, selectedId, setSelectedId}) {
  const nodeRef = useRef(null);

    return (
        <Draggable
        nodeRef={nodeRef}
        position={{ x: layer.x ?? 0, y: layer.y ?? 0 }}
        onClick={() => setSelectedId(layer.tempId)}
        onStop={(e, data) => handleDragStop(e, data, layer)}
        >

        {/* 프레임 기준, 텍스트  수정 */}
        <div ref={nodeRef} style={{ position: "absolute", outline: selectedId === layer.tempId ? "2px solid red" : "none" }}>
            {layer.type === "text" && (
            editingId === layer.tempId ? (
                <div>
                    <input
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
                        if (e.key === "Enter") {
                        handleTextSave(layer);
                        }
                    }}
                    />

                    {/* 컬러 선택 */}
                    <input
                    type="color"
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
                <p style={{ fontSize: `${layer.fontSize}px`,
                        color: layer.color}}
                    onDoubleClick={() => setEditingId(layer.tempId)}>
                    {layer.content}
                </p>
            )
            )}

            {/* 스탬프 렌더링*/}
            {layer.type === "stamp" && (
            <img
                width={50}
                src={`${baseUrl}${layer.url}`}
                alt=""
            />
            )}

            {/* 해당  */}
            <button onClick={() => handleDelete(layer.tempId)}>
            X
            </button>

        </div>
        </Draggable>
    );
}