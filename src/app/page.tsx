"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, User, BookOpen } from "lucide-react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabaseClient";

interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

// 갤러리/블로그용 풍성한 목 데이터 (Supabase 미연동 혹은 데이터 미존재 시 대안 제시)
const MOCK_POSTS: Post[] = [
  {
    id: "mock-1",
    title: "빛과 어둠의 조화, 미니멀리즘 건축 여행",
    summary: "콘크리트와 자연광이 만들어내는 현대 건축의 걸작들을 탐험합니다. 단순함 속에서 발견하는 구조적 아름다움과 그 심오한 내면을 기록한 에세이.",
    content: "현대 건축에서 빛과 어둠은 단순한 물리적 현상이 아니라, 공간을 채우고 나누는 핵심적인 구조 요소입니다...",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tags: ["건축", "미니멀리즘", "디자인"],
    created_at: "2026-07-15T12:00:00.000Z",
  },
  {
    id: "mock-2",
    title: "영감을 일깨우는 나만의 작업 공간 꾸미기",
    summary: "몰입을 돕고 생산성을 극대화시키는 미니멀 워크스테이션 세팅 가이드. 조명 배치, 테스크 테라피, 그리고 집중을 위한 사물들.",
    content: "우리가 머무는 공간은 우리의 사고 방식에 직접적인 영향을 미칩니다. 특히 창작 활동을 활발히 해야 하는 크리에이터에게...",
    image_url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
    tags: ["데스크셋업", "생산성", "인테리어"],
    created_at: "2026-07-14T09:30:00.000Z",
  },
  {
    id: "mock-3",
    title: "자연의 숲속에서 만난 온전한 휴식과 몰입",
    summary: "도시의 분주함을 떠나 자연의 아날로그적 템포에 몸을 맡깁니다. 이끼 낀 숲속에서 느낀 디지털 디톡스의 기록과 진정한 휴식의 가치.",
    content: "초록빛 그림자가 드리워진 울창한 숲에 들어서는 순간, 스마트폰의 알림 소리가 점차 무의미해지기 시작합니다...",
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    tags: ["에세이", "디지털디톡스", "여행"],
    created_at: "2026-07-12T15:20:00.000Z",
  },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        let dbPosts: Post[] = [];
        if (supabase) {
          const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            dbPosts = data;
          }
        }

        // 로컬스토리지 임시글 병합
        const localData = localStorage.getItem("aura_local_posts");
        const localPosts: Post[] = localData ? JSON.parse(localData) : [];

        // DB글과 로컬글 병합
        const combined = [...localPosts, ...dbPosts];

        if (combined.length > 0) {
          setPosts(combined);
        } else {
          setPosts(MOCK_POSTS);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        const localData = localStorage.getItem("aura_local_posts");
        const localPosts: Post[] = localData ? JSON.parse(localData) : [];
        setPosts([...localPosts, ...MOCK_POSTS]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className={styles.hero}>
        <div className={styles.heroTagline}>PREMIUM INSIGHTS</div>
        <h1 className={styles.heroTitle}>
          생각과 감각을 기록하는 <br />
          <span className="gradient-text">AURA 아카이브</span>
        </h1>
        <p className={styles.heroDescription}>
          빛나는 순간들의 기록, 일상에서 수집한 시각적 영감과 깊이 있는 인사이트를 아름답고 미니멀한 공간에 나눕니다.
        </p>
        
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="포스트 제목, 요약, 태그 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
        </div>
      </section>

      {/* 포스트 피드 */}
      <section style={{ marginTop: "2rem" }}>
        <h2 className={styles.sectionTitle}>
          최신 스토리
          <div className={styles.sectionTitleDot} />
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            스토리를 로드하는 중입니다...
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <article className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {post.image_url ? (
                      post.image_url.startsWith("data:") ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className={styles.image}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.image}
                          priority={post.id === "mock-1"}
                        />
                      )
                    ) : (
                      <div className={styles.placeholderImage}>
                        <BookOpen size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.tagWrapper}>
                      {post.tags && post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className={styles.title}>{post.title}</h3>
                    <p className={styles.summary}>{post.summary}</p>
                    
                    <div className={styles.meta}>
                      <div className={styles.authorInfo}>
                        <div className={styles.avatar} />
                        <span>AURA Editor</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Calendar size={12} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>검색 결과가 없습니다</div>
            <div className={styles.emptyDesc}>
              다른 키워드로 검색해 보시거나 새로운 글을 작성해 보세요.
            </div>
            <button className={styles.emptyBtn} onClick={() => setSearchQuery("")}>
              초기화
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
