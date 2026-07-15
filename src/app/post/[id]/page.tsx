"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, BookOpen, Clock } from "lucide-react";
import styles from "./postDetail.module.css";
import { supabase } from "@/lib/supabaseClient";

interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  tags: string[];
  created_at: string;
  gallery_urls?: string[];
}

const MOCK_POSTS: Record<string, Post> = {
  "mock-1": {
    id: "mock-1",
    title: "빛과 어둠의 조화, 미니멀리즘 건축 여행",
    summary: "콘크리트와 자연광이 만들어내는 현대 건축의 걸작들을 탐험합니다.",
    content: `현대 건축에서 빛과 어둠은 단순한 물리적 현상이 아니라, 공간을 채우고 나누는 핵심적인 구조 요소입니다. 콘크리트의 차가운 질감과 따뜻한 햇살이 만나는 지점에서 느껴지는 고요함은 우리에게 깊은 사색을 선물합니다.

미니멀리즘 건축은 불필요한 장식을 걷어내고 본질만을 남깁니다. 선과 면, 그리고 빛이 만들어내는 기하학적 형태는 시시각각 변하는 자연의 표정을 건물 내부에 온전히 투영합니다.

이번 여행에서 방문한 안도 타다오의 공간들은 특히 빛의 극적인 연출이 돋보였습니다. 벽면에 뚫린 틈새를 통해 길게 드리워지는 빛의 선은 마치 공간 자체가 조용히 기도하고 있는 듯한 경건함을 자아냅니다. 단순함 속에서 비로소 복잡한 마음을 비워내고 나 자신과의 조용한 대화를 나눌 수 있는 시간관이었습니다.`,
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["건축", "미니멀리즘", "디자인"],
    created_at: "2026-07-15T12:00:00.000Z",
    gallery_urls: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "mock-2": {
    id: "mock-2",
    title: "영감을 일깨우는 나만의 작업 공간 꾸미기",
    summary: "몰입을 돕고 생산성을 극대화시키는 미니멀 워크스테이션 세팅 가이드.",
    content: `우리가 머무는 공간은 우리의 사고 방식에 직접적인 영향을 미칩니다. 특히 창작 활동을 활발히 해야 하는 크리에이터에게는 최적의 작업 공간을 조성하는 것이 생산성 향상의 첫걸음입니다.

데스크 테라피의 핵심은 '덜어냄'입니다. 시야를 어지럽히는 케이블과 불필요한 서류들을 정리하는 것만으로도 뇌에 걸리는 부하를 줄일 수 있습니다. 모니터 암을 활용해 데스크 위의 공간을 확보하고, 시선에 맞는 최적의 높이를 맞춥니다.

그리고 중요한 것은 '빛의 온도'입니다. 낮에는 자연광을 충분히 받아들이고, 밤에는 눈의 피로를 덜어주는 은은한 간접 조명(3000K 내외)을 활용하면 한층 더 아늑하고 집중도 높은 공간을 만들 수 있습니다. 식물 하나, 좋아하는 작가의 포스터 하나를 더해 심리적인 안정감을 부여하는 것도 잊지 마세요.`,
    image_url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80",
    tags: ["데스크셋업", "생산성", "인테리어"],
    created_at: "2026-07-14T09:30:00.000Z",
    gallery_urls: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "mock-3": {
    id: "mock-3",
    title: "자연의 숲속에서 만난 온전한 휴식과 몰입",
    summary: "도시의 분주함을 떠나 자연의 아날로그적 템포에 몸을 맡깁니다.",
    content: `초록빛 그림자가 드리워진 울창한 숲에 들어서는 순간, 스마트폰의 알림 소리가 점차 무의미해지기 시작합니다. 끊임없이 자극을 쫓던 뇌에 비로소 잔잔한 휴식의 파도가 밀려옵니다.

디지털 디톡스는 단순한 '기기 오프'를 넘어 우리 삶의 속도를 재조정하는 과정입니다. 숲길을 걸으며 바람에 부딪히는 나뭇잎 소리, 발밑에서 바스락거리는 흙의 감촉에 집중하다 보면 마음 깊은 곳에 웅크리고 있던 고요함이 깨어납니다.

온전한 몰입은 외부 자극이 없을 때 찾아오는 것이 아니라, 내 안의 소리에 집중할 때 가능합니다. 복잡한 생각의 실타래를 내려놓고 자연이 들려주는 이야기들에 귀를 기울인 3일간의 시간은, 다시 일상으로 돌아와 창조적인 에너지를 내뿜을 수 있는 단단한 거름이 되었습니다.`,
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    tags: ["에세이", "디지털디톡스", "여행"],
    created_at: "2026-07-12T15:20:00.000Z",
    gallery_urls: [
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    ]
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        // 1. 로컬스토리지 임시 글 먼저 검색
        const localData = localStorage.getItem("aura_local_posts");
        const localPosts: Post[] = localData ? JSON.parse(localData) : [];
        const foundLocal = localPosts.find((p) => p.id === id);

        if (foundLocal) {
          setPost(foundLocal);
          return;
        }

        // 2. Supabase에서 글 검색
        if (supabase) {
          const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", id)
            .single();

          if (!error && data) {
            setPost(data);
            return;
          }
        }

        // 3. 둘 다 없으면 내장 Mock 데이터 제공
        setPost(MOCK_POSTS[id] || null);
      } catch (err) {
        console.error("Error fetching post detail:", err);
        setPost(MOCK_POSTS[id] || null); // 에러 발생 시 Mock 대응
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "6rem 0" }}>
        <p style={{ color: "var(--text-secondary)" }}>포스트 상세 내용을 불러오고 있습니다...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "6rem 0" }}>
        <h2 style={{ marginBottom: "1rem" }}>포스트를 찾을 수 없습니다</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          요청하신 글이 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Link href="/">
          <button className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>피드로 돌아가기</span>
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/">
        <button className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>피드로 돌아가기</span>
        </button>
      </Link>

      <article>
        <header className={styles.header}>
          <div className={styles.tagWrapper}>
            {post.tags && post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <div className={styles.authorInfo}>
              <div className={styles.avatar} />
              <span>AURA Editor</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={14} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Clock size={14} />
              <span>읽기 시간 약 3분</span>
            </div>
          </div>
        </header>

        {post.image_url && (
          <div className={styles.heroImageWrapper}>
            {post.image_url.startsWith("data:") ? (
              <img
                src={post.image_url}
                alt={post.title}
                className={styles.heroImage}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className={styles.heroImage}
                priority
              />
            )}
          </div>
        )}

        <div className={styles.content}>
          {post.content}
        </div>

        {/* 갤러리 이미지 처리 */}
        {post.gallery_urls && post.gallery_urls.length > 0 && (
          <div className={styles.gallerySection}>
            <h3 className={styles.galleryTitle}>스토리 아카이브</h3>
            <div className={styles.galleryGrid}>
              {post.gallery_urls.map((url, index) => (
                <div className={styles.galleryImageWrapper} key={index}>
                  <Image
                    src={url}
                    alt={`Gallery asset ${index + 1}`}
                    fill
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
