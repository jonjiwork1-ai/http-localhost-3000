"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Send } from "lucide-react";
import styles from "./write.module.css";
import { supabase } from "@/lib/supabaseClient";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 태그 추가
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, "");
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // 태그 삭제
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  // 드래그 앤 드롭 이벤트
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError("이미지 파일만 업로드할 수 있습니다.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // 글 발행 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("글 제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      setError("글 본문 내용을 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const summary = content.substring(0, 150) + (content.length > 150 ? "..." : "");

    // 1. Supabase 연동 모드
    if (supabase) {
      try {
        let uploadedImageUrl = null;

        if (imageFile) {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `posts/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(filePath, imageFile);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
          uploadedImageUrl = data.publicUrl;
        }

        const { error: insertError } = await supabase.from("posts").insert([
          {
            title,
            summary,
            content,
            image_url: uploadedImageUrl,
            tags,
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) throw insertError;

        setSuccess("성공적으로 글이 발행되었습니다!");
        setTimeout(() => {
          router.push("/");
        }, 1200);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "발행 중 오류가 발생했습니다. DB 스키마 및 버킷 권한을 확인해주세요.");
        setLoading(false);
      }
    } 
    // 2. Mock 모드 (로컬스토리지 데이터 저장)
    else {
      try {
        const newPost = {
          id: `local-${Date.now()}`,
          title,
          summary,
          content,
          image_url: imagePreview || null,
          tags,
          created_at: new Date().toISOString(),
        };

        const existingLocal = localStorage.getItem("aura_local_posts");
        const localPosts = existingLocal ? JSON.parse(existingLocal) : [];
        localPosts.unshift(newPost);
        localStorage.setItem("aura_local_posts", JSON.stringify(localPosts));

        setSuccess("로컬 아카이브에 글이 저장되었습니다! (Mock 모드)");
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } catch (err) {
        console.error(err);
        setError("로컬 저장 용량을 초과했거나 로컬 저장소 에러가 발생했습니다.");
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.btnSecondary} onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ArrowLeft size={16} />
          <span>목록으로</span>
        </button>
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={loading}
          >
            <Send size={16} />
            <span>{loading ? "발행 중..." : "발행하기"}</span>
          </button>
        </div>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            {error}
          </div>
        )}
        {success && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            {success}
          </div>
        )}

        {/* Notion 스타일 제목 인풋 */}
        <input
          type="text"
          placeholder="제목 없는 포스트"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />

        {/* 태그 입력란 */}
        <div className={styles.tagSection}>
          <span className={styles.tagLabel}>태그 분류</span>
          <div className={styles.tagContainer}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tagChip}>
                #{tag}
                <button
                  type="button"
                  className={styles.tagRemoveBtn}
                  onClick={() => removeTag(index)}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={tags.length === 0 ? "태그 입력 후 Enter 또는 쉼표(,)" : ""}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className={styles.tagInput}
            />
          </div>
        </div>

        {/* 대표 이미지 드롭존 */}
        <div className={styles.tagSection}>
          <span className={styles.tagLabel}>대표 이미지 설정</span>
          {imagePreview ? (
            <div className={styles.previewContainer}>
              <img
                src={imagePreview}
                alt="Upload preview"
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeImageBtn}
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Upload className={styles.uploadIcon} size={40} />
              <div>
                <p className={styles.uploadText}>드래그 앤 드롭하거나 클릭하여 이미지 선택</p>
                <p className={styles.uploadHint}>PNG, JPG, WebP (최대 5MB 권장)</p>
              </div>
            </div>
          )}
        </div>

        {/* 본문 텍스트 에어리어 */}
        <div className={styles.contentArea}>
          <span className={styles.tagLabel}>본문 작성</span>
          <textarea
            placeholder="당신의 빛나는 생각과 영감을 기록해 보세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />
        </div>
      </form>
    </div>
  );
}
