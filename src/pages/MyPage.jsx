// pages/MyPage.jsx
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useModal } from "../components/hooks/useModal";
import { deleteUser } from "../api/auth.api";
import PasswordConfirm from "../components/auth/PasswordConfirm";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import styles from "../styles/MyPage.module.css";

export default function MyPage() {
    const [step, setStep] = useState("default");
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { openModal } = useModal();

    // 로그아웃 핸들러
    const handleLogout = () => {
        logout();
        navigate("/"); 
    };

    // 회원탈퇴 핸들러
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");

        if (!confirmDelete) return;

        setStep("confirm");
    };

    // 서버에 회원탈퇴 전달
    const handleDelete = async(password) => {
        try {
            await deleteUser(password);
            alert("탈퇴되었습니다.");
            logout();
            navigate("/");
        } catch (error) {
            alert("비밀번호가 틀렸습니다.");
        }
    }

    // 만일 confirm일 경우, 회원탈퇴 컴포넌트로.
    if (step === "confirm") {
        return (
            <PasswordConfirm onCancel={() => setStep("default")} onSubmit={handleDelete} />
        );
    }

    return (
        <div className={styles.container}>
            {/* 상단 유저 정보 영역 */}
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <div className={styles.userNameRow}>
                        <h1 className={styles.userName}>{user?.name}</h1>
                        <div className={styles.buttonGroup}>
                            <button className={styles.actionButton} onClick={() => openModal("profileEdit")}>프로필 수정</button>
                            <button className={styles.actionButton} onClick={() => openModal("socialLink")}>계정 관리</button>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.actionButton} onClick={handleLogout}>로그아웃</button>
                        <button className={`${styles.actionButton} styles.dangerButton`} onClick={handleDeleteAccount}>회원탈퇴</button>
                    </div>
                </div>
            </header>

            {/* 메뉴 탭 영역 */}
            <nav>
                <NavLink to="" end
                    className={({ isActive }) => isActive ? `${styles.tabLink} ${styles.activeTab}` : styles.tabLink}>
                    내 오마모리
                </NavLink>

                {/* 확장 */}
                {/* 
                <NavLink to="posts">
                    {({ isActive }) =>
                        isActive ? "★ 작성 글" : "작성 글"
                    }
                </NavLink>

                <NavLink to="bookmarks">
                    {({ isActive }) =>
                        isActive ? "★ 북마크" : "북마크"
                    }
                </NavLink>
                */}
            </nav>

            <hr />

            {/* 본문 영역 */}
            <main style={{ marginTop: '20px' }}>
                <Outlet />
            </main>

            <hr />

            {/* 행운 컬러 보기 */}
            <section className={styles.fortuneSection}>
                <button className={styles.fortuneButton} onClick={() => openModal("fortune")}> 오늘의 행운 컬러 보기 </button>
                <button className={styles.fortuneButton} onClick={() => navigate("/fortune-list")}> 전체 행운 컬러 목록 </button>
            </section>

        </div>
    );
}
