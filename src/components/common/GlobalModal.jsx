// components/modals/GlobalModal.jsx

import { useModal } from "../hooks/useModal";
import RegisterModal from "../modals/RegisterModal";
import LoginModal from "../modals/LoginModal";
import ProfileEditModal from "../modals/ProfileEditModal";
import SocialLinkModal from "../modals/SocialLinkModal";
import BirthDayModal from "../modals/BirthDayModal";
import FortuneDetailModal from "../modals/FortuneDetailModal";
import OmamoriCreateModal from "../modals/OmamoriCreateModal";
import BackMessageModal from "../modals/BackMessageModal";
import OmamoriShareModal from "../modals/OmamoriShareModal";

// 모달 상태 관리
function GlobalModal() {
    const { modal, closeModal, openModal, modalData } = useModal();

    // 없으면 아무것도 안그리기
    if (!modal) return null;

    let modalContent;

    // 각 모달 상태 변경 시 모달 이동
    if (modal === "signup") {
        modalContent = <RegisterModal openModal={openModal} />;
    } else if (modal === "login") {
        modalContent = <LoginModal onClose={closeModal}/>;
    } else if (modal === "profileEdit") {
        modalContent = <ProfileEditModal />;
    } else if (modal === "socialLink") {
        modalContent = <SocialLinkModal onClose={closeModal} />;
    } else if (modal === "fortune") {
        modalContent = <BirthDayModal />;
    } else if (modal === "fortuneDetail") {
        modalContent = <FortuneDetailModal colorId={modalData.id}/>;
    } else if (modal === "omamori") {
        modalContent = <OmamoriCreateModal onClose={closeModal}/>;
    } else if (modal === "backMessage") {
        modalContent = <BackMessageModal omamoriData={modalData}/>
    } else if (modal === "omamoriShare") {
        modalContent = <OmamoriShareModal omamoriData={modalData} />
    }

    return (
        // 모달 영역
        <div 
        onClick={closeModal} // 배경 클릭 시 닫기
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(34, 34, 34, 0.4)", 
            backdropFilter: "blur(5px)", 
            display: "flex",
            justifyContent: "center", 
            alignItems: "center",    
            zIndex: 1000 
        }}>
            {/* 모달 콘텐츠 영역 (둥근 직사각형) */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                style={{ 
                position: "relative", 
                backgroundColor: "white", 
                padding: "40px", 
                borderRadius: "32px", 
                width: "auto", 
                minWidth: "400px", 
                maxWidth: "90%", 
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)", 
                border: "1px solid rgba(0, 0, 0, 0.03)", 
                }}
            >
                {/* 닫기 버튼 임시 추가 */}
                <button 
                    onClick={closeModal}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        color: "#999", 
                        cursor: "pointer",
                        fontWeight: "light",
                        padding: "8px",
                        lineHeight: 1,
                        transition: "0.2s", // 호버 효과
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#222")}
                    onMouseLeave={(e) => (e.target.style.color = "#999")}
                    >
                    &times; 
                </button>
                {modalContent}
            </div>
        </div>
    );
}

export default GlobalModal;
