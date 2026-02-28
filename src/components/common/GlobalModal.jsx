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
        modalContent = <SocialLinkModal />;
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
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", 
            display: "flex",
            justifyContent: "center", 
            alignItems: "center",    
            zIndex: 1000         
        }}>
            {/* 테스트용 박스 */}
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
                {/* 닫기 버튼 임시 추가 */}
                <button onClick={closeModal}>X</button>
                {modalContent}
            </div>
        </div>
    );
}

export default GlobalModal;
