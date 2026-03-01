// components/modals/LoginModal.jsx
import { useEffect, useState } from "react";
import { login as loginApi } from "../../api/auth.api";
import { googleAuth } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/AuthModal.module.css";
import { useModal } from "../hooks/useModal";

export default function LoginModal({ onClose }) {

    const { login, isLoggedIn } = useAuth();
    const { openModal } = useModal();
    const navigate = useNavigate();

    // 이메일, 비밀번호, 검증 비밀번호, 이름 상태 관리
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // 응답 상태 관리
    const [errors, setErrors] = useState({
        email : "",
        password : "",
        responseError : ""
    });

    // 로그인 된 상태인 경우, mypage로 바로 이동
    useEffect(() => {
        if (isLoggedIn == true) {
            navigate("/mypage");
        }
    })

    // 수정 이벤트 처리
    const handleChange = (e) => {
        const { name, value } = e.target; 

        // 기존 값은 유지하면서, 바뀐 값만 덮어씌기
        setFormData((prev) => ({
            ...prev,
            [name] : value
        }));
    };

    // 제출 이벤트
    const handleSubmit = async (e) => {
        e.preventDefault(); // 새로고침 방지
        setErrors({email: "", password: "", responseError: ""});

        // 에러 객체
        let newErrors = {};

        // 1차 검증
        // 이메일 검사
        if (!formData.email.trim()) {
            newErrors.email = "이메일을 입력해주세요.";
        }

        // 비밀번호 검사
        if (!formData.password) {
            newErrors.password = "비밀번호를 입력해주세요.";
        }

        // newErrors의 객체 중, 빈 값이 아닌 경우(1차 검증에서 에러가 발생한 경우)
        if (Object.values(newErrors).some(error => error !== "")) {
            setErrors(newErrors);
            return;
        }

        // 서버 전송
        try {
            const response = await loginApi(formData);
            const { user, token } = response.data;
            login(user, token);
                        
            onClose();

            // 마이페이지 이동
            navigate("/mypage");
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                email : error.response?.data?.errors?.email?.[0] || "",
                password : error.response?.data?.errors?.password?.[0] || ""
            }));
        }
    };

    // 구글 오어스 요청
    const handleGoogleLogin = async () => {
        try {
            const response = await googleAuth();
            window.location.href = response.data.redirect_url;
        } catch (error) {
            alert("구글 로그인에 실패했습니다.");
        }
    };

    // 화면 그리기
    return (
        <div className={styles.authContainer}>
            <h2 className={styles.title}>로그인</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}

                <input
                    className={styles.input}
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p className={styles.errorText}>{errors.password}</p>}

                <button className={styles.submitButton} type="submit">로그인</button>

                {errors.responseError && <p className={styles.errorText}>{errors.responseError}</p>}

                <hr/>

                <button className={styles.link} type="button" onClick={handleGoogleLogin}>
                Google로 계속하기
                </button>   
            </form>
            <p className={styles.footerText}>
                처음이신가요? 
                <span className={styles.link} onClick={() => openModal("signup")}>회원가입</span>
            </p>
        </div>
    );
}
