import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { omamori } from "../../api/omamori.api";

export default function OmamoriCreateModal({ onClose }) {
    const [userTitle, setUserTitle] = useState("");
    const navigate = useNavigate();

    // 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await omamori({ title : userTitle }); 
            const newId = response.data.id;

            // 오마모리 제작 이동
            navigate(`/omamori/edit/${newId}`);

            onClose();
        } catch (error) {
        alert("제작 중 오류가 발생했습니다.");
        }
    }

    return (
        <div className="modal" style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "10px",
            width: "420px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
        }}>
            <form onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>
                <input
                    type="text"
                    name="title"
                    placeholder="오마모리 제목을 입력하세요."
                    value={userTitle}
                    onChange={(e) => {setUserTitle(e.target.value)}}
                    style={{
                        padding: "14px 16px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                        outline: "none"
                    }}
                />
            
                <button 
                    type="submit"
                    style={{
                        padding: "12px",
                        borderRadius: "5px",
                        border: "none",
                        background: "#7b96ff",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    제목 생성
                </button>
            </form>
        </div>
    )
}