import { useState } from "react";
import DraggableLayer from "./DraggableLayer";
import { omamoriElementDel, omamoriElementUpdate } from "../../api/omamori.api";

// OmamoriCanvas.jsx
export default function OmamoriCanvas({ omamoriId, layers, setLayers, baseUrl, selectedId, setSelectedId }) {
  // const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // 요소 수정 통합
  const handleElementUpdate = async (layer, updates) => {
    try {
      const payload = {};

      // 텍스트 수정
      if (updates.content !== undefined) {
        payload.props = {
          content: updates.content,
          color: updates.color ?? layer.color
        };
      }

      // 위치 조정
      if (updates.x !== undefined || updates.y !== undefined) {
        payload.transform = {
          x: updates.x, y: updates.y
        };
      }

      // 백엔드 요청
      const response = await omamoriElementUpdate(omamoriId, layer.tempId, payload);

    } catch (error) {
      console.log(error);
    }
  };

  // 위치 수정 
  const handleDragStop = (e, data, layer) => {
      const updatedLayer = {
        ...layer,
        x: data.x,
        y: data.y
      };

      // 드래깅 한 x, y 좌표 Layer 전달
      setLayers(prev =>
        prev.map(l =>
          l.tempId === layer.tempId ? updatedLayer : l
        )
      );

      // 백엔드에 수정 위치 전달
      handleElementUpdate(layer, {
        x: data.x,
        y: data.y
      });
  };

  // 삭제 
  const handleDelete = async (tempId) => {
    setLayers(prev => prev.filter(l => l.tempId !== tempId));

    try {
      await omamoriElementDel(omamoriId, tempId);
    } catch (error) {
      console.log(error);
    }
  };

  // 텍스트 저장
  const handleTextSave = (layer) => {
    setEditingId(null);

    handleElementUpdate(layer, {
      content: layer.content
    });
  };

  // 렌더링
  return (
    <div style={{ 
      position: "relative", 
      width: "450px",  
      height: "600px", 
      margin: "0 auto", 
      backgroundColor: "#fff",
      borderRadius: "20px",
      overflow: "hidden", 
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    }}>
      {[...layers]
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(layer => {
        // 프레임 렌더링
        if (layer.type === "frame") {
          return (
            <img
                key={layer.id} 
                src={`${baseUrl}${layer.url}`}
                style={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "contain",
                  pointerEvents: "none", 
                  zIndex: 0 
                }}
                alt="Omamori Frame"
              />
          );
        }

        // 텍스트 및 스탬프 위치 렌더링
        return (
          <DraggableLayer
            key={layer.tempId}
            layer={layer}
            baseUrl={baseUrl}
            handleDragStop={handleDragStop}
            handleDelete={handleDelete}
            editingId={editingId}
            setEditingId={setEditingId}
            setLayers={setLayers}
            handleTextSave={handleTextSave}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        );
      })}
    </div>
  );
}