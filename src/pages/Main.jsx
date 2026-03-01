// src/pages/Main.jsx

import { useModal } from "../components/hooks/useModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Main.module.css";

function Main() {
  const navigate = useNavigate();
  // Modal 상태 변경함수
  const { openModal } = useModal();

  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={`${styles.section} ${styles.hero}`}>
        <h1>나만의 오마모리</h1>
        <p>소중한 의미를 담아, 나만의 부적을 만들고 공유해보세요.</p>

        <div className={styles.buttonGroup}>
          <button>오마모리 만들기</button>
          {isLoggedIn ? (
          <>
            <p>{user?.name}님, 환영합니다!</p>
            <button onClick={() => navigate("/mypage")}>마이페이지</button>
            <button onClick={handleLogout}>로그아웃</button>
          </>
          ) : (
          <>
            <button onClick={() => openModal("signup")}>회원가입</button>
            <button onClick={() => openModal("login")}>로그인</button>
          </>
          )}
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.section}>
        <h2>나만의 오마모리를 만들고 공유해보세요!</h2>
        <p>감정, 소원, 기억을 담아 오마모리를 제작하고 게시판에서 공유할 수 있습니다.</p>

        <div className={styles.cardGrid}>
          <article className={styles.card}>
            <h3>오마모리 제작</h3>
            <p>문구와 이미지를 선택해 나만의 오마모리를 만들 수 있어요.</p>
          </article>

          <article className={styles.card}>
            <h3>오마모리 보관</h3>
            <p>내가 만든 오마모리를 보관함에 저장하고 언제든 확인할 수 있어요.</p>
          </article>

          {/* <article className={styles.card}>
            <h3>게시판 공유</h3>
            <p>오마모리를 게시판에 올리고 다른 사람들과 공유할 수 있어요.</p>
          </article>

          <article className={styles.card}>
            <h3>다른 오마모리 구경</h3>
            <p>다른 사용자의 오마모리를 보고 응원하거나 댓글을 남길 수 있어요.</p>
          </article> */}
        </div>
      </section>

      {/* Feature Section */}
      <section className={styles.section}>
        <h2>오마모리 기능</h2>

        <ul>
          <li>텍스트 문구 입력</li>
          <li>색상/테마 선택</li>
          {/* <li>이미지 업로드</li>
          <li>공유 링크 생성</li>
          <li>게시글 작성 및 댓글</li> */}
        </ul>
      </section>

      {/* Recent Posts Section */}
      {/* <section className={styles.section}>
        <h2>최근 등록된 오마모리</h2>

        <div>
          <div>오마모리 카드 1</div>
          <div>오마모리 카드 2</div>
          <div>오마모리 카드 3</div>
          <div>오마모리 카드 4</div>
          <div>오마모리 카드 5</div>
          <div>오마모리 카드 6</div>
        </div>

        <button>게시판 더보기</button>
      </section> */}

      {/* Footer */}
      <footer>
        <p>© 2026 Omamori Project</p>

        <div>
          <a href="/about">서비스 소개</a>
          <a href="/board">게시판</a>
          <a href="/mypage">마이페이지</a>
        </div>
      </footer>
    </div>
  );
}


export default Main; 